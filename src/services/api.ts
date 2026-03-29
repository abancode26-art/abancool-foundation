// ============================================================
// ABANCOOL BILLING - API Service Layer
// 
// Kiro: Replace these placeholder implementations with real
// Laravel API calls. The base URL should point to your Laravel
// backend (e.g., https://billing.abancool.com/api).
//
// Recommended: Laravel Sanctum for SPA authentication with
// cookie-based sessions, or API tokens for mobile.
// ============================================================

import type { ApiResponse, ApiError } from '@/types';

const API_BASE_URL = '/api'; // Kiro: Update to your Laravel API URL

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Kiro: Implement with real fetch/axios calls
  // Include CSRF token handling for Laravel Sanctum
  async get<T>(endpoint: string, _params?: Record<string, string>): Promise<ApiResponse<T>> {
    console.log(`[API Placeholder] GET ${this.baseUrl}${endpoint}`, _params);
    throw new Error(`API not implemented: GET ${endpoint}`);
  }

  async post<T>(endpoint: string, _data?: unknown): Promise<ApiResponse<T>> {
    console.log(`[API Placeholder] POST ${this.baseUrl}${endpoint}`, _data);
    throw new Error(`API not implemented: POST ${endpoint}`);
  }

  async put<T>(endpoint: string, _data?: unknown): Promise<ApiResponse<T>> {
    console.log(`[API Placeholder] PUT ${this.baseUrl}${endpoint}`, _data);
    throw new Error(`API not implemented: PUT ${endpoint}`);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    console.log(`[API Placeholder] DELETE ${this.baseUrl}${endpoint}`, );
    throw new Error(`API not implemented: DELETE ${endpoint}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// ============================================================
// Kiro: Expected API Endpoint Groups
// 
// AUTH:
//   POST /auth/register
//   POST /auth/login
//   POST /auth/logout
//   POST /auth/forgot-password
//   POST /auth/reset-password
//   GET  /auth/me
//   POST /auth/verify-email
//   POST /auth/resend-verification
//
// PRODUCTS:
//   GET  /products
//   GET  /products/:slug
//   GET  /products/category/:category
//
// DOMAINS:
//   POST /domains/search
//   GET  /domains/tld-pricing
//
// CART:
//   GET  /cart
//   POST /cart/add
//   PUT  /cart/:id
//   DELETE /cart/:id
//
// CHECKOUT:
//   POST /checkout
//   GET  /checkout/review
//
// ORDERS:
//   GET  /client/orders
//   GET  /client/orders/:id
//
// INVOICES:
//   GET  /client/invoices
//   GET  /client/invoices/:id
//   POST /client/invoices/:id/pay
//
// PAYMENTS:
//   GET  /client/payments
//   POST /client/payments
//
// SERVICES:
//   GET  /client/services
//   GET  /client/services/:id
//
// CLIENT DOMAINS:
//   GET  /client/domains
//   GET  /client/domains/:id
//
// TICKETS:
//   GET  /client/tickets
//   POST /client/tickets
//   GET  /client/tickets/:id
//   POST /client/tickets/:id/reply
//
// PROFILE:
//   GET  /client/profile
//   PUT  /client/profile
//   PUT  /client/security/password
//
// ANNOUNCEMENTS:
//   GET  /announcements
//   GET  /announcements/:id
//
// ADMIN - all under /admin prefix:
//   GET/POST/PUT/DELETE for clients, products, orders,
//   invoices, payments, services, servers, tickets,
//   announcements, coupons, settings, provisioning-logs,
//   activity-logs, email-templates, directadmin-settings
// ============================================================
