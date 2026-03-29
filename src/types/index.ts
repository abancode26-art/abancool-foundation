// ============================================================
// ABANCOOL BILLING - Core Type Definitions
// These types define the data contracts between frontend and backend.
// Kiro: Match these shapes in your Laravel API responses.
// ============================================================

export type UserRole = 'client' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientProfile {
  id: string;
  user_id: string;
  company?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'shared' | 'reseller' | 'vps' | 'domain';
  description: string;
  features: string[];
  is_active: boolean;
  is_recommended: boolean;
  sort_order: number;
  pricing: ProductPricing[];
  created_at: string;
}

export interface ProductPricing {
  id: string;
  product_id: string;
  billing_cycle: 'monthly' | 'quarterly' | 'semi-annually' | 'annually' | 'biennially';
  price: number;
  setup_fee: number;
  currency: string;
}

export interface HostingPackage {
  id: string;
  name: string;
  directadmin_package_name: string;
  disk_space_mb: number;
  bandwidth_mb: number;
  email_accounts: number;
  databases: number;
  subdomains: number;
  ftp_accounts: number;
  product_id: string;
}

export type DomainOption = 'register' | 'transfer' | 'existing' | 'subdomain';

export interface CartItem {
  id: string;
  product: Product;
  billing_cycle: string;
  price: number;
  domain?: string;
  domain_option?: DomainOption;
  addons?: string[];
}

export interface Order {
  id: string;
  order_number: string;
  client_id: string;
  client_name?: string;
  status: 'pending' | 'paid' | 'provisioning' | 'completed' | 'cancelled';
  total: number;
  currency: string;
  items: OrderItem[];
  invoice_id?: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  product_name: string;
  domain?: string;
  billing_cycle: string;
  price: number;
  setup_fee: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  client_name?: string;
  status: 'draft' | 'unpaid' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  due_date: string;
  paid_date?: string;
  items: InvoiceItem[];
  created_at: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Payment {
  id: string;
  invoice_id: string;
  invoice_number?: string;
  client_id: string;
  client_name?: string;
  amount: number;
  currency: string;
  method: 'bank_transfer' | 'mpesa' | 'card' | 'wallet';
  reference: string;
  status: 'pending' | 'confirmed' | 'rejected';
  created_at: string;
}

export interface Service {
  id: string;
  client_id: string;
  product_id: string;
  product_name: string;
  domain: string;
  status: 'active' | 'suspended' | 'pending' | 'terminated' | 'cancelled';
  billing_cycle: string;
  amount: number;
  currency: string;
  next_due_date: string;
  registration_date: string;
  server_id?: string;
  server_hostname?: string;
  directadmin_username?: string;
  ip_address?: string;
  nameservers?: string[];
  provisioning_status: 'pending' | 'provisioning' | 'completed' | 'failed';
}

export interface Domain {
  id: string;
  client_id: string;
  domain_name: string;
  tld: string;
  status: 'active' | 'expired' | 'pending_transfer' | 'redemption';
  registration_date: string;
  expiry_date: string;
  auto_renew: boolean;
  nameservers: string[];
  is_locked: boolean;
  whois_privacy: boolean;
}

export interface Ticket {
  id: string;
  ticket_number: string;
  client_id: string;
  client_name?: string;
  subject: string;
  department: 'sales' | 'billing' | 'technical' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'answered' | 'client_reply' | 'closed';
  service_id?: string;
  messages: TicketMessage[];
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_type: 'client' | 'staff';
  sender_name: string;
  message: string;
  attachments?: string[];
  created_at: string;
}

export interface Server {
  id: string;
  name: string;
  hostname: string;
  ip_address: string;
  port: number;
  use_ssl: boolean;
  type: 'shared' | 'reseller' | 'vps';
  status: 'active' | 'maintenance' | 'offline';
  api_username?: string;
  default_package?: string;
  nameservers: string[];
  max_accounts: number;
  current_accounts: number;
}

export interface ProvisioningLog {
  id: string;
  order_id: string;
  client_id: string;
  client_name?: string;
  product_name: string;
  action: 'create' | 'suspend' | 'unsuspend' | 'terminate' | 'password_reset';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  is_published: boolean;
  created_at: string;
}

export interface DomainSearchResult {
  domain: string;
  tld: string;
  available: boolean;
  price: number;
  currency: string;
  premium?: boolean;
}

export interface TLDPricing {
  tld: string;
  register_price: number;
  renew_price: number;
  transfer_price: number;
  currency: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}
