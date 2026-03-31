import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Star, ArrowRight, Users, Palette, Globe, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHostingProducts, useAddToCart } from '@/hooks/useSupabase';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useState } from 'react';

export default function ResellerHostingPage() {
  const { data: allProducts, isLoading } = useHostingProducts();
  const addToCart = useAddToCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const products = allProducts?.filter((p: any) => p.product_type === 'reseller_hosting') || [];

  const handleOrder = async (product: any) => {
    if (!isAuthenticated) {
      toast.info('Please login or register to order.');
      navigate('/register');
      return;
    }
    const pricing = product.hosting_product_pricing?.find((p: any) => p.billing_cycle === billingCycle);
    if (!pricing) { toast.error('Pricing not available for this cycle'); return; }
    try {
      await addToCart.mutateAsync({ item_type: 'hosting', product_id: product.id, billing_cycle: billingCycle });
      toast.success(`${product.name} added to cart!`);
      navigate('/cart');
    } catch (err: any) {
      toast.error(err.message || 'Failed to add to cart');
    }
  };

  return (
    <div>
      <section className="hero-gradient py-20 relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto px-4 lg:px-8 text-center relative">
          <h1 className="text-4xl lg:text-5xl font-bold font-heading text-primary-foreground mb-4">Reseller Hosting</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">Start your own hosting business with our white-label reseller plans. Full control, your branding, our infrastructure.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center rounded-xl bg-muted p-1">
              <button onClick={() => setBillingCycle('monthly')} className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${billingCycle === 'monthly' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>Monthly</button>
              <button onClick={() => setBillingCycle('annual')} className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${billingCycle === 'annual' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>Annually <span className="text-success text-xs font-bold ml-1">Save 17%</span></button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[1,2].map(i => <Skeleton key={i} className="h-96 rounded-2xl" />)}
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No reseller hosting plans available yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {products.map((product: any, i: number) => {
                const pricing = product.hosting_product_pricing || [];
                const currentPrice = pricing.find((p: any) => p.billing_cycle === billingCycle);
                const monthlyEquiv = billingCycle === 'annual' ? Math.round((currentPrice?.price || 0) / 12) : currentPrice?.price;
                const features = Array.isArray(product.features_json) ? product.features_json : [];
                return (
                  <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className={`relative rounded-2xl border p-8 card-hover ${product.is_featured ? 'border-primary ring-2 ring-primary/20' : 'border-border bg-card'}`}>
                    {product.is_featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground"><Star className="h-3 w-3" /> {product.badge_text || 'Recommended'}</span></div>}
                    <h3 className="text-xl font-bold font-heading mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-6">{product.short_description || product.description}</p>
                    <div className="mb-1">
                      <span className="text-sm text-muted-foreground">KES</span>
                      <span className="text-4xl font-bold font-heading ml-1">{monthlyEquiv ? Number(monthlyEquiv).toLocaleString() : '—'}</span>
                      <span className="text-muted-foreground">/mo</span>
                    </div>
                    {billingCycle === 'annual' && currentPrice && <p className="text-xs text-muted-foreground mb-6">Billed KES {Number(currentPrice.price).toLocaleString()} annually</p>}
                    {billingCycle === 'monthly' && <p className="text-xs text-muted-foreground mb-6">&nbsp;</p>}
                    <ul className="space-y-3 mb-8">{features.map((f: string) => <li key={f} className="flex items-start gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />{f}</li>)}</ul>
                    <Button onClick={() => handleOrder(product)} disabled={addToCart.isPending || !currentPrice}
                      className="w-full h-12 rounded-xl font-semibold" variant={product.is_featured ? 'default' : 'outline'}>
                      {addToCart.isPending ? 'Adding...' : 'Get Started'} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold font-heading text-center mb-14">Why Resell With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Palette, title: 'White Label', desc: 'Your brand, your business. Clients never see our name.' },
              { icon: Users, title: 'Unlimited Clients', desc: 'No per-client fees. Grow without restrictions.' },
              { icon: Globe, title: 'Private DNS', desc: 'Use your own nameservers for a professional setup.' },
              { icon: Headphones, title: 'Priority Support', desc: 'Get faster responses as a reseller partner.' },
            ].map(item => (
              <div key={item.title} className="text-center">
                <item.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-bold font-heading mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
