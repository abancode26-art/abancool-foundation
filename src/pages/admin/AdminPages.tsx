// Placeholder admin pages for routing
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';

export function AdminClients() {
  const clients = [
    { id: '1', name: 'John Mwangi', email: 'john@mwangitech.co.ke', services: 2, status: 'active', created: '2024-01-15' },
    { id: '2', name: 'Grace Wanjiku', email: 'grace@savannah.digital', services: 3, status: 'active', created: '2024-03-01' },
    { id: '3', name: 'David Otieno', email: 'david@nairobieats.com', services: 1, status: 'active', created: '2024-06-20' },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold font-heading">Clients</h1><p className="text-muted-foreground">Manage client accounts</p></div></div>
      <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search clients..." className="pl-10" /></div>
      <div className="rounded-xl border border-border overflow-hidden"><table className="w-full"><thead><tr className="bg-muted/50"><th className="text-left px-6 py-3 text-sm font-semibold">Name</th><th className="text-left px-6 py-3 text-sm font-semibold hidden md:table-cell">Email</th><th className="text-left px-6 py-3 text-sm font-semibold">Services</th><th className="text-left px-6 py-3 text-sm font-semibold">Status</th></tr></thead>
        <tbody>{clients.map(c => <tr key={c.id} className="border-t border-border hover:bg-muted/30"><td className="px-6 py-4"><Link to={`/admin/clients/${c.id}`} className="text-sm font-semibold text-primary hover:underline">{c.name}</Link></td><td className="px-6 py-4 text-sm hidden md:table-cell">{c.email}</td><td className="px-6 py-4 text-sm">{c.services}</td><td className="px-6 py-4"><StatusBadge status={c.status} /></td></tr>)}</tbody>
      </table></div>
    </div>
  );
}

export function AdminProducts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold font-heading">Products</h1><p className="text-muted-foreground">Manage hosting products</p></div><Button asChild><Link to="/admin/products/new"><Plus className="h-4 w-4 mr-2" /> New Product</Link></Button></div>
      <div className="rounded-xl border border-border bg-card p-12 text-center"><p className="text-muted-foreground">Product management interface — connect to backend API.</p></div>
    </div>
  );
}

export function AdminOrders() {
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Orders</h1><p className="text-muted-foreground">Manage customer orders</p></div><div className="rounded-xl border border-border bg-card p-12 text-center"><p className="text-muted-foreground">Order management — connect to backend API.</p></div></div>;
}

export function AdminInvoices() {
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Invoices</h1><p className="text-muted-foreground">Manage invoices</p></div><div className="rounded-xl border border-border bg-card p-12 text-center"><p className="text-muted-foreground">Invoice management — connect to backend API.</p></div></div>;
}

export function AdminPayments() {
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Payments</h1><p className="text-muted-foreground">Review and verify payments</p></div><div className="rounded-xl border border-border bg-card p-12 text-center"><p className="text-muted-foreground">Payment verification — connect to backend API.</p></div></div>;
}

export function AdminServices() {
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Services</h1><p className="text-muted-foreground">Manage hosting services</p></div><div className="rounded-xl border border-border bg-card p-12 text-center"><p className="text-muted-foreground">Service management — connect to backend API.</p></div></div>;
}

export function AdminServers() {
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Servers</h1><p className="text-muted-foreground">Manage hosting servers</p></div><div className="rounded-xl border border-border bg-card p-12 text-center"><p className="text-muted-foreground">Server management — connect to backend API.</p></div></div>;
}

export function AdminDirectAdmin() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold font-heading">DirectAdmin Integration</h1><p className="text-muted-foreground">Configure DirectAdmin server connection</p></div>
      <div className="rounded-xl border border-border bg-card p-8 max-w-2xl space-y-4">
        <div><label className="text-sm font-medium mb-1.5 block">Hostname</label><Input defaultValue="server.abancool.com" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm font-medium mb-1.5 block">Port</label><Input defaultValue="2222" /></div>
          <div><label className="text-sm font-medium mb-1.5 block">Use SSL</label><select className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm"><option>Yes</option><option>No</option></select></div>
        </div>
        <div><label className="text-sm font-medium mb-1.5 block">API Username</label><Input defaultValue="admin" /></div>
        <div><label className="text-sm font-medium mb-1.5 block">API Password / Login Key</label><Input type="password" placeholder="••••••••" /></div>
        <div><label className="text-sm font-medium mb-1.5 block">Default Nameservers</label><Input defaultValue="ns1.abancool.com, ns2.abancool.com" /></div>
        <div><label className="text-sm font-medium mb-1.5 block">Provisioning Mode</label><select className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm"><option>Automatic after payment</option><option>Manual approval first</option></select></div>
        <div className="flex gap-3"><Button>Save Settings</Button><Button variant="outline">Test Connection</Button></div>
      </div>
    </div>
  );
}

export function AdminProvisioning() {
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Provisioning Logs</h1><p className="text-muted-foreground">Monitor hosting account provisioning</p></div><div className="rounded-xl border border-border bg-card p-12 text-center"><p className="text-muted-foreground">Provisioning log viewer — connect to backend API.</p></div></div>;
}

export function AdminTickets() {
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Support Tickets</h1><p className="text-muted-foreground">Manage support requests</p></div><div className="rounded-xl border border-border bg-card p-12 text-center"><p className="text-muted-foreground">Ticket queue — connect to backend API.</p></div></div>;
}

export function AdminAnnouncements() {
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Announcements</h1><p className="text-muted-foreground">Manage announcements</p></div><div className="rounded-xl border border-border bg-card p-12 text-center"><p className="text-muted-foreground">Announcement CRUD — connect to backend API.</p></div></div>;
}

export function AdminCoupons() {
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Coupons</h1><p className="text-muted-foreground">Manage discount coupons</p></div><div className="rounded-xl border border-border bg-card p-12 text-center"><p className="text-muted-foreground">Coupon management — connect to backend API.</p></div></div>;
}

export function AdminSettings() {
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Settings</h1><p className="text-muted-foreground">Platform configuration</p></div><div className="rounded-xl border border-border bg-card p-12 text-center"><p className="text-muted-foreground">Settings panel — connect to backend API.</p></div></div>;
}

export function AdminEmailTemplates() {
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Email Templates</h1><p className="text-muted-foreground">Manage email templates</p></div><div className="rounded-xl border border-border bg-card p-12 text-center"><p className="text-muted-foreground">Email template editor — connect to backend API.</p></div></div>;
}

export function AdminActivityLogs() {
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Activity Logs</h1><p className="text-muted-foreground">View system activity</p></div><div className="rounded-xl border border-border bg-card p-12 text-center"><p className="text-muted-foreground">Activity log viewer — connect to backend API.</p></div></div>;
}

export function AdminPackages() {
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Hosting Packages</h1><p className="text-muted-foreground">Manage DirectAdmin packages</p></div><div className="rounded-xl border border-border bg-card p-12 text-center"><p className="text-muted-foreground">Package management — connect to backend API.</p></div></div>;
}
