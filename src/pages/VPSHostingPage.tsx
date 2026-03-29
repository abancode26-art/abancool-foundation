import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Cpu, HardDrive, Globe, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { vpsProducts } from '@/data/placeholder';
import { CheckCircle2, Star } from 'lucide-react';

export default function VPSHostingPage() {
  return (
    <div>
      <section className="hero-gradient py-20 relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto px-4 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-primary-foreground/80 mb-6">
            <Cpu className="h-4 w-4" /> Now Available
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold font-heading text-primary-foreground mb-4">VPS Hosting</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">Dedicated virtual servers with full root access. Deploy in minutes with your choice of operating system.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {vpsProducts.map((product, i) => {
              const price = product.pricing[0];
              return (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className={`relative rounded-2xl border p-8 card-hover ${product.is_recommended ? 'border-primary ring-2 ring-primary/20' : 'border-border bg-card'}`}>
                  {product.is_recommended && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground"><Star className="h-3 w-3" /> Recommended</span></div>}
                  <h3 className="text-xl font-bold font-heading mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{product.description}</p>
                  <div className="mb-6"><span className="text-sm text-muted-foreground">KES</span><span className="text-4xl font-bold font-heading ml-1">{price?.price.toLocaleString()}</span><span className="text-muted-foreground">/mo</span></div>
                  <ul className="space-y-3 mb-8">{product.features.map(f => <li key={f} className="flex items-start gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />{f}</li>)}</ul>
                  <Button asChild className="w-full h-12 rounded-xl font-semibold" variant={product.is_recommended ? 'default' : 'outline'}>
                    <Link to="/contact">Contact Sales <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Cpu, title: 'Dedicated Resources', desc: 'Guaranteed CPU and RAM that are never shared.' },
              { icon: HardDrive, title: 'NVMe SSD', desc: 'Ultra-fast NVMe storage for peak performance.' },
              { icon: Globe, title: 'Full Root Access', desc: 'Complete control over your server environment.' },
              { icon: Shield, title: 'DDoS Protection', desc: 'Enterprise-grade protection included.' },
            ].map(item => (
              <div key={item.title} className="text-center"><item.icon className="h-10 w-10 text-primary mx-auto mb-4" /><h3 className="font-bold font-heading mb-2">{item.title}</h3><p className="text-sm text-muted-foreground">{item.desc}</p></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
