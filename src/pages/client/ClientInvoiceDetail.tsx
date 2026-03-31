import { useParams, Link } from 'react-router-dom';
import { useInvoiceDetail, useInitiateMpesa } from '@/hooks/useSupabase';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreditCard, Download, ArrowLeft, Loader2, Phone, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ClientInvoiceDetail() {
  const { id } = useParams();
  const { data: invoice, isLoading } = useInvoiceDetail(id!);
  const initiateMpesa = useInitiateMpesa();
  const [phone, setPhone] = useState('');
  const [paymentSent, setPaymentSent] = useState(false);

  if (isLoading) return <div className="space-y-4 max-w-3xl"><Skeleton className="h-8 w-48" /><Skeleton className="h-96 rounded-xl" /></div>;
  if (!invoice) return <div className="text-center py-20"><h2 className="text-xl font-bold font-heading mb-2">Invoice Not Found</h2><Button asChild><Link to="/client/invoices">Back to Invoices</Link></Button></div>;

  const handleMpesaPay = async () => {
    if (!phone) { toast.error('Please enter your M-Pesa phone number'); return; }
    try {
      await initiateMpesa.mutateAsync({ invoice_id: invoice.id, phone_number: phone });
      setPaymentSent(true);
      toast.success('STK Push sent! Check your phone and enter M-Pesa PIN.');
    } catch (err: any) {
      toast.error(err.message || 'Payment failed');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Link to="/client/invoices" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Back to Invoices</Link>

      <div className="rounded-xl border border-border bg-card p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-heading mb-1">{invoice.invoice_number}</h1>
            <p className="text-muted-foreground">Due: {invoice.due_date}</p>
          </div>
          <StatusBadge status={invoice.status} />
        </div>

        <table className="w-full mb-8">
          <thead><tr className="border-b border-border"><th className="text-left py-3 text-sm font-semibold">Description</th><th className="text-right py-3 text-sm font-semibold">Qty</th><th className="text-right py-3 text-sm font-semibold">Price</th><th className="text-right py-3 text-sm font-semibold">Total</th></tr></thead>
          <tbody>
            {(invoice.items || []).map((item: any) => (
              <tr key={item.id} className="border-b border-border/50">
                <td className="py-3 text-sm">{item.description}</td>
                <td className="py-3 text-sm text-right">{item.qty}</td>
                <td className="py-3 text-sm text-right">{invoice.currency} {Number(item.unit_price).toLocaleString()}</td>
                <td className="py-3 text-sm text-right font-medium">{invoice.currency} {Number(item.total_price).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{invoice.currency} {Number(invoice.subtotal).toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax</span><span>{invoice.currency} {Number(invoice.tax).toLocaleString()}</span></div>
            <div className="flex justify-between font-bold text-lg border-t border-border pt-2"><span>Total</span><span>{invoice.currency} {Number(invoice.total).toLocaleString()}</span></div>
            {Number(invoice.balance_due) > 0 && Number(invoice.balance_due) !== Number(invoice.total) && (
              <div className="flex justify-between text-sm text-warning"><span>Balance Due</span><span>{invoice.currency} {Number(invoice.balance_due).toLocaleString()}</span></div>
            )}
          </div>
        </div>

        {(invoice.status === 'unpaid' || invoice.status === 'pending') && !paymentSent && (
          <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
            <h3 className="font-heading font-semibold mb-3 flex items-center gap-2"><Phone className="h-5 w-5" /> Pay with M-Pesa</h3>
            <p className="text-sm text-muted-foreground mb-4">Enter your Safaricom M-Pesa number. You'll receive an STK push to complete payment.</p>
            <div className="flex gap-3">
              <Input placeholder="254712345678" value={phone} onChange={e => setPhone(e.target.value)} className="max-w-xs" />
              <Button onClick={handleMpesaPay} disabled={initiateMpesa.isPending} className="btn-primary-glow">
                {initiateMpesa.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : <><CreditCard className="h-4 w-4 mr-2" /> Pay KES {Number(invoice.balance_due).toLocaleString()}</>}
              </Button>
            </div>
          </div>
        )}

        {paymentSent && invoice.status !== 'paid' && (
          <div className="mt-8 rounded-xl border border-info/20 bg-info/5 p-6">
            <h3 className="font-heading font-semibold mb-2 flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Payment Processing</h3>
            <p className="text-sm text-muted-foreground">An STK Push has been sent to your phone. Please enter your M-Pesa PIN to complete the payment. This page will update automatically.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => window.location.reload()}>Refresh Status</Button>
          </div>
        )}

        {invoice.status === 'paid' && (
          <div className="mt-8 rounded-xl border border-success/20 bg-success/5 p-4 text-sm flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <span>Paid on {invoice.paid_at ? new Date(invoice.paid_at).toLocaleDateString() : 'N/A'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
