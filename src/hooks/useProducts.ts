import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DbProduct } from '@/types/product';

// Import local images
import croixAgadez1 from '@/assets/croix-agadez-1.jpg';
import croixAgadez2 from '@/assets/croix-agadez-2.jpg';
import croixAgadez3 from '@/assets/croix-agadez-3.jpg';
import croixAgadezChaineDore from '@/assets/croix-agadez-chaine-dore.jpg';
import croixAgadezChaineArgente from '@/assets/croix-agadez-chaine-argente.jpg';
import croixAgadezPerleDore from '@/assets/croix-agadez-perle-dore.jpg';
import croixAgadezPerleArgente from '@/assets/croix-agadez-perle-argente.jpg';
import croixTahoua from '@/assets/croix-tahoua.jpg';
import croixIfe from '@/assets/croix-ife.jpg';
import croixIna from '@/assets/croix-ina.jpg';
import croixZinda from '@/assets/croix-zinda.jpg';
import croixInwagar from '@/assets/croix-inwagar.jpg';
import braceletTuareg from '@/assets/bracelet-tuareg.jpg';
import bracelet1 from '@/assets/bracelet-1.jpg';
import ring1 from '@/assets/ring-1.jpg';

// Map slugs to local images
const localImageMap: Record<string, string[]> = {
  'croix-agadez': [croixAgadez1, croixAgadez2, croixAgadez3],
  'croix-tahoua': [croixTahoua],
  'croix-ife': [croixIfe],
  'croix-ina': [croixIna],
  'croix-zinda': [croixZinda],
  'croix-inwagar': [croixInwagar],
  'bracelet-touareg-traditionnel': [braceletTuareg],
  'bracelet-touareg-luxe': [bracelet1],
  'bague-touareg-gravee': [ring1],
};

// Map for variant images
const variantImageMap: Record<string, Record<string, string>> = {
  'croix-agadez': {
    'Chaîne-Doré': croixAgadezChaineDore,
    'Chaîne-Argenté': croixAgadezChaineArgente,
    'Perles-Doré': croixAgadezPerleDore,
    'Perles-Argenté': croixAgadezPerleArgente,
  },
};

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  material: string;
  category: string;
  isNew: boolean;
  inStock: boolean;
  weight?: string;
  dimensions?: string;
  hasVariants?: boolean;
  variants?: any[];
  variantImages?: Record<string, string>;
}

// Transform DB product to frontend format
const transformProduct = (dbProduct: DbProduct): Product => {
  const localImages = localImageMap[dbProduct.slug] || [];
  const images = localImages.length > 0 ? localImages : (dbProduct.images?.length ? dbProduct.images : ['/placeholder.svg']);
  
  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.name,
    description: dbProduct.short_description || '',
    longDescription: dbProduct.description || '',
    price: dbProduct.price,
    originalPrice: dbProduct.compare_at_price || undefined,
    image: images[0],
    images,
    material: dbProduct.material || '',
    category: dbProduct.category,
    isNew: dbProduct.featured || false,
    inStock: (dbProduct.stock || 0) > 0,
    weight: dbProduct.weight ? `${dbProduct.weight}g` : undefined,
    hasVariants: dbProduct.variants && dbProduct.variants.length > 0,
    variants: dbProduct.variants || [],
    variantImages: variantImageMap[dbProduct.slug] || {},
  };
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as unknown as DbProduct[]).map(transformProduct);
    },
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return transformProduct(data as unknown as DbProduct);
    },
    enabled: !!slug,
  });
};

export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (category !== 'tous') {
        query = query.eq('category', category.toLowerCase());
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data as unknown as DbProduct[]).map(transformProduct);
    },
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('featured', true)
        .limit(6);

      if (error) throw error;
      return (data as unknown as DbProduct[]).map(transformProduct);
    },
  });
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(price);
};
