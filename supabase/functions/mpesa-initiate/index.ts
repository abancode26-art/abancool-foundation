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
        gateway: "intersend_mpesa",
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

    // Call Intersend API
    const INTERSEND_BASE_URL = Deno.env.get("INTERSEND_BASE_URL");
    const INTERSEND_PUBLIC_KEY = Deno.env.get("INTERSEND_PUBLIC_KEY");
    const INTERSEND_SECRET_KEY = Deno.env.get("INTERSEND_SECRET_KEY");
    const APP_BASE_URL = Deno.env.get("APP_BASE_URL") || Deno.env.get("SUPABASE_URL");

    if (!INTERSEND_BASE_URL || !INTERSEND_SECRET_KEY) {
      // Update payment to failed if keys not configured
      await supabaseAdmin.from("payments").update({ status: "failed", raw_response_json: { error: "Payment gateway not configured" } }).eq("id", payment.id);
      return new Response(JSON.stringify({ error: "Payment gateway not configured. Contact support." }), { status: 503, headers: corsHeaders });
    }

    const callbackUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/mpesa-webhook`;

    const stkPayload = {
      phone_number: cleanPhone,
      amount: Number(invoice.balance_due),
      account_reference: merchantRef,
      transaction_desc: `Payment for ${invoice.invoice_number}`,
      callback_url: callbackUrl,
    };

    const providerResponse = await fetch(`${INTERSEND_BASE_URL}/mpesa/stk-push`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${INTERSEND_SECRET_KEY}`,
        "X-Public-Key": INTERSEND_PUBLIC_KEY || "",
      },
      body: JSON.stringify(stkPayload),
    });

    const providerData = await providerResponse.json();

    // Update payment with provider response
    await supabaseAdmin.from("payments").update({
      status: providerResponse.ok ? "pending" : "failed",
      checkout_request_id: providerData.CheckoutRequestID || providerData.checkout_request_id || null,
      raw_request_json: stkPayload,
      raw_response_json: providerData,
    }).eq("id", payment.id);

    // Update invoice status
    if (providerResponse.ok) {
      await supabaseAdmin.from("invoices").update({ status: "pending" }).eq("id", invoice_id);
    }

    if (!providerResponse.ok) {
      return new Response(JSON.stringify({
        error: "STK Push failed. Please try again.",
        details: providerData,
      }), { status: 502, headers: corsHeaders });
    }

    return new Response(JSON.stringify({
      payment_id: payment.id,
      checkout_request_id: providerData.CheckoutRequestID || providerData.checkout_request_id,
      message: "STK Push sent to your phone. Please enter your M-Pesa PIN.",
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("M-Pesa initiate error:", error);
    return new Response(JSON.stringify({ error: error.message || "Payment initiation failed" }), { status: 500, headers: corsHeaders });
  }
});
