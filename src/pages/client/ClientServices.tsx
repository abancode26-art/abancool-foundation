import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';
import { useMyServices } from '@/hooks/useSupabase';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ClientServices() {
  const [search, setSearch] = useState('');
  const { data: services, isLoading } = useMyServices();

  const filtered = (services || []).filter((s: any) =>
    (s.domain_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.hosting_products?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold font-heading">My Services</h1><p className="text-muted-foreground">Manage your hosting services</p></div>
        <Button asChild><Link to="/hosting/shared"><Plus className="h-4 w-4 mr-2" /> New Service</Link></Button>
      </div>
      <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[1,2].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground mb-4">No services found.</p>
          <Button asChild><Link to="/hosting/shared">Get Your First Hosting Plan</Link></Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((svc: any) => (
            <Link key={svc.id} to={`/client/services/${svc.id}`} className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-all card-hover">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold font-heading">{svc.domain_name || 'Unnamed'}</h3>
                <StatusBadge status={svc.status} />
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between"><span>Package</span><span className="font-medium text-foreground">{svc.hosting_products?.name || svc.package_name || '—'}</span></div>
                <div className="flex justify-between"><span>Billing</span><span className="font-medium text-foreground capitalize">{svc.billing_cycle || '—'}</span></div>
                <div className="flex justify-between"><span>Next Due</span><span className="font-medium text-foreground">{svc.next_due_date || '—'}</span></div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
