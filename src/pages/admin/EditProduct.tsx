import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductForm } from '@/components/admin/ProductForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProductFormData, DbProduct } from '@/types/product';

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as unknown as DbProduct;
    },
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const { error } = await supabase
        .from('products')
        .update({
          name: data.name,
          slug: data.slug,
          description: data.description || null,
          short_description: data.short_description || null,
          price: data.price,
          compare_at_price: data.compare_at_price,
          category: data.category,
          material: data.material || null,
          stock: data.stock,
          is_active: data.is_active,
          featured: data.featured,
          images: data.images,
          variants: data.variants as any,
          sizes: data.sizes as any,
          colors: data.colors as any,
          tags: data.tags,
          seo_title: data.seo_title || null,
          seo_description: data.seo_description || null,
          weight: data.weight,
          dimensions: data.dimensions as any,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-product', id] });
      toast.success('Produit mis à jour avec succès');
      navigate('/admin/produits');
    },
    onError: (error: any) => {
      console.error('Error updating product:', error);
      if (error.code === '23505') {
        toast.error('Un produit avec ce slug existe déjà');
      } else {
        toast.error('Erreur lors de la mise à jour du produit');
      }
    },
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Produit non trouvé</p>
          <Button variant="link" onClick={() => navigate('/admin/produits')}>
            Retour aux produits
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const initialData: Partial<ProductFormData> = {
    name: product.name,
    slug: product.slug,
    description: product.description || '',
    short_description: product.short_description || '',
    price: product.price,
    compare_at_price: product.compare_at_price,
    category: product.category,
    material: product.material || '',
    stock: product.stock || 0,
    is_active: product.is_active ?? true,
    featured: product.featured ?? false,
    images: product.images || [],
    variants: product.variants || [],
    sizes: product.sizes || [],
    colors: product.colors || [],
    tags: product.tags || [],
    seo_title: product.seo_title || '',
    seo_description: product.seo_description || '',
    weight: product.weight,
    dimensions: product.dimensions,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/produits')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Modifier le produit</h1>
            <p className="text-muted-foreground">{product.name}</p>
          </div>
        </div>

        <ProductForm
          initialData={initialData}
          onSubmit={updateMutation.mutateAsync}
          isSubmitting={updateMutation.isPending}
        />
      </div>
    </AdminLayout>
  );
};

export default EditProduct;
