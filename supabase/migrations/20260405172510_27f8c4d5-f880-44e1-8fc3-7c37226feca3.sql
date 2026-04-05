DO $$
BEGIN
  -- support_tickets -> support_departments
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'support_tickets_department_id_fkey') THEN
    ALTER TABLE public.support_tickets ADD CONSTRAINT support_tickets_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.support_departments(id);
  END IF;

  -- support_tickets -> hosting_services
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'support_tickets_service_id_fkey') THEN
    ALTER TABLE public.support_tickets ADD CONSTRAINT support_tickets_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.hosting_services(id);
  END IF;

  -- support_ticket_messages -> profiles
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'support_ticket_messages_sender_profile_id_fkey') THEN
    ALTER TABLE public.support_ticket_messages ADD CONSTRAINT support_ticket_messages_sender_profile_id_fkey FOREIGN KEY (sender_user_id) REFERENCES public.profiles(id);
  END IF;

  -- support_ticket_messages -> support_tickets
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'support_ticket_messages_ticket_id_fkey') THEN
    ALTER TABLE public.support_ticket_messages ADD CONSTRAINT support_ticket_messages_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.support_tickets(id);
  END IF;

  -- domains -> orders
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'domains_order_id_fkey') THEN
    ALTER TABLE public.domains ADD CONSTRAINT domains_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);
  END IF;

  -- invoices -> orders
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'invoices_order_id_fkey') THEN
    ALTER TABLE public.invoices ADD CONSTRAINT invoices_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);
  END IF;

  -- invoice_items -> invoices
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'invoice_items_invoice_id_fkey') THEN
    ALTER TABLE public.invoice_items ADD CONSTRAINT invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id);
  END IF;

  -- order_items -> orders
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'order_items_order_id_fkey') THEN
    ALTER TABLE public.order_items ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);
  END IF;

  -- payments -> invoices
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payments_invoice_id_fkey') THEN
    ALTER TABLE public.payments ADD CONSTRAINT payments_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id);
  END IF;

  -- notifications -> profiles
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'notifications_user_id_fkey') THEN
    ALTER TABLE public.notifications ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);
  END IF;

  -- hosting_product_pricing -> hosting_products
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'hosting_product_pricing_product_id_fkey') THEN
    ALTER TABLE public.hosting_product_pricing ADD CONSTRAINT hosting_product_pricing_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.hosting_products(id);
  END IF;

  -- hosting_products -> hosting_categories
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'hosting_products_category_id_fkey') THEN
    ALTER TABLE public.hosting_products ADD CONSTRAINT hosting_products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.hosting_categories(id);
  END IF;
END $$;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';