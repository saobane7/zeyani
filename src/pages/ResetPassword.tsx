import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const getResetParams = () => {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const queryParams = new URLSearchParams(window.location.search);
  const get = (key: string) => hashParams.get(key) || queryParams.get(key);

  return {
    accessToken: get("access_token"),
    refreshToken: get("refresh_token"),
    code: get("code"),
    tokenHash: get("token_hash"),
    token: get("token"),
    email: get("email"),
    type: get("type"),
    error: get("error") || get("error_code"),
  };
};

const cleanResetUrl = () => {
  window.history.replaceState({}, "", window.location.pathname);
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [sessionOk, setSessionOk] = useState(false);
  const [linkError, setLinkError] = useState("");

  useEffect(() => {
    let mounted = true;

    const confirmActiveRecoverySession = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!mounted) return false;

      if (!error && data.user) {
        setSessionOk(true);
        setLinkError("");
        setReady(true);
        cleanResetUrl();
        return true;
      }

      return false;
    };

    const requireActiveRecoverySession = async () => {
      if (!(await confirmActiveRecoverySession())) {
        throw new Error("Session de réinitialisation introuvable");
      }
    };

    const init = async () => {
      try {
        const params = getResetParams();

        if (params.error) {
          throw new Error("Lien de réinitialisation invalide ou expiré");
        }

        if (params.accessToken && params.refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: params.accessToken,
            refresh_token: params.refreshToken,
          });
          if (error) throw error;
          await requireActiveRecoverySession();
          return;
        }

        if (params.tokenHash && params.type === "recovery") {
          const { error } = await supabase.auth.verifyOtp({
            type: "recovery",
            token_hash: params.tokenHash,
          });
          if (error) throw error;
          await requireActiveRecoverySession();
          return;
        }

        if (params.token && params.email && params.type === "recovery") {
          const { error } = await supabase.auth.verifyOtp({
            type: "recovery",
            token: params.token,
            email: params.email,
          });
          if (error) throw error;
          await requireActiveRecoverySession();
          return;
        }

        if (params.code) {
          const { error } = await supabase.auth.exchangeCodeForSession(params.code);
          if (error) throw error;
          await requireActiveRecoverySession();
          return;
        }

        if (await confirmActiveRecoverySession()) return;

        if (mounted) {
          setSessionOk(false);
          setLinkError("Le lien a expiré ou n'est pas valide. Demandez un nouvel email de réinitialisation.");
          setReady(true);
        }
      } catch (err) {
        console.error("Reset password init error:", err);
        if (mounted) {
          setSessionOk(false);
          setLinkError("Le lien a expiré ou n'est pas valide. Demandez un nouvel email de réinitialisation.");
          setReady(true);
        }
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "PASSWORD_RECOVERY" && session?.user) {
        setSessionOk(true);
        setLinkError("");
        setReady(true);
        cleanResetUrl();
      }
    });

    init();

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
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
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      setIsLoading(false);
      setSessionOk(false);
      setLinkError("Votre session de réinitialisation a expiré. Demandez un nouvel email de réinitialisation.");
      toast.error("Votre session a expiré. Demandez un nouvel email de réinitialisation.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);

    if (error) {
      console.error("Reset password update error:", error);
      const message = error.message.toLowerCase().includes("different")
        ? "Choisissez un mot de passe différent de l'ancien."
        : "Impossible de modifier le mot de passe. Demandez un nouvel email de réinitialisation si le problème continue.";
      toast.error(message);
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
              : linkError || "Le lien a expiré ou n'est pas valide. Demandez un nouvel email de réinitialisation."}
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
