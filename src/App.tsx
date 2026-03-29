import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicLayout } from "@/layouts/PublicLayout";
import { ClientLayout } from "@/layouts/ClientLayout";
import { AdminLayout } from "@/layouts/AdminLayout";

// Public pages
import HomePage from "@/pages/HomePage";
import SharedHostingPage from "@/pages/SharedHostingPage";
import ResellerHostingPage from "@/pages/ResellerHostingPage";
import VPSHostingPage from "@/pages/VPSHostingPage";
import DomainsPage from "@/pages/DomainsPage";
import PricingPage from "@/pages/PricingPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import CartPage from "@/pages/CartPage";
import NotFound from "@/pages/NotFound";

// Auth pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import VerifyEmailPage from "@/pages/auth/VerifyEmailPage";

// Client pages
import ClientDashboard from "@/pages/client/ClientDashboard";
import ClientServices from "@/pages/client/ClientServices";
import ClientServiceDetail from "@/pages/client/ClientServiceDetail";
import ClientDomains from "@/pages/client/ClientDomains";
import ClientInvoices from "@/pages/client/ClientInvoices";
import ClientInvoiceDetail from "@/pages/client/ClientInvoiceDetail";
import ClientPayments from "@/pages/client/ClientPayments";
import ClientTickets from "@/pages/client/ClientTickets";
import ClientNewTicket from "@/pages/client/ClientNewTicket";
import ClientTicketDetail from "@/pages/client/ClientTicketDetail";
import ClientAnnouncements from "@/pages/client/ClientAnnouncements";
import ClientDirectAdmin from "@/pages/client/ClientDirectAdmin";
import ClientProfile from "@/pages/client/ClientProfile";
import ClientSecurity from "@/pages/client/ClientSecurity";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import {
  AdminClients, AdminProducts, AdminOrders, AdminInvoices, AdminPayments,
  AdminServices, AdminServers, AdminDirectAdmin, AdminProvisioning,
  AdminTickets, AdminAnnouncements, AdminCoupons, AdminSettings,
  AdminEmailTemplates, AdminActivityLogs, AdminPackages
} from "@/pages/admin/AdminPages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/hosting/shared" element={<SharedHostingPage />} />
                <Route path="/hosting/reseller" element={<ResellerHostingPage />} />
                <Route path="/hosting/vps" element={<VPSHostingPage />} />
                <Route path="/domains" element={<DomainsPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/cart" element={<CartPage />} />
              </Route>

              {/* Auth routes (no layout) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />

              {/* Client protected routes */}
              <Route element={<ProtectedRoute requiredRole="client"><ClientLayout /></ProtectedRoute>}>
                <Route path="/client/dashboard" element={<ClientDashboard />} />
                <Route path="/client/services" element={<ClientServices />} />
                <Route path="/client/services/:id" element={<ClientServiceDetail />} />
                <Route path="/client/domains" element={<ClientDomains />} />
                <Route path="/client/invoices" element={<ClientInvoices />} />
                <Route path="/client/invoices/:id" element={<ClientInvoiceDetail />} />
                <Route path="/client/payments" element={<ClientPayments />} />
                <Route path="/client/tickets" element={<ClientTickets />} />
                <Route path="/client/tickets/new" element={<ClientNewTicket />} />
                <Route path="/client/tickets/:id" element={<ClientTicketDetail />} />
                <Route path="/client/announcements" element={<ClientAnnouncements />} />
                <Route path="/client/directadmin" element={<ClientDirectAdmin />} />
                <Route path="/client/profile" element={<ClientProfile />} />
                <Route path="/client/security" element={<ClientSecurity />} />
              </Route>

              {/* Admin protected routes */}
              <Route element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/clients" element={<AdminClients />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/packages" element={<AdminPackages />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/invoices" element={<AdminInvoices />} />
                <Route path="/admin/payments" element={<AdminPayments />} />
                <Route path="/admin/services" element={<AdminServices />} />
                <Route path="/admin/servers" element={<AdminServers />} />
                <Route path="/admin/directadmin" element={<AdminDirectAdmin />} />
                <Route path="/admin/provisioning" element={<AdminProvisioning />} />
                <Route path="/admin/tickets" element={<AdminTickets />} />
                <Route path="/admin/announcements" element={<AdminAnnouncements />} />
                <Route path="/admin/coupons" element={<AdminCoupons />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/email-templates" element={<AdminEmailTemplates />} />
                <Route path="/admin/activity-logs" element={<AdminActivityLogs />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
