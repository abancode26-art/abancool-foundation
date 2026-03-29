import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    toast.success('Message sent! We\'ll get back to you soon.');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div>
      <section className="hero-gradient py-20 relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto px-4 lg:px-8 text-center relative">
          <h1 className="text-4xl lg:text-5xl font-bold font-heading text-primary-foreground mb-4">Contact Us</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">Have a question? We'd love to hear from you.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Contact info */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-heading mb-4">Get in Touch</h2>
              {[
                { icon: Mail, label: 'Email', value: 'support@abancool.com' },
                { icon: Phone, label: 'Phone', value: '+254 700 000 000' },
                { icon: MapPin, label: 'Address', value: 'Nairobi, Kenya' },
                { icon: Clock, label: 'Hours', value: 'Mon-Fri, 8AM - 6PM EAT' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-2.5"><item.icon className="h-5 w-5 text-primary" /></div>
                  <div><div className="text-sm font-semibold">{item.label}</div><div className="text-sm text-muted-foreground">{item.value}</div></div>
                </div>
              ))}
              <div className="rounded-xl border border-border bg-muted/30 p-6 mt-8">
                <h3 className="font-heading font-semibold mb-2">For Technical Support</h3>
                <p className="text-sm text-muted-foreground">Existing clients can open a support ticket from their client area for faster assistance.</p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-8 space-y-6">
                <h2 className="text-xl font-bold font-heading">Send a Message</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium mb-1.5 block">Name</label><Input placeholder="Your name" required /></div>
                  <div><label className="text-sm font-medium mb-1.5 block">Email</label><Input type="email" placeholder="you@example.com" required /></div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Department</label>
                  <select className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm">
                    <option>Sales</option><option>Billing</option><option>Technical Support</option><option>General Inquiry</option>
                  </select>
                </div>
                <div><label className="text-sm font-medium mb-1.5 block">Subject</label><Input placeholder="How can we help?" required /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Message</label><Textarea placeholder="Tell us more..." rows={5} required /></div>
                <Button type="submit" disabled={loading} className="h-12 px-8 rounded-xl font-semibold">
                  {loading ? 'Sending...' : <><Send className="h-4 w-4 mr-2" /> Send Message</>}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
