import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { service_id } = await req.json();
    if (!service_id) return new Response(JSON.stringify({ error: "service_id required" }), { status: 400, headers: corsHeaders });

    // Get service details
    const { data: service } = await supabaseAdmin
      .from("hosting_services")
      .select("*, hosting_products(name, directadmin_package_name)")
      .eq("id", service_id)
      .single();

    if (!service) return new Response(JSON.stringify({ error: "Service not found" }), { status: 404, headers: corsHeaders });

    // IDEMPOTENCY: Don't re-provision active services
    if (service.status === "active") {
      return new Response(JSON.stringify({ message: "Service already active" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Update status to provisioning
    await supabaseAdmin.from("hosting_services").update({ status: "provisioning" }).eq("id", service_id);

    const DA_BASE_URL = Deno.env.get("DIRECTADMIN_BASE_URL");
    const DA_USERNAME = Deno.env.get("DIRECTADMIN_USERNAME");
    const DA_LOGIN_KEY = Deno.env.get("DIRECTADMIN_LOGIN_KEY");
    const DA_DEFAULT_IP = Deno.env.get("DIRECTADMIN_DEFAULT_IP") || "";
    const DA_NAMESERVERS = Deno.env.get("DIRECTADMIN_DEFAULT_NAMESERVERS_JSON") || '["ns1.abancool.com","ns2.abancool.com"]';
    const DA_USE_SSL = Deno.env.get("DIRECTADMIN_USE_SSL") !== "false";

    if (!DA_BASE_URL || !DA_USERNAME || !DA_LOGIN_KEY) {
      await logAndFail(supabaseAdmin, service_id, "DirectAdmin credentials not configured");
      return new Response(JSON.stringify({ error: "DirectAdmin not configured" }), { status: 503, headers: corsHeaders });
    }

    // Generate unique username (max 8 chars for DA)
    const domain = service.domain_name || "default";
    const baseName = domain.replace(/[^a-z0-9]/gi, "").substring(0, 6).toLowerCase();
    const username = baseName + Math.floor(Math.random() * 99).toString().padStart(2, "0");

    // Generate secure password
    const password = generatePassword(16);

    const packageName = service.hosting_products?.directadmin_package_name || service.package_name || "default";
    const nameservers = JSON.parse(DA_NAMESERVERS);

    // Build DirectAdmin API request
    const daUrl = `${DA_BASE_URL}/CMD_API_ACCOUNT_USER`;
    const params = new URLSearchParams({
      action: "create",
      add: "Submit",
      username,
      email: "", // Will be set from profile
      passwd: password,
      passwd2: password,
      domain: service.domain_name || `${username}.abancool.com`,
      package: packageName,
      ip: DA_DEFAULT_IP,
      notify: "no",
      dns: nameservers[0] || "ns1.abancool.com",
      dns2: nameservers[1] || "ns2.abancool.com",
    });

    // Get user email for the DA account
    const { data: profile } = await supabaseAdmin.from("profiles").select("email").eq("id", service.user_id).single();
    if (profile?.email) params.set("email", profile.email);

    const authString = btoa(`${DA_USERNAME}:${DA_LOGIN_KEY}`);
    const protocol = DA_USE_SSL ? "https" : "http";

    const daResponse = await fetch(`${protocol}://${daUrl}`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const daText = await daResponse.text();
    let daJson: any = {};
    try { daJson = Object.fromEntries(new URLSearchParams(daText)); } catch { daJson = { raw: daText }; }

    // Log the automation
    await supabaseAdmin.from("automation_logs").insert({
      entity_type: "hosting_service",
      entity_id: service_id,
      action: "provision",
      status: daResponse.ok && !daText.includes("error") ? "success" : "failed",
      request_json: { url: daUrl, params: Object.fromEntries(params) },
      response_json: daJson,
      error_message: daText.includes("error") ? daText : "",
    });

    if (daResponse.ok && !daText.toLowerCase().includes("error")) {
      // Success - update service
      await supabaseAdmin.from("hosting_services").update({
        status: "active",
        username,
        directadmin_user: username,
        directadmin_domain: service.domain_name,
        server_hostname: DA_BASE_URL.replace(/^https?:\/\//, "").split(":")[0],
        server_ip: DA_DEFAULT_IP,
        da_response_json: daJson,
      }).eq("id", service_id);

      // Store credentials securely
      await supabaseAdmin.from("service_credentials").insert({
        hosting_service_id: service_id,
        encrypted_password: password, // In production, encrypt with a master key
        encrypted_login_url: `${DA_BASE_URL}`,
      });

      // Update order status
      if (service.order_id) {
        // Check if all services for this order are active
        const { data: allServices } = await supabaseAdmin
          .from("hosting_services")
          .select("status")
          .eq("order_id", service.order_id);

        const allActive = allServices?.every(s => s.status === "active");
        if (allActive) {
          await supabaseAdmin.from("orders").update({ status: "active" }).eq("id", service.order_id);
        }
      }

      return new Response(JSON.stringify({ success: true, username, message: "Hosting account provisioned" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      await logAndFail(supabaseAdmin, service_id, daText);
      return new Response(JSON.stringify({ error: "Provisioning failed", details: daText }), { status: 502, headers: corsHeaders });
    }
  } catch (error) {
    console.error("DA Provision error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});

async function logAndFail(supabase: any, serviceId: string, errorMsg: string) {
  await supabase.from("hosting_services").update({ status: "failed" }).eq("id", serviceId);
  await supabase.from("automation_logs").insert({
    entity_type: "hosting_service",
    entity_id: serviceId,
    action: "provision",
    status: "failed",
    error_message: errorMsg,
  });
}

function generatePassword(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, b => chars[b % chars.length]).join("");
}
