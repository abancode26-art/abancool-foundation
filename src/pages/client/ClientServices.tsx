import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';
import { sampleServices } from '@/data/placeholder';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function ClientServices() {
  const [search, setSearch] = useState('');
  const filtered = sampleServices.filter(s => s.domain.toLowerCase().includes(search.toLowerCase()) || s.product_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold font-heading">My Services</h1><p className="text-muted-foreground">Manage your hosting services</p></div>
        <Button asChild><Link to="/hosting/shared"><Plus className="h-4 w-4 mr-2" /> New Service</Link></Button>
      </div>

      <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground mb-4">No services found.</p>
          <Button asChild><Link to="/hosting/shared">Get Your First Hosting Plan</Link></Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(svc => (
            <Link key={svc.id} to={`/client/services/${svc.id}`} className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-all card-hover">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold font-heading">{svc.domain}</h3>
                <StatusBadge status={svc.status} />
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between"><span>Package</span><span className="font-medium text-foreground">{svc.product_name}</span></div>
                <div className="flex justify-between"><span>Billing</span><span className="font-medium text-foreground capitalize">{svc.billing_cycle}</span></div>
                <div className="flex justify-between"><span>Amount</span><span className="font-medium text-foreground">{svc.currency} {svc.amount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Next Due</span><span className="font-medium text-foreground">{svc.next_due_date}</span></div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
