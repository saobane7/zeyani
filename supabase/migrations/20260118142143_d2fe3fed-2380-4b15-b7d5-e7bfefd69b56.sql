-- Create orders table for storing PayPal orders (GDPR compliant - minimal data)
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  paypal_order_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  items JSONB NOT NULL,
  shipping_address JSONB,
  payer_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy for service role only (orders are managed by backend)
-- No public access to orders table for security
CREATE POLICY "Service role can manage orders" 
ON public.orders 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create index for faster lookups
CREATE INDEX idx_orders_paypal_id ON public.orders (paypal_order_id);
CREATE INDEX idx_orders_created_at ON public.orders (created_at DESC);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();