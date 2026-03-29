import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, ChevronDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const productLinks = [
  { name: 'Shared Hosting', href: '/hosting/shared', desc: 'Fast SSD hosting for websites' },
  { name: 'Reseller Hosting', href: '/hosting/reseller', desc: 'Start your hosting business' },
  { name: 'VPS Hosting', href: '/hosting/vps', desc: 'Dedicated virtual servers' },
  { name: 'Domain Names', href: '/domains', desc: 'Register & manage domains' },
];

const navLinks = [
  { name: 'Pricing', href: '/pricing' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();

  const clientAreaHref = isAdmin ? '/admin/dashboard' : '/client/dashboard';

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-card/95 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">A</span>
          </div>
          <span className="text-xl font-bold font-heading text-foreground">Abancool</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-lg hover:bg-muted/50">
              Products <ChevronDown className="h-4 w-4" />
            </button>
            {productsOpen && (
              <div className="absolute left-0 top-full pt-2 w-72 animate-scale-in">
                <div className="rounded-xl border bg-card p-2 shadow-lg">
                  {productLinks.map(link => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="flex flex-col gap-0.5 rounded-lg px-4 py-3 hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-sm font-semibold text-foreground">{link.name}</span>
                      <span className="text-xs text-muted-foreground">{link.desc}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                location.pathname === link.href
                  ? 'text-primary bg-primary/5'
                  : 'text-foreground/80 hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/cart" className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <ShoppingCart className="h-5 w-5 text-foreground/70" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-accent text-xs font-bold text-accent-foreground flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <Button asChild>
              <Link to={clientAreaHref}>
                <User className="h-4 w-4 mr-2" /> Client Area
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild className="btn-primary-glow">
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card p-4 space-y-2 animate-fade-in">
          {productLinks.map(link => (
            <Link key={link.href} to={link.href} className="block px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-muted/50" onClick={() => setMobileOpen(false)}>
              {link.name}
            </Link>
          ))}
          <div className="border-t border-border my-2" />
          {navLinks.map(link => (
            <Link key={link.href} to={link.href} className="block px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-muted/50" onClick={() => setMobileOpen(false)}>
              {link.name}
            </Link>
          ))}
          <div className="border-t border-border my-2" />
          <div className="flex gap-2">
            {isAuthenticated ? (
              <Button asChild className="flex-1"><Link to={clientAreaHref}>Client Area</Link></Button>
            ) : (
              <>
                <Button variant="outline" asChild className="flex-1"><Link to="/login">Log In</Link></Button>
                <Button asChild className="flex-1"><Link to="/register">Get Started</Link></Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
