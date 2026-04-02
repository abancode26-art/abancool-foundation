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

    const { ticket_id, message } = await req.json();
    if (!ticket_id || !message) {
      return new Response(JSON.stringify({ error: "ticket_id and message are required" }), { status: 400, headers: corsHeaders });
    }

    // Get ticket to verify ownership or admin access
    const { data: ticket } = await supabaseAdmin
      .from("support_tickets")
      .select("*")
      .eq("id", ticket_id)
      .single();

    if (!ticket) return new Response(JSON.stringify({ error: "Ticket not found" }), { status: 404, headers: corsHeaders });

    // Get user's role
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single();

    const role = profile?.role || "customer";
    const isStaff = ["super_admin", "admin", "support"].includes(role);

    // Check permission: must be ticket owner or staff
    if (ticket.user_id !== user.id && !isStaff) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });
    }

    // Insert message
    const { error: msgError } = await supabaseAdmin
      .from("support_ticket_messages")
      .insert({
        ticket_id,
        sender_user_id: user.id,
        sender_role: role,
        message,
      });

    if (msgError) throw msgError;

    // Update ticket status
    const newStatus = isStaff ? "admin_reply" : "customer_reply";
    await supabaseAdmin
      .from("support_tickets")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", ticket_id);

    // Notify the other party
    if (isStaff) {
      // Notify ticket owner
      await supabaseAdmin.from("notifications").insert({
        user_id: ticket.user_id,
        title: "Ticket Reply",
        message: `Staff replied to your ticket ${ticket.ticket_number}: "${ticket.subject}"`,
        type: "ticket",
        action_url: `/client/tickets/${ticket_id}`,
      }).catch(() => {});
    } else {
      // Notify admins
      const { data: staffUsers } = await supabaseAdmin
        .from("user_roles")
        .select("user_id")
        .in("role", ["super_admin", "admin", "support"]);

      if (staffUsers?.length) {
        const staffNotifications = staffUsers.map((s: any) => ({
          user_id: s.user_id,
          title: "Customer Reply",
          message: `${profile?.full_name || "Customer"} replied to ticket ${ticket.ticket_number}`,
          type: "ticket",
          action_url: `/admin/tickets/${ticket_id}`,
        }));
        await supabaseAdmin.from("notifications").insert(staffNotifications).catch(() => {});
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Reply ticket error:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to reply" }), {
      status: 500, headers: corsHeaders,
    });
  }
});
