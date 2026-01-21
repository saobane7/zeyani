import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { data: productsCount } = useQuery({
    queryKey: ['admin-products-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: ordersData } = useQuery({
    queryKey: ['admin-orders-stats'],
    queryFn: async () => {
      const { data, count } = await supabase
        .from('orders')
        .select('total_amount, status', { count: 'exact' });
      
      const totalRevenue = data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const completedOrders = data?.filter(o => o.status === 'completed').length || 0;
      
      return { 
        count: count || 0, 
        totalRevenue,
        completedOrders 
      };
    },
  });

  const stats = [
    {
      title: 'Produits',
      value: productsCount || 0,
      icon: Package,
      description: 'Produits dans le catalogue',
    },
    {
      title: 'Commandes',
      value: ordersData?.count || 0,
      icon: ShoppingCart,
      description: 'Commandes totales',
    },
    {
      title: 'Revenus',
      value: `${(ordersData?.totalRevenue || 0).toFixed(2)} €`,
      icon: TrendingUp,
      description: 'Chiffre d\'affaires total',
    },
    {
      title: 'Complétées',
      value: ordersData?.completedOrders || 0,
      icon: Users,
      description: 'Commandes livrées',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Bienvenue dans votre espace d'administration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Link
              to="/admin/produits/nouveau"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <Package className="h-6 w-6 mb-2 text-primary" />
              <h3 className="font-medium">Ajouter un produit</h3>
              <p className="text-sm text-muted-foreground">
                Créer un nouveau produit
              </p>
            </Link>
            <Link
              to="/admin/commandes"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <ShoppingCart className="h-6 w-6 mb-2 text-primary" />
              <h3 className="font-medium">Voir les commandes</h3>
              <p className="text-sm text-muted-foreground">
                Gérer les commandes clients
              </p>
            </Link>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
