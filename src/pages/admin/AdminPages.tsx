import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAllClients, useAdminProducts, useAllOrders, useAllInvoices, useAllPayments, useAllServices, useAllTickets, useAllDomains, useAutomationLogs, useDAManage } from '@/hooks/useSupabase';
import { useState } from 'react';
import { toast } from 'sonner';

export function AdminClients() {
  const { data: clients, isLoading } = useAllClients();
  const [search, setSearch] = useState('');
  const filtered = (clients || []).filter((c: any) => (c.full_name || '').toLowerCase().includes(search.toLowerCase()) || (c.email || '').toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold font-heading">Clients</h1><p className="text-muted-foreground">Manage client accounts</p></div>
      <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
      {isLoading ? <Skeleton className="h-48 rounded-xl" /> : (
        <div className="rounded-xl border border-border overflow-hidden"><table className="w-full"><thead><tr className="bg-muted/50"><th className="text-left px-6 py-3 text-sm font-semibold">Name</th><th className="text-left px-6 py-3 text-sm font-semibold hidden md:table-cell">Email</th><th className="text-left px-6 py-3 text-sm font-semibold hidden md:table-cell">Phone</th><th className="text-left px-6 py-3 text-sm font-semibold">Status</th></tr></thead>
          <tbody>{filtered.map((c: any) => <tr key={c.id} className="border-t border-border hover:bg-muted/30"><td className="px-6 py-4 text-sm font-semibold">{c.full_name || '—'}</td><td className="px-6 py-4 text-sm hidden md:table-cell">{c.email}</td><td className="px-6 py-4 text-sm hidden md:table-cell">{c.phone || '—'}</td><td className="px-6 py-4"><StatusBadge status={c.status} /></td></tr>)}</tbody>
        </table></div>
      )}
    </div>
  );
}

export function AdminProducts() {
  const { data: products, isLoading } = useAdminProducts();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold font-heading">Products</h1><p className="text-muted-foreground">Manage hosting products & pricing</p></div></div>
      {isLoading ? <Skeleton className="h-48 rounded-xl" /> : (
        <div className="rounded-xl border border-border overflow-hidden"><table className="w-full"><thead><tr className="bg-muted/50"><th className="text-left px-6 py-3 text-sm font-semibold">Name</th><th className="text-left px-6 py-3 text-sm font-semibold hidden md:table-cell">Type</th><th className="text-left px-6 py-3 text-sm font-semibold hidden md:table-cell">DA Package</th><th className="text-left px-6 py-3 text-sm font-semibold">Featured</th><th className="text-left px-6 py-3 text-sm font-semibold">Active</th></tr></thead>
          <tbody>{(products || []).map((p: any) => <tr key={p.id} className="border-t border-border hover:bg-muted/30"><td className="px-6 py-4 text-sm font-semibold">{p.name}</td><td className="px-6 py-4 text-sm hidden md:table-cell capitalize">{(p.product_type || '').replace(/_/g, ' ')}</td><td className="px-6 py-4 text-sm font-mono hidden md:table-cell">{p.directadmin_package_name || '—'}</td><td className="px-6 py-4">{p.is_featured ? '⭐' : '—'}</td><td className="px-6 py-4"><StatusBadge status={p.is_active ? 'active' : 'inactive'} /></td></tr>)}</tbody>
        </table></div>
      )}
    </div>
  );
}

export function AdminOrders() {
  const { data: orders, isLoading } = useAllOrders();
  return (
    <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Orders</h1><p className="text-muted-foreground">Manage customer orders</p></div>
      {isLoading ? <Skeleton className="h-48 rounded-xl" /> : (
        <div className="rounded-xl border border-border overflow-hidden"><table className="w-full"><thead><tr className="bg-muted/50"><th className="text-left px-6 py-3 text-sm font-semibold">Order</th><th className="text-left px-6 py-3 text-sm font-semibold hidden md:table-cell">Client</th><th className="text-left px-6 py-3 text-sm font-semibold">Total</th><th className="text-left px-6 py-3 text-sm font-semibold">Status</th><th className="text-left px-6 py-3 text-sm font-semibold hidden md:table-cell">Date</th></tr></thead>
          <tbody>{(orders || []).map((o: any) => <tr key={o.id} className="border-t border-border hover:bg-muted/30"><td className="px-6 py-4 text-sm font-semibold">{o.order_number}</td><td className="px-6 py-4 text-sm hidden md:table-cell">{o.profiles?.full_name || '—'}</td><td className="px-6 py-4 text-sm">KES {Number(o.total).toLocaleString()}</td><td className="px-6 py-4"><StatusBadge status={o.status} /></td><td className="px-6 py-4 text-sm hidden md:table-cell">{new Date(o.created_at).toLocaleDateString()}</td></tr>)}</tbody>
        </table></div>
      )}
    </div>
  );
}

export function AdminInvoices() {
  const { data: invoices, isLoading } = useAllInvoices();
  return (
    <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Invoices</h1><p className="text-muted-foreground">Manage invoices</p></div>
      {isLoading ? <Skeleton className="h-48 rounded-xl" /> : (
        <div className="rounded-xl border border-border overflow-hidden"><table className="w-full"><thead><tr className="bg-muted/50"><th className="text-left px-6 py-3 text-sm font-semibold">Invoice</th><th className="text-left px-6 py-3 text-sm font-semibold hidden md:table-cell">Client</th><th className="text-left px-6 py-3 text-sm font-semibold">Total</th><th className="text-left px-6 py-3 text-sm font-semibold">Status</th></tr></thead>
          <tbody>{(invoices || []).map((inv: any) => <tr key={inv.id} className="border-t border-border"><td className="px-6 py-4 text-sm font-semibold">{inv.invoice_number}</td><td className="px-6 py-4 text-sm hidden md:table-cell">{inv.profiles?.full_name || '—'}</td><td className="px-6 py-4 text-sm">KES {Number(inv.total).toLocaleString()}</td><td className="px-6 py-4"><StatusBadge status={inv.status} /></td></tr>)}</tbody>
        </table></div>
      )}
    </div>
  );
}

export function AdminPayments() {
  const { data: payments, isLoading } = useAllPayments();
  return (
    <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Payments</h1><p className="text-muted-foreground">Review and verify payments</p></div>
      {isLoading ? <Skeleton className="h-48 rounded-xl" /> : (
        <div className="rounded-xl border border-border overflow-hidden"><table className="w-full"><thead><tr className="bg-muted/50"><th className="text-left px-6 py-3 text-sm font-semibold">Date</th><th className="text-left px-6 py-3 text-sm font-semibold hidden md:table-cell">Client</th><th className="text-left px-6 py-3 text-sm font-semibold hidden md:table-cell">Invoice</th><th className="text-left px-6 py-3 text-sm font-semibold">Amount</th><th className="text-left px-6 py-3 text-sm font-semibold">Method</th><th className="text-left px-6 py-3 text-sm font-semibold">Status</th></tr></thead>
          <tbody>{(payments || []).map((p: any) => <tr key={p.id} className="border-t border-border"><td className="px-6 py-4 text-sm">{new Date(p.created_at).toLocaleDateString()}</td><td className="px-6 py-4 text-sm hidden md:table-cell">{p.profiles?.full_name || '—'}</td><td className="px-6 py-4 text-sm hidden md:table-cell">{p.invoices?.invoice_number || '—'}</td><td className="px-6 py-4 text-sm font-semibold">KES {Number(p.amount).toLocaleString()}</td><td className="px-6 py-4 text-sm capitalize">{(p.method || '').replace(/_/g, ' ')}</td><td className="px-6 py-4"><StatusBadge status={p.status} /></td></tr>)}</tbody>
        </table></div>
      )}
    </div>
  );
}

export function AdminServices() {
  const { data: services, isLoading } = useAllServices();
  const daManage = useDAManage();
  const handleAction = async (action: string, serviceId: string) => {
    try { await daManage.mutateAsync({ action, service_id: serviceId }); toast.success(`${action} completed`); } catch (e: any) { toast.error(e.message); }
  };
  return (
    <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Services</h1><p className="text-muted-foreground">Manage hosting services</p></div>
      {isLoading ? <Skeleton className="h-48 rounded-xl" /> : (
        <div className="rounded-xl border border-border overflow-hidden"><table className="w-full"><thead><tr className="bg-muted/50"><th className="text-left px-6 py-3 text-sm font-semibold">Domain</th><th className="text-left px-6 py-3 text-sm font-semibold hidden md:table-cell">Client</th><th className="text-left px-6 py-3 text-sm font-semibold hidden md:table-cell">Product</th><th className="text-left px-6 py-3 text-sm font-semibold">Status</th><th className="text-left px-6 py-3 text-sm font-semibold">Actions</th></tr></thead>
          <tbody>{(services || []).map((s: any) => <tr key={s.id} className="border-t border-border"><td className="px-6 py-4 text-sm font-semibold">{s.domain_name || '—'}</td><td className="px-6 py-4 text-sm hidden md:table-cell">{s.profiles?.full_name || '—'}</td><td className="px-6 py-4 text-sm hidden md:table-cell">{s.hosting_products?.name || '—'}</td><td className="px-6 py-4"><StatusBadge status={s.status} /></td>
            <td className="px-6 py-4 space-x-1">
              {s.status === 'active' && <Button size="sm" variant="outline" onClick={() => handleAction('suspend', s.id)} disabled={daManage.isPending}>Suspend</Button>}
              {s.status === 'suspended' && <Button size="sm" variant="outline" onClick={() => handleAction('unsuspend', s.id)} disabled={daManage.isPending}>Unsuspend</Button>}
              {s.status === 'pending' && <Button size="sm" onClick={() => handleAction('provision', s.id)} disabled={daManage.isPending}>Provision</Button>}
            </td></tr>)}</tbody>
        </table></div>
      )}
    </div>
  );
}

export function AdminServers() {
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Servers</h1><p className="text-muted-foreground">Manage hosting servers</p></div><div className="rounded-xl border border-border bg-card p-8 text-center"><p className="text-muted-foreground">Server management is configured via Lovable Cloud secrets (DIRECTADMIN_BASE_URL, etc).</p></div></div>;
}

export function AdminDirectAdmin() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold font-heading">DirectAdmin Integration</h1><p className="text-muted-foreground">DirectAdmin is configured via backend secrets</p></div>
      <div className="rounded-xl border border-border bg-card p-8 max-w-2xl space-y-4">
        <p className="text-sm text-muted-foreground">The following secrets are configured in Lovable Cloud and used by edge functions:</p>
        <ul className="text-sm space-y-2">
          {['DIRECTADMIN_BASE_URL', 'DIRECTADMIN_USERNAME', 'DIRECTADMIN_LOGIN_KEY', 'DIRECTADMIN_DEFAULT_IP', 'DIRECTADMIN_DEFAULT_NAMESERVERS_JSON'].map(k => (
            <li key={k} className="flex items-center gap-2"><span className="font-mono bg-muted px-2 py-1 rounded text-xs">{k}</span><span className="text-success text-xs">✓ Configured</span></li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground mt-4">Provisioning runs automatically after payment via the da-provision edge function. Use the Services page to manually suspend/unsuspend/provision accounts.</p>
      </div>
    </div>
  );
}

export function AdminProvisioning() {
  const { data: logs, isLoading } = useAutomationLogs();
  return (
    <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Provisioning Logs</h1><p className="text-muted-foreground">Monitor hosting account provisioning</p></div>
      {isLoading ? <Skeleton className="h-48 rounded-xl" /> : !logs?.length ? (
        <p className="text-muted-foreground">No automation logs yet.</p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden"><table className="w-full"><thead><tr className="bg-muted/50"><th className="text-left px-4 py-2.5 text-xs font-semibold">Entity</th><th className="text-left px-4 py-2.5 text-xs font-semibold">Action</th><th className="text-left px-4 py-2.5 text-xs font-semibold">Status</th><th className="text-left px-4 py-2.5 text-xs font-semibold hidden md:table-cell">Error</th><th className="text-left px-4 py-2.5 text-xs font-semibold">Date</th></tr></thead>
          <tbody>{logs.map((l: any) => <tr key={l.id} className="border-t border-border"><td className="px-4 py-3 text-sm">{l.entity_type}/{l.entity_id?.slice(0,8)}</td><td className="px-4 py-3 text-sm">{l.action}</td><td className="px-4 py-3"><StatusBadge status={l.status} /></td><td className="px-4 py-3 text-sm text-destructive hidden md:table-cell">{l.error_message || '—'}</td><td className="px-4 py-3 text-sm">{new Date(l.created_at).toLocaleDateString()}</td></tr>)}</tbody>
        </table></div>
      )}
    </div>
  );
}

export function AdminTickets() {
  const { data: tickets, isLoading } = useAllTickets();
  return (
    <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Support Tickets</h1><p className="text-muted-foreground">Manage support requests</p></div>
      {isLoading ? <Skeleton className="h-48 rounded-xl" /> : (
        <div className="rounded-xl border border-border overflow-hidden"><table className="w-full"><thead><tr className="bg-muted/50"><th className="text-left px-6 py-3 text-sm font-semibold">Subject</th><th className="text-left px-6 py-3 text-sm font-semibold hidden md:table-cell">Client</th><th className="text-left px-6 py-3 text-sm font-semibold">Priority</th><th className="text-left px-6 py-3 text-sm font-semibold">Status</th></tr></thead>
          <tbody>{(tickets || []).map((t: any) => <tr key={t.id} className="border-t border-border"><td className="px-6 py-4"><Link to={`/client/tickets/${t.id}`} className="text-sm font-semibold text-primary hover:underline">{t.subject}</Link><div className="text-xs text-muted-foreground">{t.ticket_number}</div></td><td className="px-6 py-4 text-sm hidden md:table-cell">{t.profiles?.full_name || '—'}</td><td className="px-6 py-4"><StatusBadge status={t.priority} /></td><td className="px-6 py-4"><StatusBadge status={t.status} /></td></tr>)}</tbody>
        </table></div>
      )}
    </div>
  );
}

export function AdminAnnouncements() {
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Announcements</h1><p className="text-muted-foreground">Manage announcements</p></div><div className="rounded-xl border border-border bg-card p-12 text-center"><p className="text-muted-foreground">Announcement CRUD coming soon. Use Lovable Cloud to insert directly.</p></div></div>;
}

export function AdminCoupons() {
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Coupons</h1><p className="text-muted-foreground">Manage discount coupons</p></div><div className="rounded-xl border border-border bg-card p-12 text-center"><p className="text-muted-foreground">Coupon management coming soon. Use Lovable Cloud to manage coupons directly.</p></div></div>;
}

export function AdminSettings() {
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Settings</h1><p className="text-muted-foreground">Platform configuration</p></div><div className="rounded-xl border border-border bg-card p-12 text-center"><p className="text-muted-foreground">Settings managed via Lovable Cloud admin_settings table.</p></div></div>;
}

export function AdminEmailTemplates() {
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Email Templates</h1><p className="text-muted-foreground">Manage email templates</p></div><div className="rounded-xl border border-border bg-card p-12 text-center"><p className="text-muted-foreground">Email template editor coming soon.</p></div></div>;
}

export function AdminActivityLogs() {
  const { data: logs, isLoading } = useAutomationLogs();
  return (
    <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Activity Logs</h1><p className="text-muted-foreground">View system activity</p></div>
      {isLoading ? <Skeleton className="h-48 rounded-xl" /> : !logs?.length ? <p className="text-muted-foreground">No activity yet.</p> : (
        <div className="rounded-xl border border-border overflow-hidden"><table className="w-full"><thead><tr className="bg-muted/50"><th className="text-left px-4 py-2.5 text-xs font-semibold">Type</th><th className="text-left px-4 py-2.5 text-xs font-semibold">Action</th><th className="text-left px-4 py-2.5 text-xs font-semibold">Status</th><th className="text-left px-4 py-2.5 text-xs font-semibold">Date</th></tr></thead>
          <tbody>{logs.map((l: any) => <tr key={l.id} className="border-t border-border"><td className="px-4 py-3 text-sm">{l.entity_type}</td><td className="px-4 py-3 text-sm">{l.action}</td><td className="px-4 py-3"><StatusBadge status={l.status} /></td><td className="px-4 py-3 text-sm">{new Date(l.created_at).toLocaleString()}</td></tr>)}</tbody>
        </table></div>
      )}
    </div>
  );
}

export function AdminPackages() {
  const { data: products, isLoading } = useAdminProducts();
  return (
    <div className="space-y-6"><div><h1 className="text-2xl font-bold font-heading">Hosting Packages</h1><p className="text-muted-foreground">DirectAdmin package mapping</p></div>
      {isLoading ? <Skeleton className="h-48 rounded-xl" /> : (
        <div className="rounded-xl border border-border overflow-hidden"><table className="w-full"><thead><tr className="bg-muted/50"><th className="text-left px-6 py-3 text-sm font-semibold">Product</th><th className="text-left px-6 py-3 text-sm font-semibold">DA Package</th><th className="text-left px-6 py-3 text-sm font-semibold">Type</th></tr></thead>
          <tbody>{(products || []).map((p: any) => <tr key={p.id} className="border-t border-border"><td className="px-6 py-4 text-sm font-semibold">{p.name}</td><td className="px-6 py-4 text-sm font-mono">{p.directadmin_package_name || 'Not mapped'}</td><td className="px-6 py-4 text-sm capitalize">{(p.product_type || '').replace(/_/g, ' ')}</td></tr>)}</tbody>
        </table></div>
      )}
    </div>
  );
}
