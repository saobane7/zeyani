import { useEffect, useRef, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    paypal?: any;
  }
}

interface PayPalButtonProps {
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

const PayPalButton = ({ onSuccess, onError, disabled = false }: PayPalButtonProps) => {
  const { items, totalPrice, clearCart } = useCart();
  const paypalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const loadPayPalScript = async () => {
      // Check if already loaded
      if (window.paypal) {
        setScriptLoaded(true);
        setIsLoading(false);
        return;
      }

      // Fetch client ID from edge function
      const { data, error } = await supabase.functions.invoke("get-paypal-client-id");
      
      if (error || !data?.clientId) {
        console.error("Failed to get PayPal client ID:", error);
        onError("Configuration PayPal non disponible");
        setIsLoading(false);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${data.clientId}&currency=EUR&locale=fr_FR`;
      script.async = true;
      
      script.onload = () => {
        setScriptLoaded(true);
        setIsLoading(false);
      };
      
      script.onerror = () => {
        onError("Erreur de chargement PayPal");
        setIsLoading(false);
      };

      document.body.appendChild(script);
    };

    loadPayPalScript();
  }, [onError]);

  useEffect(() => {
    if (!scriptLoaded || !window.paypal || !paypalRef.current || disabled) return;

    // Clear previous buttons
    paypalRef.current.innerHTML = "";

    window.paypal.Buttons({
      style: {
        layout: "vertical",
        color: "gold",
        shape: "rect",
        label: "paypal",
        height: 45,
      },
      createOrder: async (_data: any, actions: any) => {
        try {
          // Validate order on backend first
          const { data, error } = await supabase.functions.invoke("create-paypal-order", {
            body: {
              items: items.map((item) => ({
                name: item.product.name,
                quantity: item.quantity,
                unit_amount: {
                  value: item.product.price.toString(),
                },
              })),
              totalAmount: totalPrice,
            },
          });

          if (error || !data?.success) {
            throw new Error(data?.error || "Erreur de validation");
          }

          // Create order via PayPal SDK actions
          return actions.order.create(data.orderData);
        } catch (err: any) {
          console.error("Create order error:", err);
          toast.error("Erreur lors de la création de la commande");
          throw err;
        }
      },
      onApprove: async (data: any, actions: any) => {
        try {
          // Capture the order
          const orderDetails = await actions.order.capture();
          
          // Store in backend
          const { error } = await supabase.functions.invoke("capture-paypal-order", {
            body: {
              orderId: orderDetails.id,
              payerDetails: orderDetails.payer,
              items: items.map((item) => ({
                productId: item.product.id,
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
              })),
              totalAmount: totalPrice,
              shippingAddress: orderDetails.purchase_units?.[0]?.shipping?.address,
            },
          });

          if (error) {
            console.error("Capture storage error:", error);
            // Don't fail - payment was successful
          }

          clearCart();
          onSuccess(orderDetails.id);
          toast.success("Paiement réussi !");
        } catch (err: any) {
          console.error("Capture error:", err);
          onError("Erreur lors de la finalisation du paiement");
        }
      },
      onError: (err: any) => {
        console.error("PayPal error:", err);
        onError("Une erreur est survenue avec PayPal");
      },
      onCancel: () => {
        toast.info("Paiement annulé");
      },
    }).render(paypalRef.current);
  }, [scriptLoaded, items, totalPrice, disabled, clearCart, onSuccess, onError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Chargement PayPal...</span>
      </div>
    );
  }

  return (
    <div 
      ref={paypalRef} 
      className={`min-h-[45px] ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    />
  );
};

export default PayPalButton;
