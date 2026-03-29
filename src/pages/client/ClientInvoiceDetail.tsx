import { useParams, Link } from 'react-router-dom';
import { sampleInvoices } from '@/data/placeholder';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { CreditCard, Download, ArrowLeft } from 'lucide-react';

export default function ClientInvoiceDetail() {
  const { id } = useParams();
  const invoice = sampleInvoices.find(i => i.id === id);

  if (!invoice) return <div className="text-center py-20"><h2 className="text-xl font-bold font-heading mb-2">Invoice Not Found</h2><Button asChild><Link to="/client/invoices">Back to Invoices</Link></Button></div>;

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
            {invoice.items.map(item => (
              <tr key={item.id} className="border-b border-border/50">
                <td className="py-3 text-sm">{item.description}</td>
                <td className="py-3 text-sm text-right">{item.quantity}</td>
                <td className="py-3 text-sm text-right">{invoice.currency} {item.unit_price.toLocaleString()}</td>
                <td className="py-3 text-sm text-right font-medium">{invoice.currency} {item.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{invoice.currency} {invoice.subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax (VAT 16%)</span><span>{invoice.currency} {invoice.tax.toLocaleString()}</span></div>
            <div className="flex justify-between font-bold text-lg border-t border-border pt-2"><span>Total</span><span>{invoice.currency} {invoice.total.toLocaleString()}</span></div>
          </div>
        </div>

        {invoice.status === 'unpaid' && (
          <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
            <h3 className="font-heading font-semibold mb-3">Payment Instructions</h3>
            <div className="text-sm text-muted-foreground space-y-2 mb-4">
              <p><strong>M-Pesa Paybill:</strong> 123456</p>
              <p><strong>Account Number:</strong> {invoice.invoice_number}</p>
              <p><strong>Bank:</strong> Equity Bank, Account: 0123456789</p>
              <p>Please use your invoice number as the reference.</p>
            </div>
            <div className="flex gap-3">
              <Button className="btn-primary-glow"><CreditCard className="h-4 w-4 mr-2" /> Pay Now</Button>
              <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Download PDF</Button>
            </div>
          </div>
        )}

        {invoice.status === 'paid' && invoice.paid_date && (
          <div className="mt-8 rounded-xl border border-success/20 bg-success/5 p-4 text-sm text-muted-foreground">
            Paid on {new Date(invoice.paid_date).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}
