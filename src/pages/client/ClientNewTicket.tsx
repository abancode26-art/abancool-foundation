import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateTicket, useSupportDepartments, useMyServices } from '@/hooks/useSupabase';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function ClientNewTicket() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [department, setDepartment] = useState('');
  const [priority, setPriority] = useState('medium');
  const [serviceId, setServiceId] = useState('');
  const navigate = useNavigate();
  const createTicket = useCreateTicket();
  const { data: departments } = useSupportDepartments();
  const { data: services } = useMyServices();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message || !department) { toast.error('Please fill all required fields'); return; }
    try {
      await createTicket.mutateAsync({ subject, message, department_id: department, priority, service_id: serviceId || undefined });
      toast.success('Ticket submitted! We\'ll respond shortly.');
      navigate('/client/tickets');
    } catch (err: any) { toast.error(err.message || 'Failed to create ticket'); }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div><h1 className="text-2xl font-bold font-heading">Open Support Ticket</h1><p className="text-muted-foreground">Describe your issue and we'll help you resolve it</p></div>
      <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-sm font-medium mb-1.5 block">Department *</label>
            <select value={department} onChange={e => setDepartment(e.target.value)} required className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm">
              <option value="">Select department</option>
              {(departments || []).map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div><label className="text-sm font-medium mb-1.5 block">Priority</label>
            <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm">
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
            </select>
          </div>
        </div>
        <div><label className="text-sm font-medium mb-1.5 block">Related Service (Optional)</label>
          <select value={serviceId} onChange={e => setServiceId(e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm">
            <option value="">None</option>
            {(services || []).map((s: any) => <option key={s.id} value={s.id}>{s.domain_name} - {s.hosting_products?.name || s.package_name}</option>)}
          </select>
        </div>
        <div><label className="text-sm font-medium mb-1.5 block">Subject *</label><Input placeholder="Brief summary of your issue" value={subject} onChange={e => setSubject(e.target.value)} required /></div>
        <div><label className="text-sm font-medium mb-1.5 block">Message *</label><Textarea placeholder="Describe your issue in detail..." rows={6} value={message} onChange={e => setMessage(e.target.value)} required /></div>
        <Button type="submit" disabled={createTicket.isPending} className="h-12 px-8 rounded-xl font-semibold">
          {createTicket.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Submit Ticket'}
        </Button>
      </form>
    </div>
  );
}
