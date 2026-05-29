import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

type MediaType = 'video' | 'image';

const AdminVideo = () => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [loop, setLoop] = useState(true);
  const [mediaType, setMediaType] = useState<MediaType>('video');
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
        setMediaType((v.mediaType as MediaType) || 'video');
        setLoading(false);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('site_settings')
      .upsert(
        { key: 'home_video', value: { url, title, subtitle, loop, mediaType } },
        { onConflict: 'key' }
      );
    setSaving(false);
    if (error) return toast.error('Erreur: ' + error.message);
    toast.success('Média enregistré');
  };

  const upload = async (file: File) => {
    setSaving(true);
    const path = `home-media-${Date.now()}-${file.name}`;
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
    toast.success('Fichier téléversé — pensez à enregistrer');
  };

  if (loading) return <AdminLayout><p>Chargement...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold">Média page d'accueil</h1>
          <p className="text-muted-foreground">
            Choisissez une image ou une vidéo à afficher dans la section dédiée
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Sélectionnez le type de média puis téléversez ou collez une URL</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Type de média</Label>
              <RadioGroup
                value={mediaType}
                onValueChange={(v) => setMediaType(v as MediaType)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="t-video" />
                  <Label htmlFor="t-video" className="cursor-pointer">Vidéo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="image" id="t-image" />
                  <Label htmlFor="t-image" className="cursor-pointer">Image</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Téléverser un fichier</Label>
              <Input
                type="file"
                accept={mediaType === 'video' ? 'video/*' : 'image/*'}
                onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL du média</Label>
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

            {mediaType === 'video' && (
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label>Lecture en boucle</Label>
                  <p className="text-sm text-muted-foreground">La vidéo se rejoue automatiquement</p>
                </div>
                <Switch checked={loop} onCheckedChange={setLoop} />
              </div>
            )}

            {url && (
              <div className="space-y-2">
                <Label>Aperçu</Label>
                {mediaType === 'video' ? (
                  <video src={url} controls loop={loop} className="w-full rounded" />
                ) : (
                  <img src={url} alt="Aperçu" className="w-full rounded" />
                )}
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
