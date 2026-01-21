import { useEffect, useRef, useState, useCallback } from "react";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, CreditCard, AlertCircle } from "lucide-react";
import { ShippingInfo } from "@/pages/Checkout";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    paypal?: any;
  }
}

interface PayPalButtonProps {
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
  shippingOption: ShippingInfo;
}

const PayPalButton = ({ onSuccess, onError, disabled = false, shippingOption }: PayPalButtonProps) => {
  const { items, totalPrice, clearCart } = useCart();
  const paypalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [buttonsRendered, setButtonsRendered] = useState(false);
  const buttonsInstanceRef = useRef<any>(null);

  const finalTotal = totalPrice + shippingOption.price;

  // Load PayPal script
  const loadPayPalScript = useCallback(async () => {
    try {
      // Check if already loaded
      if (window.paypal) {
        console.log("PayPal SDK already loaded");
        setScriptLoaded(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setScriptError(null);

      // Fetch client ID from edge function
      console.log("Fetching PayPal client ID...");
      const { data, error } = await supabase.functions.invoke("get-paypal-client-id");
      
      if (error) {
        console.error("Edge function error:", error);
        throw new Error("Impossible de charger la configuration PayPal");
      }

      if (!data?.clientId) {
        console.error("No client ID returned:", data);
        throw new Error("Client ID PayPal non disponible");
      }

      console.log("PayPal client ID received, loading SDK...");

      // Remove any existing PayPal script
      const existingScript = document.querySelector('script[src*="paypal.com/sdk"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Create and load PayPal script
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${data.clientId}&currency=EUR&locale=fr_FR&intent=capture`;
      script.async = true;
      script.id = "paypal-sdk";
      
      script.onload = () => {
        console.log("PayPal SDK loaded successfully");
        setScriptLoaded(true);
        setIsLoading(false);
      };
      
      script.onerror = (e) => {
        console.error("PayPal script load error:", e);
        setScriptError("Erreur de chargement du SDK PayPal");
        setIsLoading(false);
      };

      document.body.appendChild(script);
    } catch (err: any) {
      console.error("PayPal initialization error:", err);
      setScriptError(err.message || "Erreur d'initialisation PayPal");
      setIsLoading(false);
    }
  }, []);

  // Initial script load
  useEffect(() => {
    loadPayPalScript();
  }, [loadPayPalScript]);

  // Render PayPal buttons
  useEffect(() => {
    if (!scriptLoaded || !window.paypal || !paypalRef.current || disabled) {
      return;
    }

    if (items.length === 0) {
      console.log("No items in cart, skipping PayPal render");
      return;
    }

    // Clear previous buttons
    if (paypalRef.current) {
      paypalRef.current.innerHTML = "";
    }
    setButtonsRendered(false);

    console.log("Rendering PayPal buttons for total:", finalTotal);

    try {
      buttonsInstanceRef.current = window.paypal.Buttons({
        style: {
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "paypal",
          height: 50,
          tagline: false,
        },
        fundingSource: undefined, // Allow all funding sources (PayPal + Cards)
        
        createOrder: async () => {
          console.log("Creating PayPal order...");
          
          try {
            // Build items for PayPal
            const purchaseItems = items.map((item) => ({
              name: item.product.name.substring(0, 127),
              quantity: String(item.quantity),
              unit_amount: {
                currency_code: "EUR",
                value: item.product.price.toFixed(2),
              },
            }));

            // Add shipping as a separate item if price > 0
            if (shippingOption.price > 0) {
              purchaseItems.push({
                name: `Livraison - ${shippingOption.label}`.substring(0, 127),
                quantity: "1",
                unit_amount: {
                  currency_code: "EUR",
                  value: shippingOption.price.toFixed(2),
                },
              });
            }

            // Calculate item total
            const itemTotal = items.reduce(
              (sum, item) => sum + item.product.price * item.quantity,
              0
            ) + shippingOption.price;

            const orderData = {
              intent: "CAPTURE",
              purchase_units: [{
                amount: {
                  currency_code: "EUR",
                  value: itemTotal.toFixed(2),
                  breakdown: {
                    item_total: {
                      currency_code: "EUR",
                      value: itemTotal.toFixed(2),
                    },
                  },
                },
                items: purchaseItems,
              }],
              application_context: {
                shipping_preference: "GET_FROM_FILE",
                user_action: "PAY_NOW",
                brand_name: "Niger Chic Designs",
              },
            };

            console.log("Order data:", JSON.stringify(orderData, null, 2));

            // Validate on backend
            const { data, error } = await supabase.functions.invoke("create-paypal-order", {
              body: {
                items: purchaseItems.map(item => ({
                  name: item.name,
                  quantity: parseInt(item.quantity),
                  unit_amount: { value: item.unit_amount.value },
                })),
                totalAmount: itemTotal,
              },
            });

            if (error) {
              console.error("Backend validation error:", error);
              throw new Error("Erreur de validation du panier");
            }

            if (!data?.success) {
              console.error("Backend validation failed:", data);
              throw new Error(data?.error || "Erreur de validation");
            }

            console.log("Backend validated, creating PayPal order...");
            
            // Return order data for PayPal SDK to create the order
            return data.orderData;
          } catch (err: any) {
            console.error("Create order error:", err);
            toast.error(err.message || "Erreur lors de la création de la commande");
            throw err;
          }
        },

        onApprove: async (data: any, actions: any) => {
          console.log("Payment approved, capturing order...", data);
          
          try {
            // Capture the payment
            const orderDetails = await actions.order.capture();
            console.log("Order captured successfully:", orderDetails);

            // Store order in database
            const { error: captureError } = await supabase.functions.invoke("capture-paypal-order", {
              body: {
                orderId: orderDetails.id,
                payerDetails: orderDetails.payer,
                items: items.map((item) => ({
                  productId: item.product.id,
                  name: item.product.name,
                  quantity: item.quantity,
                  price: item.product.price,
                })),
                shipping: {
                  type: shippingOption.type,
                  label: shippingOption.label,
                  price: shippingOption.price,
                },
                totalAmount: finalTotal,
                shippingAddress: orderDetails.purchase_units?.[0]?.shipping?.address,
              },
            });

            if (captureError) {
              console.error("Order storage error:", captureError);
              // Don't fail - payment was successful
            }

            // Clear cart and notify success
            clearCart();
            toast.success("Paiement réussi ! Merci pour votre commande.");
            onSuccess(orderDetails.id);
          } catch (err: any) {
            console.error("Capture error:", err);
            onError("Erreur lors de la finalisation du paiement. Veuillez contacter le support.");
          }
        },

        onError: (err: any) => {
          console.error("PayPal SDK error:", err);
          
          // Provide more specific error messages
          let errorMessage = "Une erreur est survenue avec PayPal.";
          
          if (err?.message?.includes("popup")) {
            errorMessage = "La fenêtre de paiement a été bloquée. Veuillez autoriser les popups.";
          } else if (err?.message?.includes("network")) {
            errorMessage = "Erreur de connexion. Vérifiez votre connexion internet.";
          }
          
          toast.error(errorMessage);
          onError(errorMessage);
        },

        onCancel: () => {
          console.log("Payment cancelled by user");
          toast.info("Paiement annulé. Vous pouvez réessayer quand vous le souhaitez.");
        },
      });

      buttonsInstanceRef.current.render(paypalRef.current)
        .then(() => {
          console.log("PayPal buttons rendered successfully");
          setButtonsRendered(true);
        })
        .catch((err: any) => {
          console.error("PayPal render error:", err);
          setScriptError("Erreur d'affichage des boutons de paiement");
        });
    } catch (err: any) {
      console.error("PayPal buttons error:", err);
      setScriptError("Erreur d'initialisation du paiement");
    }

    return () => {
      if (buttonsInstanceRef.current?.close) {
        buttonsInstanceRef.current.close();
      }
    };
  }, [scriptLoaded, items, finalTotal, disabled, clearCart, onSuccess, onError, shippingOption]);

  // Retry button
  const handleRetry = () => {
    setScriptError(null);
    setScriptLoaded(false);
    setIsLoading(true);
    
    // Remove existing PayPal SDK
    const existingScript = document.getElementById("paypal-sdk");
    if (existingScript) {
      existingScript.remove();
    }
    delete window.paypal;
    
    loadPayPalScript();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Chargement des options de paiement...</p>
      </div>
    );
  }

  // Error state
  if (scriptError) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center">
          <p className="font-medium text-destructive">{scriptError}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Veuillez réessayer ou actualiser la page.
          </p>
        </div>
        <Button onClick={handleRetry} variant="outline">
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* PayPal / Cards buttons container */}
      <div 
        ref={paypalRef} 
        className={`min-h-[120px] ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      />
      
      {/* Payment methods info */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <CreditCard className="h-4 w-4" />
        <span>PayPal, Visa, Mastercard, American Express</span>
      </div>
    </div>
  );
};

export default PayPalButton;
