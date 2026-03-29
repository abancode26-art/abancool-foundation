import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Zap, Users, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      <section className="hero-gradient py-20 relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto px-4 lg:px-8 text-center relative">
          <h1 className="text-4xl lg:text-5xl font-bold font-heading text-primary-foreground mb-4">About Abancool</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">Building reliable, affordable hosting infrastructure for businesses across Africa.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <h2 className="text-2xl font-bold font-heading mb-6">Our Mission</h2>
          <p className="text-muted-foreground mb-6">Abancool was founded with a simple goal: to provide premium-quality web hosting that businesses in Africa can rely on. We believe every business deserves fast, secure hosting with responsive support — without paying enterprise prices.</p>
          <p className="text-muted-foreground mb-12">We're committed to transparency, reliability, and building long-term relationships with our clients. When your business succeeds, we succeed.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {[
              { icon: Shield, title: 'Reliability First', desc: 'Our infrastructure is built for 99.9% uptime with redundant systems and continuous monitoring.' },
              { icon: Zap, title: 'Speed Matters', desc: 'NVMe SSDs, optimized servers, and smart caching deliver consistently fast experiences.' },
              { icon: Users, title: 'Human Support', desc: 'Real humans who understand hosting. No bots, no scripts, no runaround.' },
              { icon: Globe, title: 'Built for Africa', desc: 'Infrastructure and pricing designed specifically for the African market.' },
            ].map(item => (
              <div key={item.title} className="rounded-xl border border-border p-6">
                <item.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-bold font-heading mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="h-12 px-8 rounded-xl font-semibold"><Link to="/contact">Get in Touch</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
