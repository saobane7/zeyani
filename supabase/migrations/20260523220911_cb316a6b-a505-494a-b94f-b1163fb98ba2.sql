
-- Make paypal_order_id nullable and add Wero fields
ALTER TABLE public.orders ALTER COLUMN paypal_order_id DROP NOT NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'paypal';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_proof_url text;

-- Private bucket for payment proofs
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users upload their own payment proof"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users read their own payment proof"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'payment-proofs' AND (auth.uid()::text = (storage.foldername(name))[1] OR has_role(auth.uid(), 'admin'::app_role)));
