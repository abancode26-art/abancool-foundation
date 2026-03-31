import { Link } from 'react-router-dom';
import { Server, FileText, MessageSquare, AlertCircle, ArrowRight, Globe, Terminal, Plus, Search, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { useMyServices, useMyInvoices, useMyTickets, useMyDomains, useAnnouncements } from '@/hooks/useSupabase';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function ClientDashboard() {
  const { user } = useAuth();
  const { data: services, isLoading: svcLoading } = useMyServices();
  const { data: invoices, isLoading: invLoading } = useMyInvoices();
  const { data: tickets } = useMyTickets();
  const { data: domains } = useMyDomains();
  const { data: announcements } = useAnnouncements();

  const activeServices = services?.filter((s: any) => s.status === 'active') || [];
  const unpaidInvoices = invoices?.filter((i: any) => i.status === 'unpaid') || [];
  const openTickets = tickets?.filter((t: any) => t.status !== 'closed') || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading mb-1">Welcome back, {user?.full_name?.split(' ')[0] || 'there'}</h1>
        <p className="text-muted-foreground">Here's an overview of your account.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Services', value: svcLoading ? '...' : activeServices.length, icon: Server, color: 'text-success' },
          { label: 'Unpaid Invoices', value: invLoading ? '...' : unpaidInvoices.length, icon: FileText, color: unpaidInvoices.length > 0 ? 'text-warning' : 'text-success' },
          { label: 'Open Tickets', value: openTickets.length, icon: MessageSquare, color: 'text-info' },
          { label: 'Domains', value: domains?.length || 0, icon: Globe, color: 'text-primary' },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
            <stat.icon className={`h-5 w-5 ${stat.color} mb-3`} />
            <div className="text-2xl font-bold font-heading">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {unpaidInvoices.length > 0 && (
        <div className="rounded-xl border border-warning/30 bg-warning/5 p-5 flex items-start gap-4">
          <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-heading font-semibold mb-1">You have {unpaidInvoices.length} unpaid invoice{unpaidInvoices.length > 1 ? 's' : ''}</h3>
            <p className="text-sm text-muted-foreground">Please settle outstanding invoices to keep your services active.</p>
          </div>
          <Button size="sm" asChild><Link to="/client/invoices">View Invoices</Link></Button>
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold font-heading mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Buy Hosting', icon: Plus, href: '/hosting/shared' },
            { label: 'Search Domain', icon: Search, href: '/domains' },
            { label: 'Open Ticket', icon: MessageSquare, href: '/client/tickets/new' },
            { label: 'Pay Invoice', icon: CreditCard, href: '/client/invoices' },
            { label: 'DirectAdmin', icon: Terminal, href: '/client/directadmin' },
            { label: 'My Services', icon: Server, href: '/client/services' },
          ].map(action => (
            <Link key={action.label} to={action.href} className="rounded-xl border border-border bg-card p-4 text-center hover:border-primary/30 hover:bg-primary/5 transition-all group">
              <action.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary mx-auto mb-2 transition-colors" />
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-heading">Active Services</h2>
            <Link to="/client/services" className="text-sm text-primary hover:underline flex items-center gap-1">View All <ArrowRight className="h-3 w-3" /></Link>
          </div>
          {svcLoading ? <Skeleton className="h-32 rounded-xl" /> : activeServices.length === 0 ? (
            <p className="text-muted-foreground text-sm">No active services yet.</p>
          ) : (
            <div className="space-y-3">
              {activeServices.slice(0, 5).map((svc: any) => (
                <Link key={svc.id} to={`/client/services/${svc.id}`} className="block rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{svc.domain_name || 'Unnamed'}</span>
                    <StatusBadge status={svc.status} />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{svc.hosting_products?.name || svc.package_name}</span>
                    <span>Due: {svc.next_due_date || '—'}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-heading">Recent Invoices</h2>
            <Link to="/client/invoices" className="text-sm text-primary hover:underline flex items-center gap-1">View All <ArrowRight className="h-3 w-3" /></Link>
          </div>
          {invLoading ? <Skeleton className="h-32 rounded-xl" /> : !invoices?.length ? (
            <p className="text-muted-foreground text-sm">No invoices yet.</p>
          ) : (
            <div className="space-y-3">
              {invoices.slice(0, 5).map((inv: any) => (
                <Link key={inv.id} to={`/client/invoices/${inv.id}`} className="block rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{inv.invoice_number}</span>
                    <StatusBadge status={inv.status} />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>KES {Number(inv.total).toLocaleString()}</span>
                    <span>Due: {inv.due_date}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {announcements && announcements.length > 0 && (
        <div>
          <h2 className="text-lg font-bold font-heading mb-4">Announcements</h2>
          <div className="space-y-3">
            {announcements.slice(0, 3).map((ann: any) => (
              <div key={ann.id} className="rounded-xl border border-border bg-card p-4">
                <h3 className="font-semibold mb-1">{ann.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{ann.content}</p>
                <span className="text-xs text-muted-foreground mt-2 block">{new Date(ann.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
