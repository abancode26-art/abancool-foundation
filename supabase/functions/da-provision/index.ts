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

    // Get service details - try hosting_products first, fallback to hosting_packages
    const { data: service } = await supabaseAdmin
      .from("hosting_services")
      .select("*")
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
      await logAndFail(supabaseAdmin, service_id, service.user_id, "DirectAdmin credentials not configured");
      return new Response(JSON.stringify({ error: "DirectAdmin not configured" }), { status: 503, headers: corsHeaders });
    }

    // Resolve DA package name from product tables
    let daPackageName = service.directadmin_package_name || service.package_name || "";
    let productName = service.package_name || "Hosting";
    let isReseller = service.directadmin_reseller || service.account_type === "reseller";

    if (service.product_id) {
      const { data: hp } = await supabaseAdmin
        .from("hosting_products")
        .select("name, directadmin_package_name, product_type")
        .eq("id", service.product_id)
        .maybeSingle();

      if (hp) {
        daPackageName = hp.directadmin_package_name || daPackageName;
        productName = hp.name;
        if (hp.product_type === "reseller_hosting") isReseller = true;
      } else {
        const { data: pkg } = await supabaseAdmin
          .from("hosting_packages")
          .select("name, directadmin_package_name, category")
          .eq("id", service.product_id)
          .maybeSingle();
        if (pkg) {
          daPackageName = pkg.directadmin_package_name || daPackageName;
          productName = pkg.name;
          if (pkg.category?.toLowerCase().includes("reseller")) isReseller = true;
        }
      }
    }

    if (!daPackageName) daPackageName = "default";

    // Generate unique username (max 8 chars for DA)
    const domain = service.domain_name || "default";
    const baseName = domain.replace(/[^a-z0-9]/gi, "").substring(0, 6).toLowerCase();
    const username = baseName + Math.floor(Math.random() * 99).toString().padStart(2, "0");

    // Generate secure password
    const password = generatePassword(16);

    const nameservers = JSON.parse(DA_NAMESERVERS);

    // Get user email for the DA account
    const { data: profile } = await supabaseAdmin.from("profiles").select("email, full_name").eq("id", service.user_id).single();

    // Build DirectAdmin API request
    const protocol = DA_USE_SSL ? "https" : "http";
    const daHostClean = DA_BASE_URL.replace(/^https?:\/\//, "");
    const daBaseUrl = `${protocol}://${daHostClean}`;

    // Choose API endpoint based on reseller vs user
    const apiEndpoint = isReseller ? "CMD_API_ACCOUNT_RESELLER" : "CMD_API_ACCOUNT_USER";

    const params = new URLSearchParams({
      action: "create",
      add: "Submit",
      username,
      email: profile?.email || "",
      passwd: password,
      passwd2: password,
      domain: service.domain_name || `${username}.abancool.com`,
      package: daPackageName,
      ip: DA_DEFAULT_IP,
      notify: "no",
    });

    // Add nameservers
    if (nameservers[0]) params.set("dns", nameservers[0]);
    if (nameservers[1]) params.set("dns2", nameservers[1]);

    const authString = btoa(`${DA_USERNAME}:${DA_LOGIN_KEY}`);

    console.log(`Provisioning ${isReseller ? "reseller" : "user"} account: ${username} with package: ${daPackageName}`);

    const daResponse = await fetch(`${daBaseUrl}/${apiEndpoint}`, {
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

    const isError = daText.toLowerCase().includes("error") && !daText.toLowerCase().includes("error=0");
    const isSuccess = daResponse.ok && !isError;

    // Log the automation
    await supabaseAdmin.from("automation_logs").insert({
      entity_type: "hosting_service",
      entity_id: service_id,
      action: "provision",
      status: isSuccess ? "success" : "failed",
      request_json: { url: `${daBaseUrl}/${apiEndpoint}`, params: Object.fromEntries(params), is_reseller: isReseller },
      response_json: daJson,
      error_message: isSuccess ? "" : daText,
    });

    if (isSuccess) {
      // Success - update service
      const serverHostname = daHostClean.split(":")[0];
      await supabaseAdmin.from("hosting_services").update({
        status: "active",
        username,
        directadmin_user: username,
        directadmin_domain: service.domain_name,
        directadmin_package_name: daPackageName,
        directadmin_reseller: isReseller,
        account_type: isReseller ? "reseller" : "user",
        server_hostname: serverHostname,
        server_ip: DA_DEFAULT_IP,
        package_name: productName,
        da_response_json: daJson,
      }).eq("id", service_id);

      // Store credentials securely
      await supabaseAdmin.from("service_credentials").insert({
        hosting_service_id: service_id,
        encrypted_password: password,
        encrypted_login_url: daBaseUrl,
      });

      // Update order status
      if (service.order_id) {
        const { data: allServices } = await supabaseAdmin
          .from("hosting_services")
          .select("status")
          .eq("order_id", service.order_id);

        const allActive = allServices?.every(s => s.status === "active");
        if (allActive) {
          await supabaseAdmin.from("orders").update({ status: "active" }).eq("id", service.order_id);
        }
      }

      // === NOTIFY CLIENT with DirectAdmin credentials ===
      const loginUrl = daBaseUrl;
      await supabaseAdmin.from("notifications").insert({
        user_id: service.user_id,
        title: "🎉 Hosting Account Ready!",
        message: `Your ${isReseller ? "reseller" : "hosting"} account "${productName}" is now active!\n\n` +
          `DirectAdmin Login: ${loginUrl}\n` +
          `Username: ${username}\n` +
          `Password: ${password}\n` +
          `Domain: ${service.domain_name || "N/A"}\n\n` +
          `Save these credentials safely. You can also access DirectAdmin from your dashboard.`,
        type: "service",
        action_url: `/client/services/${service_id}`,
      }).catch(() => {});

      // === NOTIFY ADMINS about successful provisioning ===
      const { data: adminUsers } = await supabaseAdmin
        .from("user_roles")
        .select("user_id")
        .in("role", ["super_admin", "admin"]);

      if (adminUsers?.length) {
        const adminNotifs = adminUsers.map((a: any) => ({
          user_id: a.user_id,
          title: "Service Provisioned",
          message: `${isReseller ? "Reseller" : "Hosting"} account provisioned for ${profile?.full_name || "customer"}: ${username}@${serverHostname} (${productName})`,
          type: "service",
          action_url: `/admin/services`,
        }));
        await supabaseAdmin.from("notifications").insert(adminNotifs).catch(() => {});
      }

      return new Response(JSON.stringify({ success: true, username, message: "Hosting account provisioned" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      await logAndFail(supabaseAdmin, service_id, service.user_id, daText);
      return new Response(JSON.stringify({ error: "Provisioning failed", details: daText }), { status: 502, headers: corsHeaders });
    }
  } catch (error) {
    console.error("DA Provision error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});

async function logAndFail(supabase: any, serviceId: string, userId: string, errorMsg: string) {
  await supabase.from("hosting_services").update({ status: "failed" }).eq("id", serviceId);
  await supabase.from("automation_logs").insert({
    entity_type: "hosting_service",
    entity_id: serviceId,
    action: "provision",
    status: "failed",
    error_message: errorMsg,
  });

  // Notify admins about failure
  const { data: adminUsers } = await supabase
    .from("user_roles")
    .select("user_id")
    .in("role", ["super_admin", "admin"]);

  if (adminUsers?.length) {
    const adminNotifs = adminUsers.map((a: any) => ({
      user_id: a.user_id,
      title: "⚠️ Provisioning Failed",
      message: `Hosting provisioning failed for service ${serviceId}. Error: ${errorMsg.substring(0, 200)}`,
      type: "alert",
      action_url: `/admin/services`,
    }));
    await supabase.from("notifications").insert(adminNotifs).catch(() => {});
  }

  // Notify customer
  await supabase.from("notifications").insert({
    user_id: userId,
    title: "Service Setup Delayed",
    message: "Your hosting account setup is taking longer than expected. Our team has been notified and will resolve this shortly.",
    type: "service",
    action_url: `/client/services`,
  }).catch(() => {});
}

function generatePassword(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, b => chars[b % chars.length]).join("");
}
