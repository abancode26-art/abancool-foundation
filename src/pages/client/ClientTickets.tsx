import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';
import { sampleTickets } from '@/data/placeholder';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ClientTickets() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold font-heading">Support Tickets</h1><p className="text-muted-foreground">Get help from our team</p></div>
        <Button asChild><Link to="/client/tickets/new"><Plus className="h-4 w-4 mr-2" /> Open Ticket</Link></Button>
      </div>

      {sampleTickets.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center"><p className="text-muted-foreground mb-4">No support tickets yet.</p><Button asChild><Link to="/client/tickets/new">Open Your First Ticket</Link></Button></div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead><tr className="bg-muted/50"><th className="text-left px-6 py-3 text-sm font-semibold">Ticket</th><th className="text-left px-6 py-3 text-sm font-semibold hidden md:table-cell">Department</th><th className="text-left px-6 py-3 text-sm font-semibold hidden sm:table-cell">Priority</th><th className="text-left px-6 py-3 text-sm font-semibold">Status</th></tr></thead>
            <tbody>
              {sampleTickets.map(t => (
                <tr key={t.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4"><Link to={`/client/tickets/${t.id}`} className="text-sm font-semibold text-primary hover:underline">{t.subject}</Link><div className="text-xs text-muted-foreground mt-0.5">{t.ticket_number} · {new Date(t.created_at).toLocaleDateString()}</div></td>
                  <td className="px-6 py-4 text-sm capitalize hidden md:table-cell">{t.department}</td>
                  <td className="px-6 py-4 hidden sm:table-cell"><StatusBadge status={t.priority} /></td>
                  <td className="px-6 py-4"><StatusBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
