import { Link, useNavigate } from 'react-router-dom';
import { useCartItems, useRemoveFromCart, useCheckout } from '@/hooks/useSupabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingCart, ArrowRight, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const { data: items, isLoading } = useCartItems();
  const removeFromCart = useRemoveFromCart();
  const checkout = useCheckout();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-20 text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
        <h1 className="text-2xl font-bold font-heading mb-2">Please Login</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your cart.</p>
        <Button asChild><Link to="/login">Login</Link></Button>
      </div>
    );
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 lg:px-8 py-12"><Skeleton className="h-64 rounded-xl" /></div>;
  }

  if (!items || items.length === 0) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-20 text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
        <h1 className="text-2xl font-bold font-heading mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">Browse our hosting plans to get started.</p>
        <Button asChild><Link to="/hosting/shared">View Hosting Plans</Link></Button>
      </div>
    );
  }

  // Calculate totals from cart items
  const total = items.reduce((sum: number, item: any) => {
    const pricing = item.hosting_product_pricing;
    if (Array.isArray(pricing)) {
      const match = pricing.find((p: any) => p.billing_cycle === item.billing_cycle);
      return sum + (match ? Number(match.price) + Number(match.setup_fee || 0) : 0);
    }
    return sum;
  }, 0);

  const handleCheckout = async () => {
    try {
      const result = await checkout.mutateAsync(coupon || undefined);
      toast.success(`Order ${result.order_number} created! Invoice ${result.invoice_number} ready for payment.`);
      navigate(`/client/invoices/${result.invoice_id}`);
    } catch (err: any) {
      toast.error(err.message || 'Checkout failed');
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <h1 className="text-2xl font-bold font-heading mb-8">Shopping Cart ({items.length})</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item: any) => {
            const pricing = Array.isArray(item.hosting_product_pricing) ? item.hosting_product_pricing : [];
            const match = pricing.find((p: any) => p.billing_cycle === item.billing_cycle);
            const price = match ? Number(match.price) + Number(match.setup_fee || 0) : 0;
            return (
              <div key={item.id} className="rounded-xl border border-border bg-card p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-bold font-heading">{item.hosting_products?.name || item.item_type}</h3>
                  <p className="text-sm text-muted-foreground">{item.item_type} · {item.billing_cycle || 'one-time'}</p>
                  {item.domain_name && <p className="text-sm text-muted-foreground">Domain: {item.domain_name}</p>}
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold">KES {price.toLocaleString()}</span>
                  <button onClick={() => removeFromCart.mutate(item.id)} disabled={removeFromCart.isPending}
                    className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="rounded-xl border border-border bg-card p-6 h-fit space-y-4">
          <h3 className="font-bold font-heading">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>KES {total.toLocaleString()}</span></div>
            <div className="flex justify-between font-bold text-lg border-t border-border pt-2"><span>Total</span><span>KES {total.toLocaleString()}</span></div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Coupon Code</label>
            <Input placeholder="Enter coupon" value={coupon} onChange={e => setCoupon(e.target.value)} />
          </div>
          <Button onClick={handleCheckout} disabled={checkout.isPending} className="w-full h-12 rounded-xl font-semibold btn-primary-glow">
            {checkout.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : <>Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" /></>}
          </Button>
          <p className="text-xs text-muted-foreground text-center">You'll be asked to pay via M-Pesa after checkout</p>
        </div>
      </div>
    </div>
  );
}
