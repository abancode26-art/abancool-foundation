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
          billing_cycle: string | null
          created_at: string
          domain_name: string | null
          id: string
          item_type: Database["public"]["Enums"]["cart_item_type"]
          metadata_json: Json | null
          product_id: string | null
          product_type: string | null
          quantity: number
          tld: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          billing_cycle?: string | null
          created_at?: string
          domain_name?: string | null
          id?: string
          item_type: Database["public"]["Enums"]["cart_item_type"]
          metadata_json?: Json | null
          product_id?: string | null
          product_type?: string | null
          quantity?: number
          tld?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          billing_cycle?: string | null
          created_at?: string
          domain_name?: string | null
          id?: string
          item_type?: Database["public"]["Enums"]["cart_item_type"]
          metadata_json?: Json | null
          product_id?: string | null
          product_type?: string | null
          quantity?: number
          tld?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      domain_api_logs: {
        Row: {
          created_at: string | null
          endpoint: string
          error_message: string | null
          execution_time_ms: number | null
          id: string
          method: string
          provider_name: string | null
          request_data: Json | null
          response_data: Json | null
          status_code: number | null
          success: boolean | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          method: string
          provider_name?: string | null
          request_data?: Json | null
          response_data?: Json | null
          status_code?: number | null
          success?: boolean | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          method?: string
          provider_name?: string | null
          request_data?: Json | null
          response_data?: Json | null
          status_code?: number | null
          success?: boolean | null
        }
        Relationships: []
      }
      domain_api_providers: {
        Row: {
          api_key: string
          api_url: string
          created_at: string | null
          id: string
          is_active: boolean | null
          is_sandbox: boolean | null
          metadata: Json | null
          name: string
          supported_tlds: string[] | null
          username: string | null
        }
        Insert: {
          api_key: string
          api_url: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_sandbox?: boolean | null
          metadata?: Json | null
          name: string
          supported_tlds?: string[] | null
          username?: string | null
        }
        Update: {
          api_key?: string
          api_url?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_sandbox?: boolean | null
          metadata?: Json | null
          name?: string
          supported_tlds?: string[] | null
          username?: string | null
        }
        Relationships: []
      }
      domain_availability_cache: {
        Row: {
          cached_at: string | null
          currency: string | null
          domain_name: string
          expires_at: string | null
          id: string
          is_available: boolean
          price: number | null
          provider_name: string | null
          tld: string
        }
        Insert: {
          cached_at?: string | null
          currency?: string | null
          domain_name: string
          expires_at?: string | null
          id?: string
          is_available: boolean
          price?: number | null
          provider_name?: string | null
          tld: string
        }
        Update: {
          cached_at?: string | null
          currency?: string | null
          domain_name?: string
          expires_at?: string | null
          id?: string
          is_available?: boolean
          price?: number | null
          provider_name?: string | null
          tld?: string
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
      email_queue: {
        Row: {
          attempts: number
          created_at: string
          error_message: string | null
          html_body: string
          id: string
          max_attempts: number
          scheduled_at: string
          sent_at: string | null
          status: string
          subject: string
          template_name: string | null
          template_variables: Json | null
          text_body: string | null
          to_email: string
          to_name: string | null
        }
        Insert: {
          attempts?: number
          created_at?: string
          error_message?: string | null
          html_body: string
          id?: string
          max_attempts?: number
          scheduled_at?: string
          sent_at?: string | null
          status?: string
          subject: string
          template_name?: string | null
          template_variables?: Json | null
          text_body?: string | null
          to_email: string
          to_name?: string | null
        }
        Update: {
          attempts?: number
          created_at?: string
          error_message?: string | null
          html_body?: string
          id?: string
          max_attempts?: number
          scheduled_at?: string
          sent_at?: string | null
          status?: string
          subject?: string
          template_name?: string | null
          template_variables?: Json | null
          text_body?: string | null
          to_email?: string
          to_name?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string
          html_body: string
          id: string
          is_active: boolean
          subject: string
          template_name: string
          text_body: string | null
          updated_at: string
          variables: Json | null
        }
        Insert: {
          created_at?: string
          html_body: string
          id?: string
          is_active?: boolean
          subject: string
          template_name: string
          text_body?: string | null
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          created_at?: string
          html_body?: string
          id?: string
          is_active?: boolean
          subject?: string
          template_name?: string
          text_body?: string | null
          updated_at?: string
          variables?: Json | null
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
      hosting_packages: {
        Row: {
          annual_price: number | null
          badge_text: string | null
          category: string
          created_at: string | null
          description: string | null
          directadmin_package_name: string | null
          features: string[] | null
          id: string
          monthly_price: number | null
          name: string
          setup_fee: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          annual_price?: number | null
          badge_text?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          directadmin_package_name?: string | null
          features?: string[] | null
          id?: string
          monthly_price?: number | null
          name: string
          setup_fee?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          annual_price?: number | null
          badge_text?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          directadmin_package_name?: string | null
          features?: string[] | null
          id?: string
          monthly_price?: number | null
          name?: string
          setup_fee?: number | null
          status?: string | null
          updated_at?: string | null
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
          account_type: string | null
          billing_cycle: Database["public"]["Enums"]["billing_cycle"] | null
          created_at: string
          da_response_json: Json | null
          directadmin_domain: string | null
          directadmin_package_name: string | null
          directadmin_reseller: boolean | null
          directadmin_user: string | null
          domain_name: string
          id: string
          next_due_date: string | null
          order_id: string | null
          order_item_id: string | null
          package_name: string | null
          product_id: string | null
          reseller_privileges: Json | null
          server_hostname: string | null
          server_ip: string | null
          status: Database["public"]["Enums"]["service_status"]
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          account_type?: string | null
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"] | null
          created_at?: string
          da_response_json?: Json | null
          directadmin_domain?: string | null
          directadmin_package_name?: string | null
          directadmin_reseller?: boolean | null
          directadmin_user?: string | null
          domain_name?: string
          id?: string
          next_due_date?: string | null
          order_id?: string | null
          order_item_id?: string | null
          package_name?: string | null
          product_id?: string | null
          reseller_privileges?: Json | null
          server_hostname?: string | null
          server_ip?: string | null
          status?: Database["public"]["Enums"]["service_status"]
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          account_type?: string | null
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"] | null
          created_at?: string
          da_response_json?: Json | null
          directadmin_domain?: string | null
          directadmin_package_name?: string | null
          directadmin_reseller?: boolean | null
          directadmin_user?: string | null
          domain_name?: string
          id?: string
          next_due_date?: string | null
          order_id?: string | null
          order_item_id?: string | null
          package_name?: string | null
          product_id?: string | null
          reseller_privileges?: Json | null
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
          billing_details: Json | null
          created_at: string
          currency: string
          due_date: string
          id: string
          invoice_number: string
          metadata: Json | null
          order_id: string | null
          paid_at: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          subtotal: number
          tax: number
          total: number
          total_amount: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          balance_due?: number
          billing_details?: Json | null
          created_at?: string
          currency?: string
          due_date?: string
          id?: string
          invoice_number?: string
          metadata?: Json | null
          order_id?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tax?: number
          total?: number
          total_amount?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          balance_due?: number
          billing_details?: Json | null
          created_at?: string
          currency?: string
          due_date?: string
          id?: string
          invoice_number?: string
          metadata?: Json | null
          order_id?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tax?: number
          total?: number
          total_amount?: number | null
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
      mpesa_payment_requests: {
        Row: {
          account_reference: string | null
          amount: number
          callback_data: Json | null
          checkout_request_id: string | null
          created_at: string | null
          currency: string | null
          id: string
          invoice_id: string | null
          merchant_request_id: string | null
          phone_number: string
          provider_response: Json | null
          status: string | null
          transaction_desc: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          account_reference?: string | null
          amount: number
          callback_data?: Json | null
          checkout_request_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_id?: string | null
          merchant_request_id?: string | null
          phone_number: string
          provider_response?: Json | null
          status?: string | null
          transaction_desc?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          account_reference?: string | null
          amount?: number
          callback_data?: Json | null
          checkout_request_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_id?: string | null
          merchant_request_id?: string | null
          phone_number?: string
          provider_response?: Json | null
          status?: string | null
          transaction_desc?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata_json: Json | null
          title: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata_json?: Json | null
          title: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata_json?: Json | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          quantity: number | null
          total_price: number
          unit_price: number
          updated_at: string | null
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
          quantity?: number | null
          total_price?: number
          unit_price?: number
          updated_at?: string | null
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
          quantity?: number | null
          total_price?: number
          unit_price?: number
          updated_at?: string | null
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
        ]
      }
      orders: {
        Row: {
          billing_details: Json | null
          coupon_id: string | null
          created_at: string
          currency: string
          id: string
          notes: string | null
          order_number: string
          payment_method: string | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          tax: number
          total: number
          total_amount: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_details?: Json | null
          coupon_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          tax?: number
          total?: number
          total_amount?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_details?: Json | null
          coupon_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          tax?: number
          total?: number
          total_amount?: number | null
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
            foreignKeyName: "support_ticket_messages_sender_profile_id_fkey"
            columns: ["sender_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
      domain_pricing: {
        Row: {
          created_at: string | null
          id: string | null
          is_active: boolean | null
          is_featured: boolean | null
          price: number | null
          register_price: number | null
          renew_price: number | null
          restore_price: number | null
          sort_order: number | null
          tld: string | null
          transfer_price: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          price?: number | null
          register_price?: number | null
          renew_price?: number | null
          restore_price?: number | null
          sort_order?: number | null
          tld?: string | null
          transfer_price?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          price?: number | null
          register_price?: number | null
          renew_price?: number | null
          restore_price?: number | null
          sort_order?: number | null
          tld?: string | null
          transfer_price?: number | null
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
      add_package_to_cart: {
        Args: {
          billing_cycle?: string
          package_name: string
          user_uuid: string
        }
        Returns: Json
      }
      bytea_to_text: { Args: { data: string }; Returns: string }
      calculate_cart_total: { Args: { user_uuid: string }; Returns: Json }
      cart_add_package: {
        Args: { billing_cycle_text?: string; package_id_text: string }
        Returns: Json
      }
      check_domain_availability: {
        Args: { domain: string; tld: string; use_sandbox?: boolean }
        Returns: Json
      }
      check_domain_cache: {
        Args: { domain_input: string; tld_input: string }
        Returns: {
          cached_at: string
          currency: string
          is_available: boolean
          price: number
        }[]
      }
      check_payment_status: { Args: { invoice_uuid: string }; Returns: Json }
      checkout_cart: {
        Args: { billing_details: Json; payment_method?: string }
        Returns: Json
      }
      clear_cart_after_payment_confirmation: {
        Args: { invoice_uuid: string }
        Returns: Json
      }
      clear_cart_for_user: { Args: { user_identifier?: string }; Returns: Json }
      clear_user_cart: { Args: never; Returns: Json }
      create_hosting_services_from_order: {
        Args: { order_uuid: string }
        Returns: Json
      }
      create_notification: {
        Args: {
          action_url?: string
          metadata?: Json
          notification_message: string
          notification_title: string
          notification_type?: string
          target_user_id: string
        }
        Returns: string
      }
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
      create_support_ticket_with_email: {
        Args: {
          ticket_category?: string
          ticket_message: string
          ticket_priority?: string
          ticket_subject: string
        }
        Returns: Json
      }
      generate_da_credentials_with_email: {
        Args: { domain_name: string; service_id: string }
        Returns: Json
      }
      generate_invoice_number: { Args: never; Returns: string }
      generate_order_number: { Args: never; Returns: string }
      get_directadmin_login: {
        Args: { service_uuid: string; user_uuid: string }
        Returns: Json
      }
      get_namecom_credentials: {
        Args: { use_sandbox?: boolean }
        Returns: {
          api_token: string
          api_url: string
          auth_string: string
          provider_id: string
          username: string
        }[]
      }
      get_namecom_logs: {
        Args: { limit_count?: number }
        Returns: {
          created_at: string
          endpoint: string
          id: string
          method: string
          provider_name: string
          status_code: number
          success: boolean
        }[]
      }
      get_payment_status: {
        Args: { checkout_request_id: string }
        Returns: Json
      }
      get_simple_cart_total: { Args: never; Returns: Json }
      get_unread_notification_count: { Args: never; Returns: number }
      handle_intasend_webhook: { Args: { webhook_data: Json }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "http_request"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_delete:
        | {
            Args: { uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { content: string; content_type: string; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_get:
        | {
            Args: { uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { data: Json; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_head: {
        Args: { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "*"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
        SetofOptions: {
          from: "*"
          to: "http_header"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_list_curlopt: {
        Args: never
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "*"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_post:
        | {
            Args: { content: string; content_type: string; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { data: Json; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_put: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "*"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_reset_curlopt: { Args: never; Returns: boolean }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      increment_coupon_usage: {
        Args: { coupon_id: string }
        Returns: undefined
      }
      initiate_intasend_mpesa_payment: {
        Args: { amount: number; invoice_uuid: string; phone_number: string }
        Returns: Json
      }
      initiate_mpesa_payment: {
        Args: {
          amount_param: number
          invoice_id_param: string
          phone_number: string
        }
        Returns: Json
      }
      is_admin_or_above: { Args: { _user_id: string }; Returns: boolean }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      list_namecom_domains: { Args: { use_sandbox?: boolean }; Returns: Json }
      mark_all_notifications_read: { Args: never; Returns: number }
      mark_notification_read: {
        Args: { notification_id: string }
        Returns: boolean
      }
      namecom_mock_api: {
        Args: {
          endpoint: string
          method?: string
          request_body?: Json
          use_sandbox?: boolean
        }
        Returns: Json
      }
      process_checkout: {
        Args: {
          billing_details: Json
          payment_method: string
          user_uuid: string
        }
        Returns: Json
      }
      process_hosting_checkout: {
        Args: {
          billing_details: Json
          payment_method: string
          user_uuid: string
        }
        Returns: Json
      }
      process_intasend_callback: {
        Args: {
          callback_data?: Json
          checkout_request_id: string
          status?: string
          transaction_id?: string
        }
        Returns: Json
      }
      provision_hosting_service: {
        Args: { service_uuid: string }
        Returns: Json
      }
      queue_email: {
        Args: {
          scheduled_at_param?: string
          template_name_param: string
          template_variables_param?: Json
          to_email_param: string
          to_name_param: string
        }
        Returns: string
      }
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
      search_domains: {
        Args: { keyword: string; tlds?: string[]; use_sandbox?: boolean }
        Returns: Json
      }
      simple_add_to_cart: {
        Args: {
          billing_cycle_param?: string
          product_id_param: string
          quantity_param?: number
        }
        Returns: Json
      }
      simple_cleanup_pricing: { Args: never; Returns: string }
      sql_checkout: {
        Args: { coupon_code_input?: string; user_uuid: string }
        Returns: Json
      }
      sql_mpesa_initiate: {
        Args: {
          invoice_id_input: string
          phone_number_input: string
          user_uuid: string
        }
        Returns: Json
      }
      test_mpesa_function: { Args: never; Returns: Json }
      test_mpesa_payment: {
        Args: { amount: number; phone_number: string }
        Returns: Json
      }
      test_namecom_connection: {
        Args: { use_sandbox?: boolean }
        Returns: Json
      }
      text_to_bytea: { Args: { data: string }; Returns: string }
      urlencode:
        | { Args: { data: Json }; Returns: string }
        | {
            Args: { string: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.urlencode(string => bytea), public.urlencode(string => varchar). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: { string: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.urlencode(string => bytea), public.urlencode(string => varchar). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
      verify_mpesa_tables: { Args: never; Returns: Json }
      view_cart: { Args: { user_identifier?: string }; Returns: Json }
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
      billing_cycle_enum: "monthly" | "annually"
      cart_item_type:
        | "hosting"
        | "domain_register"
        | "domain_transfer"
        | "domain_renew"
        | "addon"
        | "hosting_package"
      coupon_discount_type: "fixed" | "percent"
      domain_status:
        | "pending"
        | "active"
        | "transfer_pending"
        | "expired"
        | "failed"
      invoice_status:
        | "unpaid"
        | "pending"
        | "paid"
        | "cancelled"
        | "refunded"
        | "overdue"
      order_status:
        | "draft"
        | "pending_payment"
        | "paid"
        | "processing"
        | "active"
        | "failed"
        | "cancelled"
        | "refunded"
        | "pending"
        | "completed"
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
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
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
      billing_cycle_enum: ["monthly", "annually"],
      cart_item_type: [
        "hosting",
        "domain_register",
        "domain_transfer",
        "domain_renew",
        "addon",
        "hosting_package",
      ],
      coupon_discount_type: ["fixed", "percent"],
      domain_status: [
        "pending",
        "active",
        "transfer_pending",
        "expired",
        "failed",
      ],
      invoice_status: [
        "unpaid",
        "pending",
        "paid",
        "cancelled",
        "refunded",
        "overdue",
      ],
      order_status: [
        "draft",
        "pending_payment",
        "paid",
        "processing",
        "active",
        "failed",
        "cancelled",
        "refunded",
        "pending",
        "completed",
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
