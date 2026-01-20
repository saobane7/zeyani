import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductForm } from '@/components/admin/ProductForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProductFormData } from '@/types/product';

const NewProduct = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const { error } = await supabase.from('products').insert({
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
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Produit créé avec succès');
      navigate('/admin/produits');
    },
    onError: (error: any) => {
      console.error('Error creating product:', error);
      if (error.code === '23505') {
        toast.error('Un produit avec ce slug existe déjà');
      } else {
        toast.error('Erreur lors de la création du produit');
      }
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/produits')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Nouveau produit</h1>
            <p className="text-muted-foreground">Créez un nouveau produit</p>
          </div>
        </div>

        <ProductForm
          onSubmit={createMutation.mutateAsync}
          isSubmitting={createMutation.isPending}
        />
      </div>
    </AdminLayout>
  );
};

export default NewProduct;
