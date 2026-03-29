import { Link } from 'react-router-dom';
import { CheckCircle2, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sharedHostingProducts, resellerHostingProducts, tldPricing } from '@/data/placeholder';

export default function PricingPage() {
  return (
    <div>
      <section className="hero-gradient py-20 relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto px-4 lg:px-8 text-center relative">
          <h1 className="text-4xl lg:text-5xl font-bold font-heading text-primary-foreground mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">No hidden fees. No surprise renewals. Choose the plan that fits your needs.</p>
        </div>
      </section>

      {/* Shared Hosting */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-bold font-heading mb-8">Shared Hosting</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
            {sharedHostingProducts.map(product => {
              const price = product.pricing.find(p => p.billing_cycle === 'monthly');
              return (
                <div key={product.id} className={`rounded-xl border p-6 ${product.is_recommended ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold font-heading">{product.name}</h3>
                    {product.is_recommended && <span className="text-xs font-bold text-primary flex items-center gap-1"><Star className="h-3 w-3" /> Popular</span>}
                  </div>
                  <div className="mb-4"><span className="text-3xl font-bold font-heading">KES {price?.price.toLocaleString()}</span><span className="text-muted-foreground">/mo</span></div>
                  <ul className="space-y-2 mb-6">{product.features.slice(0, 5).map(f => <li key={f} className="flex items-start gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />{f}</li>)}</ul>
                  <Button asChild size="sm" className="w-full" variant={product.is_recommended ? 'default' : 'outline'}>
                    <Link to={`/hosting/shared?plan=${product.slug}`}>Order Now <ArrowRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reseller */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-bold font-heading mb-8">Reseller Hosting</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            {resellerHostingProducts.map(product => {
              const price = product.pricing.find(p => p.billing_cycle === 'monthly');
              return (
                <div key={product.id} className={`rounded-xl border p-6 bg-card ${product.is_recommended ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}>
                  <h3 className="font-bold font-heading mb-2">{product.name}</h3>
                  <div className="mb-4"><span className="text-3xl font-bold font-heading">KES {price?.price.toLocaleString()}</span><span className="text-muted-foreground">/mo</span></div>
                  <ul className="space-y-2 mb-6">{product.features.slice(0, 4).map(f => <li key={f} className="flex items-start gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />{f}</li>)}</ul>
                  <Button asChild size="sm" className="w-full" variant="outline"><Link to="/hosting/reseller">View Details</Link></Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Domain Pricing */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-bold font-heading mb-8">Domain Pricing</h2>
          <div className="overflow-x-auto">
            <table className="w-full max-w-2xl text-left">
              <thead><tr className="border-b border-border"><th className="py-3 px-4 font-heading font-semibold">TLD</th><th className="py-3 px-4 font-heading font-semibold">Register</th><th className="py-3 px-4 font-heading font-semibold">Renew</th><th className="py-3 px-4 font-heading font-semibold">Transfer</th></tr></thead>
              <tbody>
                {tldPricing.map(t => (
                  <tr key={t.tld} className="border-b border-border/50">
                    <td className="py-3 px-4 font-bold">{t.tld}</td>
                    <td className="py-3 px-4">KES {t.register_price.toLocaleString()}</td>
                    <td className="py-3 px-4">KES {t.renew_price.toLocaleString()}</td>
                    <td className="py-3 px-4">KES {t.transfer_price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
