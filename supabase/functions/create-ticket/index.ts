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

    const { subject, message, department_id, priority, service_id } = await req.json();

    if (!subject || !message || !department_id) {
      return new Response(JSON.stringify({ error: "subject, message, and department_id are required" }), { status: 400, headers: corsHeaders });
    }

    // Get user profile
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name, email, role")
      .eq("id", user.id)
      .single();

    // Create ticket using admin client (bypasses RLS)
    const { data: ticket, error: ticketError } = await supabaseAdmin
      .from("support_tickets")
      .insert({
        user_id: user.id,
        subject,
        department_id,
        priority: priority || "medium",
        service_id: service_id || null,
        status: "open",
      })
      .select()
      .single();

    if (ticketError) throw ticketError;

    // Create initial message
    const { error: msgError } = await supabaseAdmin
      .from("support_ticket_messages")
      .insert({
        ticket_id: ticket.id,
        sender_user_id: user.id,
        sender_role: profile?.role || "customer",
        message,
      });

    if (msgError) throw msgError;

    // Notify ALL admins/support staff about new ticket
    const { data: staffUsers } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .in("role", ["super_admin", "admin", "support"]);

    if (staffUsers?.length) {
      const staffNotifications = staffUsers.map((s: any) => ({
        user_id: s.user_id,
        title: "New Support Ticket",
        message: `${profile?.full_name || "A customer"} opened ticket ${ticket.ticket_number}: "${subject}"`,
        type: "ticket",
        action_url: `/admin/tickets/${ticket.id}`,
      }));
      await supabaseAdmin.from("notifications").insert(staffNotifications).catch(() => {});
    }

    // Notify the customer their ticket was created
    await supabaseAdmin.from("notifications").insert({
      user_id: user.id,
      title: "Ticket Created",
      message: `Your support ticket ${ticket.ticket_number} has been submitted. We'll respond shortly.`,
      type: "ticket",
      action_url: `/client/tickets/${ticket.id}`,
    }).catch(() => {});

    return new Response(JSON.stringify({
      id: ticket.id,
      ticket_number: ticket.ticket_number,
      status: ticket.status,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Create ticket error:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to create ticket" }), {
      status: 500, headers: corsHeaders,
    });
  }
});
