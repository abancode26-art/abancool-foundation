import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, ArrowRight, Zap, Shield, HardDrive, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHostingProducts } from '@/hooks/useSupabase';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { useAddToCart } from '@/hooks/useSupabase';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function SharedHostingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const { data: allProducts, isLoading } = useHostingProducts();
  const addToCart = useAddToCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const products = allProducts?.filter((p: any) => p.product_type === 'shared_hosting') || [];

  const handleOrder = async (product: any) => {
    if (!isAuthenticated) {
      toast.info('Please login or register to order.');
      navigate('/register');
      return;
    }
    const pricing = product.hosting_product_pricing?.find((p: any) => p.billing_cycle === billingCycle);
    if (!pricing) { toast.error('Pricing not available for this cycle'); return; }
    try {
      await addToCart.mutateAsync({
        item_type: 'hosting',
        product_id: product.id,
        billing_cycle: billingCycle,
      });
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
          <h1 className="text-4xl lg:text-5xl font-bold font-heading text-primary-foreground mb-4">Shared Web Hosting</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">Fast, reliable SSD hosting with everything you need. Free SSL, daily backups, and DirectAdmin control panel included.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center rounded-xl bg-muted p-1">
              <button onClick={() => setBillingCycle('monthly')} className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${billingCycle === 'monthly' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Monthly</button>
              <button onClick={() => setBillingCycle('annual')} className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${billingCycle === 'annual' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                Annually <span className="text-success text-xs font-bold ml-1">Save 17%</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[1,2,3].map(i => <Skeleton key={i} className="h-96 rounded-2xl" />)}
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No shared hosting plans available yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {products.map((product: any, i: number) => {
                const pricing = product.hosting_product_pricing || [];
                const currentPrice = pricing.find((p: any) => p.billing_cycle === billingCycle);
                const monthlyEquiv = billingCycle === 'annual' ? Math.round((currentPrice?.price || 0) / 12) : currentPrice?.price;
                const features = Array.isArray(product.features_json) ? product.features_json : [];
                return (
                  <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className={`relative rounded-2xl border p-8 card-hover ${product.is_featured ? 'border-primary ring-2 ring-primary/20' : 'border-border bg-card'}`}>
                    {product.is_featured && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground"><Star className="h-3 w-3" /> {product.badge_text || 'Most Popular'}</span>
                      </div>
                    )}
                    <h3 className="text-xl font-bold font-heading mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-6">{product.short_description || product.description}</p>
                    <div className="mb-1">
                      <span className="text-sm text-muted-foreground">KES</span>
                      <span className="text-4xl font-bold font-heading ml-1">{monthlyEquiv ? Number(monthlyEquiv).toLocaleString() : '—'}</span>
                      <span className="text-muted-foreground">/mo</span>
                    </div>
                    {billingCycle === 'annual' && currentPrice && <p className="text-xs text-muted-foreground mb-6">Billed KES {Number(currentPrice.price).toLocaleString()} annually</p>}
                    {billingCycle === 'monthly' && <p className="text-xs text-muted-foreground mb-6">&nbsp;</p>}
                    <ul className="space-y-3 mb-8">
                      {features.map((f: string) => (
                        <li key={f} className="flex items-start gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />{f}</li>
                      ))}
                    </ul>
                    <Button onClick={() => handleOrder(product)} disabled={addToCart.isPending || !currentPrice}
                      className={`w-full h-12 rounded-xl font-semibold ${product.is_featured ? 'btn-primary-glow' : ''}`} variant={product.is_featured ? 'default' : 'outline'}>
                      {addToCart.isPending ? 'Adding...' : 'Order Now'} <ArrowRight className="ml-2 h-4 w-4" />
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
          <h2 className="text-3xl font-bold font-heading text-center mb-14">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Zap, title: '99.9% Uptime', desc: 'Our servers are monitored 24/7 with guaranteed uptime.' },
              { icon: Shield, title: 'Free SSL', desc: 'Auto-installed SSL certificates on every domain.' },
              { icon: HardDrive, title: 'SSD Storage', desc: 'NVMe SSDs for blazing fast load times.' },
              { icon: Headphones, title: 'Expert Support', desc: 'Friendly, knowledgeable support when you need it.' },
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
