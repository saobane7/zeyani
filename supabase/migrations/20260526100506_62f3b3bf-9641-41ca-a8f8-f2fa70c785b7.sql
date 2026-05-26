
-- 1) Short sequential order number
CREATE SEQUENCE IF NOT EXISTS public.orders_order_number_seq START 1;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS order_number BIGINT;

-- Backfill existing rows in creation order
DO $$
DECLARE
  r RECORD;
  i BIGINT := 0;
BEGIN
  FOR r IN SELECT id FROM public.orders WHERE order_number IS NULL ORDER BY created_at ASC LOOP
    i := nextval('public.orders_order_number_seq');
    UPDATE public.orders SET order_number = i WHERE id = r.id;
  END LOOP;
END $$;

-- Default + trigger to autofill on insert
ALTER TABLE public.orders
  ALTER COLUMN order_number SET DEFAULT nextval('public.orders_order_number_seq');

ALTER TABLE public.orders
  ALTER COLUMN order_number SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS orders_order_number_key ON public.orders(order_number);

-- 2) Seed hero slides in site_settings (empty array means: use default fallback in code)
INSERT INTO public.site_settings (key, value)
VALUES ('hero_slides', '[]'::jsonb)
ON CONFLICT (key) DO NOTHING;
