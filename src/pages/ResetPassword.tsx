import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [sessionOk, setSessionOk] = useState(false);

  useEffect(() => {
    // Supabase peut renvoyer les tokens dans le hash (#access_token=...&type=recovery)
    // ou dans la query (?code=...). On gère les deux cas.
    const init = async () => {
      try {
        const hash = window.location.hash || "";
        const search = window.location.search || "";

        // Cas 1: hash avec access_token (lien direct de récupération)
        if (hash.includes("access_token") && hash.includes("type=recovery")) {
          const params = new URLSearchParams(hash.replace(/^#/, ""));
          const access_token = params.get("access_token");
          const refresh_token = params.get("refresh_token");
          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({ access_token, refresh_token });
            if (error) throw error;
            window.history.replaceState({}, "", window.location.pathname);
            setSessionOk(true);
            setReady(true);
            return;
          }
        }

        // Cas 2: code dans la query string (PKCE)
        const urlParams = new URLSearchParams(search);
        const code = urlParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          window.history.replaceState({}, "", window.location.pathname);
          setSessionOk(true);
          setReady(true);
          return;
        }

        // Cas 3: session déjà active (onAuthStateChange a déjà fait le travail)
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setSessionOk(true);
        }
        setReady(true);
      } catch (err) {
        console.error("Reset password init error:", err);
        setReady(true);
      }
    };

    // Écoute aussi l'événement PASSWORD_RECOVERY
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setSessionOk(true);
        setReady(true);
      }
    });

    init();

    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);

    if (error) {
      toast.error("Impossible de modifier le mot de passe. Le lien a peut-être expiré.");
      return;
    }

    toast.success("Mot de passe modifié avec succès ! Vous pouvez maintenant vous connecter.");
    await supabase.auth.signOut();
    setTimeout(() => navigate("/auth"), 1200);
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Nouveau mot de passe</CardTitle>
          <CardDescription>
            {sessionOk
              ? "Choisissez un nouveau mot de passe pour votre compte."
              : "Le lien a expiré ou n'est pas valide. Demandez un nouvel email de réinitialisation."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessionOk ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Enregistrer
              </Button>
            </form>
          ) : (
            <Button className="w-full" onClick={() => navigate("/auth")}>
              Retour à la connexion
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
