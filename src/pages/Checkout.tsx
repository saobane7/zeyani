import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PayPalButton from "@/components/PayPalButton";
import OrderReceipt from "@/components/OrderReceipt";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, ShieldCheck, Lock, Package, Truck, MapPin, Building2, Gift, LogIn, Loader2, FileText, History } from "lucide-react";

export type ShippingOption = "free" | "locker" | "relay" | "home";

export interface ShippingInfo {
  type: ShippingOption;
  label: string;
  price: number;
}

export const SHIPPING_OPTIONS: Record<ShippingOption, ShippingInfo> = {
  free: { type: "free", label: "Livraison gratuite", price: 0 },
  locker: { type: "locker", label: "Locker Mondial Relay", price: 3.99 },
  relay: { type: "relay", label: "Point Relais Mondial Relay", price: 4.99 },
  home: { type: "home", label: "Livraison à domicile", price: 5.99 },
};

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption>("free");
  const [orderDate, setOrderDate] = useState<Date>(new Date());
  
  // Store order items for the receipt (since cart will be cleared)
  const [orderItems, setOrderItems] = useState<Array<{
    name: string;
    quantity: number;
    price: number;
  }>>([]);
  const [orderSubtotal, setOrderSubtotal] = useState(0);
  const [orderShipping, setOrderShipping] = useState(SHIPPING_OPTIONS.free);

  const shippingPrice = SHIPPING_OPTIONS[selectedShipping].price;
  const finalTotal = totalPrice + shippingPrice;

  const handleSuccess = (id: string) => {
    // Store order details before clearing cart
    setOrderItems(items.map(item => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    })));
    setOrderSubtotal(totalPrice);
    setOrderShipping(SHIPPING_OPTIONS[selectedShipping]);
    setOrderDate(new Date());
    
    setOrderId(id);
    setOrderSuccess(true);
    setPaymentError(null);
  };

  const handleError = (error: string) => {
    setPaymentError(error);
  };

  // Afficher un loader pendant le chargement de l'auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto text-center">
            <LogIn className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-serif mb-4">Connexion requise</h1>
            <p className="text-muted-foreground mb-6">
              Veuillez vous connecter ou créer un compte pour finaliser votre commande.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/auth?redirect=/checkout">
                  Se connecter
                </Link>
              </Button>
              <Button variant="outline" onClick={() => navigate("/collection")}>
                Continuer mes achats
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-serif mb-4">Votre panier est vide</h1>
            <p className="text-muted-foreground mb-6">
              Ajoutez des articles à votre panier pour procéder au paiement.
            </p>
            <Button onClick={() => navigate("/collection")}>
              Découvrir la collection
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (orderSuccess && orderId) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 lg:py-12">
          <div className="max-w-2xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8">
              <CheckCircle2 className="h-16 w-16 mx-auto text-green-600 mb-4" />
              <h1 className="text-3xl font-serif mb-2">Commande confirmée !</h1>
              <p className="text-muted-foreground">
                Merci pour votre confiance. Votre commande a été enregistrée avec succès.
              </p>
            </div>

            {/* Important Notice */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Téléchargez votre reçu
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Conservez ce reçu pour vos dossiers. Il contient toutes les informations 
                    relatives à votre commande.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Receipt Component */}
            <OrderReceipt
              orderId={orderId}
              items={orderItems}
              shipping={orderShipping}
              subtotal={orderSubtotal}
              total={orderSubtotal + orderShipping.price}
              date={orderDate}
            />

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button onClick={() => navigate("/orders")} variant="outline">
                <History className="h-4 w-4 mr-2" />
                Voir mes commandes
              </Button>
              <Button onClick={() => navigate("/")}>
                Retour à l'accueil
              </Button>
              <Button variant="outline" onClick={() => navigate("/collection")}>
                Continuer mes achats
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 lg:py-12">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Order Summary */}
          <div className="order-2 lg:order-1">
            <h1 className="text-2xl font-serif mb-6">Récapitulatif de commande</h1>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Quantité : {item.quantity}
                    </p>
                    <p className="font-medium">
                      {(item.product.price * item.quantity).toFixed(2)} €
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            {/* Shipping Options */}
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Mode de livraison
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Livraison via Mondial Relay
              </p>
              
              <RadioGroup
                value={selectedShipping}
                onValueChange={(value) => setSelectedShipping(value as ShippingOption)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 border-2 border-green-500 bg-green-50 dark:bg-green-950/30 rounded-lg p-4 cursor-pointer hover:bg-green-100 dark:hover:bg-green-950/50 transition-colors">
                  <RadioGroupItem value="free" id="free" />
                  <Label htmlFor="free" className="flex-1 cursor-pointer flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Gift className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-700 dark:text-green-400">Livraison gratuite</p>
                        <p className="text-sm text-green-600 dark:text-green-500">Délai standard de livraison</p>
                      </div>
                    </div>
                    <span className="font-semibold text-green-700 dark:text-green-400">Gratuit</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="locker" id="locker" />
                  <Label htmlFor="locker" className="flex-1 cursor-pointer flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Locker Mondial Relay</p>
                        <p className="text-sm text-muted-foreground">Retrait 24h/24 en consigne automatique</p>
                      </div>
                    </div>
                    <span className="font-semibold">3,99 €</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="relay" id="relay" />
                  <Label htmlFor="relay" className="flex-1 cursor-pointer flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Point Relais Mondial Relay</p>
                        <p className="text-sm text-muted-foreground">Retrait chez un commerçant partenaire</p>
                      </div>
                    </div>
                    <span className="font-semibold">4,99 €</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="home" id="home" />
                  <Label htmlFor="home" className="flex-1 cursor-pointer flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Livraison à domicile</p>
                        <p className="text-sm text-muted-foreground">Réception directement chez vous</p>
                      </div>
                    </div>
                    <span className="font-semibold">5,99 €</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Separator className="my-6" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{totalPrice.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Livraison ({SHIPPING_OPTIONS[selectedShipping].label})</span>
                <span>{shippingPrice.toFixed(2)} €</span>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{finalTotal.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="order-1 lg:order-2">
            <div className="bg-card rounded-lg p-6 border">
              <h2 className="text-xl font-serif mb-6">Paiement sécurisé</h2>

              {/* Security badges */}
              <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Lock className="h-4 w-4" />
                  <span>SSL sécurisé</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Protection acheteur</span>
                </div>
              </div>

              {paymentError && (
                <div className="bg-destructive/10 text-destructive rounded-md p-4 mb-6">
                  <p className="text-sm">{paymentError}</p>
                </div>
              )}

              <PayPalButton
                onSuccess={handleSuccess}
                onError={handleError}
                disabled={items.length === 0}
                shippingOption={SHIPPING_OPTIONS[selectedShipping]}
              />

              <p className="text-xs text-muted-foreground mt-6 text-center">
                En procédant au paiement, vous acceptez nos{" "}
                <a href="/cgv" className="underline hover:text-foreground">
                  conditions générales de vente
                </a>
                .
              </p>

              {/* RGPD Notice */}
              <div className="mt-6 p-4 bg-muted/50 rounded-md">
                <p className="text-xs text-muted-foreground">
                  <strong>Protection des données :</strong> Vos données de paiement sont traitées 
                  directement par PayPal. Nous ne stockons que les informations essentielles à 
                  la gestion de votre commande, conformément au RGPD.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
