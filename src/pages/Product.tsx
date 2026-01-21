import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Truck, Shield, RotateCcw, Minus, Plus, ChevronLeft, Check, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProduct, useProductsByCategory, formatPrice } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";

const Product = () => {
  const { addToCart } = useCart();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(slug || "");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  
  // Variantes
  const [selectedType, setSelectedType] = useState<"chain" | "bead">("chain");
  const [selectedColor, setSelectedColor] = useState<"dore" | "argente">("argente");

  // Reset selected image when variant changes
  useEffect(() => {
    setSelectedImage(0);
  }, [selectedType, selectedColor]);

  const { data: relatedProducts } = useProductsByCategory(product?.category?.toLowerCase() || "tous");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gold-dark" />
        </main>
        <Footer />
      </div>
    );
  }

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

  // Trouver la variante sélectionnée
  const selectedVariant = product.hasVariants && product.variants
    ? product.variants.find((v: any) => v.type === selectedType && v.color === selectedColor)
    : null;

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;

  // Construire la clé de variante pour chercher les images (format: "type-color")
  const variantKey = product.hasVariants ? `${selectedType}-${selectedColor}` : null;

  // Obtenir les images à afficher (variantes si disponibles, sinon images par défaut)
  const displayImages = variantKey && product.variantImages?.[variantKey]?.length 
    ? product.variantImages[variantKey]
    : product.images;

  // Collecter toutes les images de variantes pour les miniatures
  const allVariantImages = product.hasVariants && product.variantImages 
    ? Object.entries(product.variantImages).map(([key, images]) => {
        const [type, color] = key.split('-');
        return {
          key,
          type: type as 'chain' | 'bead',
          color: color as 'dore' | 'argente',
          image: images[0],
          label: `${type === 'chain' ? 'Chaîne' : 'Perles'} ${color === 'dore' ? 'Doré' : 'Argenté'}`
        };
      })
    : [];

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      price: currentPrice,
      name: selectedVariant 
        ? `${product.name} - ${selectedVariant.label}`
        : product.name,
    };
    addToCart(productToAdd, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const filteredRelatedProducts = relatedProducts
    ?.filter((p) => p.id !== product.id)
    .slice(0, 3) || [];

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
            <Link to={`/collection?category=${product.category.toLowerCase()}`} className="hover:text-foreground transition-colors">
              {product.category}
            </Link>
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
              {/* Image principale - depuis l'onglet Images */}
              <div className="aspect-square bg-secondary rounded-lg overflow-hidden">
                <motion.img
                  key={`main-${product.images[0]}`}
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {/* Miniatures - uniquement les images des variantes */}
              {allVariantImages.length > 0 && (
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
                  {allVariantImages.map((variant) => (
                    <button
                      key={variant.key}
                      onClick={() => {
                        setSelectedType(variant.type);
                        setSelectedColor(variant.color);
                        setSelectedImage(0);
                      }}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all relative group ${
                        variantKey === variant.key 
                          ? "border-gold ring-2 ring-gold/30" 
                          : "border-border hover:border-gold/50"
                      }`}
                      title={variant.label}
                    >
                      <img src={variant.image} alt={variant.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] sm:text-[10px] py-0.5 text-center truncate">
                        {variant.type === 'chain' ? 'Chaîne' : 'Perles'} {variant.color === 'dore' ? '🟡' : '⚪'}
                      </div>
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
                  {formatPrice(currentPrice)}
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

              {/* Variantes */}
              {product.hasVariants && product.variants && product.variants.length > 0 && (
                <div className="space-y-6 mb-6 sm:mb-8 p-4 sm:p-6 bg-sand-light rounded-xl">
                  {/* Type de chaîne */}
                  <div>
                    <h3 className="font-medium text-foreground mb-3 text-sm sm:text-base">Type de collier</h3>
                    <RadioGroup 
                      value={selectedType} 
                      onValueChange={(value) => setSelectedType(value as "chain" | "bead")}
                      className="flex flex-wrap gap-3"
                    >
                      <div className="flex items-center">
                        <RadioGroupItem value="chain" id="chain" className="peer sr-only" />
                        <Label 
                          htmlFor="chain" 
                          className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border-2 cursor-pointer transition-all text-sm sm:text-base ${
                            selectedType === "chain" 
                              ? "border-gold bg-gold/10 text-gold-dark" 
                              : "border-border hover:border-gold/50"
                          }`}
                        >
                          Chaîne - 23€
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="bead" id="bead" className="peer sr-only" />
                        <Label 
                          htmlFor="bead" 
                          className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border-2 cursor-pointer transition-all text-sm sm:text-base ${
                            selectedType === "bead" 
                              ? "border-gold bg-gold/10 text-gold-dark" 
                              : "border-border hover:border-gold/50"
                          }`}
                        >
                          Perles - 25€
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Couleur */}
                  <div>
                    <h3 className="font-medium text-foreground mb-3 text-sm sm:text-base">Couleur</h3>
                    <RadioGroup 
                      value={selectedColor} 
                      onValueChange={(value) => setSelectedColor(value as "dore" | "argente")}
                      className="flex flex-wrap gap-3"
                    >
                      <div className="flex items-center">
                        <RadioGroupItem value="argente" id="argente" className="peer sr-only" />
                        <Label 
                          htmlFor="argente" 
                          className={`flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border-2 cursor-pointer transition-all text-sm sm:text-base ${
                            selectedColor === "argente" 
                              ? "border-gold bg-gold/10 text-gold-dark" 
                              : "border-border hover:border-gold/50"
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 border border-gray-400" />
                          Argenté
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="dore" id="dore" className="peer sr-only" />
                        <Label 
                          htmlFor="dore" 
                          className={`flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border-2 cursor-pointer transition-all text-sm sm:text-base ${
                            selectedColor === "dore" 
                              ? "border-gold bg-gold/10 text-gold-dark" 
                              : "border-border hover:border-gold/50"
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border border-yellow-500" />
                          Doré
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Résumé de la sélection */}
                  {selectedVariant && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Votre sélection : <span className="font-medium text-foreground">{selectedVariant.label}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Details */}
              {!product.hasVariants && (
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
              )}

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
                      Ajouter au panier - {formatPrice(currentPrice * quantity)}
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
          {filteredRelatedProducts.length > 0 && (
            <section className="mt-12 lg:mt-20">
              <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground mb-6 lg:mb-8">
                Vous aimerez aussi
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {filteredRelatedProducts.map((item, index) => (
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
                        <p className="text-sm sm:text-base font-bold text-gold-dark">
                          {formatPrice(item.price)}
                        </p>
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
