import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';
import { useMyDomains } from '@/hooks/useSupabase';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ClientDomains() {
  const { data: domains, isLoading } = useMyDomains();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold font-heading">My Domains</h1><p className="text-muted-foreground">Manage your domain names</p></div>
        <Button asChild><Link to="/domains"><Plus className="h-4 w-4 mr-2" /> Register Domain</Link></Button>
      </div>
      {isLoading ? <Skeleton className="h-32 rounded-xl" /> : !domains?.length ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center"><p className="text-muted-foreground mb-4">No domains registered yet.</p><Button asChild><Link to="/domains">Register Your First Domain</Link></Button></div>
      ) : (
        <div className="space-y-4">
          {domains.map((d: any) => (
            <div key={d.id} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold font-heading text-lg">{d.domain_name}</h3>
                <StatusBadge status={d.status} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div><span className="text-muted-foreground block">TLD</span><span className="font-medium">{d.tld}</span></div>
                <div><span className="text-muted-foreground block">Expires</span><span className="font-medium">{d.expiry_date || '—'}</span></div>
                <div><span className="text-muted-foreground block">Action</span><span className="font-medium capitalize">{d.action_type}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
