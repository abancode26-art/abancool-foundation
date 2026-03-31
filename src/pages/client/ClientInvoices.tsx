import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';
import { useMyInvoices } from '@/hooks/useSupabase';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ClientInvoices() {
  const [filter, setFilter] = useState<'all' | 'unpaid' | 'paid'>('all');
  const [search, setSearch] = useState('');
  const { data: invoices, isLoading } = useMyInvoices();

  const filtered = (invoices || [])
    .filter((i: any) => filter === 'all' || i.status === filter)
    .filter((i: any) => (i.invoice_number || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold font-heading">Invoices</h1><p className="text-muted-foreground">View and manage your invoices</p></div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative max-w-sm flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
        <div className="inline-flex items-center rounded-lg bg-muted p-1">
          {(['all', 'unpaid', 'paid'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === f ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {isLoading ? <Skeleton className="h-48 rounded-xl" /> : filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center"><p className="text-muted-foreground">No invoices found.</p></div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead><tr className="bg-muted/50"><th className="text-left px-6 py-3 text-sm font-semibold">Invoice</th><th className="text-left px-6 py-3 text-sm font-semibold hidden sm:table-cell">Due Date</th><th className="text-left px-6 py-3 text-sm font-semibold">Amount</th><th className="text-left px-6 py-3 text-sm font-semibold">Status</th></tr></thead>
            <tbody>
              {filtered.map((inv: any) => (
                <tr key={inv.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4"><Link to={`/client/invoices/${inv.id}`} className="text-sm font-semibold text-primary hover:underline">{inv.invoice_number}</Link></td>
                  <td className="px-6 py-4 text-sm text-muted-foreground hidden sm:table-cell">{inv.due_date}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{inv.currency} {Number(inv.total).toLocaleString()}</td>
                  <td className="px-6 py-4"><StatusBadge status={inv.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
