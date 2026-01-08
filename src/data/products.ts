import croix1 from "@/assets/croix-agadez-1.jpg";
import croix2 from "@/assets/croix-agadez-2.jpg";
import croix3 from "@/assets/croix-agadez-3.jpg";
import bracelet1 from "@/assets/bracelet-1.jpg";
import necklace1 from "@/assets/necklace-1.jpg";
import ring1 from "@/assets/ring-1.jpg";

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
}

export const products: Product[] = [
  {
    id: "1",
    slug: "croix-agadez-classique",
    name: "Croix d'Agadez Classique",
    description: "La croix traditionnelle, symbole de protection",
    longDescription: "La Croix d'Agadez, aussi appelée Croix du Sud, est un bijou ancestral des Touaregs du Niger. Ce pendentif en argent 925 est entièrement façonné à la main par nos artisans selon des techniques transmises de génération en génération. Elle représente les quatre directions cardinales et symbolise la protection du voyageur.",
    price: 189,
    image: croix1,
    images: [croix1, croix2, croix3],
    material: "Argent 925",
    category: "Croix",
    isNew: true,
    inStock: true,
    weight: "25g",
    dimensions: "5cm x 4cm",
  },
  {
    id: "2",
    slug: "croix-agadez-royale",
    name: "Croix d'Agadez Royale",
    description: "Motifs ornementaux élaborés",
    longDescription: "Cette version royale de la Croix d'Agadez présente des ornements plus élaborés et des détails en or. Chaque motif gravé raconte une histoire du peuple Touareg. Cette pièce exceptionnelle allie tradition et raffinement pour les amateurs de bijoux d'exception.",
    price: 289,
    originalPrice: 329,
    image: croix2,
    images: [croix2, croix1, croix3],
    material: "Argent & Or",
    category: "Croix",
    isNew: false,
    inStock: true,
    weight: "30g",
    dimensions: "6cm x 5cm",
  },
  {
    id: "3",
    slug: "croix-agadez-elegance",
    name: "Croix d'Agadez Élégance",
    description: "Design épuré et moderne",
    longDescription: "Une interprétation contemporaine de la Croix d'Agadez qui conserve l'essence des motifs traditionnels tout en offrant un design plus épuré. Parfaite pour un port quotidien, cette croix s'adapte à tous les styles.",
    price: 159,
    image: croix3,
    images: [croix3, croix1, croix2],
    material: "Argent 925",
    category: "Croix",
    isNew: true,
    inStock: true,
    weight: "20g",
    dimensions: "4cm x 3.5cm",
  },
  {
    id: "4",
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
    id: "5",
    slug: "collier-perles-niger",
    name: "Collier Perles du Niger",
    description: "Collier de perles traditionnelles du Niger",
    longDescription: "Ce collier associe des perles traditionnelles du Niger à des éléments en argent travaillé. Les perles en verre coloré étaient autrefois utilisées comme monnaie d'échange sur les routes commerciales transsahariennes. Un bijou chargé d'histoire.",
    price: 219,
    image: necklace1,
    images: [necklace1],
    material: "Argent & Perles",
    category: "Colliers",
    isNew: true,
    inStock: true,
    weight: "35g",
    dimensions: "45cm",
  },
  {
    id: "6",
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
  { name: "Croix d'Agadez", slug: "croix" },
  { name: "Bracelets", slug: "bracelets" },
  { name: "Colliers", slug: "colliers" },
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
