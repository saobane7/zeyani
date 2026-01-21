import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Loader2, Eye, Info, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  ORDER_STATUSES, 
  getStatusConfig, 
  OrderStatusTimeline, 
  StatusBadge 
} from '@/components/OrderStatusTimeline';

interface Order {
  id: string;
  paypal_order_id: string;
  status: string;
  total_amount: number;
  currency: string;
  payer_email: string | null;
  items: any[];
  shipping_address: any;
  created_at: string;
  received_at: string | null;
}

const AdminOrders = () => {
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusChangeDialog, setStatusChangeDialog] = useState<{
    order: Order;
    newStatus: string;
  } | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updateData: any = { status };
      
      if (status === 'completed') {
        updateData.received_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      const statusConfig = getStatusConfig(variables.status);
      toast.success(`Statut mis à jour: ${statusConfig.label}`);
      setStatusChangeDialog(null);
    },
    onError: (error) => {
      console.error('Error updating status:', error);
      toast.error('Erreur lors de la mise à jour');
    },
  });

  const handleStatusChange = (order: Order, newStatus: string) => {
    if (order.status === newStatus) return;
    setStatusChangeDialog({ order, newStatus });
  };

  const confirmStatusChange = () => {
    if (statusChangeDialog) {
      updateStatusMutation.mutate({
        id: statusChangeDialog.order.id,
        status: statusChangeDialog.newStatus,
      });
    }
  };

  const filteredOrders = orders?.filter(
    (order) =>
      order.paypal_order_id.toLowerCase().includes(search.toLowerCase()) ||
      order.payer_email?.toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const stats = {
    pending: orders?.filter((o) => o.status === 'pending').length || 0,
    paid: orders?.filter((o) => o.status === 'paid').length || 0,
    processing: orders?.filter((o) => o.status === 'processing').length || 0,
    shipped: orders?.filter((o) => o.status === 'shipped').length || 0,
    completed: orders?.filter((o) => o.status === 'completed').length || 0,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Commandes</h1>
            <p className="text-muted-foreground">Gérez et suivez les commandes clients</p>
          </div>
          <Button variant="outline" onClick={() => setShowGuide(true)}>
            <Info className="h-4 w-4 mr-2" />
            Guide d'utilisation
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { key: 'paid', label: 'À traiter', count: stats.paid },
            { key: 'processing', label: 'En préparation', count: stats.processing },
            { key: 'shipped', label: 'Expédiées', count: stats.shipped },
            { key: 'completed', label: 'Livrées', count: stats.completed },
            { key: 'pending', label: 'En attente', count: stats.pending },
          ].map((stat) => {
            const config = getStatusConfig(stat.key);
            return (
              <Card key={stat.key} className={`${config.bgColor} border-${config.borderColor}`}>
                <CardHeader className="pb-2">
                  <CardDescription className={config.color}>{stat.label}</CardDescription>
                  <CardTitle className={`text-2xl ${config.color}`}>{stat.count}</CardTitle>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par ID ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Commande</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut actuel</TableHead>
                  <TableHead>Changer le statut</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      Aucune commande trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders?.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <p className="font-mono text-sm">{order.paypal_order_id.slice(0, 15)}...</p>
                      </TableCell>
                      <TableCell>{order.payer_email || 'N/A'}</TableCell>
                      <TableCell>
                        {format(new Date(order.created_at), 'dd MMM yyyy', { locale: fr })}
                      </TableCell>
                      <TableCell>
                        {order.total_amount.toFixed(2)} {order.currency}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order, value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUSES.map((status) => {
                              const Icon = status.icon;
                              return (
                                <SelectItem key={status.value} value={status.value}>
                                  <div className="flex items-center gap-2">
                                    <Icon className={`h-4 w-4 ${status.color}`} />
                                    {status.label}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la commande</DialogTitle>
            <DialogDescription>
              {selectedOrder?.paypal_order_id}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Timeline */}
              <div className="border rounded-lg p-4 bg-muted/30">
                <h4 className="font-medium mb-4 text-center">Progression de la commande</h4>
                <OrderStatusTimeline currentStatus={selectedOrder.status} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Informations</h4>
                  <dl className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Email:</dt>
                      <dd>{selectedOrder.payer_email || 'N/A'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Date:</dt>
                      <dd>
                        {format(new Date(selectedOrder.created_at), 'dd/MM/yyyy HH:mm', {
                          locale: fr,
                        })}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Statut:</dt>
                      <dd><StatusBadge status={selectedOrder.status} size="sm" /></dd>
                    </div>
                    {selectedOrder.received_at && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Livrée le:</dt>
                        <dd>
                          {format(new Date(selectedOrder.received_at), 'dd/MM/yyyy', {
                            locale: fr,
                          })}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                {selectedOrder.shipping_address && (
                  <div>
                    <h4 className="font-medium mb-2">Adresse de livraison</h4>
                    <address className="text-sm not-italic text-muted-foreground">
                      {selectedOrder.shipping_address.full_name}
                      <br />
                      {selectedOrder.shipping_address.address_line_1}
                      {selectedOrder.shipping_address.address_line_2 && (
                        <>
                          <br />
                          {selectedOrder.shipping_address.address_line_2}
                        </>
                      )}
                      <br />
                      {selectedOrder.shipping_address.postal_code}{' '}
                      {selectedOrder.shipping_address.admin_area_2}
                      <br />
                      {selectedOrder.shipping_address.country_code}
                    </address>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-medium mb-2">Articles</h4>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produit</TableHead>
                        <TableHead>Quantité</TableHead>
                        <TableHead className="text-right">Prix</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-10 rounded object-cover"
                                />
                              )}
                              <div>
                                <p className="font-medium">{item.name}</p>
                                {item.variant && (
                                  <p className="text-xs text-muted-foreground">
                                    {item.variant}
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            {item.price.toFixed(2)} €
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end mt-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-xl font-bold">
                      {selectedOrder.total_amount.toFixed(2)} {selectedOrder.currency}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Status Change */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Modifier le statut</h4>
                <div className="flex flex-wrap gap-2">
                  {ORDER_STATUSES.filter(s => s.value !== selectedOrder.status).map((status) => {
                    const Icon = status.icon;
                    return (
                      <Button
                        key={status.value}
                        variant="outline"
                        size="sm"
                        className={`${status.bgColor} ${status.color} hover:opacity-80`}
                        onClick={() => handleStatusChange(selectedOrder, status.value)}
                      >
                        <Icon className="h-4 w-4 mr-1" />
                        {status.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Change Confirmation */}
      <AlertDialog 
        open={!!statusChangeDialog} 
        onOpenChange={() => setStatusChangeDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer le changement de statut</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p>Voulez-vous vraiment changer le statut de cette commande ?</p>
                {statusChangeDialog && (
                  <div className="flex items-center justify-center gap-4 py-4">
                    <StatusBadge status={statusChangeDialog.order.status} size="lg" />
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    <StatusBadge status={statusChangeDialog.newStatus} size="lg" />
                  </div>
                )}
                {statusChangeDialog?.newStatus === 'completed' && (
                  <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                    ⚠️ Marquer comme "Livrée" déclenchera le compte à rebours RGPD de 3 ans 
                    pour la conservation des données.
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmStatusChange}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Usage Guide Dialog */}
      <Dialog open={showGuide} onOpenChange={setShowGuide}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Guide de gestion des commandes</DialogTitle>
            <DialogDescription>
              Comment mettre à jour le suivi de commande
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Étapes du suivi</h3>
              <div className="space-y-4">
                {ORDER_STATUSES.filter(s => s.value !== 'cancelled').map((status, index) => {
                  const Icon = status.icon;
                  return (
                    <div key={status.value} className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${status.bgColor}`}>
                        <Icon className={`h-5 w-5 ${status.color}`} />
                      </div>
                      <div>
                        <p className="font-medium">{index + 1}. {status.label}</p>
                        <p className="text-sm text-muted-foreground">{status.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-lg mb-3">Comment mettre à jour</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Trouvez la commande dans le tableau (recherche par ID ou email)</li>
                <li>Utilisez le menu déroulant "Changer le statut" pour sélectionner le nouveau statut</li>
                <li>Confirmez le changement dans la boîte de dialogue</li>
                <li>Le client verra automatiquement la mise à jour dans son historique de commandes</li>
              </ol>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-lg mb-3">Bonnes pratiques</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li><strong>Payée → En préparation:</strong> Dès que vous commencez à préparer la commande</li>
                <li><strong>En préparation → Expédiée:</strong> Quand le colis est remis au transporteur</li>
                <li><strong>Expédiée → Livrée:</strong> Quand vous avez confirmation de réception</li>
                <li><strong>Annulée:</strong> En cas de remboursement ou d'annulation client</li>
              </ul>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">
                <strong>💡 Astuce:</strong> Cliquez sur l'icône 👁️ pour voir les détails complets 
                de la commande et modifier rapidement le statut depuis cette vue.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminOrders;