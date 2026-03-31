import { Users, Server, ShoppingCart, FileText, CreditCard, MessageSquare, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';
import { useAdminStats, useAllOrders, useAllTickets, useAutomationLogs } from '@/hooks/useSupabase';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();
  const { data: orders } = useAllOrders();
  const { data: tickets } = useAllTickets();
  const { data: logs } = useAutomationLogs();

  const recentOrders = (orders || []).slice(0, 5);
  const openTickets = (tickets || []).filter((t: any) => t.status !== 'closed').slice(0, 5);
  const failedLogs = (logs || []).filter((l: any) => l.status === 'failed');

  const statCards = [
    { label: 'Total Clients', value: stats?.total_clients ?? '—', icon: Users, color: 'text-primary' },
    { label: 'Active Services', value: stats?.active_services ?? '—', icon: Server, color: 'text-success' },
    { label: 'Pending Orders', value: stats?.pending_orders ?? '—', icon: ShoppingCart, color: 'text-warning' },
    { label: 'Unpaid Invoices', value: stats?.unpaid_invoices ?? '—', icon: FileText, color: 'text-destructive' },
    { label: 'Revenue (MTD)', value: stats?.monthly_revenue ? `KES ${Number(stats.monthly_revenue).toLocaleString()}` : '—', icon: CreditCard, color: 'text-success' },
    { label: 'Open Tickets', value: stats?.open_tickets ?? '—', icon: MessageSquare, color: 'text-info' },
  ];

  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-bold font-heading">Admin Dashboard</h1><p className="text-muted-foreground">Overview of your hosting platform</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            {isLoading ? <Skeleton className="h-16" /> : <>
              <s.icon className={`h-5 w-5 ${s.color} mb-3`} />
              <div className="text-2xl font-bold font-heading">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </>}
          </div>
        ))}
      </div>

      {failedLogs.length > 0 && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 flex items-start gap-4">
          <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
          <div className="flex-1"><h3 className="font-heading font-semibold mb-1">{failedLogs.length} Failed Automation(s)</h3><p className="text-sm text-muted-foreground">Check provisioning logs for details.</p></div>
          <Link to="/admin/provisioning" className="text-sm text-primary hover:underline font-medium">View Logs</Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold font-heading">Recent Orders</h2><Link to="/admin/orders" className="text-sm text-primary hover:underline">View All</Link></div>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full"><thead><tr className="bg-muted/50"><th className="text-left px-4 py-2.5 text-xs font-semibold">Order</th><th className="text-left px-4 py-2.5 text-xs font-semibold">Client</th><th className="text-left px-4 py-2.5 text-xs font-semibold">Status</th></tr></thead>
              <tbody>{recentOrders.length === 0 ? <tr><td colSpan={3} className="px-4 py-6 text-center text-muted-foreground text-sm">No orders yet</td></tr> :
                recentOrders.map((o: any) => <tr key={o.id} className="border-t border-border"><td className="px-4 py-3 text-sm font-semibold">{o.order_number}</td><td className="px-4 py-3 text-sm">{o.profiles?.full_name || '—'}</td><td className="px-4 py-3"><StatusBadge status={o.status} /></td></tr>)}</tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold font-heading">Open Tickets</h2><Link to="/admin/tickets" className="text-sm text-primary hover:underline">View All</Link></div>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full"><thead><tr className="bg-muted/50"><th className="text-left px-4 py-2.5 text-xs font-semibold">Subject</th><th className="text-left px-4 py-2.5 text-xs font-semibold">Priority</th><th className="text-left px-4 py-2.5 text-xs font-semibold">Status</th></tr></thead>
              <tbody>{openTickets.length === 0 ? <tr><td colSpan={3} className="px-4 py-6 text-center text-muted-foreground text-sm">No open tickets</td></tr> :
                openTickets.map((t: any) => <tr key={t.id} className="border-t border-border"><td className="px-4 py-3 text-sm">{t.subject}</td><td className="px-4 py-3"><StatusBadge status={t.priority} /></td><td className="px-4 py-3"><StatusBadge status={t.status} /></td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
