import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  try {
    const { domain_name } = await req.json();
    if (!domain_name) return new Response(JSON.stringify({ error: "domain_name required" }), { status: 400, headers: corsHeaders });

    const DOMAIN_API_BASE_URL = Deno.env.get("DOMAIN_API_BASE_URL");
    const DOMAIN_API_KEY = Deno.env.get("DOMAIN_API_KEY");

    if (!DOMAIN_API_BASE_URL || !DOMAIN_API_KEY) {
      await supabaseAdmin.from("automation_logs").insert({
        entity_type: "domain", entity_id: domain_name, action: "register",
        status: "failed", error_message: "Domain API not configured",
      });
      return new Response(JSON.stringify({ error: "Domain API not configured" }), { status: 503, headers: corsHeaders });
    }

    // Get nameservers from settings or env
    const DA_NAMESERVERS = Deno.env.get("DIRECTADMIN_DEFAULT_NAMESERVERS_JSON") || '["ns1.abancool.com","ns2.abancool.com"]';
    const nameservers = JSON.parse(DA_NAMESERVERS);

    const registerResponse = await fetch(`${DOMAIN_API_BASE_URL}/domains/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DOMAIN_API_KEY}`,
      },
      body: JSON.stringify({
        domain: domain_name,
        nameservers,
        period: 1,
      }),
    });

    const registerData = await registerResponse.json();

    await supabaseAdmin.from("automation_logs").insert({
      entity_type: "domain", entity_id: domain_name, action: "register",
      status: registerResponse.ok ? "success" : "failed",
      request_json: { domain: domain_name, nameservers },
      response_json: registerData,
      error_message: registerResponse.ok ? "" : JSON.stringify(registerData),
    });

    if (registerResponse.ok) {
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      await supabaseAdmin.from("domains").update({
        status: "active",
        nameservers_json: nameservers,
        expiry_date: expiryDate.toISOString().split("T")[0],
        registrar: "api",
      }).eq("domain_name", domain_name);
    } else {
      await supabaseAdmin.from("domains").update({ status: "failed" }).eq("domain_name", domain_name);
    }

    return new Response(JSON.stringify({ success: registerResponse.ok, data: registerData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Domain register error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
