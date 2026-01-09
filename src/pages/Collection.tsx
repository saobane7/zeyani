import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { products, categories, formatPrice, getProductsByCategory } from "@/data/products";
import { useCart } from "@/contexts/CartContext";

const Collection = () => {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState("tous");
  const [showFilters, setShowFilters] = useState(false);
  const filteredProducts = getProductsByCategory(activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-20">
        {/* Hero Banner */}
        <section className="bg-primary py-12 sm:py-16 lg:py-24">
          <motion.div 
            className="container mx-auto px-4 lg:px-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="gold-line w-16 mx-auto mb-4 sm:mb-6" />
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-cream mb-3 sm:mb-4">
              Notre <span className="text-gradient-gold font-semibold">Collection</span>
            </h1>
            <p className="text-cream/80 max-w-2xl mx-auto text-base sm:text-lg px-4">
              Découvrez nos créations artisanales authentiques, 
              façonnées par les maîtres artisans Touaregs du Niger.
            </p>
          </motion.div>
        </section>

        {/* Filters & Products */}
        <section className="py-8 sm:py-12 lg:py-20">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Mobile Filter Toggle */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <span className="text-sm text-muted-foreground">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtres
              </Button>
            </div>

            {/* Category Filters */}
            <motion.div 
              className={`flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 lg:mb-12 ${
                showFilters ? 'block' : 'hidden lg:flex'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Filter className="h-5 w-5 text-muted-foreground mr-2 hidden lg:block" />
              {categories.map((category) => (
                <Button
                  key={category.slug}
                  variant={activeCategory === category.slug ? "gold" : "outline"}
                  size="sm"
                  onClick={() => {
                    setActiveCategory(category.slug);
                    setShowFilters(false);
                  }}
                  className="rounded-full text-xs sm:text-sm"
                >
                  {category.name}
                </Button>
              ))}
            </motion.div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="group bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-card transition-all duration-500"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  {/* Image Container */}
                  <Link to={`/produit/${product.slug}`} className="block relative aspect-square overflow-hidden bg-secondary">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-col gap-1 sm:gap-2">
                      {product.isNew && (
                        <span className="bg-gold text-primary-foreground px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wide">
                          Nouveau
                        </span>
                      )}
                      {product.originalPrice && (
                        <span className="bg-primary text-primary-foreground px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wide">
                          -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>

                    {/* Quick actions - Desktop only */}
                    <div className="absolute top-4 right-4 flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden lg:flex">
                      <Button variant="secondary" size="icon" className="rounded-full shadow-soft h-10 w-10">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Link to={`/produit/${product.slug}`}>
                        <Button variant="secondary" size="icon" className="rounded-full shadow-soft h-10 w-10">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>

                    {/* Add to cart overlay - Desktop */}
                    <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hidden lg:block">
                      <Button 
                        variant="gold" 
                        className="w-full rounded-full"
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product);
                        }}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Ajouter au panier
                      </Button>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-3 sm:p-4 lg:p-5">
                    <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest">
                      {product.material}
                    </span>
                    <Link to={`/produit/${product.slug}`}>
                      <h3 className="font-display text-sm sm:text-base lg:text-lg font-semibold text-foreground mt-1 sm:mt-2 mb-1 sm:mb-2 hover:text-gold-dark transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 hidden sm:block">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="text-sm sm:text-base lg:text-lg font-bold text-gold-dark">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[10px] sm:text-sm text-muted-foreground line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      {/* Mobile add button */}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="lg:hidden h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:bg-gold/10"
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-gold-dark" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <motion.div 
                className="text-center py-12 lg:py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-muted-foreground text-base lg:text-lg">
                  Aucun produit trouvé dans cette catégorie.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveCategory("tous")}
                >
                  Voir tous les produits
                </Button>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Collection;
