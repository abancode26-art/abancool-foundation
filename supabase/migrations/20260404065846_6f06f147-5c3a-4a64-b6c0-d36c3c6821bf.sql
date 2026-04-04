
-- 1) Create domain_pricing view over domain_tlds so frontend queries work
CREATE OR REPLACE VIEW public.domain_pricing AS
SELECT
  id,
  tld,
  register_price AS price,
  register_price,
  transfer_price,
  renew_price,
  restore_price,
  is_active,
  is_featured,
  sort_order,
  created_at
FROM public.domain_tlds
WHERE is_active = true;

-- 2) Fix notifications check constraint to allow 'order' and 'ticket' types
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check
  CHECK (type = ANY (ARRAY['info','success','warning','error','payment','service','system','order','ticket','domain']));
