import { sampleServices } from '@/data/placeholder';
import { Button } from '@/components/ui/button';
import { Terminal, Copy, ExternalLink, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function ClientDirectAdmin() {
  const activeServices = sampleServices.filter(s => s.status === 'active');
  const copy = (text: string, label: string) => { navigator.clipboard.writeText(text); toast.success(`${label} copied!`); };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold font-heading flex items-center gap-2"><Terminal className="h-6 w-6 text-primary" /> DirectAdmin Access</h1><p className="text-muted-foreground">Access your hosting control panel</p></div>

      <div className="rounded-xl border border-warning/20 bg-warning/5 p-4 text-sm flex items-start gap-3">
        <Shield className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
        <div><strong>Security Notice:</strong> Only access DirectAdmin from trusted devices. Never share your credentials.</div>
      </div>

      <div className="space-y-4">
        {activeServices.map(svc => {
          const daUrl = `https://${svc.server_hostname}:2222`;
          return (
            <div key={svc.id} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold font-heading">{svc.domain}</h3>
                <Button size="sm" asChild><a href={daUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4 mr-2" /> Login to DirectAdmin</a></Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { label: 'Control Panel URL', value: daUrl },
                  { label: 'Username', value: svc.directadmin_username || '—' },
                  { label: 'Server', value: svc.server_hostname || '—' },
                  { label: 'IP Address', value: svc.ip_address || '—' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-3">
                    <div><span className="text-xs text-muted-foreground block">{item.label}</span><span className="text-sm font-medium font-mono">{item.value}</span></div>
                    <button onClick={() => copy(item.value, item.label)} className="text-muted-foreground hover:text-foreground"><Copy className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-sm text-muted-foreground">Nameservers: {svc.nameservers?.join(', ')}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
