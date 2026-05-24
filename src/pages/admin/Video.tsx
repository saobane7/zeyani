import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const AdminVideo = () => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [loop, setLoop] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'home_video')
      .maybeSingle()
      .then(({ data }) => {
        const v = (data?.value as any) || {};
        setUrl(v.url || '');
        setTitle(v.title || '');
        setSubtitle(v.subtitle || '');
        setLoop(v.loop !== false);
        setLoading(false);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: 'home_video', value: { url, title, subtitle, loop } }, { onConflict: 'key' });
    setSaving(false);
    if (error) return toast.error('Erreur: ' + error.message);
    toast.success('Vidéo enregistrée');
  };

  const upload = async (file: File) => {
    setSaving(true);
    const path = `home-video-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) {
      setSaving(false);
      return toast.error('Upload échoué: ' + error.message);
    }
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    setUrl(data.publicUrl);
    setSaving(false);
    toast.success('Vidéo téléversée — pensez à enregistrer');
  };

  if (loading) return <AdminLayout><p>Chargement...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold">Vidéo page d'accueil</h1>
          <p className="text-muted-foreground">
            Vidéo affichée à la place de la section communauté
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Téléversez un fichier ou collez une URL</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Téléverser une vidéo</Label>
              <Input
                type="file"
                accept="video/*"
                onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL de la vidéo</Label>
              <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Sous-titre</Label>
              <Input id="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label>Lecture en boucle</Label>
                <p className="text-sm text-muted-foreground">La vidéo se rejoue automatiquement</p>
              </div>
              <Switch checked={loop} onCheckedChange={setLoop} />
            </div>

            {url && (
              <div className="space-y-2">
                <Label>Aperçu</Label>
                <video src={url} controls loop={loop} className="w-full rounded" />
              </div>
            )}

            <Button onClick={save} disabled={saving} className="w-full">
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Enregistrer
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminVideo;
