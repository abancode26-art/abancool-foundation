import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, HardDrive, Headphones, RefreshCw, Lock, ChevronRight, Star, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DomainSearch } from '@/components/DomainSearch';
import { sharedHostingProducts } from '@/data/placeholder';

const trustBadges = [
  { icon: Zap, label: '99.9% Uptime', desc: 'Guaranteed reliability' },
  { icon: Lock, label: 'Free SSL', desc: 'On every plan' },
  { icon: HardDrive, label: 'SSD Storage', desc: 'Blazing fast speeds' },
  { icon: Headphones, label: 'Fast Support', desc: 'When you need it' },
  { icon: RefreshCw, label: 'Daily Backups', desc: 'Automatic protection' },
  { icon: Shield, label: 'Secure Hosting', desc: 'Enterprise security' },
];

const whyChoose = [
  { title: 'Built for Africa', desc: 'Optimized infrastructure serving businesses across Kenya and the African continent with low-latency connectivity.' },
  { title: 'Simple Control Panel', desc: 'Manage your hosting with DirectAdmin — intuitive, fast, and powerful. No steep learning curves.' },
  { title: 'Transparent Pricing', desc: 'No hidden fees, no surprise renewals. What you see is exactly what you pay.' },
  { title: 'Migration Support', desc: 'Moving from another host? Our team will help migrate your websites for free.' },
];

const testimonials = [
  { name: 'Grace Wanjiku', company: 'Savannah Digital', quote: 'Abancool has been rock-solid for our agency. The speed and uptime are exactly what our clients expect.' },
  { name: 'David Otieno', company: 'Nairobi Eats', quote: 'Migrating from our old host was seamless. Support team was incredibly helpful throughout the process.' },
  { name: 'Amina Hassan', company: 'TechBridge Solutions', quote: 'The reseller hosting lets us offer premium hosting under our own brand. Great value for agencies.' },
];

const faqs = [
  { q: 'What control panel do you use?', a: 'We use DirectAdmin — a fast, intuitive control panel that makes managing your hosting simple. Create email accounts, manage databases, install applications, and more.' },
  { q: 'Do you offer free SSL certificates?', a: 'Yes! Every hosting plan includes free SSL certificates through Let\'s Encrypt. They are automatically installed and renewed.' },
  { q: 'Can I upgrade my plan later?', a: 'Absolutely. You can upgrade your hosting plan at any time from your client area. The price difference is prorated.' },
  { q: 'What payment methods do you accept?', a: 'We accept M-Pesa, bank transfers, and card payments. All payments are secure and processed locally.' },
  { q: 'Do you offer a money-back guarantee?', a: 'Yes, we offer a 30-day money-back guarantee on all shared hosting plans. If you\'re not satisfied, we\'ll refund your payment.' },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="container mx-auto px-4 lg:px-8 py-20 lg:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-foreground/80 mb-6">
              <Zap className="h-4 w-4" /> Premium Web Hosting for Africa
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-primary-foreground mb-6 leading-tight">
              Fast, Reliable Hosting
              <br />
              <span className="text-gradient-accent">Your Business Deserves</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto">
              SSD-powered hosting with 99.9% uptime, free SSL, and expert support. Built for businesses across Kenya and Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" asChild className="btn-accent-glow bg-accent text-accent-foreground hover:bg-accent/90 h-14 px-8 rounded-xl text-base font-semibold">
                <Link to="/hosting/shared">View Hosting Plans <ChevronRight className="ml-1 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-14 px-8 rounded-xl text-base font-semibold border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/pricing">Compare Plans</Link>
              </Button>
            </div>
            <DomainSearch variant="hero" />
          </motion.div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {trustBadges.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <badge.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="font-semibold font-heading text-sm">{badge.label}</div>
                <div className="text-xs text-muted-foreground">{badge.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hosting Plans */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-4">Shared Hosting Plans</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Simple, powerful hosting with everything you need to get your website online.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {sharedHostingProducts.map((product, i) => {
              const monthlyPrice = product.pricing.find(p => p.billing_cycle === 'monthly');
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className={`relative rounded-2xl border p-8 card-hover ${product.is_recommended ? 'border-primary bg-primary/[0.02] ring-2 ring-primary/20' : 'border-border bg-card'}`}
                >
                  {product.is_recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground">
                        <Star className="h-3 w-3" /> Most Popular
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold font-heading mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{product.description}</p>
                  <div className="mb-6">
                    <span className="text-sm text-muted-foreground">KES</span>
                    <span className="text-4xl font-bold font-heading ml-1">{monthlyPrice?.price.toLocaleString()}</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {product.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={`w-full h-12 rounded-xl font-semibold ${product.is_recommended ? 'btn-primary-glow' : ''}`}
                    variant={product.is_recommended ? 'default' : 'outline'}
                  >
                    <Link to={`/hosting/shared?plan=${product.slug}`}>Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-4">Why Choose Abancool?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">We're not just another hosting company. We're your growth partner.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {whyChoose.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-xl border border-border bg-card p-8 card-hover"
              >
                <h3 className="text-xl font-bold font-heading mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-4">Trusted by Businesses</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-8"
              >
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-accent text-accent" />)}</div>
                <p className="text-muted-foreground mb-6 italic">"{t.quote}"</p>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-bold font-heading text-center mb-14">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map(faq => (
              <details key={faq.q} className="group rounded-xl border border-border bg-card overflow-hidden">
                <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold font-heading hover:bg-muted/30 transition-colors">
                  {faq.q}
                  <ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90 text-muted-foreground" />
                </summary>
                <div className="px-6 pb-6 text-muted-foreground">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold font-heading text-primary-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-primary-foreground/70 mb-8 max-w-xl mx-auto">Join hundreds of businesses hosting with Abancool. Start in minutes.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="btn-accent-glow bg-accent text-accent-foreground hover:bg-accent/90 h-14 px-8 rounded-xl text-base font-semibold">
              <Link to="/hosting/shared">Get Started Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-14 px-8 rounded-xl text-base font-semibold border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/contact">Talk to Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
