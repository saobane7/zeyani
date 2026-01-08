import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Truck, Shield, RotateCcw, Minus, Plus, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProductBySlug, products, formatPrice } from "@/data/products";

const Product = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = getProductBySlug(slug || "");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

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

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Accueil</Link>
            <span>/</span>
            <Link to="/collection" className="hover:text-foreground transition-colors">Collection</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          {/* Back button on mobile */}
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 lg:hidden"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour
          </Button>

          {/* Product Details */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-secondary rounded-lg overflow-hidden">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === idx ? "border-gold" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <span className="text-sm text-gold-dark font-medium uppercase tracking-widest">
                {product.category}
              </span>
              <h1 className="font-display text-3xl lg:text-4xl font-semibold text-foreground mt-2 mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-3xl font-bold text-gold-dark">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.longDescription}
              </p>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                <div className="bg-sand-light rounded-lg p-4">
                  <span className="text-muted-foreground">Matériau</span>
                  <p className="font-semibold text-foreground">{product.material}</p>
                </div>
                {product.weight && (
                  <div className="bg-sand-light rounded-lg p-4">
                    <span className="text-muted-foreground">Poids</span>
                    <p className="font-semibold text-foreground">{product.weight}</p>
                  </div>
                )}
                {product.dimensions && (
                  <div className="bg-sand-light rounded-lg p-4 col-span-2">
                    <span className="text-muted-foreground">Dimensions</span>
                    <p className="font-semibold text-foreground">{product.dimensions}</p>
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium">Quantité:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <Button variant="gold" size="lg" className="flex-1">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Ajouter au panier
                </Button>
                <Button variant="outline" size="lg" className="px-4">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
                <div className="text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-gold-dark" />
                  <p className="text-xs text-muted-foreground">Livraison gratuite<br />dès 100€</p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-gold-dark" />
                  <p className="text-xs text-muted-foreground">Paiement<br />sécurisé</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-6 w-6 mx-auto mb-2 text-gold-dark" />
                  <p className="text-xs text-muted-foreground">Retour sous<br />30 jours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-20">
              <h2 className="font-display text-2xl lg:text-3xl font-semibold text-foreground mb-8">
                Vous aimerez aussi
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((item) => (
                  <Link
                    key={item.id}
                    to={`/produit/${item.slug}`}
                    className="group bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-card transition-all duration-300"
                  >
                    <div className="aspect-square bg-secondary overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                        {item.name}
                      </h3>
                      <p className="text-gold-dark font-bold">{formatPrice(item.price)}</p>
                    </div>
                  </Link>
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
