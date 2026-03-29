import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';
import { sampleDomains } from '@/data/placeholder';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ClientDomains() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold font-heading">My Domains</h1><p className="text-muted-foreground">Manage your domain names</p></div>
        <Button asChild><Link to="/domains"><Plus className="h-4 w-4 mr-2" /> Register Domain</Link></Button>
      </div>

      {sampleDomains.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center"><p className="text-muted-foreground mb-4">No domains registered yet.</p><Button asChild><Link to="/domains">Register Your First Domain</Link></Button></div>
      ) : (
        <div className="space-y-4">
          {sampleDomains.map(d => (
            <Link key={d.id} to={`/client/domains/${d.id}`} className="block rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-all card-hover">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold font-heading text-lg">{d.domain_name}</h3>
                <StatusBadge status={d.status} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><span className="text-muted-foreground block">Registered</span><span className="font-medium">{d.registration_date}</span></div>
                <div><span className="text-muted-foreground block">Expires</span><span className="font-medium">{d.expiry_date}</span></div>
                <div><span className="text-muted-foreground block">Auto Renew</span><span className="font-medium">{d.auto_renew ? 'Enabled' : 'Disabled'}</span></div>
                <div><span className="text-muted-foreground block">Lock</span><span className="font-medium">{d.is_locked ? 'Locked' : 'Unlocked'}</span></div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
