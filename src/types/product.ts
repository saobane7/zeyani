export interface ProductVariant {
  id: string;
  type: 'chain' | 'bead';
  color: 'argente' | 'dore';
  price: number;
  label: string;
  image?: string;
}

export interface ProductSize {
  id: string;
  name: string;
  available: boolean;
}

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  available: boolean;
}

export interface ProductDimensions {
  length?: number;
  width?: number;
  height?: number;
  unit: 'cm' | 'mm';
}

export interface DbProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_at_price: number | null;
  category: string;
  material: string | null;
  stock: number | null;
  is_active: boolean | null;
  featured: boolean | null;
  images: string[];
  variants: ProductVariant[];
  sizes: ProductSize[];
  colors: ProductColor[];
  tags: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
  weight: number | null;
  dimensions: ProductDimensions | null;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  compare_at_price: number | null;
  category: string;
  material: string;
  stock: number;
  is_active: boolean;
  featured: boolean;
  images: string[];
  variants: ProductVariant[];
  sizes: ProductSize[];
  colors: ProductColor[];
  tags: string[];
  seo_title: string;
  seo_description: string;
  weight: number | null;
  dimensions: ProductDimensions | null;
}

export const PRODUCT_CATEGORIES = [
  { value: 'colliers', label: 'Colliers' },
  { value: 'bracelets', label: 'Bracelets' },
  { value: 'bagues', label: 'Bagues' },
  { value: 'boucles-oreilles', label: "Boucles d'oreilles" },
  { value: 'pendentifs', label: 'Pendentifs' },
];

export const PRODUCT_MATERIALS = [
  { value: 'argent', label: 'Argent' },
  { value: 'argent-925', label: 'Argent 925' },
  { value: 'bronze', label: 'Bronze' },
  { value: 'cuir', label: 'Cuir' },
  { value: 'perles', label: 'Perles' },
  { value: 'mixte', label: 'Mixte' },
];
