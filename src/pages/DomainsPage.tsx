import { DomainSearch } from '@/components/DomainSearch';
import { tldPricing } from '@/data/placeholder';
import { motion } from 'framer-motion';
import { Globe, Lock, Shield, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function DomainsPage() {
  const [tab, setTab] = useState<'register' | 'transfer' | 'existing'>('register');

  return (
    <div>
      <section className="hero-gradient py-20 relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto px-4 lg:px-8 text-center relative">
          <h1 className="text-4xl lg:text-5xl font-bold font-heading text-primary-foreground mb-4">Domain Names</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-10">Find the perfect domain for your business. Register, transfer, or manage your domains.</p>
          
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center rounded-xl bg-primary-foreground/10 p-1">
              {(['register', 'transfer', 'existing'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-card text-foreground shadow-sm' : 'text-primary-foreground/70 hover:text-primary-foreground'}`}>
                  {t === 'register' ? 'Register New' : t === 'transfer' ? 'Transfer' : 'Use Existing'}
                </button>
              ))}
            </div>
          </div>

          {tab === 'register' && <DomainSearch variant="hero" />}
          {tab === 'transfer' && (
            <div className="max-w-md mx-auto text-left bg-card rounded-xl p-6 animate-fade-in">
              <h3 className="font-heading font-semibold mb-2 text-foreground">Transfer Your Domain</h3>
              <p className="text-sm text-muted-foreground mb-4">Enter your domain and EPP/transfer code to begin the transfer process.</p>
              <input className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm mb-3" placeholder="yourdomain.com" />
              <input className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm mb-4" placeholder="EPP / Transfer Code" />
              <button className="w-full rounded-lg bg-primary text-primary-foreground py-3 text-sm font-semibold">Start Transfer</button>
            </div>
          )}
          {tab === 'existing' && (
            <div className="max-w-md mx-auto text-left bg-card rounded-xl p-6 animate-fade-in">
              <h3 className="font-heading font-semibold mb-2 text-foreground">Use Your Existing Domain</h3>
              <p className="text-sm text-muted-foreground mb-4">Already own a domain? Point it to our nameservers to get started.</p>
              <div className="bg-muted rounded-lg p-4 text-sm space-y-1 mb-4">
                <div><strong>NS1:</strong> ns1.abancool.com</div>
                <div><strong>NS2:</strong> ns2.abancool.com</div>
              </div>
              <p className="text-xs text-muted-foreground">Update your domain's nameservers at your current registrar to point to our servers above.</p>
            </div>
          )}
        </div>
      </section>

      {/* TLD Pricing */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold font-heading text-center mb-14">Domain Pricing</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {tldPricing.map((tld, i) => (
              <motion.div key={tld.tld} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-6 text-center card-hover">
                <div className="text-2xl font-bold font-heading text-primary mb-2">{tld.tld}</div>
                <div className="text-lg font-bold">KES {tld.register_price.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">per year</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Globe, title: 'Easy Management', desc: 'Manage DNS, nameservers, and settings from your dashboard.' },
              { icon: Lock, title: 'Domain Lock', desc: 'Protect your domain from unauthorized transfers.' },
              { icon: Shield, title: 'WHOIS Privacy', desc: 'Keep your personal information private.' },
              { icon: RefreshCw, title: 'Auto Renewal', desc: 'Never lose your domain with automatic renewals.' },
            ].map(item => (
              <div key={item.title} className="text-center"><item.icon className="h-10 w-10 text-primary mx-auto mb-4" /><h3 className="font-bold font-heading mb-2">{item.title}</h3><p className="text-sm text-muted-foreground">{item.desc}</p></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
