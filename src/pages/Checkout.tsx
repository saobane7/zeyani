import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PayPalButton from "@/components/PayPalButton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle2, ShieldCheck, Lock, Package } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice } = useCart();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSuccess = (id: string) => {
    setOrderId(id);
    setOrderSuccess(true);
    setPaymentError(null);
  };

  const handleError = (error: string) => {
    setPaymentError(error);
  };

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

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto text-center">
            <CheckCircle2 className="h-20 w-20 mx-auto text-green-600 mb-6" />
            <h1 className="text-3xl font-serif mb-4">Commande confirmée !</h1>
            <p className="text-muted-foreground mb-2">
              Merci pour votre commande.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Numéro de commande : <span className="font-mono font-medium">{orderId}</span>
            </p>
            <p className="text-muted-foreground mb-8">
              Vous recevrez un email de confirmation avec les détails de votre commande.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{totalPrice.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Livraison</span>
                <span className="text-green-600">Gratuite</span>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{totalPrice.toFixed(2)} €</span>
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
