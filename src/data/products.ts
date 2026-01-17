import croix1 from "@/assets/croix-agadez-1.jpg";
import croix2 from "@/assets/croix-agadez-2.jpg";
import croix3 from "@/assets/croix-agadez-3.jpg";
import croixTahoua from "@/assets/croix-tahoua.jpg";
import croixIfe from "@/assets/croix-ife.jpg";
import croixIna from "@/assets/croix-ina.jpg";
import croixZinda from "@/assets/croix-zinda.jpg";
import croixInwagar from "@/assets/croix-inwagar.jpg";
import bracelet1 from "@/assets/bracelet-1.jpg";
import braceletTuareg from "@/assets/bracelet-tuareg.jpg";
import necklace1 from "@/assets/necklace-1.jpg";
import ring1 from "@/assets/ring-1.jpg";

export interface ProductVariant {
  id: string;
  type: "chaine" | "perle";
  color: "dore" | "argente";
  price: number;
  label: string;
}

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
  variants?: ProductVariant[];
}

// Descriptions des croix pour le carrousel
export const crossDescriptions = [
  {
    name: "Croix d'Agadez",
    slug: "collier-croix-agadez",
    description: "La plus célèbre des croix touareg, symbole de protection et de direction. Offerte traditionnellement par le père à son fils.",
    image: croix1,
  },
  {
    name: "Croix de Tahoua",
    slug: "collier-croix-tahoua",
    description: "Originaire de la région de Tahoua, cette croix se distingue par ses formes élancées et ses motifs fins.",
    image: croixTahoua,
  },
  {
    name: "Croix de Ifé",
    slug: "collier-croix-ife",
    description: "Inspirée par l'art ancien du Nigéria, cette croix combine influences touareg et tradition Yoruba.",
    image: croixIfe,
  },
  {
    name: "Croix de Ina",
    slug: "collier-croix-ina",
    description: "Symbole de féminité et de grâce, la croix de Ina est caractérisée par ses courbes délicates.",
    image: croixIna,
  },
  {
    name: "Croix de Zinda",
    slug: "collier-croix-zinda",
    description: "Représentant l'équilibre cosmique, cette croix aux quatre branches égales incarne l'harmonie universelle.",
    image: croixZinda,
  },
  {
    name: "Croix de Inwagar",
    slug: "collier-croix-inwagar",
    description: "La croix des guerriers nomades, symbole de courage et de force pour ceux qui traversent le Sahara.",
    image: croixInwagar,
  },
];

// Générer les variantes pour chaque croix collier
const generateNecklaceVariants = (): ProductVariant[] => [
  { id: "chaine-argente", type: "chaine", color: "argente", price: 23, label: "Chaîne Argentée" },
  { id: "chaine-dore", type: "chaine", color: "dore", price: 23, label: "Chaîne Dorée" },
  { id: "perle-argente", type: "perle", color: "argente", price: 25, label: "Perles Argentées" },
  { id: "perle-dore", type: "perle", color: "dore", price: 25, label: "Perles Dorées" },
];

export const products: Product[] = [
  // COLLIERS - 6 croix
  {
    id: "1",
    slug: "collier-croix-agadez",
    name: "Collier Croix d'Agadez",
    description: "La croix traditionnelle, symbole de protection",
    longDescription: "La Croix d'Agadez, aussi appelée Croix du Sud, est un bijou ancestral des Touaregs du Niger. Ce pendentif est entièrement façonné à la main par nos artisans selon des techniques transmises de génération en génération. Elle représente les quatre directions cardinales et symbolise la protection du voyageur. Disponible en chaîne ou perles, en finition dorée ou argentée.",
    price: 23,
    image: croix1,
    images: [croix1, croix2, croix3],
    material: "Argent/Or",
    category: "Colliers",
    isNew: true,
    inStock: true,
    weight: "15g",
    dimensions: "Pendentif 3cm, Chaîne 45cm",
    hasVariants: true,
    variants: generateNecklaceVariants(),
  },
  {
    id: "2",
    slug: "collier-croix-tahoua",
    name: "Collier Croix de Tahoua",
    description: "Formes élancées et motifs fins",
    longDescription: "Originaire de la région de Tahoua au Niger, cette croix se distingue par ses formes élancées et ses motifs délicatement ciselés. Chaque pièce est unique, portant la signature de son créateur. Un bijou d'exception pour ceux qui apprécient l'artisanat authentique.",
    price: 23,
    image: croixTahoua,
    images: [croixTahoua],
    material: "Argent/Or",
    category: "Colliers",
    isNew: true,
    inStock: true,
    weight: "14g",
    dimensions: "Pendentif 3.5cm, Chaîne 45cm",
    hasVariants: true,
    variants: generateNecklaceVariants(),
  },
  {
    id: "3",
    slug: "collier-croix-ife",
    name: "Collier Croix de Ifé",
    description: "Fusion des traditions touareg et Yoruba",
    longDescription: "Inspirée par l'art ancien du royaume de Ifé au Nigéria, cette croix unique combine les influences touareg et la tradition artistique Yoruba. Un pont entre deux cultures riches, créant un bijou véritablement unique et chargé d'histoire.",
    price: 23,
    image: croixIfe,
    images: [croixIfe],
    material: "Argent/Or",
    category: "Colliers",
    isNew: false,
    inStock: true,
    weight: "16g",
    dimensions: "Pendentif 3.2cm, Chaîne 45cm",
    hasVariants: true,
    variants: generateNecklaceVariants(),
  },
  {
    id: "4",
    slug: "collier-croix-ina",
    name: "Collier Croix de Ina",
    description: "Symbole de féminité et de grâce",
    longDescription: "La Croix de Ina incarne la féminité et la grâce dans la tradition touareg. Ses courbes délicates et son design raffiné en font le bijou idéal pour les femmes qui recherchent l'élégance et l'authenticité. Traditionnellement offerte lors des mariages.",
    price: 23,
    image: croixIna,
    images: [croixIna],
    material: "Argent/Or",
    category: "Colliers",
    isNew: false,
    inStock: true,
    weight: "12g",
    dimensions: "Pendentif 2.8cm, Chaîne 45cm",
    hasVariants: true,
    variants: generateNecklaceVariants(),
  },
  {
    id: "5",
    slug: "collier-croix-zinda",
    name: "Collier Croix de Zinda",
    description: "L'équilibre cosmique en bijou",
    longDescription: "La Croix de Zinda représente l'équilibre cosmique et l'harmonie universelle. Ses quatre branches égales symbolisent les quatre éléments et les quatre points cardinaux. Un bijou puissant pour ceux qui cherchent l'équilibre dans leur vie.",
    price: 23,
    image: croixZinda,
    images: [croixZinda],
    material: "Argent/Or",
    category: "Colliers",
    isNew: true,
    inStock: true,
    weight: "18g",
    dimensions: "Pendentif 3.5cm, Chaîne 45cm",
    hasVariants: true,
    variants: generateNecklaceVariants(),
  },
  {
    id: "6",
    slug: "collier-croix-inwagar",
    name: "Collier Croix de Inwagar",
    description: "La croix des guerriers nomades",
    longDescription: "La Croix de Inwagar est la croix des guerriers nomades du Sahara. Symbole de courage et de force, elle était portée par ceux qui bravaient les immensités désertiques. Un bijou pour les âmes aventurières et les esprits libres.",
    price: 23,
    image: croixInwagar,
    images: [croixInwagar],
    material: "Argent/Or",
    category: "Colliers",
    isNew: false,
    inStock: true,
    weight: "17g",
    dimensions: "Pendentif 3.8cm, Chaîne 45cm",
    hasVariants: true,
    variants: generateNecklaceVariants(),
  },
  // BRACELETS
  {
    id: "7",
    slug: "bracelet-touareg-traditionnel",
    name: "Bracelet Touareg Traditionnel",
    description: "Bracelet en argent avec motifs géométriques",
    longDescription: "Ce bracelet en argent massif est orné des motifs géométriques caractéristiques de l'artisanat Touareg. Les gravures symbolisent les dunes du désert et les étoiles qui guidaient les caravanes. Un bijou robuste et élégant pour homme et femme.",
    price: 129,
    image: bracelet1,
    images: [bracelet1],
    material: "Argent 925",
    category: "Bracelets",
    isNew: false,
    inStock: true,
    weight: "45g",
    dimensions: "Ajustable",
  },
  {
    id: "8",
    slug: "bracelet-touareg-luxe",
    name: "Bracelet Touareg Luxe",
    description: "Bracelet large aux motifs ancestraux",
    longDescription: "Ce bracelet large en argent présente des motifs ancestraux finement gravés. Chaque détail raconte une histoire du peuple nomade. Un accessoire statement qui ne passe pas inaperçu.",
    price: 189,
    image: braceletTuareg,
    images: [braceletTuareg],
    material: "Argent 925",
    category: "Bracelets",
    isNew: true,
    inStock: true,
    weight: "55g",
    dimensions: "Ajustable",
  },
  // BAGUES
  {
    id: "9",
    slug: "bague-touareg-gravee",
    name: "Bague Touareg Gravée",
    description: "Bague en argent avec gravures ancestrales",
    longDescription: "Cette bague en argent 925 présente des gravures réalisées selon les techniques ancestrales des Touaregs. Chaque motif est unique et symbolise la connexion entre le ciel et la terre. Un bijou unisexe qui s'adapte à tous les styles.",
    price: 89,
    image: ring1,
    images: [ring1],
    material: "Argent 925",
    category: "Bagues",
    isNew: false,
    inStock: true,
    weight: "12g",
    dimensions: "Tailles disponibles: 52-62",
  },
];

export const categories = [
  { name: "Tous", slug: "tous" },
  { name: "Colliers", slug: "colliers" },
  { name: "Bracelets", slug: "bracelets" },
  { name: "Bagues", slug: "bagues" },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find((p) => p.slug === slug);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === "tous") return products;
  return products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(price);
};
