import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const productLinks = [
  { name: 'Shared Hosting', href: '/hosting/shared' },
  { name: 'Reseller Hosting', href: '/hosting/reseller' },
  { name: 'VPS Hosting', href: '/hosting/vps' },
  { name: 'Domain Names', href: '/domains' },
];

const companyLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Pricing', href: '/pricing' },
];

const supportLinks = [
  { name: 'Support Center', href: '/support' },
  { name: 'Client Area', href: '/login' },
  { name: 'Open a Ticket', href: '/client/tickets/new' },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">A</span>
              </div>
              <span className="text-xl font-bold font-heading">Abancool</span>
            </div>
            <p className="text-sm text-background/60 mb-6">
              Premium web hosting for businesses across Africa and beyond. Fast, reliable, and always supported.
            </p>
            <div className="space-y-2 text-sm text-background/60">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@abancool.com</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> +254 700 000 000</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Nairobi, Kenya</div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Products</h4>
            <ul className="space-y-2.5">
              {productLinks.map(link => (
                <li key={link.href}><Link to={link.href} className="text-sm text-background/60 hover:text-background transition-colors">{link.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map(link => (
                <li key={link.href}><Link to={link.href} className="text-sm text-background/60 hover:text-background transition-colors">{link.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Support</h4>
            <ul className="space-y-2.5">
              {supportLinks.map(link => (
                <li key={link.href}><Link to={link.href} className="text-sm text-background/60 hover:text-background transition-colors">{link.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/50">&copy; {new Date().getFullYear()} Abancool. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-background/50">
            <Link to="#" className="hover:text-background transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-background transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
