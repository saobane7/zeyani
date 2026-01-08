import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Eye, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { products, categories, formatPrice, getProductsByCategory } from "@/data/products";

const Collection = () => {
  const [activeCategory, setActiveCategory] = useState("tous");
  const filteredProducts = getProductsByCategory(activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Banner */}
        <section className="bg-primary py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <div className="gold-line w-16 mx-auto mb-6" />
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-cream mb-4">
              Notre <span className="text-gradient-gold font-semibold">Collection</span>
            </h1>
            <p className="text-cream/80 max-w-2xl mx-auto text-lg">
              Découvrez nos créations artisanales authentiques, 
              façonnées par les maîtres artisans Touaregs du Niger.
            </p>
          </div>
        </section>

        {/* Filters & Products */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Category Filters */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              <Filter className="h-5 w-5 text-muted-foreground mr-2" />
              {categories.map((category) => (
                <Button
                  key={category.slug}
                  variant={activeCategory === category.slug ? "gold" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category.slug)}
                  className="rounded-full"
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {filteredProducts.map((product) => (
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
                  <div className="p-5">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">
                      {product.material}
                    </span>
                    <Link to={`/produit/${product.slug}`}>
                      <h3 className="font-display text-lg font-semibold text-foreground mt-2 mb-2 hover:text-gold-dark transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gold-dark">
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

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  Aucun produit trouvé dans cette catégorie.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Collection;
