import { useParams, Link } from 'react-router-dom';
import { sampleTickets } from '@/data/placeholder';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, User, Headphones } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ClientTicketDetail() {
  const { id } = useParams();
  const ticket = sampleTickets.find(t => t.id === id);
  const [reply, setReply] = useState('');

  if (!ticket) return <div className="text-center py-20"><h2 className="text-xl font-bold font-heading mb-2">Ticket Not Found</h2><Button asChild><Link to="/client/tickets">Back to Tickets</Link></Button></div>;

  return (
    <div className="max-w-3xl space-y-6">
      <Link to="/client/tickets" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Back to Tickets</Link>

      <div className="flex items-start justify-between">
        <div><h1 className="text-2xl font-bold font-heading mb-1">{ticket.subject}</h1><p className="text-sm text-muted-foreground">{ticket.ticket_number} · {ticket.department} · {new Date(ticket.created_at).toLocaleDateString()}</p></div>
        <StatusBadge status={ticket.status} />
      </div>

      {/* Messages */}
      <div className="space-y-4">
        {ticket.messages.map(msg => (
          <div key={msg.id} className={`rounded-xl border p-5 ${msg.sender_type === 'staff' ? 'border-primary/20 bg-primary/5' : 'border-border bg-card'}`}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${msg.sender_type === 'staff' ? 'bg-primary/10' : 'bg-muted'}`}>
                {msg.sender_type === 'staff' ? <Headphones className="h-4 w-4 text-primary" /> : <User className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div><span className="text-sm font-semibold">{msg.sender_name}</span><span className="text-xs text-muted-foreground ml-2">{new Date(msg.created_at).toLocaleString()}</span></div>
            </div>
            <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
          </div>
        ))}
      </div>

      {/* Reply */}
      {ticket.status !== 'closed' && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-heading font-semibold mb-3">Reply</h3>
          <Textarea placeholder="Type your reply..." rows={4} value={reply} onChange={e => setReply(e.target.value)} className="mb-4" />
          <Button onClick={() => { toast.success('Reply sent!'); setReply(''); }} disabled={!reply.trim()}>Send Reply</Button>
        </div>
      )}
    </div>
  );
}
