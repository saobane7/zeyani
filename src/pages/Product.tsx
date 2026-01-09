import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Truck, Shield, RotateCcw, Minus, Plus, ChevronLeft, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProductBySlug, products, formatPrice } from "@/data/products";
import { useCart } from "@/contexts/CartContext";

const Product = () => {
  const { addToCart } = useCart();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = getProductBySlug(slug || "");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-3xl mb-4">Produit non trouvé</h1>
            <p className="text-muted-foreground mb-8">
              Ce produit n'existe pas ou a été retiré de notre catalogue.
            </p>
            <Button variant="gold" onClick={() => navigate("/collection")}>
              Retour à la collection
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 lg:pt-24 pb-12 lg:pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Breadcrumb - Desktop */}
          <nav className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground mb-6 lg:mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Accueil</Link>
            <span>/</span>
            <Link to="/collection" className="hover:text-foreground transition-colors">Collection</Link>
            <span>/</span>
            <span className="text-foreground line-clamp-1">{product.name}</span>
          </nav>

          {/* Back button on mobile */}
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 sm:hidden"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour
          </Button>

          {/* Product Details */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 xl:gap-16">
            {/* Images */}
            <motion.div 
              className="space-y-3 sm:space-y-4"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="aspect-square bg-secondary rounded-lg overflow-hidden">
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === idx ? "border-gold" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="text-sm text-gold-dark font-medium uppercase tracking-widest">
                {product.category}
              </span>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground mt-2 mb-3 sm:mb-4">
                {product.name}
              </h1>

              {/* Rating placeholder */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(12 avis)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 sm:gap-4 mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl font-bold text-gold-dark">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg sm:text-xl text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
                {product.longDescription}
              </p>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 text-sm">
                <div className="bg-sand-light rounded-lg p-3 sm:p-4">
                  <span className="text-muted-foreground text-xs sm:text-sm">Matériau</span>
                  <p className="font-semibold text-foreground text-sm sm:text-base">{product.material}</p>
                </div>
                {product.weight && (
                  <div className="bg-sand-light rounded-lg p-3 sm:p-4">
                    <span className="text-muted-foreground text-xs sm:text-sm">Poids</span>
                    <p className="font-semibold text-foreground text-sm sm:text-base">{product.weight}</p>
                  </div>
                )}
                {product.dimensions && (
                  <div className="bg-sand-light rounded-lg p-3 sm:p-4 col-span-2">
                    <span className="text-muted-foreground text-xs sm:text-sm">Dimensions</span>
                    <p className="font-semibold text-foreground text-sm sm:text-base">{product.dimensions}</p>
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <span className="text-sm font-medium">Quantité:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-9 w-9 sm:h-10 sm:w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 sm:w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-9 w-9 sm:h-10 sm:w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8">
                <Button 
                  variant="gold" 
                  size="lg" 
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={isAdded}
                >
                  {isAdded ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Ajouté !
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Ajouter au panier
                    </>
                  )}
                </Button>
                <Button variant="outline" size="lg" className="px-3 sm:px-4">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 sm:pt-8 border-t border-border">
                <div className="text-center">
                  <Truck className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-gold-dark" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Livraison gratuite<br />dès 100€</p>
                </div>
                <div className="text-center">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-gold-dark" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Paiement<br />sécurisé</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-gold-dark" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Retour sous<br />30 jours</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-12 lg:mt-20">
              <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground mb-6 lg:mb-8">
                Vous aimerez aussi
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {relatedProducts.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Link
                      to={`/produit/${item.slug}`}
                      className="group block bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-card transition-all duration-300"
                    >
                      <div className="aspect-square bg-secondary overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="font-display text-sm sm:text-base lg:text-lg font-semibold text-foreground mb-1 line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-gold-dark font-bold text-sm sm:text-base">{formatPrice(item.price)}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Product;
