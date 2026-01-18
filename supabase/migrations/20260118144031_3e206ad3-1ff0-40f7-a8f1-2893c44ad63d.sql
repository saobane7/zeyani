-- Add user_id column to orders table for linking to authenticated users
ALTER TABLE public.orders 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add received_at column to track when order was delivered (for GDPR retention)
ALTER TABLE public.orders 
ADD COLUMN received_at TIMESTAMP WITH TIME ZONE;

-- Add expires_at column for automatic deletion scheduling (3 years after received)
ALTER TABLE public.orders 
ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE;

-- Create index for efficient cleanup queries
CREATE INDEX idx_orders_expires_at ON public.orders(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_orders_user_id ON public.orders(user_id);

-- Drop the restrictive service_role only policy
DROP POLICY IF EXISTS "Service role can manage orders" ON public.orders;

-- Create new RLS policies

-- Service role can do everything (for edge functions)
CREATE POLICY "Service role full access"
ON public.orders
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Authenticated users can view their own orders
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Authenticated users can create orders for themselves
CREATE POLICY "Users can create their own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Function to set expires_at when order is marked as received
CREATE OR REPLACE FUNCTION public.set_order_expiry()
RETURNS TRIGGER AS $$
BEGIN
  -- When received_at is set, calculate expires_at (3 years = 1095 days)
  IF NEW.received_at IS NOT NULL AND OLD.received_at IS NULL THEN
    NEW.expires_at = NEW.received_at + INTERVAL '3 years';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger to automatically set expiry when order is received
CREATE TRIGGER set_order_expiry_trigger
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.set_order_expiry();

-- Function to clean up expired orders (GDPR compliance)
CREATE OR REPLACE FUNCTION public.cleanup_expired_orders()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.orders
  WHERE expires_at IS NOT NULL AND expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;