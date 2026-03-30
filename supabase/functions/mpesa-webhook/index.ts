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
        provider: "intersend_mpesa",
        event_type: "stk_callback",
        event_id: payload.CheckoutRequestID || payload.checkout_request_id || "",
        payload_json: payload,
      })
      .select()
      .single();

    // Extract relevant fields (adapt to actual Intersend webhook format)
    const checkoutRequestId = payload.CheckoutRequestID || payload.checkout_request_id;
    const resultCode = payload.ResultCode ?? payload.result_code;
    const mpesaRef = payload.MpesaReceiptNumber || payload.mpesa_receipt_number || payload.transaction_id;

    if (!checkoutRequestId) {
      console.error("No checkout_request_id in webhook payload");
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), { status: 200 });
    }

    // Find payment by checkout_request_id - IDEMPOTENCY CHECK
    const { data: payment } = await supabaseAdmin
      .from("payments")
      .select("*")
      .eq("checkout_request_id", checkoutRequestId)
      .single();

    if (!payment) {
      console.error("Payment not found for checkout_request_id:", checkoutRequestId);
      // Still return 200 to prevent retries
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

    const isSuccess = resultCode === 0 || resultCode === "0" || String(resultCode).toLowerCase() === "success";

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

      // Update order to paid
      const { data: invoice } = await supabaseAdmin
        .from("invoices")
        .select("order_id")
        .eq("id", payment.invoice_id)
        .single();

      if (invoice?.order_id) {
        await supabaseAdmin.from("orders").update({ status: "paid" }).eq("id", invoice.order_id);

        // Trigger provisioning for hosting items
        const { data: orderItems } = await supabaseAdmin
          .from("order_items")
          .select("*, hosting_products(name, directadmin_package_name)")
          .eq("order_id", invoice.order_id);

        if (orderItems) {
          for (const item of orderItems) {
            if (item.item_type === "hosting" && item.product_id) {
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
                  package_name: item.hosting_products?.directadmin_package_name || "",
                  next_due_date: calculateNextDueDate(item.billing_cycle),
                })
                .select()
                .single();

              if (service) {
                // Trigger DirectAdmin provisioning (async, fire-and-forget)
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
              // Create domain record
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

              // Trigger domain registration (async)
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

        // Update order status to processing
        await supabaseAdmin.from("orders").update({ status: "processing" }).eq("id", invoice.order_id);
      }
    } else {
      // Payment failed
      await supabaseAdmin.from("payments").update({
        status: "failed",
        raw_response_json: payload,
      }).eq("id", payment.id);

      // Revert invoice to unpaid
      await supabaseAdmin.from("invoices").update({ status: "unpaid" }).eq("id", payment.invoice_id);
    }

    // Mark webhook as processed
    if (webhookEvent) {
      await supabaseAdmin.from("webhook_events").update({ processed: true, processed_at: new Date().toISOString() }).eq("id", webhookEvent.id);
    }

    // Always return 200 to prevent retries
    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    // Still return 200 to prevent infinite retries
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
