import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, Plus, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  ProductFormData,
  PRODUCT_CATEGORIES,
  PRODUCT_MATERIALS,
  ProductVariant,
  ProductSize,
  ProductColor,
} from '@/types/product';

const productSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  slug: z.string().min(1, 'Le slug est requis'),
  description: z.string().optional(),
  short_description: z.string().optional(),
  price: z.number().min(0, 'Le prix doit être positif'),
  compare_at_price: z.number().nullable().optional(),
  category: z.string().min(1, 'La catégorie est requise'),
  material: z.string().optional(),
  stock: z.number().min(0).default(0),
  is_active: z.boolean().default(true),
  featured: z.boolean().default(false),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  weight: z.number().nullable().optional(),
});

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isSubmitting: boolean;
}

export const ProductForm = ({ initialData, onSubmit, isSubmitting }: ProductFormProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [variants, setVariants] = useState<ProductVariant[]>(initialData?.variants || []);
  const [sizes, setSizes] = useState<ProductSize[]>(initialData?.sizes || []);
  const [colors, setColors] = useState<ProductColor[]>(initialData?.colors || []);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVariantImage, setUploadingVariantImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      short_description: initialData?.short_description || '',
      price: initialData?.price || 0,
      compare_at_price: initialData?.compare_at_price || null,
      category: initialData?.category || 'colliers',
      material: initialData?.material || '',
      stock: initialData?.stock || 0,
      is_active: initialData?.is_active ?? true,
      featured: initialData?.featured ?? false,
      seo_title: initialData?.seo_title || '',
      seo_description: initialData?.seo_description || '',
      weight: initialData?.weight || null,
    },
  });

  const name = watch('name');
  const category = watch('category');
  const material = watch('material');
  const description = watch('description');

  const generateSlug = (productName: string) => {
    return productName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setValue('name', newName);
    if (!initialData?.slug) {
      setValue('slug', generateSlug(newName));
    }
  };

  const generateDescription = async () => {
    if (!name) {
      toast.error('Veuillez entrer un nom de produit');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-description', {
        body: {
          productName: name,
          category,
          material,
          existingDescription: description,
        },
      });

      if (error) throw error;
      if (data.description) {
        setValue('description', data.description);
        toast.success('Description générée avec succès');
      }
    } catch (err) {
      console.error('Error generating description:', err);
      toast.error('Erreur lors de la génération de la description');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const newImages: string[] = [];

      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        newImages.push(publicUrl);
      }

      setImages([...images, ...newImages]);
      toast.success('Image(s) uploadée(s) avec succès');
    } catch (err) {
      console.error('Error uploading image:', err);
      toast.error("Erreur lors de l'upload de l'image");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: crypto.randomUUID(),
      type: 'chain',
      color: 'argente',
      price: 0,
      label: '',
    };
    setVariants([...variants, newVariant]);
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    // Auto-generate label based on type and color
    if (field === 'type' || field === 'color') {
      const type = field === 'type' ? value : updated[index].type;
      const color = field === 'color' ? value : updated[index].color;
      const typeLabel = type === 'chain' ? 'Chaîne' : 'Perles';
      const colorLabel = color === 'argente' ? 'Argenté' : 'Doré';
      updated[index].label = `${typeLabel} ${colorLabel}`;
    }
    setVariants(updated);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantImageUpload = async (variantId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingVariantImage(variantId);
    try {
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `variants/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const index = variants.findIndex(v => v.id === variantId);
      if (index !== -1) {
        updateVariant(index, 'image', publicUrl);
      }
      toast.success('Image de variante uploadée');
    } catch (err) {
      console.error('Error uploading variant image:', err);
      toast.error("Erreur lors de l'upload de l'image");
    } finally {
      setUploadingVariantImage(null);
    }
  };

  const removeVariantImage = (index: number) => {
    updateVariant(index, 'image', undefined);
  };

  const addSize = () => {
    const newSize: ProductSize = {
      id: crypto.randomUUID(),
      name: '',
      available: true,
    };
    setSizes([...sizes, newSize]);
  };

  const updateSize = (index: number, field: keyof ProductSize, value: any) => {
    const updated = [...sizes];
    updated[index] = { ...updated[index], [field]: value };
    setSizes(updated);
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const addColor = () => {
    const newColor: ProductColor = {
      id: crypto.randomUUID(),
      name: '',
      hex: '#000000',
      available: true,
    };
    setColors([...colors, newColor]);
  };

  const updateColor = (index: number, field: keyof ProductColor, value: any) => {
    const updated = [...colors];
    updated[index] = { ...updated[index], [field]: value };
    setColors(updated);
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (data: any) => {
    await onSubmit({
      ...data,
      images,
      variants,
      sizes,
      colors,
      tags,
      dimensions: null,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="variants">Variantes</TabsTrigger>
          <TabsTrigger value="inventory">Inventaire</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de base</CardTitle>
              <CardDescription>Détails principaux du produit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du produit *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    onChange={handleNameChange}
                    placeholder="Croix d'Agadez traditionnelle"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL) *</Label>
                  <Input
                    id="slug"
                    {...register('slug')}
                    placeholder="croix-agadez-traditionnelle"
                  />
                  {errors.slug && (
                    <p className="text-sm text-destructive">{errors.slug.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select
                    value={watch('category')}
                    onValueChange={(value) => setValue('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="material">Matériau</Label>
                  <Select
                    value={watch('material') || ''}
                    onValueChange={(value) => setValue('material', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un matériau" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_MATERIALS.map((mat) => (
                        <SelectItem key={mat.value} value={mat.value}>
                          {mat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Description courte</Label>
                <Input
                  id="short_description"
                  {...register('short_description')}
                  placeholder="Bijou artisanal Touareg en argent"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">Description complète</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateDescription}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Générer avec IA
                  </Button>
                </div>
                <Textarea
                  id="description"
                  {...register('description')}
                  rows={5}
                  placeholder="Description détaillée du produit..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix (€) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register('price', { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">{errors.price.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compare_at_price">Prix barré (€)</Label>
                  <Input
                    id="compare_at_price"
                    type="number"
                    step="0.01"
                    {...register('compare_at_price', { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={watch('is_active')}
                    onCheckedChange={(checked) => setValue('is_active', checked)}
                  />
                  <Label htmlFor="is_active">Produit actif</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="featured"
                    checked={watch('featured')}
                    onCheckedChange={(checked) => setValue('featured', checked)}
                  />
                  <Label htmlFor="featured">Mettre en avant</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Images du produit</CardTitle>
              <CardDescription>Ajoutez des photos de votre produit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                        Principale
                      </span>
                    )}
                  </div>
                ))}

                <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Ajouter</span>
                    </>
                  )}
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variants" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Variantes du produit</CardTitle>
              <CardDescription>Configurez les différentes versions du produit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {variants.map((variant, index) => (
                <div key={variant.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-end gap-4">
                    <div className="flex-1 space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={variant.type}
                        onValueChange={(value) => updateVariant(index, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chain">Chaîne</SelectItem>
                          <SelectItem value="bead">Perles</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Couleur</Label>
                      <Select
                        value={variant.color}
                        onValueChange={(value) => updateVariant(index, 'color', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="argente">Argenté</SelectItem>
                          <SelectItem value="dore">Doré</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Label</Label>
                      <Input
                        value={variant.label}
                        onChange={(e) => updateVariant(index, 'label', e.target.value)}
                        placeholder="Chaîne Argenté"
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label>Prix (€)</Label>
                      <Input
                        type="number"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeVariant(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Variant Image Upload */}
                  <div className="flex items-center gap-4 pt-2 border-t">
                    <div className="flex-shrink-0">
                      {variant.image ? (
                        <div className="relative group">
                          <img
                            src={variant.image}
                            alt={`${variant.label} variant`}
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeVariantImage(index)}
                            className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleVariantImageUpload(variant.id, e)}
                            className="hidden"
                            disabled={uploadingVariantImage === variant.id}
                          />
                          {uploadingVariantImage === variant.id ? (
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                          ) : (
                            <Upload className="h-5 w-5 text-muted-foreground" />
                          )}
                        </label>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium">Image pour: {variant.label || `${variant.type === 'chain' ? 'Chaîne' : 'Perles'} ${variant.color === 'argente' ? 'Argenté' : 'Doré'}`}</p>
                      <p>Cette image sera affichée quand le client sélectionne cette variante</p>
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addVariant}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une variante
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tailles disponibles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sizes.map((size, index) => (
                <div key={size.id} className="flex items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <Label>Nom de la taille</Label>
                    <Input
                      value={size.name}
                      onChange={(e) => updateSize(index, 'name', e.target.value)}
                      placeholder="S, M, L, 50cm..."
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={size.available}
                      onCheckedChange={(checked) => updateSize(index, 'available', checked)}
                    />
                    <Label>Disponible</Label>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeSize(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addSize}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une taille
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Couleurs disponibles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {colors.map((color, index) => (
                <div key={color.id} className="flex items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <Label>Nom</Label>
                    <Input
                      value={color.name}
                      onChange={(e) => updateColor(index, 'name', e.target.value)}
                      placeholder="Argent, Or, Bronze..."
                    />
                  </div>
                  <div className="w-20 space-y-2">
                    <Label>Couleur</Label>
                    <Input
                      type="color"
                      value={color.hex}
                      onChange={(e) => updateColor(index, 'hex', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={color.available}
                      onCheckedChange={(checked) => updateColor(index, 'available', checked)}
                    />
                    <Label>Disponible</Label>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeColor(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addColor}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une couleur
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventaire</CardTitle>
              <CardDescription>Gestion du stock et caractéristiques</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock disponible</Label>
                  <Input
                    id="stock"
                    type="number"
                    {...register('stock', { valueAsNumber: true })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Poids (g)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    {...register('weight', { valueAsNumber: true })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nouveau tag..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Référencement (SEO)</CardTitle>
              <CardDescription>Optimisez la visibilité de votre produit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo_title">Titre SEO</Label>
                <Input
                  id="seo_title"
                  {...register('seo_title')}
                  placeholder="Croix d'Agadez - Bijou Touareg Authentique | Niger Chic"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">
                  {(watch('seo_title') || '').length}/60 caractères
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo_description">Description SEO</Label>
                <Textarea
                  id="seo_description"
                  {...register('seo_description')}
                  placeholder="Découvrez cette authentique croix d'Agadez, symbole de la culture Touareg..."
                  maxLength={160}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {(watch('seo_description') || '').length}/160 caractères
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {initialData ? 'Mettre à jour' : 'Créer le produit'}
        </Button>
      </div>
    </form>
  );
};
