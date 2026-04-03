import { useParams, Link } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';
import { useServiceDetail, useDALogin } from '@/hooks/useSupabase';
import { Button } from '@/components/ui/button';
import { Terminal, Copy, ExternalLink, Server, Globe, Shield, RefreshCw, MessageSquare, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

export default function ClientServiceDetail() {
  const { id } = useParams();
  const { data: service, isLoading } = useServiceDetail(id!);
  const daLogin = useDALogin();
  const [daCredentials, setDaCredentials] = useState<any>(null);

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-96 rounded-xl" /></div>;
  if (!service) return <div className="text-center py-20"><h2 className="text-xl font-bold font-heading mb-2">Service Not Found</h2><Button asChild><Link to="/client/services">Back to Services</Link></Button></div>;

  const copyToClipboard = (text: string, label: string) => { navigator.clipboard.writeText(text); toast.success(`${label} copied!`); };

  const handleDALogin = async () => {
    try {
      const result = await daLogin.mutateAsync(service.id);
      setDaCredentials(result);
      if (result.login_url) {
        toast.success('DirectAdmin credentials loaded!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to get DA login');
    }
  };

  const daUrl = daCredentials?.login_url || (service.server_hostname ? `https://${service.server_hostname}:2222` : 'https://server.abancool.com:2222');
  const daUser = daCredentials?.username || service.directadmin_user || service.username || '—';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold font-heading">{service.domain_name || 'Service'}</h1><p className="text-muted-foreground">{service.package_name || service.directadmin_package_name || '—'}</p></div>
        <StatusBadge status={service.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold font-heading mb-4">Service Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Domain', value: service.domain_name || '—' },
                { label: 'Package', value: service.hosting_products?.name || service.package_name || '—' },
                { label: 'Billing Cycle', value: service.billing_cycle || '—' },
                { label: 'Status', value: service.status },
                { label: 'Created', value: service.created_at ? new Date(service.created_at).toLocaleDateString() : '—' },
                { label: 'Next Due', value: service.next_due_date || '—' },
                { label: 'Server', value: service.server_hostname || '—' },
                { label: 'IP Address', value: service.server_ip || '—' },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold font-heading mb-4 flex items-center gap-2"><Terminal className="h-5 w-5 text-primary" /> DirectAdmin Access</h2>
            {!daCredentials ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-4">Click below to securely load your DirectAdmin credentials</p>
                <Button onClick={handleDALogin} disabled={daLogin.isPending || service.status !== 'active'}>
                  {daLogin.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...</> : 'Load DirectAdmin Credentials'}
                </Button>
                {service.status !== 'active' && <p className="text-xs text-muted-foreground mt-2">Service must be active to access DirectAdmin</p>}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-3">
                  <div><span className="text-xs text-muted-foreground block">Login URL</span><span className="text-sm font-medium font-mono">{daUrl}</span></div>
                  <div className="flex gap-2">
                    <button onClick={() => copyToClipboard(daUrl, 'URL')} className="text-muted-foreground hover:text-foreground"><Copy className="h-4 w-4" /></button>
                    <a href={daUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground"><ExternalLink className="h-4 w-4" /></a>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-3">
                  <div><span className="text-xs text-muted-foreground block">Username</span><span className="text-sm font-medium font-mono">{daUser}</span></div>
                  <button onClick={() => copyToClipboard(daUser, 'Username')} className="text-muted-foreground hover:text-foreground"><Copy className="h-4 w-4" /></button>
                </div>
                {daCredentials.password && daCredentials.password !== 'Contact support for password' && (
                  <div className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-3">
                    <div><span className="text-xs text-muted-foreground block">Password</span><span className="text-sm font-medium font-mono">{daCredentials.password}</span></div>
                    <button onClick={() => copyToClipboard(daCredentials.password, 'Password')} className="text-muted-foreground hover:text-foreground"><Copy className="h-4 w-4" /></button>
                  </div>
                )}
              </div>
            )}
            <div className="mt-4 p-3 rounded-lg bg-warning/5 border border-warning/20 text-sm text-muted-foreground flex items-start gap-2">
              <Shield className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />Keep your credentials secure. Never share them with untrusted parties.
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6 space-y-3">
            <h3 className="font-heading font-semibold">Actions</h3>
            <Button className="w-full justify-start" variant="outline"><RefreshCw className="h-4 w-4 mr-2" /> Renew Service</Button>
            <Button className="w-full justify-start" variant="outline" asChild><Link to="/client/invoices"><FileText className="h-4 w-4 mr-2" /> View Invoices</Link></Button>
            <Button className="w-full justify-start" variant="outline" asChild><Link to="/client/tickets/new"><MessageSquare className="h-4 w-4 mr-2" /> Open Support Ticket</Link></Button>
            <Button className="w-full justify-start" variant="outline"><Server className="h-4 w-4 mr-2" /> Change Password</Button>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-heading font-semibold mb-3">Provisioning Status</h3>
            <StatusBadge status={service.status} />
          </div>
        </div>
      </div>
    </div>
  );
}
