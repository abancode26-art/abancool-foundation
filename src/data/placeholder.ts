// ============================================================
// ABANCOOL BILLING - Placeholder Data
// Kiro: Replace all of this with real database queries via API
// ============================================================

import type { Product, Service, Invoice, Ticket, Domain, Server, Order, Payment, ProvisioningLog, Announcement, TLDPricing, DomainSearchResult } from '@/types';

export const sharedHostingProducts: Product[] = [
  {
    id: 'sh-1',
    name: 'Starter',
    slug: 'shared-starter',
    category: 'shared',
    description: 'Perfect for personal websites and blogs',
    features: ['5 GB SSD Storage', '50 GB Bandwidth', '1 Website', '5 Email Accounts', 'Free SSL Certificate', 'Daily Backups', 'DirectAdmin Panel'],
    is_active: true,
    is_recommended: false,
    sort_order: 1,
    pricing: [
      { id: 'p1', product_id: 'sh-1', billing_cycle: 'monthly', price: 350, setup_fee: 0, currency: 'KES' },
      { id: 'p2', product_id: 'sh-1', billing_cycle: 'annually', price: 3500, setup_fee: 0, currency: 'KES' },
    ],
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'sh-2',
    name: 'Business',
    slug: 'shared-business',
    category: 'shared',
    description: 'Ideal for growing business websites',
    features: ['20 GB SSD Storage', '200 GB Bandwidth', '5 Websites', '25 Email Accounts', 'Free SSL Certificate', 'Daily Backups', 'DirectAdmin Panel', 'Priority Support'],
    is_active: true,
    is_recommended: true,
    sort_order: 2,
    pricing: [
      { id: 'p3', product_id: 'sh-2', billing_cycle: 'monthly', price: 750, setup_fee: 0, currency: 'KES' },
      { id: 'p4', product_id: 'sh-2', billing_cycle: 'annually', price: 7500, setup_fee: 0, currency: 'KES' },
    ],
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'sh-3',
    name: 'Enterprise',
    slug: 'shared-enterprise',
    category: 'shared',
    description: 'Maximum power for demanding websites',
    features: ['50 GB SSD Storage', 'Unlimited Bandwidth', '10 Websites', 'Unlimited Email Accounts', 'Free SSL Certificate', 'Daily Backups', 'DirectAdmin Panel', 'Priority Support', 'Dedicated Resources'],
    is_active: true,
    is_recommended: false,
    sort_order: 3,
    pricing: [
      { id: 'p5', product_id: 'sh-3', billing_cycle: 'monthly', price: 1500, setup_fee: 0, currency: 'KES' },
      { id: 'p6', product_id: 'sh-3', billing_cycle: 'annually', price: 15000, setup_fee: 0, currency: 'KES' },
    ],
    created_at: '2024-01-01T00:00:00Z',
  },
];

export const resellerHostingProducts: Product[] = [
  {
    id: 'rs-1',
    name: 'Reseller Starter',
    slug: 'reseller-starter',
    category: 'reseller',
    description: 'Start your own hosting business',
    features: ['30 GB SSD Storage', '300 GB Bandwidth', '10 cPanel Accounts', 'Free SSL Certificates', 'WHM Access', 'Private Nameservers', 'White-label Branding'],
    is_active: true,
    is_recommended: false,
    sort_order: 1,
    pricing: [
      { id: 'rp1', product_id: 'rs-1', billing_cycle: 'monthly', price: 2500, setup_fee: 0, currency: 'KES' },
      { id: 'rp2', product_id: 'rs-1', billing_cycle: 'annually', price: 25000, setup_fee: 0, currency: 'KES' },
    ],
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'rs-2',
    name: 'Reseller Pro',
    slug: 'reseller-pro',
    category: 'reseller',
    description: 'Scale your hosting business',
    features: ['80 GB SSD Storage', '800 GB Bandwidth', '30 cPanel Accounts', 'Free SSL Certificates', 'WHM Access', 'Private Nameservers', 'White-label Branding', 'Priority Support'],
    is_active: true,
    is_recommended: true,
    sort_order: 2,
    pricing: [
      { id: 'rp3', product_id: 'rs-2', billing_cycle: 'monthly', price: 5000, setup_fee: 0, currency: 'KES' },
      { id: 'rp4', product_id: 'rs-2', billing_cycle: 'annually', price: 50000, setup_fee: 0, currency: 'KES' },
    ],
    created_at: '2024-01-01T00:00:00Z',
  },
];

export const vpsProducts: Product[] = [
  {
    id: 'vps-1',
    name: 'VPS Basic',
    slug: 'vps-basic',
    category: 'vps',
    description: 'Entry-level VPS for developers',
    features: ['2 vCPU Cores', '2 GB RAM', '40 GB NVMe SSD', '2 TB Bandwidth', 'Full Root Access', 'Choice of OS'],
    is_active: true,
    is_recommended: false,
    sort_order: 1,
    pricing: [
      { id: 'vp1', product_id: 'vps-1', billing_cycle: 'monthly', price: 3000, setup_fee: 500, currency: 'KES' },
    ],
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'vps-2',
    name: 'VPS Performance',
    slug: 'vps-performance',
    category: 'vps',
    description: 'High-performance VPS for production',
    features: ['4 vCPU Cores', '8 GB RAM', '100 GB NVMe SSD', '4 TB Bandwidth', 'Full Root Access', 'Choice of OS', 'DDoS Protection'],
    is_active: true,
    is_recommended: true,
    sort_order: 2,
    pricing: [
      { id: 'vp2', product_id: 'vps-2', billing_cycle: 'monthly', price: 6000, setup_fee: 500, currency: 'KES' },
    ],
    created_at: '2024-01-01T00:00:00Z',
  },
];

export const tldPricing: TLDPricing[] = [
  { tld: '.com', register_price: 1200, renew_price: 1400, transfer_price: 1200, currency: 'KES' },
  { tld: '.net', register_price: 1400, renew_price: 1600, transfer_price: 1400, currency: 'KES' },
  { tld: '.org', register_price: 1300, renew_price: 1500, transfer_price: 1300, currency: 'KES' },
  { tld: '.co.ke', register_price: 800, renew_price: 800, transfer_price: 800, currency: 'KES' },
  { tld: '.africa', register_price: 2000, renew_price: 2200, transfer_price: 2000, currency: 'KES' },
  { tld: '.io', register_price: 4500, renew_price: 4500, transfer_price: 4500, currency: 'KES' },
];

export const sampleDomainResults: DomainSearchResult[] = [
  { domain: 'mybusiness.com', tld: '.com', available: true, price: 1200, currency: 'KES' },
  { domain: 'mybusiness.net', tld: '.net', available: true, price: 1400, currency: 'KES' },
  { domain: 'mybusiness.co.ke', tld: '.co.ke', available: true, price: 800, currency: 'KES' },
  { domain: 'mybusiness.org', tld: '.org', available: false, price: 1300, currency: 'KES' },
  { domain: 'mybusiness.africa', tld: '.africa', available: true, price: 2000, currency: 'KES' },
];

export const sampleServices: Service[] = [
  {
    id: 'svc-1', client_id: '1', product_id: 'sh-2', product_name: 'Business Hosting',
    domain: 'mwangitech.co.ke', status: 'active', billing_cycle: 'annually', amount: 7500, currency: 'KES',
    next_due_date: '2025-06-15', registration_date: '2024-06-15', server_hostname: 'server.abancool.com',
    directadmin_username: 'mwangitech', ip_address: '102.134.56.78',
    nameservers: ['ns1.abancool.com', 'ns2.abancool.com'], provisioning_status: 'completed',
  },
  {
    id: 'svc-2', client_id: '1', product_id: 'sh-1', product_name: 'Starter Hosting',
    domain: 'personalsite.com', status: 'active', billing_cycle: 'monthly', amount: 350, currency: 'KES',
    next_due_date: '2025-02-15', registration_date: '2024-12-15', server_hostname: 'server.abancool.com',
    directadmin_username: 'personal', ip_address: '102.134.56.78',
    nameservers: ['ns1.abancool.com', 'ns2.abancool.com'], provisioning_status: 'completed',
  },
];

export const sampleInvoices: Invoice[] = [
  {
    id: 'inv-1', invoice_number: 'INV-2025-001', client_id: '1', client_name: 'John Mwangi',
    status: 'unpaid', subtotal: 7500, tax: 1200, total: 8700, currency: 'KES',
    due_date: '2025-02-15',
    items: [{ id: 'ii-1', description: 'Business Hosting - mwangitech.co.ke (Annual)', quantity: 1, unit_price: 7500, total: 7500 }],
    created_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'inv-2', invoice_number: 'INV-2025-002', client_id: '1', client_name: 'John Mwangi',
    status: 'paid', subtotal: 350, tax: 56, total: 406, currency: 'KES',
    due_date: '2025-01-15', paid_date: '2025-01-14T00:00:00Z',
    items: [{ id: 'ii-2', description: 'Starter Hosting - personalsite.com (Monthly)', quantity: 1, unit_price: 350, total: 350 }],
    created_at: '2025-01-01T00:00:00Z',
  },
];

export const samplePayments: Payment[] = [
  { id: 'pay-1', invoice_id: 'inv-2', invoice_number: 'INV-2025-002', client_id: '1', client_name: 'John Mwangi', amount: 406, currency: 'KES', method: 'mpesa', reference: 'MPESA-RK23H4JK', status: 'confirmed', created_at: '2025-01-14T00:00:00Z' },
];

export const sampleTickets: Ticket[] = [
  {
    id: 'tkt-1', ticket_number: 'TKT-001', client_id: '1', client_name: 'John Mwangi',
    subject: 'Cannot access DirectAdmin panel', department: 'technical', priority: 'high', status: 'open',
    service_id: 'svc-1',
    messages: [
      { id: 'tm-1', ticket_id: 'tkt-1', sender_type: 'client', sender_name: 'John Mwangi', message: 'I am unable to login to my DirectAdmin panel. It shows "Access Denied". Please help.', created_at: '2025-01-20T10:00:00Z' },
      { id: 'tm-2', ticket_id: 'tkt-1', sender_type: 'staff', sender_name: 'Abancool Support', message: 'Thank you for contacting us. We are looking into this and will update you shortly.', created_at: '2025-01-20T10:30:00Z' },
    ],
    created_at: '2025-01-20T10:00:00Z', updated_at: '2025-01-20T10:30:00Z',
  },
];

export const sampleDomains: Domain[] = [
  {
    id: 'dom-1', client_id: '1', domain_name: 'mwangitech.co.ke', tld: '.co.ke',
    status: 'active', registration_date: '2024-06-15', expiry_date: '2025-06-15',
    auto_renew: true, nameservers: ['ns1.abancool.com', 'ns2.abancool.com'],
    is_locked: true, whois_privacy: false,
  },
];

export const sampleServers: Server[] = [
  {
    id: 'srv-1', name: 'Production Server 1', hostname: 'server.abancool.com',
    ip_address: '102.134.56.78', port: 2222, use_ssl: true, type: 'shared',
    status: 'active', api_username: 'admin', default_package: 'starter',
    nameservers: ['ns1.abancool.com', 'ns2.abancool.com'], max_accounts: 200, current_accounts: 45,
  },
];

export const sampleOrders: Order[] = [
  {
    id: 'ord-1', order_number: 'ORD-2025-001', client_id: '1', client_name: 'John Mwangi',
    status: 'completed', total: 8700, currency: 'KES', invoice_id: 'inv-2',
    items: [{ id: 'oi-1', product_name: 'Business Hosting', domain: 'mwangitech.co.ke', billing_cycle: 'annually', price: 7500, setup_fee: 0 }],
    created_at: '2024-06-15T00:00:00Z',
  },
];

export const sampleProvisioningLogs: ProvisioningLog[] = [
  { id: 'pl-1', order_id: 'ord-1', client_id: '1', client_name: 'John Mwangi', product_name: 'Business Hosting', action: 'create', status: 'completed', created_at: '2024-06-15T00:00:00Z' },
];

export const sampleAnnouncements: Announcement[] = [
  { id: 'ann-1', title: 'Scheduled Maintenance - January 25th', content: 'We will be performing scheduled maintenance on our servers on January 25th from 2:00 AM to 4:00 AM EAT. During this time, some services may be briefly unavailable.', is_published: true, created_at: '2025-01-18T00:00:00Z' },
  { id: 'ann-2', title: 'New VPS Plans Coming Soon', content: 'We are excited to announce that new VPS hosting plans will be available starting February 2025. Stay tuned for more details!', is_published: true, created_at: '2025-01-10T00:00:00Z' },
];
