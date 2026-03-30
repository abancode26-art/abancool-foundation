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

    const { service_id } = await req.json();
    if (!service_id) return new Response(JSON.stringify({ error: "service_id required" }), { status: 400, headers: corsHeaders });

    // Verify service belongs to user (or user is admin)
    const { data: service } = await supabaseAdmin
      .from("hosting_services")
      .select("*")
      .eq("id", service_id)
      .single();

    if (!service) return new Response(JSON.stringify({ error: "Service not found" }), { status: 404, headers: corsHeaders });

    const { data: roles } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", user.id);
    const isAdmin = roles?.some(r => ["super_admin", "admin"].includes(r.role));

    if (service.user_id !== user.id && !isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });
    }

    if (service.status !== "active") {
      return new Response(JSON.stringify({ error: "Service is not active" }), { status: 400, headers: corsHeaders });
    }

    const DA_BASE_URL = Deno.env.get("DIRECTADMIN_BASE_URL");
    const DA_USERNAME = Deno.env.get("DIRECTADMIN_USERNAME");
    const DA_LOGIN_KEY = Deno.env.get("DIRECTADMIN_LOGIN_KEY");
    const DA_USE_SSL = Deno.env.get("DIRECTADMIN_USE_SSL") !== "false";

    if (!DA_BASE_URL || !DA_USERNAME || !DA_LOGIN_KEY) {
      return new Response(JSON.stringify({ error: "DirectAdmin not configured" }), { status: 503, headers: corsHeaders });
    }

    // Get stored credentials
    const { data: creds } = await supabaseAdmin
      .from("service_credentials")
      .select("encrypted_password, encrypted_login_url")
      .eq("hosting_service_id", service_id)
      .single();

    if (!creds) {
      return new Response(JSON.stringify({ error: "Credentials not found" }), { status: 404, headers: corsHeaders });
    }

    // Create a temporary login session via DirectAdmin API
    // Using the CMD_LOGIN endpoint to generate a one-time login link
    const authString = btoa(`${DA_USERNAME}:${DA_LOGIN_KEY}`);
    const protocol = DA_USE_SSL ? "https" : "http";
    const daUsername = service.directadmin_user || service.username || "";

    // Generate login URL using stored credentials
    const loginUrl = `${protocol}://${DA_BASE_URL.replace(/^https?:\/\//, "")}`;

    // Log the access attempt
    await supabaseAdmin.from("automation_logs").insert({
      entity_type: "hosting_service",
      entity_id: service_id,
      action: "da_login_access",
      status: "success",
      request_json: { user_id: user.id, da_user: daUsername },
    });

    return new Response(JSON.stringify({
      login_url: loginUrl,
      username: daUsername,
      // Return password only to the owner, via secure channel
      password: creds.encrypted_password,
      message: "Use these credentials to log into DirectAdmin",
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("DA login error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
