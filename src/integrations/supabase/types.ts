export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value_json: Json | null
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value_json?: Json | null
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value_json?: Json | null
        }
        Relationships: []
      }
      announcements: {
        Row: {
          content: string
          created_at: string
          id: string
          is_published: boolean
          published_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          is_published?: boolean
          published_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_published?: boolean
          published_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      automation_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          error_message: string | null
          id: string
          request_json: Json | null
          response_json: Json | null
          status: string
        }
        Insert: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          error_message?: string | null
          id?: string
          request_json?: Json | null
          response_json?: Json | null
          status?: string
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          error_message?: string | null
          id?: string
          request_json?: Json | null
          response_json?: Json | null
          status?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          billing_cycle: Database["public"]["Enums"]["billing_cycle"] | null
          created_at: string
          domain_name: string | null
          id: string
          item_type: Database["public"]["Enums"]["cart_item_type"]
          metadata_json: Json | null
          product_id: string | null
          quantity: number
          tld: string | null
          user_id: string
        }
        Insert: {
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"] | null
          created_at?: string
          domain_name?: string | null
          id?: string
          item_type: Database["public"]["Enums"]["cart_item_type"]
          metadata_json?: Json | null
          product_id?: string | null
          quantity?: number
          tld?: string | null
          user_id: string
        }
        Update: {
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"] | null
          created_at?: string
          domain_name?: string | null
          id?: string
          item_type?: Database["public"]["Enums"]["cart_item_type"]
          metadata_json?: Json | null
          product_id?: string | null
          quantity?: number
          tld?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "hosting_products"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          applies_to_json: Json | null
          code: string
          created_at: string
          discount_type: Database["public"]["Enums"]["coupon_discount_type"]
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          starts_at: string | null
          updated_at: string
          used_count: number
        }
        Insert: {
          applies_to_json?: Json | null
          code: string
          created_at?: string
          discount_type?: Database["public"]["Enums"]["coupon_discount_type"]
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          starts_at?: string | null
          updated_at?: string
          used_count?: number
        }
        Update: {
          applies_to_json?: Json | null
          code?: string
          created_at?: string
          discount_type?: Database["public"]["Enums"]["coupon_discount_type"]
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          starts_at?: string | null
          updated_at?: string
          used_count?: number
        }
        Relationships: []
      }
      domain_tlds: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          is_featured: boolean
          register_price: number
          renew_price: number
          restore_price: number | null
          sort_order: number
          tld: string
          transfer_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_featured?: boolean
          register_price?: number
          renew_price?: number
          restore_price?: number | null
          sort_order?: number
          tld: string
          transfer_price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_featured?: boolean
          register_price?: number
          renew_price?: number
          restore_price?: number | null
          sort_order?: number
          tld?: string
          transfer_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      domains: {
        Row: {
          action_type: string
          created_at: string
          domain_name: string
          epp_code: string | null
          expiry_date: string | null
          id: string
          nameservers_json: Json | null
          order_id: string | null
          registrar: string | null
          status: Database["public"]["Enums"]["domain_status"]
          tld: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_type?: string
          created_at?: string
          domain_name: string
          epp_code?: string | null
          expiry_date?: string | null
          id?: string
          nameservers_json?: Json | null
          order_id?: string | null
          registrar?: string | null
          status?: Database["public"]["Enums"]["domain_status"]
          tld: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          domain_name?: string
          epp_code?: string | null
          expiry_date?: string | null
          id?: string
          nameservers_json?: Json | null
          order_id?: string | null
          registrar?: string | null
          status?: Database["public"]["Enums"]["domain_status"]
          tld?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "domains_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "domains_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "recent_orders_view"
            referencedColumns: ["id"]
          },
        ]
      }
      edge_function_deployments: {
        Row: {
          deployed_at: string | null
          function_name: string
          id: string
          notes: string | null
          status: string
        }
        Insert: {
          deployed_at?: string | null
          function_name: string
          id?: string
          notes?: string | null
          status?: string
        }
        Update: {
          deployed_at?: string | null
          function_name?: string
          id?: string
          notes?: string | null
          status?: string
        }
        Relationships: []
      }
      hosting_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      hosting_product_pricing: {
        Row: {
          billing_cycle: Database["public"]["Enums"]["billing_cycle"]
          created_at: string
          currency: string
          id: string
          is_active: boolean
          price: number
          product_id: string
          setup_fee: number
        }
        Insert: {
          billing_cycle: Database["public"]["Enums"]["billing_cycle"]
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          price?: number
          product_id: string
          setup_fee?: number
        }
        Update: {
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"]
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          price?: number
          product_id?: string
          setup_fee?: number
        }
        Relationships: [
          {
            foreignKeyName: "hosting_product_pricing_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "hosting_products"
            referencedColumns: ["id"]
          },
        ]
      }
      hosting_products: {
        Row: {
          badge_text: string | null
          category_id: string | null
          created_at: string
          description: string | null
          directadmin_package_name: string | null
          features_json: Json | null
          id: string
          is_active: boolean
          is_featured: boolean
          name: string
          product_type: Database["public"]["Enums"]["product_type"]
          server_group: string | null
          short_description: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          badge_text?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          directadmin_package_name?: string | null
          features_json?: Json | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          name: string
          product_type?: Database["public"]["Enums"]["product_type"]
          server_group?: string | null
          short_description?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          badge_text?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          directadmin_package_name?: string | null
          features_json?: Json | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          name?: string
          product_type?: Database["public"]["Enums"]["product_type"]
          server_group?: string | null
          short_description?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hosting_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "hosting_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      hosting_services: {
        Row: {
          billing_cycle: Database["public"]["Enums"]["billing_cycle"] | null
          created_at: string
          da_response_json: Json | null
          directadmin_domain: string | null
          directadmin_user: string | null
          domain_name: string
          id: string
          next_due_date: string | null
          order_id: string | null
          order_item_id: string | null
          package_name: string | null
          product_id: string | null
          server_hostname: string | null
          server_ip: string | null
          status: Database["public"]["Enums"]["service_status"]
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"] | null
          created_at?: string
          da_response_json?: Json | null
          directadmin_domain?: string | null
          directadmin_user?: string | null
          domain_name?: string
          id?: string
          next_due_date?: string | null
          order_id?: string | null
          order_item_id?: string | null
          package_name?: string | null
          product_id?: string | null
          server_hostname?: string | null
          server_ip?: string | null
          status?: Database["public"]["Enums"]["service_status"]
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"] | null
          created_at?: string
          da_response_json?: Json | null
          directadmin_domain?: string | null
          directadmin_user?: string | null
          domain_name?: string
          id?: string
          next_due_date?: string | null
          order_id?: string | null
          order_item_id?: string | null
          package_name?: string | null
          product_id?: string | null
          server_hostname?: string | null
          server_ip?: string | null
          status?: Database["public"]["Enums"]["service_status"]
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hosting_services_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hosting_services_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "recent_orders_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hosting_services_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hosting_services_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "hosting_products"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string
          metadata_json: Json | null
          qty: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          invoice_id: string
          metadata_json?: Json | null
          qty?: number
          total_price?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          metadata_json?: Json | null
          qty?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          balance_due: number
          created_at: string
          currency: string
          due_date: string
          id: string
          invoice_number: string
          order_id: string | null
          paid_at: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          subtotal: number
          tax: number
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance_due?: number
          created_at?: string
          currency?: string
          due_date?: string
          id?: string
          invoice_number?: string
          order_id?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance_due?: number
          created_at?: string
          currency?: string
          due_date?: string
          id?: string
          invoice_number?: string
          order_id?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "recent_orders_view"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          billing_cycle: Database["public"]["Enums"]["billing_cycle"] | null
          created_at: string
          description: string
          domain_name: string | null
          id: string
          item_type: Database["public"]["Enums"]["cart_item_type"]
          metadata_json: Json | null
          order_id: string
          product_id: string | null
          qty: number
          total_price: number
          unit_price: number
        }
        Insert: {
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"] | null
          created_at?: string
          description?: string
          domain_name?: string | null
          id?: string
          item_type: Database["public"]["Enums"]["cart_item_type"]
          metadata_json?: Json | null
          order_id: string
          product_id?: string | null
          qty?: number
          total_price?: number
          unit_price?: number
        }
        Update: {
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"] | null
          created_at?: string
          description?: string
          domain_name?: string | null
          id?: string
          item_type?: Database["public"]["Enums"]["cart_item_type"]
          metadata_json?: Json | null
          order_id?: string
          product_id?: string | null
          qty?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "recent_orders_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "hosting_products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          coupon_id: string | null
          created_at: string
          currency: string
          id: string
          notes: string | null
          order_number: string
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          tax: number
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          coupon_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          order_number?: string
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          coupon_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          order_number?: string
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          checkout_request_id: string | null
          created_at: string
          currency: string
          gateway: string
          id: string
          invoice_id: string
          merchant_reference: string | null
          method: string
          paid_at: string | null
          phone_number: string | null
          provider_reference: string | null
          raw_request_json: Json | null
          raw_response_json: Json | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          checkout_request_id?: string | null
          created_at?: string
          currency?: string
          gateway?: string
          id?: string
          invoice_id: string
          merchant_reference?: string | null
          method?: string
          paid_at?: string | null
          phone_number?: string | null
          provider_reference?: string | null
          raw_request_json?: Json | null
          raw_response_json?: Json | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          checkout_request_id?: string | null
          created_at?: string
          currency?: string
          gateway?: string
          id?: string
          invoice_id?: string
          merchant_reference?: string | null
          method?: string
          paid_at?: string | null
          phone_number?: string | null
          provider_reference?: string | null
          raw_request_json?: Json | null
          raw_response_json?: Json | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          postal_code: string | null
          role: Database["public"]["Enums"]["app_role"]
          state: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id: string
          phone?: string | null
          postal_code?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          state?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          postal_code?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          state?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      service_credentials: {
        Row: {
          created_at: string
          encrypted_login_url: string | null
          encrypted_password: string | null
          hosting_service_id: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          encrypted_login_url?: string | null
          encrypted_password?: string | null
          hosting_service_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          encrypted_login_url?: string | null
          encrypted_password?: string | null
          hosting_service_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_credentials_hosting_service_id_fkey"
            columns: ["hosting_service_id"]
            isOneToOne: false
            referencedRelation: "hosting_services"
            referencedColumns: ["id"]
          },
        ]
      }
      support_departments: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      support_ticket_messages: {
        Row: {
          attachments_json: Json | null
          created_at: string
          id: string
          message: string
          sender_role: Database["public"]["Enums"]["app_role"]
          sender_user_id: string
          ticket_id: string
        }
        Insert: {
          attachments_json?: Json | null
          created_at?: string
          id?: string
          message?: string
          sender_role?: Database["public"]["Enums"]["app_role"]
          sender_user_id: string
          ticket_id: string
        }
        Update: {
          attachments_json?: Json | null
          created_at?: string
          id?: string
          message?: string
          sender_role?: Database["public"]["Enums"]["app_role"]
          sender_user_id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          created_at: string
          department_id: string | null
          id: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          service_id: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          ticket_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          service_id?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          ticket_number?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          department_id?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          service_id?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          ticket_number?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "support_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "hosting_services"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string
          event_id: string | null
          event_type: string
          id: string
          payload_json: Json | null
          processed: boolean
          processed_at: string | null
          provider: string
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          event_type?: string
          id?: string
          payload_json?: Json | null
          processed?: boolean
          processed_at?: string | null
          provider?: string
        }
        Update: {
          created_at?: string
          event_id?: string | null
          event_type?: string
          id?: string
          payload_json?: Json | null
          processed?: boolean
          processed_at?: string | null
          provider?: string
        }
        Relationships: []
      }
    }
    Views: {
      admin_stats_view: {
        Row: {
          active_services: number | null
          daily_revenue: number | null
          failed_provisions: number | null
          monthly_revenue: number | null
          open_tickets: number | null
          pending_orders: number | null
          total_clients: number | null
          unpaid_invoices: number | null
        }
        Relationships: []
      }
      recent_orders_view: {
        Row: {
          created_at: string | null
          customer_email: string | null
          customer_name: string | null
          id: string | null
          order_number: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          total: number | null
        }
        Relationships: []
      }
      recent_payments_view: {
        Row: {
          amount: number | null
          created_at: string | null
          customer_name: string | null
          id: string | null
          invoice_number: string | null
          method: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_server: {
        Args: {
          directadmin_password?: string
          directadmin_url?: string
          directadmin_username?: string
          ip_address: string
          location?: string
          max_accounts?: number
          notes?: string
          server_name: string
        }
        Returns: Json
      }
      create_service_credentials: {
        Args: {
          login_url?: string
          password?: string
          service_uuid: string
          username?: string
        }
        Returns: Json
      }
      get_directadmin_login: {
        Args: { service_uuid: string; user_uuid: string }
        Returns: Json
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_above: { Args: { _user_id: string }; Returns: boolean }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      save_directadmin_config: {
        Args: {
          api_password?: string
          api_username?: string
          hostname: string
          nameservers?: string
          port?: string
          provisioning_mode?: string
          use_ssl?: boolean
        }
        Returns: Json
      }
      verify_mpesa_tables: { Args: never; Returns: Json }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "support" | "customer"
      billing_cycle:
        | "monthly"
        | "quarterly"
        | "semiannual"
        | "annual"
        | "biennial"
        | "triennial"
      cart_item_type:
        | "hosting"
        | "domain_register"
        | "domain_transfer"
        | "domain_renew"
        | "addon"
      coupon_discount_type: "fixed" | "percent"
      domain_status:
        | "pending"
        | "active"
        | "transfer_pending"
        | "expired"
        | "failed"
      invoice_status: "unpaid" | "pending" | "paid" | "cancelled" | "refunded"
      order_status:
        | "draft"
        | "pending_payment"
        | "paid"
        | "processing"
        | "active"
        | "failed"
        | "cancelled"
        | "refunded"
      payment_status:
        | "initiated"
        | "pending"
        | "success"
        | "failed"
        | "reversed"
      product_type:
        | "shared_hosting"
        | "reseller_hosting"
        | "vps_placeholder"
        | "addon"
      service_status:
        | "pending"
        | "provisioning"
        | "active"
        | "suspended"
        | "terminated"
        | "failed"
      ticket_priority: "low" | "medium" | "high"
      ticket_status: "open" | "customer_reply" | "admin_reply" | "closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "admin", "support", "customer"],
      billing_cycle: [
        "monthly",
        "quarterly",
        "semiannual",
        "annual",
        "biennial",
        "triennial",
      ],
      cart_item_type: [
        "hosting",
        "domain_register",
        "domain_transfer",
        "domain_renew",
        "addon",
      ],
      coupon_discount_type: ["fixed", "percent"],
      domain_status: [
        "pending",
        "active",
        "transfer_pending",
        "expired",
        "failed",
      ],
      invoice_status: ["unpaid", "pending", "paid", "cancelled", "refunded"],
      order_status: [
        "draft",
        "pending_payment",
        "paid",
        "processing",
        "active",
        "failed",
        "cancelled",
        "refunded",
      ],
      payment_status: ["initiated", "pending", "success", "failed", "reversed"],
      product_type: [
        "shared_hosting",
        "reseller_hosting",
        "vps_placeholder",
        "addon",
      ],
      service_status: [
        "pending",
        "provisioning",
        "active",
        "suspended",
        "terminated",
        "failed",
      ],
      ticket_priority: ["low", "medium", "high"],
      ticket_status: ["open", "customer_reply", "admin_reply", "closed"],
    },
  },
} as const
