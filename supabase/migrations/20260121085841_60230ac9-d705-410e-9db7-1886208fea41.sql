-- Supprimer les commandes sans user_id (s'il y en a)
DELETE FROM public.orders WHERE user_id IS NULL;

-- Rendre user_id obligatoire
ALTER TABLE public.orders 
ALTER COLUMN user_id SET NOT NULL;