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

    const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const supabaseUser = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });

    const { data: { user } } = await supabaseUser.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

    // Check if admin
    const { data: roles } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", user.id);
    const isAdmin = roles?.some(r => ["super_admin", "admin"].includes(r.role));
    if (!isAdmin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });

    const { action, service_id } = await req.json();
    if (!action || !service_id) return new Response(JSON.stringify({ error: "action and service_id required" }), { status: 400, headers: corsHeaders });

    const { data: service } = await supabaseAdmin
      .from("hosting_services")
      .select("*")
      .eq("id", service_id)
      .single();

    if (!service) return new Response(JSON.stringify({ error: "Service not found" }), { status: 404, headers: corsHeaders });

    const DA_BASE_URL = Deno.env.get("DIRECTADMIN_BASE_URL");
    const DA_USERNAME = Deno.env.get("DIRECTADMIN_USERNAME");
    const DA_LOGIN_KEY = Deno.env.get("DIRECTADMIN_LOGIN_KEY");
    const DA_USE_SSL = Deno.env.get("DIRECTADMIN_USE_SSL") !== "false";

    if (!DA_BASE_URL || !DA_USERNAME || !DA_LOGIN_KEY) {
      return new Response(JSON.stringify({ error: "DirectAdmin not configured" }), { status: 503, headers: corsHeaders });
    }

    const authString = btoa(`${DA_USERNAME}:${DA_LOGIN_KEY}`);
    const protocol = DA_USE_SSL ? "https" : "http";
    let daUrl = "";
    let params = new URLSearchParams();
    let newStatus = service.status;

    switch (action) {
      case "suspend":
        daUrl = `${DA_BASE_URL}/CMD_API_MODIFY_USER`;
        params.set("action", "suspend");
        params.set("select0", service.directadmin_user || service.username || "");
        params.set("dosuspend", "yes");
        newStatus = "suspended";
        break;
      case "unsuspend":
        daUrl = `${DA_BASE_URL}/CMD_API_MODIFY_USER`;
        params.set("action", "unsuspend");
        params.set("select0", service.directadmin_user || service.username || "");
        params.set("dounsuspend", "yes");
        newStatus = "active";
        break;
      case "terminate":
        daUrl = `${DA_BASE_URL}/CMD_API_ACCOUNT_USER`;
        params.set("action", "delete");
        params.set("select0", service.directadmin_user || service.username || "");
        params.set("confirmed", "yes");
        newStatus = "terminated";
        break;
      case "reset_password": {
        const newPassword = generatePassword(16);
        daUrl = `${DA_BASE_URL}/CMD_API_MODIFY_USER`;
        params.set("action", "single");
        params.set("user", service.directadmin_user || service.username || "");
        params.set("passwd", newPassword);
        params.set("passwd2", newPassword);
        // Update credentials
        await supabaseAdmin.from("service_credentials").update({ encrypted_password: newPassword }).eq("hosting_service_id", service_id);
        break;
      }
      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400, headers: corsHeaders });
    }

    const daResponse = await fetch(`${protocol}://${daUrl}`, {
      method: "POST",
      headers: { "Authorization": `Basic ${authString}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const daText = await daResponse.text();
    const success = daResponse.ok && !daText.toLowerCase().includes("error");

    // Log automation
    await supabaseAdmin.from("automation_logs").insert({
      entity_type: "hosting_service",
      entity_id: service_id,
      action,
      status: success ? "success" : "failed",
      request_json: { url: daUrl, action },
      response_json: { raw: daText },
      error_message: success ? "" : daText,
    });

    if (success && newStatus !== service.status) {
      await supabaseAdmin.from("hosting_services").update({ status: newStatus }).eq("id", service_id);
    }

    return new Response(JSON.stringify({ success, message: success ? `${action} completed` : `${action} failed`, details: daText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("DA manage error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});

function generatePassword(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, b => chars[b % chars.length]).join("");
}
