// ============================================================
// ABANCOOL BILLING - Supabase Hooks
// Reusable data fetching hooks for all areas
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];

// ============================================================
// PRODUCTS & PRICING
// ============================================================
export function useHostingProducts(categorySlug?: string) {
  return useQuery({
    queryKey: ['hosting-products', categorySlug],
    queryFn: async () => {
      let query = supabase
        .from('hosting_products')
        .select('*, hosting_categories(name, slug), hosting_product_pricing(*)')
        .eq('is_active', true)
        .order('sort_order');

      if (categorySlug) {
        query = query.eq('hosting_categories.slug', categorySlug);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useHostingCategories() {
  return useQuery({
    queryKey: ['hosting-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_products')
        .select('*, hosting_product_pricing(*)')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
  });
}

// ============================================================
// DOMAIN TLDS
// ============================================================
export function useDomainTLDs() {
  return useQuery({
    queryKey: ['domain-tlds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domain_tlds')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
  });
}

// ============================================================
// CLIENT: SERVICES
// ============================================================
export function useMyServices() {
  return useQuery({
    queryKey: ['my-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_services')
        .select('*, hosting_products(name, slug)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useServiceDetail(id: string) {
  return useQuery({
    queryKey: ['service-detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_services')
        .select('*, hosting_products(name, slug, directadmin_package_name)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

// ============================================================
// CLIENT: INVOICES
// ============================================================
export function useMyInvoices() {
  return useQuery({
    queryKey: ['my-invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useInvoiceDetail(id: string) {
  return useQuery({
    queryKey: ['invoice-detail', id],
    queryFn: async () => {
      const { data: invoice, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;

      const { data: items } = await supabase
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', id);

      return { ...invoice, items: items || [] };
    },
    enabled: !!id,
  });
}

// ============================================================
// CLIENT: PAYMENTS
// ============================================================
export function useMyPayments() {
  return useQuery({
    queryKey: ['my-payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*, invoices(invoice_number)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

// ============================================================
// CLIENT: ORDERS
// ============================================================
export function useMyOrders() {
  return useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

// ============================================================
// CLIENT: DOMAINS
// ============================================================
export function useMyDomains() {
  return useQuery({
    queryKey: ['my-domains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

// ============================================================
// CLIENT: TICKETS
// ============================================================
export function useMyTickets() {
  return useQuery({
    queryKey: ['my-tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*, support_departments(name)')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useTicketDetail(id: string) {
  return useQuery({
    queryKey: ['ticket-detail', id],
    queryFn: async () => {
      const { data: ticket, error } = await supabase
        .from('support_tickets')
        .select('*, support_departments(name)')
        .eq('id', id)
        .single();
      if (error) throw error;

      const { data: messages } = await supabase
        .from('support_ticket_messages')
        .select('*, profiles:sender_user_id(full_name)')
        .eq('ticket_id', id)
        .order('created_at');

      return { ...ticket, messages: messages || [] };
    },
    enabled: !!id,
  });
}

export function useSupportDepartments() {
  return useQuery({
    queryKey: ['support-departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_departments')
        .select('*')
        .eq('is_active', true);
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ticket: { subject: string; department_id: string; priority: string; message: string; service_id?: string }) => {
      const { data, error } = await supabase.functions.invoke('create-ticket', {
        body: ticket,
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useReplyToTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ticketId, message }: { ticketId: string; message: string }) => {
      const { data, error } = await supabase.functions.invoke('reply-ticket', {
        body: { ticket_id: ticketId, message },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ['ticket-detail', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['my-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// ============================================================
// NOTIFICATIONS
// ============================================================
export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
    refetchInterval: 15000, // Poll every 15 seconds
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ['unread-notification-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      if (error) throw error;
      return count || 0;
    },
    refetchInterval: 15000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notification-count'] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notification-count'] });
    },
  });
}

// ============================================================
// CART (Database-backed)
// ============================================================
export function useCartItems() {
  return useQuery({
    queryKey: ['cart-items'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('cart_items')
        .select('*, hosting_products(name, slug, features_json), hosting_product_pricing:hosting_product_pricing!cart_items_product_id_fkey(price, setup_fee, billing_cycle)')
        .eq('user_id', user.id)
        .order('created_at');

      if (error) throw error;
      return data || [];
    },
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: {
      item_type: string;
      product_id?: string;
      domain_name?: string;
      tld?: string;
      billing_cycle?: string;
      quantity?: number;
      metadata_json?: any;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('cart_items').insert({
        user_id: user.id,
        item_type: item.item_type as any,
        product_id: item.product_id || null,
        domain_name: item.domain_name || null,
        tld: item.tld || null,
        billing_cycle: item.billing_cycle as any || null,
        quantity: item.quantity || 1,
        metadata_json: item.metadata_json || {},
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart-items'] }),
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('cart_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart-items'] }),
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from('cart_items').delete().eq('user_id', user.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart-items'] }),
  });
}

// ============================================================
// CHECKOUT
// ============================================================
export function useCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (couponCode?: string) => {
      const { data, error } = await supabase.functions.invoke('checkout', {
        body: { coupon_code: couponCode },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart-items'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-invoices'] });
    },
  });
}

// ============================================================
// MPESA PAYMENT
// ============================================================
export function useInitiateMpesa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ invoice_id, phone_number }: { invoice_id: string; phone_number: string }) => {
      const { data, error } = await supabase.functions.invoke('mpesa-initiate', {
        body: { invoice_id, phone_number },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-invoices'] });
      queryClient.invalidateQueries({ queryKey: ['my-payments'] });
    },
  });
}

// ============================================================
// DA LOGIN
// ============================================================
export function useDALogin() {
  return useMutation({
    mutationFn: async (serviceId: string) => {
      const { data, error } = await supabase.functions.invoke('da-login', {
        body: { service_id: serviceId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
  });
}

// ============================================================
// ANNOUNCEMENTS
// ============================================================
export function useAnnouncements() {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

// ============================================================
// PROFILE
// ============================================================
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Partial<Tables['profiles']['Update']>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });
}

// ============================================================
// ADMIN: STATS
// ============================================================
export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('admin-stats');
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refresh every 30s
  });
}

// ============================================================
// ADMIN: ALL RECORDS QUERIES
// ============================================================
export function useAllClients() {
  return useQuery({
    queryKey: ['admin-clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'customer')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAllOrders() {
  return useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAllInvoices() {
  return useQuery({
    queryKey: ['admin-invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAllPayments() {
  return useQuery({
    queryKey: ['admin-payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*, profiles(full_name), invoices(invoice_number)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAllServices() {
  return useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_services')
        .select('*, profiles(full_name, email), hosting_products(name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAllTickets() {
  return useQuery({
    queryKey: ['admin-tickets'],
    queryFn: async () => {
      // Fetch tickets first
      const { data: tickets, error } = await supabase
        .from('support_tickets')
        .select('*, support_departments(name)')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      if (!tickets?.length) return [];

      // Fetch profiles for each unique user_id
      const userIds = [...new Set(tickets.map((t: any) => t.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds);

      const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));

      return tickets.map((t: any) => ({
        ...t,
        profiles: profileMap.get(t.user_id) || { full_name: 'Unknown', email: '' },
      }));
    },
  });
}

export function useAllDomains() {
  return useQuery({
    queryKey: ['admin-domains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAutomationLogs() {
  return useQuery({
    queryKey: ['automation-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automation_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });
}

// ============================================================
// ADMIN: PRODUCT MANAGEMENT
// ============================================================
export function useAdminProducts() {
  return useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_products')
        .select('*, hosting_categories(name), hosting_product_pricing(*)')
        .order('sort_order');
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: Tables['hosting_products']['Insert']) => {
      const { data, error } = await supabase.from('hosting_products').insert(product).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Tables['hosting_products']['Update'] & { id: string }) => {
      const { error } = await supabase.from('hosting_products').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  });
}

export function useDAManage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ action, service_id }: { action: string; service_id: string }) => {
      const { data, error } = await supabase.functions.invoke('da-manage', {
        body: { action, service_id },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['my-services'] });
    },
  });
}
