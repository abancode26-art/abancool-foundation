import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function ClientNewTicket() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success('Ticket submitted! We\'ll respond shortly.');
    navigate('/client/tickets');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div><h1 className="text-2xl font-bold font-heading">Open Support Ticket</h1><p className="text-muted-foreground">Describe your issue and we'll help you resolve it</p></div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-sm font-medium mb-1.5 block">Department</label>
            <select className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm"><option>Technical Support</option><option>Billing</option><option>Sales</option><option>General</option></select>
          </div>
          <div><label className="text-sm font-medium mb-1.5 block">Priority</label>
            <select className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm"><option>Medium</option><option>Low</option><option>High</option><option>Urgent</option></select>
          </div>
        </div>
        <div><label className="text-sm font-medium mb-1.5 block">Related Service (Optional)</label>
          <select className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm"><option value="">None</option><option>mwangitech.co.ke - Business Hosting</option><option>personalsite.com - Starter Hosting</option></select>
        </div>
        <div><label className="text-sm font-medium mb-1.5 block">Subject</label><Input placeholder="Brief summary of your issue" required /></div>
        <div><label className="text-sm font-medium mb-1.5 block">Message</label><Textarea placeholder="Describe your issue in detail..." rows={6} required /></div>
        <div><label className="text-sm font-medium mb-1.5 block">Attachments (Optional)</label>
          <div className="rounded-lg border-2 border-dashed border-border p-6 text-center text-sm text-muted-foreground">Drop files here or click to upload</div>
        </div>
        <Button type="submit" disabled={loading} className="h-12 px-8 rounded-xl font-semibold">{loading ? 'Submitting...' : 'Submit Ticket'}</Button>
      </form>
    </div>
  );
}
