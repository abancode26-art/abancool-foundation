import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, total, itemCount } = useCart();

  if (itemCount === 0) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-20 text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
        <h1 className="text-2xl font-bold font-heading mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">Browse our hosting plans to get started.</p>
        <Button asChild><Link to="/hosting/shared">View Hosting Plans</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <h1 className="text-2xl font-bold font-heading mb-8">Shopping Cart ({itemCount})</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="rounded-xl border border-border bg-card p-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold font-heading">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground">{item.product.category} hosting · {item.billing_cycle}</p>
                {item.domain && <p className="text-sm text-muted-foreground">Domain: {item.domain}</p>}
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold">KES {item.price.toLocaleString()}</span>
                <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-border bg-card p-6 h-fit">
          <h3 className="font-bold font-heading mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>KES {total.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax (16% VAT)</span><span>KES {Math.round(total * 0.16).toLocaleString()}</span></div>
            <div className="flex justify-between font-bold text-lg border-t border-border pt-2"><span>Total</span><span>KES {Math.round(total * 1.16).toLocaleString()}</span></div>
          </div>
          <Button asChild className="w-full h-12 rounded-xl font-semibold btn-primary-glow"><Link to="/checkout">Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
      </div>
    </div>
  );
}
