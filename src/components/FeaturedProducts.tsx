import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { products, formatPrice } from "@/data/products";

const FeaturedProducts = () => {
  const featuredProducts = products.slice(0, 3);

  return (
    <section id="collection" className="py-24 lg:py-32 bg-sand-light">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="gold-line w-16 mx-auto mb-8" />
          <span className="inline-block mb-4 text-gold-dark font-medium text-sm tracking-[0.25em] uppercase">
            Collection Exclusive
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-6">
            Nos <span className="text-gradient-gold font-semibold">Créations</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Chaque pièce est unique, façonnée par des artisans Touaregs 
            selon des techniques ancestrales transmises de génération en génération.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-card transition-all duration-500"
            >
              {/* Image Container */}
              <Link to={`/produit/${product.slug}`} className="block relative aspect-square overflow-hidden bg-secondary">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-gold text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                      Nouveau
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Quick actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button variant="secondary" size="icon" className="rounded-full shadow-soft h-10 w-10">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Link to={`/produit/${product.slug}`}>
                    <Button variant="secondary" size="icon" className="rounded-full shadow-soft h-10 w-10">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                {/* Add to cart overlay */}
                <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <Button variant="gold" className="w-full rounded-full">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Ajouter au panier
                  </Button>
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-6">
                <span className="text-xs text-muted-foreground uppercase tracking-widest">
                  {product.material}
                </span>
                <Link to={`/produit/${product.slug}`}>
                  <h3 className="font-display text-xl font-semibold text-foreground mt-2 mb-2 hover:text-gold-dark transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-muted-foreground text-sm mb-4">
                  {product.description}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-gold-dark">
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
        <div className="text-center mt-16">
          <Link to="/collection">
            <Button variant="tuareg" size="lg" className="px-12">
              Voir Toute la Collection
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
