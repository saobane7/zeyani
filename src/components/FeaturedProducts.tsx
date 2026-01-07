import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import braceletImg from "@/assets/bracelet-1.jpg";
import necklaceImg from "@/assets/necklace-1.jpg";
import ringImg from "@/assets/ring-1.jpg";

const products = [
  {
    id: 1,
    name: "Bracelet Agadez",
    price: 85000,
    originalPrice: 95000,
    image: braceletImg,
    category: "Bracelets",
    isNew: true,
  },
  {
    id: 2,
    name: "Collier Tenere",
    price: 120000,
    image: necklaceImg,
    category: "Colliers",
    isNew: false,
  },
  {
    id: 3,
    name: "Bague Touareg",
    price: 45000,
    image: ringImg,
    category: "Bagues",
    isNew: true,
  },
  {
    id: 4,
    name: "Manchette Sahara",
    price: 110000,
    originalPrice: 130000,
    image: braceletImg,
    category: "Bracelets",
    isNew: false,
  },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fr-NE", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(price);
};

const FeaturedProducts = () => {
  return (
    <section className="py-20 lg:py-32 bg-secondary/50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block mb-4 text-accent font-medium text-sm tracking-widest uppercase">
            Sélection
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Produits Vedettes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Les pièces les plus prisées de notre collection, 
            choisies pour leur beauté exceptionnelle.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      Nouveau
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      Promo
                    </span>
                  )}
                </div>

                {/* Quick actions */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button variant="secondary" size="icon" className="rounded-full shadow-soft">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                {/* Add to cart overlay */}
                <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <Button variant="gold" className="w-full rounded-full">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Ajouter au panier
                  </Button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  {product.category}
                </span>
                <h3 className="font-display text-lg font-semibold text-foreground mt-1 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-accent">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="terracotta" size="lg">
            Voir Tous les Produits
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
