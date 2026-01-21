import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Calendar, CreditCard, Download } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  paypal_order_id: string;
  status: string;
  total_amount: number;
  currency: string;
  items: unknown;
  created_at: string;
  received_at: string | null;
  shipping_address: {
    method?: {
      type: string;
      label: string;
      price: number;
    };
  } | null;
}

const parseItems = (items: unknown): OrderItem[] => {
  if (Array.isArray(items)) {
    return items as OrderItem[];
  }
  return [];
};

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
      } else {
        setOrders((data as Order[]) || []);
      }
      setLoading(false);
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { text: string; color: string }> = {
      pending: { text: "En attente", color: "bg-yellow-100 text-yellow-800" },
      completed: { text: "Payée", color: "bg-green-100 text-green-800" },
      shipped: { text: "Expédiée", color: "bg-blue-100 text-blue-800" },
      delivered: { text: "Livrée", color: "bg-purple-100 text-purple-800" },
      cancelled: { text: "Annulée", color: "bg-red-100 text-red-800" },
    };
    return labels[status] || { text: status, color: "bg-gray-100 text-gray-800" };
  };

  const handleDownloadReceipt = (order: Order) => {
    const items = parseItems(order.items);
    const shippingMethod = order.shipping_address?.method || { type: "free", label: "Livraison gratuite", price: 0 };
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Veuillez autoriser les popups pour télécharger le reçu.");
      return;
    }

    const styles = `
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          padding: 40px; 
          max-width: 800px; 
          margin: 0 auto;
          color: #1a1a1a;
        }
        .header { 
          text-align: center; 
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #d4af37;
        }
        .logo { 
          font-size: 28px; 
          font-weight: bold; 
          color: #d4af37;
          font-family: 'Playfair Display', serif;
          margin-bottom: 8px;
        }
        .subtitle { 
          color: #666; 
          font-size: 14px;
        }
        .receipt-title {
          font-size: 24px;
          margin: 30px 0 20px;
          color: #1a1a1a;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        .info-box {
          background: #f9f9f9;
          padding: 15px;
          border-radius: 8px;
        }
        .info-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .info-value {
          font-size: 14px;
          font-weight: 500;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .items-table th {
          text-align: left;
          padding: 12px 0;
          border-bottom: 2px solid #e5e5e5;
          font-size: 12px;
          text-transform: uppercase;
          color: #666;
        }
        .items-table td {
          padding: 15px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .items-table .name { font-weight: 500; }
        .items-table .qty { text-align: center; color: #666; }
        .items-table .price { text-align: right; }
        .totals {
          margin-top: 20px;
          padding-top: 20px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
        }
        .total-row.final {
          font-size: 18px;
          font-weight: bold;
          padding-top: 15px;
          margin-top: 10px;
          border-top: 2px solid #d4af37;
        }
        .footer {
          margin-top: 50px;
          padding-top: 30px;
          border-top: 1px solid #e5e5e5;
          text-align: center;
          color: #888;
          font-size: 12px;
        }
        .footer p { margin: 5px 0; }
        .legal {
          margin-top: 30px;
          padding: 15px;
          background: #f9f9f9;
          border-radius: 8px;
          font-size: 11px;
          color: #666;
        }
        @media print {
          body { padding: 20px; }
        }
      </style>
    `;

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reçu - Niger Chic Designs - ${order.paypal_order_id}</title>
          <meta charset="utf-8">
          ${styles}
        </head>
        <body>
          <div class="header">
            <div class="logo">Niger Chic Designs</div>
            <div class="subtitle">Bijoux artisanaux touaregs</div>
          </div>

          <h1 class="receipt-title">Reçu de commande</h1>

          <div class="info-grid">
            <div class="info-box">
              <div class="info-label">Numéro de commande</div>
              <div class="info-value">${order.paypal_order_id}</div>
            </div>
            <div class="info-box">
              <div class="info-label">Date de commande</div>
              <div class="info-value">${format(new Date(order.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}</div>
            </div>
            <div class="info-box">
              <div class="info-label">Mode de paiement</div>
              <div class="info-value">PayPal</div>
            </div>
            <div class="info-box">
              <div class="info-label">Livraison</div>
              <div class="info-value">${shippingMethod.label}</div>
            </div>
          </div>

          <h2 style="font-size: 16px; margin: 30px 0 15px; color: #666;">Articles commandés</h2>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>Article</th>
                <th style="text-align: center;">Qté</th>
                <th style="text-align: right;">Prix unitaire</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td class="name">${item.name}</td>
                  <td class="qty">${item.quantity}</td>
                  <td class="price">${item.price.toFixed(2)} €</td>
                  <td class="price">${(item.price * item.quantity).toFixed(2)} €</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>Sous-total (${totalItems} article${totalItems > 1 ? "s" : ""})</span>
              <span>${subtotal.toFixed(2)} €</span>
            </div>
            <div class="total-row">
              <span>Frais de livraison (${shippingMethod.label})</span>
              <span>${shippingMethod.price === 0 ? "Gratuit" : shippingMethod.price.toFixed(2) + " €"}</span>
            </div>
            <div class="total-row final">
              <span>TOTAL TTC</span>
              <span>${order.total_amount.toFixed(2)} €</span>
            </div>
          </div>

          <div class="legal">
            <p><strong>Informations légales</strong></p>
            <p>Ce reçu fait foi de votre achat auprès de Niger Chic Designs.</p>
            <p>Conformément au RGPD, vos données personnelles sont conservées pendant 3 ans après réception de votre commande.</p>
            <p>Pour toute question concernant votre commande, contactez-nous via notre formulaire de contact.</p>
          </div>

          <div class="footer">
            <p><strong>Niger Chic Designs</strong></p>
            <p>Bijoux artisanaux touaregs - Fait main au Niger</p>
            <p>www.niger-chic-designs.lovable.app</p>
            <p style="margin-top: 15px;">Merci pour votre confiance !</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <h1 className="font-playfair text-3xl font-bold text-foreground mb-8">
          Mes commandes
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium text-foreground mb-2">
              Aucune commande
            </h2>
            <p className="text-muted-foreground mb-6">
              Vous n'avez pas encore passé de commande.
            </p>
            <Button onClick={() => navigate("/collection")}>
              Découvrir nos bijoux
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = getStatusLabel(order.status);
              return (
                <div
                  key={order.id}
                  className="bg-card rounded-lg border p-6 space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(order.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Réf: {order.paypal_order_id}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                      {status.text}
                    </span>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    {parseItems(order.items).map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                        </span>
                        <span>{(item.price * item.quantity).toFixed(2)} €</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      PayPal
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadReceipt(order)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger le reçu
                      </Button>
                      <p className="text-lg font-semibold">
                        Total: {order.total_amount.toFixed(2)} {order.currency}
                      </p>
                    </div>
                  </div>

                  {order.received_at && (
                    <p className="text-xs text-muted-foreground border-t pt-4">
                      Livrée le {format(new Date(order.received_at), "d MMMM yyyy", { locale: fr })}
                      <br />
                      <span className="text-xs">
                        (Données conservées jusqu'au {format(new Date(new Date(order.received_at).getTime() + 3 * 365 * 24 * 60 * 60 * 1000), "d MMMM yyyy", { locale: fr })} - RGPD)
                      </span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
          <p>
            <strong>Information RGPD :</strong> Vos données de commande sont conservées pendant 
            3 ans après réception de votre commande, conformément aux obligations légales. 
            Après ce délai, elles sont automatiquement supprimées.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderHistory;
