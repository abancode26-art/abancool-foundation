import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabaseUser.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

    const { invoice_id, phone_number } = await req.json();
    if (!invoice_id || !phone_number) {
      return new Response(JSON.stringify({ error: "invoice_id and phone_number required" }), { status: 400, headers: corsHeaders });
    }

    // Validate phone format (Kenyan)
    const cleanPhone = phone_number.replace(/\s/g, "").replace(/^0/, "254").replace(/^\+/, "");
    if (!/^254\d{9}$/.test(cleanPhone)) {
      return new Response(JSON.stringify({ error: "Invalid phone number. Use format 254XXXXXXXXX" }), { status: 400, headers: corsHeaders });
    }

    // Get user profile for name/email
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .single();

    // Verify invoice belongs to user and is unpaid
    const { data: invoice } = await supabaseAdmin
      .from("invoices")
      .select("*")
      .eq("id", invoice_id)
      .eq("user_id", user.id)
      .in("status", ["unpaid", "pending"])
      .single();

    if (!invoice) return new Response(JSON.stringify({ error: "Invoice not found or already paid" }), { status: 404, headers: corsHeaders });

    // Check for existing pending payment to prevent duplicates
    const { data: existingPayment } = await supabaseAdmin
      .from("payments")
      .select("id")
      .eq("invoice_id", invoice_id)
      .in("status", ["initiated", "pending"])
      .single();

    if (existingPayment) {
      return new Response(JSON.stringify({ error: "A payment is already in progress for this invoice", payment_id: existingPayment.id }), { status: 409, headers: corsHeaders });
    }

    const merchantRef = `ABAN-${invoice.invoice_number}-${Date.now()}`;

    // Create payment record BEFORE calling provider
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from("payments")
      .insert({
        user_id: user.id,
        invoice_id,
        gateway: "intasend_mpesa",
        method: "mpesa_stk_push",
        amount: Number(invoice.balance_due),
        currency: invoice.currency,
        status: "initiated",
        phone_number: cleanPhone,
        merchant_reference: merchantRef,
      })
      .select()
      .single();

    if (paymentError) throw paymentError;

    // Call IntaSend API - M-Pesa STK Push
    // Docs: POST https://payment.intasend.com/api/v1/payment/mpesa-stk-push/
    const INTASEND_BASE_URL = Deno.env.get("INTERSEND_BASE_URL") || "https://payment.intasend.com";
    const INTASEND_PUBLISHABLE_KEY = Deno.env.get("INTERSEND_PUBLIC_KE") || "";
    const INTASEND_SECRET_KEY = Deno.env.get("INTERSEND_SECRET_KEY") || "";
    const APP_BASE_URL = Deno.env.get("APP_BASE_URL") || Deno.env.get("SUPABASE_URL");

    if (!INTASEND_SECRET_KEY) {
      await supabaseAdmin.from("payments").update({ status: "failed", raw_response_json: { error: "Payment gateway not configured" } }).eq("id", payment.id);
      return new Response(JSON.stringify({ error: "Payment gateway not configured. Contact support." }), { status: 503, headers: corsHeaders });
    }

    const nameParts = (profile?.full_name || "Customer").split(" ");
    const firstName = nameParts[0] || "Customer";
    const lastName = nameParts.slice(1).join(" ") || "User";

    const stkPayload = {
      first_name: firstName,
      last_name: lastName,
      email: profile?.email || user.email || "customer@abancool.com",
      host: APP_BASE_URL,
      amount: Number(invoice.balance_due),
      phone_number: cleanPhone,
      api_ref: merchantRef,
    };

    console.log("IntaSend STK Push payload:", JSON.stringify(stkPayload));

    const providerResponse = await fetch(`${INTASEND_BASE_URL}/api/v1/payment/mpesa-stk-push/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${INTASEND_SECRET_KEY}`,
        "X-IntaSend-Public-API-Key": INTASEND_PUBLISHABLE_KEY,
      },
      body: JSON.stringify(stkPayload),
    });

    const providerData = await providerResponse.json();
    console.log("IntaSend STK Push response:", JSON.stringify(providerData));

    // Update payment with provider response
    const checkoutRequestId = providerData?.invoice?.invoice_id || providerData?.id || null;
    
    await supabaseAdmin.from("payments").update({
      status: providerResponse.ok ? "pending" : "failed",
      checkout_request_id: checkoutRequestId,
      raw_request_json: stkPayload,
      raw_response_json: providerData,
    }).eq("id", payment.id);

    // Update invoice status
    if (providerResponse.ok) {
      await supabaseAdmin.from("invoices").update({ status: "pending" }).eq("id", invoice_id);
    }

    if (!providerResponse.ok) {
      return new Response(JSON.stringify({
        error: providerData?.errors?.[0]?.detail || "STK Push failed. Please try again.",
        details: providerData,
      }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({
      payment_id: payment.id,
      checkout_request_id: checkoutRequestId,
      message: "STK Push sent to your phone. Please enter your M-Pesa PIN.",
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("M-Pesa initiate error:", error);
    return new Response(JSON.stringify({ error: error.message || "Payment initiation failed" }), { status: 500, headers: corsHeaders });
  }
});
