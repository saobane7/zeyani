import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DbProduct } from '@/types/product';

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
  variantImages?: Record<string, string[]>;
}

// Build variant images from DB variants only (uses admin-uploaded images)
const buildVariantImages = (dbProduct: DbProduct): Record<string, string[]> => {
  const variantImages: Record<string, string[]> = {};
  
  // Build from DB variants only - no local overrides
  if (dbProduct.variants && Array.isArray(dbProduct.variants)) {
    dbProduct.variants.forEach((variant: any) => {
      if (variant.type && variant.color && variant.image) {
        const key = `${variant.type}-${variant.color}`;
        if (!variantImages[key]) {
          variantImages[key] = [];
        }
        variantImages[key].push(variant.image);
      }
    });
  }
  
  return variantImages;
};

// Transform DB product to frontend format
const transformProduct = (dbProduct: DbProduct): Product => {
  // Use only images from DB - no local overrides
  const images = dbProduct.images?.length ? dbProduct.images : ['/placeholder.svg'];
  
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
    variantImages: buildVariantImages(dbProduct),
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
        .order('display_order', { ascending: true });

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
        .order('display_order', { ascending: true });

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
        .order('display_order', { ascending: true })
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
