import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// No CORS needed - this is a server-to-server webhook
Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const payload = await req.json();

    // Store raw webhook event for audit
    const { data: webhookEvent } = await supabaseAdmin
      .from("webhook_events")
      .insert({
        provider: "intasend_mpesa",
        event_type: "stk_callback",
        event_id: payload.invoice_id || payload.checkout_request_id || payload.CheckoutRequestID || "",
        payload_json: payload,
      })
      .select()
      .single();

    // IntaSend webhook format: { invoice_id, state, ... }
    // Also handle legacy Safaricom format
    const checkoutRequestId = payload.invoice_id || payload.checkout_request_id || payload.CheckoutRequestID;
    const state = payload.state || payload.ResultCode;
    const mpesaRef = payload.mpesa_reference || payload.MpesaReceiptNumber || payload.transaction_id || "";

    if (!checkoutRequestId) {
      console.error("No checkout_request_id in webhook payload");
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), { status: 200 });
    }

    // Find payment by checkout_request_id - IDEMPOTENCY CHECK
    const { data: payment } = await supabaseAdmin
      .from("payments")
      .select("*")
      .eq("checkout_request_id", checkoutRequestId)
      .maybeSingle();

    if (!payment) {
      console.error("Payment not found for checkout_request_id:", checkoutRequestId);
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), { status: 200 });
    }

    // IDEMPOTENCY: Skip if already processed
    if (payment.status === "success" || payment.status === "failed") {
      console.log("Payment already processed:", payment.id);
      if (webhookEvent) {
        await supabaseAdmin.from("webhook_events").update({ processed: true, processed_at: new Date().toISOString() }).eq("id", webhookEvent.id);
      }
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Already processed" }), { status: 200 });
    }

    const isSuccess = state === "COMPLETE" || state === "SUCCESSFUL" || state === 0 || state === "0" || String(state).toLowerCase() === "success";

    if (isSuccess) {
      // Update payment to success
      await supabaseAdmin.from("payments").update({
        status: "success",
        provider_reference: mpesaRef,
        raw_response_json: payload,
        paid_at: new Date().toISOString(),
      }).eq("id", payment.id);

      // Update invoice to paid
      await supabaseAdmin.from("invoices").update({
        status: "paid",
        balance_due: 0,
        paid_at: new Date().toISOString(),
      }).eq("id", payment.invoice_id);

      // Get invoice to find order
      const { data: invoice } = await supabaseAdmin
        .from("invoices")
        .select("order_id")
        .eq("id", payment.invoice_id)
        .single();

      // Notify customer about successful payment
      await supabaseAdmin.from("notifications").insert({
        user_id: payment.user_id,
        title: "Payment Successful",
        message: `Your M-Pesa payment of KES ${Number(payment.amount).toLocaleString()} has been received. ${mpesaRef ? `Ref: ${mpesaRef}` : ""}`,
        type: "payment",
        action_url: `/client/invoices/${payment.invoice_id}`,
      }).catch(() => {});

      // Notify admins about payment
      const { data: adminUsers } = await supabaseAdmin
        .from("user_roles")
        .select("user_id")
        .in("role", ["super_admin", "admin"]);

      const { data: customerProfile } = await supabaseAdmin
        .from("profiles")
        .select("full_name")
        .eq("id", payment.user_id)
        .single();

      if (adminUsers?.length) {
        const adminNotifs = adminUsers.map((a: any) => ({
          user_id: a.user_id,
          title: "Payment Received",
          message: `${customerProfile?.full_name || "Customer"} paid KES ${Number(payment.amount).toLocaleString()} via M-Pesa. ${mpesaRef ? `Ref: ${mpesaRef}` : ""}`,
          type: "payment",
          action_url: `/admin/payments`,
        }));
        await supabaseAdmin.from("notifications").insert(adminNotifs).catch(() => {});
      }

      if (invoice?.order_id) {
        await supabaseAdmin.from("orders").update({ status: "paid" }).eq("id", invoice.order_id);

        // Trigger provisioning for hosting items
        const { data: orderItems } = await supabaseAdmin
          .from("order_items")
          .select("*")
          .eq("order_id", invoice.order_id);

        if (orderItems) {
          for (const item of orderItems) {
            if ((item.item_type === "hosting" || item.item_type === "hosting_package") && item.product_id) {
              // Get DA package name from either products table
              let daPackageName = "";
              let productName = item.description || "Hosting";
              let accountType = "user";

              const { data: hp } = await supabaseAdmin
                .from("hosting_products")
                .select("name, directadmin_package_name, product_type")
                .eq("id", item.product_id)
                .maybeSingle();

              if (hp) {
                daPackageName = hp.directadmin_package_name || "";
                productName = hp.name;
                if (hp.product_type === "reseller_hosting") accountType = "reseller";
              } else {
                const { data: pkg } = await supabaseAdmin
                  .from("hosting_packages")
                  .select("name, directadmin_package_name, category")
                  .eq("id", item.product_id)
                  .maybeSingle();
                if (pkg) {
                  daPackageName = pkg.directadmin_package_name || "";
                  productName = pkg.name;
                  if (pkg.category?.toLowerCase().includes("reseller")) accountType = "reseller";
                }
              }

              // Create hosting service record
              const { data: service } = await supabaseAdmin
                .from("hosting_services")
                .insert({
                  user_id: payment.user_id,
                  order_id: invoice.order_id,
                  order_item_id: item.id,
                  product_id: item.product_id,
                  domain_name: item.domain_name || "",
                  status: "pending",
                  billing_cycle: item.billing_cycle,
                  package_name: productName,
                  directadmin_package_name: daPackageName,
                  account_type: accountType,
                  directadmin_reseller: accountType === "reseller",
                  next_due_date: calculateNextDueDate(item.billing_cycle),
                })
                .select()
                .single();

              if (service) {
                // Trigger DirectAdmin provisioning
                const provisionUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/da-provision`;
                fetch(provisionUrl, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
                  },
                  body: JSON.stringify({ service_id: service.id }),
                }).catch(err => console.error("Failed to trigger provisioning:", err));
              }
            }

            if (["domain_register", "domain_transfer"].includes(item.item_type) && item.domain_name) {
              const parts = item.domain_name.split(".");
              const tld = "." + parts.slice(1).join(".");
              await supabaseAdmin.from("domains").insert({
                user_id: payment.user_id,
                domain_name: item.domain_name,
                tld,
                action_type: item.item_type === "domain_register" ? "register" : "transfer",
                status: "pending",
                order_id: invoice.order_id,
              });

              const domainFn = item.item_type === "domain_register" ? "domain-register" : "domain-transfer";
              fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/${domainFn}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
                },
                body: JSON.stringify({ domain_name: item.domain_name }),
              }).catch(err => console.error("Failed to trigger domain operation:", err));
            }
          }
        }

        await supabaseAdmin.from("orders").update({ status: "processing" }).eq("id", invoice.order_id);
      }
    } else {
      // Payment failed
      await supabaseAdmin.from("payments").update({
        status: "failed",
        raw_response_json: payload,
      }).eq("id", payment.id);

      await supabaseAdmin.from("invoices").update({ status: "unpaid" }).eq("id", payment.invoice_id);

      // Notify customer about failure
      await supabaseAdmin.from("notifications").insert({
        user_id: payment.user_id,
        title: "Payment Failed",
        message: `Your M-Pesa payment of KES ${Number(payment.amount).toLocaleString()} was not completed. Please try again.`,
        type: "payment",
        action_url: `/client/invoices/${payment.invoice_id}`,
      }).catch(() => {});
    }

    // Mark webhook as processed
    if (webhookEvent) {
      await supabaseAdmin.from("webhook_events").update({ processed: true, processed_at: new Date().toISOString() }).eq("id", webhookEvent.id);
    }

    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), { status: 200 });
  }
});

function calculateNextDueDate(billingCycle: string | null): string {
  const now = new Date();
  switch (billingCycle) {
    case "monthly": now.setMonth(now.getMonth() + 1); break;
    case "quarterly": now.setMonth(now.getMonth() + 3); break;
    case "semiannual": now.setMonth(now.getMonth() + 6); break;
    case "annual": now.setFullYear(now.getFullYear() + 1); break;
    case "biennial": now.setFullYear(now.getFullYear() + 2); break;
    case "triennial": now.setFullYear(now.getFullYear() + 3); break;
    default: now.setMonth(now.getMonth() + 1);
  }
  return now.toISOString().split("T")[0];
}
