import { useMyPayments } from '@/hooks/useSupabase';
import { StatusBadge } from '@/components/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';

export default function ClientPayments() {
  const { data: payments, isLoading } = useMyPayments();

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold font-heading">Payment History</h1><p className="text-muted-foreground">View your past payments</p></div>
      {isLoading ? <Skeleton className="h-48 rounded-xl" /> : !payments?.length ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center"><p className="text-muted-foreground">No payments recorded yet.</p></div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead><tr className="bg-muted/50"><th className="text-left px-6 py-3 text-sm font-semibold">Date</th><th className="text-left px-6 py-3 text-sm font-semibold">Invoice</th><th className="text-left px-6 py-3 text-sm font-semibold hidden sm:table-cell">Method</th><th className="text-left px-6 py-3 text-sm font-semibold">Amount</th><th className="text-left px-6 py-3 text-sm font-semibold">Status</th></tr></thead>
            <tbody>
              {payments.map((p: any) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-6 py-4 text-sm">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{p.invoices?.invoice_number || '—'}</td>
                  <td className="px-6 py-4 text-sm capitalize hidden sm:table-cell">{(p.method || '').replace(/_/g, ' ')}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{p.currency} {Number(p.amount).toLocaleString()}</td>
                  <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
