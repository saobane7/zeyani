import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, Trash2, ArrowUp, ArrowDown, Upload, Image as ImageIcon, Save } from 'lucide-react';

interface HeroSlide {
  id: string;
  name: string;          // ex: "Croix d'Agadez"
  highlight?: string;    // ex: "d'Agadez" (mot mis en doré). Si vide → dérivé.
  description: string;
  image_url: string;
  slug?: string;         // slug produit (optionnel)
}

const emptySlide = (): HeroSlide => ({
  id: crypto.randomUUID(),
  name: '',
  highlight: '',
  description: '',
  image_url: '',
  slug: '',
});

const AdminHomeSlides = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'hero_slides')
      .maybeSingle()
      .then(({ data }) => {
        const v = (data?.value as any) || [];
        if (Array.isArray(v)) setSlides(v);
        setLoading(false);
      });
  }, []);

  const persist = async (next: HeroSlide[]) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key: 'hero_slides', value: next as any }, { onConflict: 'key' });
      if (error) throw error;
      setSlides(next);
      toast.success('Section accueil enregistrée');
    } catch (e: any) {
      console.error(e);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const updateSlide = (id: string, patch: Partial<HeroSlide>) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const move = (id: string, dir: -1 | 1) => {
    const idx = slides.findIndex((s) => s.id === id);
    const next = idx + dir;
    if (idx < 0 || next < 0 || next >= slides.length) return;
    const copy = [...slides];
    [copy[idx], copy[next]] = [copy[next], copy[idx]];
    setSlides(copy);
  };

  const remove = (id: string) => {
    setSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const add = () => setSlides((prev) => [...prev, emptySlide()]);

  const handleUpload = async (id: string, file: File) => {
    setUploadingId(id);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `hero/${id}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('product-images')
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from('product-images').getPublicUrl(path);
      updateSlide(id, { image_url: data.publicUrl });
      toast.success('Image chargée. Pensez à enregistrer.');
    } catch (e: any) {
      console.error(e);
      toast.error("Échec de l'upload de l'image");
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Section d'accueil</h1>
            <p className="text-muted-foreground">
              Gérez les diapositives du grand bandeau d'accueil. Le positionnement des
              textes (titre, description, boutons) reste le même : seul leur contenu
              et l'image changent.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={add}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une diapositive
            </Button>
            <Button onClick={() => persist(slides)} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Enregistrer
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : slides.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Aucune diapositive personnalisée. Les diapositives par défaut du site
              s'affichent. Cliquez sur « Ajouter une diapositive » pour commencer.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {slides.map((s, i) => (
              <Card key={s.id}>
                <CardHeader className="flex flex-row items-center justify-between gap-2">
                  <CardTitle className="text-base">
                    Diapositive {i + 1}
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => move(s.id, -1)} disabled={i === 0}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => move(s.id, 1)} disabled={i === slides.length - 1}>
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => remove(s.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  {/* Image */}
                  <div className="space-y-2">
                    <Label>Image de fond</Label>
                    <div className="aspect-[16/10] bg-muted rounded-lg overflow-hidden flex items-center justify-center border">
                      {s.image_url ? (
                        <img src={s.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleUpload(s.id, f);
                        }}
                      />
                      <Button asChild variant="outline" className="w-full" disabled={uploadingId === s.id}>
                        <span>
                          {uploadingId === s.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4 mr-2" />
                          )}
                          Téléverser une image
                        </span>
                      </Button>
                    </label>
                  </div>

                  {/* Textes */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label>Titre principal</Label>
                      <Input
                        value={s.name}
                        placeholder="ex: Croix d'Agadez"
                        onChange={(e) => updateSlide(s.id, { name: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Affiché en grand : « La Croix » + ce titre.
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label>Mot doré (optionnel)</Label>
                      <Input
                        value={s.highlight || ''}
                        placeholder="ex: d'Agadez"
                        onChange={(e) => updateSlide(s.id, { highlight: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Partie du titre mise en doré sur le visuel. Laissez vide pour utiliser tout le titre.
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label>Description</Label>
                      <Textarea
                        rows={4}
                        value={s.description}
                        placeholder="Phrase de présentation affichée sous le titre."
                        onChange={(e) => updateSlide(s.id, { description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Lien vers un produit (slug, optionnel)</Label>
                      <Input
                        value={s.slug || ''}
                        placeholder="ex: collier-croix-agadez"
                        onChange={(e) => updateSlide(s.id, { slug: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Si renseigné, le bouton « Découvrir ce collier » mène à /produit/&lt;slug&gt;.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminHomeSlides;
