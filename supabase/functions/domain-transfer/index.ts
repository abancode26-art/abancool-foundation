import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  try {
    const { domain_name, epp_code } = await req.json();
    if (!domain_name) return new Response(JSON.stringify({ error: "domain_name required" }), { status: 400, headers: corsHeaders });

    const DOMAIN_API_BASE_URL = Deno.env.get("DOMAIN_API_BASE_URL");
    const DOMAIN_API_KEY = Deno.env.get("DOMAIN_API_KEY");

    if (!DOMAIN_API_BASE_URL || !DOMAIN_API_KEY) {
      await supabaseAdmin.from("automation_logs").insert({
        entity_type: "domain", entity_id: domain_name, action: "transfer",
        status: "failed", error_message: "Domain API not configured",
      });
      return new Response(JSON.stringify({ error: "Domain API not configured" }), { status: 503, headers: corsHeaders });
    }

    const transferResponse = await fetch(`${DOMAIN_API_BASE_URL}/domains/transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${DOMAIN_API_KEY}` },
      body: JSON.stringify({ domain: domain_name, epp_code: epp_code || "" }),
    });

    const transferData = await transferResponse.json();

    await supabaseAdmin.from("automation_logs").insert({
      entity_type: "domain", entity_id: domain_name, action: "transfer",
      status: transferResponse.ok ? "success" : "failed",
      request_json: { domain: domain_name },
      response_json: transferData,
    });

    if (transferResponse.ok) {
      await supabaseAdmin.from("domains").update({ status: "transfer_pending" }).eq("domain_name", domain_name);
    } else {
      await supabaseAdmin.from("domains").update({ status: "failed" }).eq("domain_name", domain_name);
    }

    return new Response(JSON.stringify({ success: transferResponse.ok, data: transferData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
