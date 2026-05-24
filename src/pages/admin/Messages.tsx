import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Trash2, Mail, MailOpen } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) toast.error('Erreur de chargement');
    else setMessages((data as ContactMessage[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleRead = async (msg: ContactMessage) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ read: !msg.read })
      .eq('id', msg.id);
    if (error) return toast.error('Erreur');
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Supprimer ce message ?')) return;
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) return toast.error('Erreur');
    toast.success('Supprimé');
    load();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Messages de contact</h1>
          <p className="text-muted-foreground">
            Messages envoyés depuis la page contact
          </p>
        </div>

        {loading && <p>Chargement...</p>}
        {!loading && messages.length === 0 && (
          <p className="text-muted-foreground">Aucun message pour le moment.</p>
        )}

        <div className="space-y-4">
          {messages.map((m) => (
            <Card key={m.id} className={m.read ? 'opacity-70' : ''}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {m.subject}
                    {!m.read && <Badge>Nouveau</Badge>}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    De <strong>{m.name}</strong> — <a href={`mailto:${m.email}`} className="underline">{m.email}</a>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(m.created_at).toLocaleString('fr-FR')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => toggleRead(m)}>
                    {m.read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => remove(m.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{m.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
