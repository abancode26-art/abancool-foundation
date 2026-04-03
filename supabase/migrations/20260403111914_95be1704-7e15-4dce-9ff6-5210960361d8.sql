CREATE INDEX IF NOT EXISTS idx_hosting_services_product_id ON public.hosting_services(product_id);
CREATE INDEX IF NOT EXISTS idx_support_ticket_messages_sender_user_id ON public.support_ticket_messages(sender_user_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'hosting_services_product_id_fkey'
      AND conrelid = 'public.hosting_services'::regclass
  ) THEN
    ALTER TABLE public.hosting_services
      ADD CONSTRAINT hosting_services_product_id_fkey
      FOREIGN KEY (product_id)
      REFERENCES public.hosting_products(id)
      ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'support_ticket_messages_sender_profile_id_fkey'
      AND conrelid = 'public.support_ticket_messages'::regclass
  ) THEN
    ALTER TABLE public.support_ticket_messages
      ADD CONSTRAINT support_ticket_messages_sender_profile_id_fkey
      FOREIGN KEY (sender_user_id)
      REFERENCES public.profiles(id)
      ON DELETE CASCADE;
  END IF;
END
$$;