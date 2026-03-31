import { useParams, Link } from 'react-router-dom';
import { useTicketDetail, useReplyToTicket } from '@/hooks/useSupabase';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, User, Headphones, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function ClientTicketDetail() {
  const { id } = useParams();
  const { data: ticket, isLoading } = useTicketDetail(id!);
  const replyToTicket = useReplyToTicket();
  const [reply, setReply] = useState('');

  if (isLoading) return <div className="max-w-3xl space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-64 rounded-xl" /></div>;
  if (!ticket) return <div className="text-center py-20"><h2 className="text-xl font-bold font-heading mb-2">Ticket Not Found</h2><Button asChild><Link to="/client/tickets">Back to Tickets</Link></Button></div>;

  const handleReply = async () => {
    if (!reply.trim()) return;
    try {
      await replyToTicket.mutateAsync({ ticketId: ticket.id, message: reply });
      setReply('');
      toast.success('Reply sent!');
    } catch (err: any) { toast.error(err.message || 'Failed to send reply'); }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <Link to="/client/tickets" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Back to Tickets</Link>
      <div className="flex items-start justify-between">
        <div><h1 className="text-2xl font-bold font-heading mb-1">{ticket.subject}</h1><p className="text-sm text-muted-foreground">{ticket.ticket_number} · {ticket.support_departments?.name || '—'} · {new Date(ticket.created_at).toLocaleDateString()}</p></div>
        <StatusBadge status={ticket.status} />
      </div>
      <div className="space-y-4">
        {(ticket.messages || []).map((msg: any) => {
          const isStaff = ['super_admin', 'admin', 'support'].includes(msg.sender_role);
          return (
            <div key={msg.id} className={`rounded-xl border p-5 ${isStaff ? 'border-primary/20 bg-primary/5' : 'border-border bg-card'}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isStaff ? 'bg-primary/10' : 'bg-muted'}`}>
                  {isStaff ? <Headphones className="h-4 w-4 text-primary" /> : <User className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div><span className="text-sm font-semibold">{msg.profiles?.full_name || (isStaff ? 'Staff' : 'You')}</span><span className="text-xs text-muted-foreground ml-2">{new Date(msg.created_at).toLocaleString()}</span></div>
              </div>
              <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
            </div>
          );
        })}
      </div>
      {ticket.status !== 'closed' && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-heading font-semibold mb-3">Reply</h3>
          <Textarea placeholder="Type your reply..." rows={4} value={reply} onChange={e => setReply(e.target.value)} className="mb-4" />
          <Button onClick={handleReply} disabled={!reply.trim() || replyToTicket.isPending}>
            {replyToTicket.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : 'Send Reply'}
          </Button>
        </div>
      )}
    </div>
  );
}
