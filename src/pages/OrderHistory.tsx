import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Calendar, CreditCard } from "lucide-react";
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

                  <div className="border-t pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      PayPal
                    </div>
                    <p className="text-lg font-semibold">
                      Total: {order.total_amount.toFixed(2)} {order.currency}
                    </p>
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
