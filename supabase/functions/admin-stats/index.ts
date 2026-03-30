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

    const { data: roles } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", user.id);
    const isAdmin = roles?.some(r => ["super_admin", "admin"].includes(r.role));
    if (!isAdmin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });

    // Gather stats
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    const [
      { count: totalClients },
      { count: activeServices },
      { count: pendingOrders },
      { count: unpaidInvoices },
      { count: openTickets },
      { count: failedProvisions },
      { data: monthlyRevenue },
      { data: dailyRevenue },
      { data: recentOrders },
      { data: recentPayments },
    ] = await Promise.all([
      supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer"),
      supabaseAdmin.from("hosting_services").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabaseAdmin.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending_payment"),
      supabaseAdmin.from("invoices").select("*", { count: "exact", head: true }).eq("status", "unpaid"),
      supabaseAdmin.from("support_tickets").select("*", { count: "exact", head: true }).in("status", ["open", "customer_reply"]),
      supabaseAdmin.from("hosting_services").select("*", { count: "exact", head: true }).eq("status", "failed"),
      supabaseAdmin.from("payments").select("amount").eq("status", "success").gte("paid_at", startOfMonth),
      supabaseAdmin.from("payments").select("amount").eq("status", "success").gte("paid_at", startOfDay),
      supabaseAdmin.from("orders").select("id, order_number, total, status, created_at, profiles(full_name)").order("created_at", { ascending: false }).limit(5),
      supabaseAdmin.from("payments").select("id, amount, status, method, created_at, profiles(full_name)").order("created_at", { ascending: false }).limit(5),
    ]);

    const revenueThisMonth = monthlyRevenue?.reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;
    const revenueToday = dailyRevenue?.reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;

    return new Response(JSON.stringify({
      total_clients: totalClients || 0,
      active_services: activeServices || 0,
      pending_orders: pendingOrders || 0,
      unpaid_invoices: unpaidInvoices || 0,
      open_tickets: openTickets || 0,
      failed_provisions: failedProvisions || 0,
      revenue_this_month: revenueThisMonth,
      revenue_today: revenueToday,
      recent_orders: recentOrders || [],
      recent_payments: recentPayments || [],
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Admin stats error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
