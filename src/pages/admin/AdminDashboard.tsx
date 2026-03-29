import { Users, Server, ShoppingCart, FileText, CreditCard, MessageSquare, Activity, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';
import { sampleOrders, sampleInvoices, sampleTickets, sampleProvisioningLogs, sampleServers } from '@/data/placeholder';

const stats = [
  { label: 'Total Clients', value: '127', icon: Users, color: 'text-primary' },
  { label: 'Active Services', value: '89', icon: Server, color: 'text-success' },
  { label: 'Pending Orders', value: '3', icon: ShoppingCart, color: 'text-warning' },
  { label: 'Unpaid Invoices', value: '12', icon: FileText, color: 'text-destructive' },
  { label: 'Revenue (MTD)', value: 'KES 245K', icon: CreditCard, color: 'text-success' },
  { label: 'Open Tickets', value: '5', icon: MessageSquare, color: 'text-info' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-bold font-heading">Admin Dashboard</h1><p className="text-muted-foreground">Overview of your hosting platform</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            <s.icon className={`h-5 w-5 ${s.color} mb-3`} />
            <div className="text-2xl font-bold font-heading">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Failed provisioning alert */}
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 flex items-start gap-4">
        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
        <div className="flex-1"><h3 className="font-heading font-semibold mb-1">1 Failed Provisioning</h3><p className="text-sm text-muted-foreground">A hosting account failed to provision. Check provisioning logs.</p></div>
        <Link to="/admin/provisioning" className="text-sm text-primary hover:underline font-medium">View Logs</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold font-heading">Recent Orders</h2><Link to="/admin/orders" className="text-sm text-primary hover:underline">View All</Link></div>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full"><thead><tr className="bg-muted/50"><th className="text-left px-4 py-2.5 text-xs font-semibold">Order</th><th className="text-left px-4 py-2.5 text-xs font-semibold">Client</th><th className="text-left px-4 py-2.5 text-xs font-semibold">Status</th></tr></thead>
              <tbody>{sampleOrders.map(o => <tr key={o.id} className="border-t border-border"><td className="px-4 py-3 text-sm font-semibold">{o.order_number}</td><td className="px-4 py-3 text-sm">{o.client_name}</td><td className="px-4 py-3"><StatusBadge status={o.status} /></td></tr>)}</tbody>
            </table>
          </div>
        </div>

        {/* Recent Tickets */}
        <div>
          <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold font-heading">Open Tickets</h2><Link to="/admin/tickets" className="text-sm text-primary hover:underline">View All</Link></div>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full"><thead><tr className="bg-muted/50"><th className="text-left px-4 py-2.5 text-xs font-semibold">Subject</th><th className="text-left px-4 py-2.5 text-xs font-semibold">Priority</th><th className="text-left px-4 py-2.5 text-xs font-semibold">Status</th></tr></thead>
              <tbody>{sampleTickets.map(t => <tr key={t.id} className="border-t border-border"><td className="px-4 py-3 text-sm">{t.subject}</td><td className="px-4 py-3"><StatusBadge status={t.priority} /></td><td className="px-4 py-3"><StatusBadge status={t.status} /></td></tr>)}</tbody>
            </table>
          </div>
        </div>

        {/* Servers */}
        <div>
          <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold font-heading">Servers</h2><Link to="/admin/servers" className="text-sm text-primary hover:underline">Manage</Link></div>
          {sampleServers.map(s => (
            <div key={s.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-3"><h3 className="font-semibold">{s.name}</h3><StatusBadge status={s.status} /></div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>{s.hostname} ({s.ip_address})</div>
                <div>Accounts: {s.current_accounts} / {s.max_accounts}</div>
                <div className="w-full bg-muted rounded-full h-2 mt-2"><div className="bg-primary rounded-full h-2" style={{ width: `${(s.current_accounts / s.max_accounts) * 100}%` }} /></div>
              </div>
            </div>
          ))}
        </div>

        {/* Provisioning Logs */}
        <div>
          <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold font-heading">Recent Provisioning</h2><Link to="/admin/provisioning" className="text-sm text-primary hover:underline">View All</Link></div>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full"><thead><tr className="bg-muted/50"><th className="text-left px-4 py-2.5 text-xs font-semibold">Product</th><th className="text-left px-4 py-2.5 text-xs font-semibold">Action</th><th className="text-left px-4 py-2.5 text-xs font-semibold">Status</th></tr></thead>
              <tbody>{sampleProvisioningLogs.map(l => <tr key={l.id} className="border-t border-border"><td className="px-4 py-3 text-sm">{l.product_name}</td><td className="px-4 py-3 text-sm capitalize">{l.action}</td><td className="px-4 py-3"><StatusBadge status={l.status} /></td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
