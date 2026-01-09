import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { products, formatPrice } from "@/data/products";
import { useCart } from "@/contexts/CartContext";

const FeaturedProducts = () => {
  const { addToCart } = useCart();
  const featuredProducts = products.slice(0, 3);

  return (
    <section id="collection" className="py-16 lg:py-24 xl:py-32 bg-sand-light">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="gold-line w-16 mx-auto mb-6 lg:mb-8" />
          <span className="inline-block mb-4 text-gold-dark font-medium text-sm tracking-[0.25em] uppercase">
            Collection Exclusive
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-foreground mb-4 lg:mb-6">
            Nos <span className="text-gradient-gold font-semibold">Créations</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base lg:text-lg px-4">
            Chaque pièce est unique, façonnée par des artisans Touaregs 
            selon des techniques ancestrales transmises de génération en génération.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-12">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="group bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-card transition-all duration-500"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              {/* Image Container */}
              <Link to={`/produit/${product.slug}`} className="block relative aspect-square overflow-hidden bg-secondary">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Badges */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-gold text-primary-foreground px-2 sm:px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                      Nouveau
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="bg-primary text-primary-foreground px-2 sm:px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Quick actions - Desktop */}
                <div className="absolute top-4 right-4 flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex">
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
                <div className="absolute inset-x-3 sm:inset-x-4 bottom-3 sm:bottom-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <Button 
                    variant="gold" 
                    className="w-full rounded-full text-sm sm:text-base"
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
              <div className="p-4 sm:p-5 lg:p-6">
                <span className="text-xs text-muted-foreground uppercase tracking-widest">
                  {product.material}
                </span>
                <Link to={`/produit/${product.slug}`}>
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mt-2 mb-2 hover:text-gold-dark transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-muted-foreground text-sm mb-3 sm:mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-lg sm:text-xl font-bold text-gold-dark">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs sm:text-sm text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {/* Mobile quick add */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="sm:hidden h-10 w-10 rounded-full hover:bg-gold/10"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingBag className="h-5 w-5 text-gold-dark" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div 
          className="text-center mt-12 lg:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link to="/collection">
            <Button variant="tuareg" size="lg" className="px-8 sm:px-12 group">
              Voir Toute la Collection
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
