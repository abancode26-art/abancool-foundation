import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Package, ShoppingCart, FileText, CreditCard,
  Server as ServerIcon, HardDrive, Terminal, MessageSquare, Settings,
  LogOut, Menu, X, Bell, ChevronRight, Activity, Megaphone, Tag, Mail, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const adminNav = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Clients', href: '/admin/clients', icon: Users },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Packages', href: '/admin/packages', icon: HardDrive },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Invoices', href: '/admin/invoices', icon: FileText },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Services', href: '/admin/services', icon: ServerIcon },
  { name: 'Domains', href: '/admin/domains', icon: Globe },
  { name: 'Servers', href: '/admin/servers', icon: HardDrive },
  { name: 'DirectAdmin', href: '/admin/directadmin', icon: Terminal },
  { name: 'Provisioning', href: '/admin/provisioning', icon: Activity },
  { name: 'Tickets', href: '/admin/tickets', icon: MessageSquare },
  { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
  { name: 'Coupons', href: '/admin/coupons', icon: Tag },
  { name: 'Email Templates', href: '/admin/email-templates', icon: Mail },
  { name: 'Activity Logs', href: '/admin/activity-logs', icon: Activity },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const breadcrumb = location.pathname.split('/').filter(Boolean).slice(1);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <span className="text-sm font-bold text-sidebar-primary-foreground">A</span>
          </div>
          <div>
            <span className="text-lg font-bold font-heading">Abancool</span>
            <span className="ml-1 text-xs text-sidebar-foreground/50">Admin</span>
          </div>
          <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col h-[calc(100vh-4rem)] overflow-y-auto p-3">
          <div className="space-y-0.5 flex-1">
            {adminNav.map(item => {
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-primary'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  }`}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors mt-4"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </nav>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-foreground/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card/95 backdrop-blur-xl px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-muted/50" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
              <Link to="/admin/dashboard" className="hover:text-foreground">Admin</Link>
              {breadcrumb.map((seg, i) => (
                <span key={i} className="flex items-center gap-1">
                  <ChevronRight className="h-3 w-3" />
                  <span className={i === breadcrumb.length - 1 ? 'text-foreground font-medium' : ''}>{seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent" />
            </Button>
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span className="text-sm font-medium">{user?.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
