import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Email invalide");
const passwordSchema = z.string().min(6, "Mot de passe: minimum 6 caractères");
const nameSchema = z.string().trim().min(1, "Champ requis").max(80);
const addressSchema = z.string().trim().min(5, "Adresse trop courte").max(300);

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleForgotPassword = async () => {
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setErrors({ ...errors, email: "Entrez d'abord votre email" });
      return;
    }
    setResetting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setResetting(false);
    if (error) {
      toast.error("Impossible d'envoyer l'email de réinitialisation");
      return;
    }
    toast.success("Email de réinitialisation envoyé. Vérifiez votre boîte de réception.");
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) navigate(redirectTo);
      }
    );
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) navigate(redirectTo);
    });
    return () => subscription.unsubscribe();
  }, [navigate, redirectTo]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) newErrors.email = emailResult.error.errors[0].message;
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) newErrors.password = passwordResult.error.errors[0].message;

    if (!isLogin) {
      const fn = nameSchema.safeParse(firstName);
      if (!fn.success) newErrors.firstName = fn.error.errors[0].message;
      const ln = nameSchema.safeParse(lastName);
      if (!ln.success) newErrors.lastName = ln.error.errors[0].message;
      const ad = addressSchema.safeParse(address);
      if (!ad.success) newErrors.address = ad.error.errors[0].message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Email ou mot de passe incorrect");
          } else {
            toast.error(error.message);
          }
          return;
        }
        toast.success("Connexion réussie !");
        navigate(redirectTo);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              address: address.trim(),
            },
          },
        });
        if (error) {
          if (error.message.includes("User already registered")) {
            toast.error("Cet email est déjà utilisé. Connectez-vous plutôt.");
          } else {
            toast.error(error.message);
          }
          return;
        }
        toast.success("Compte créé avec succès !");
        navigate(redirectTo);
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="font-playfair text-3xl font-bold text-foreground">
              {isLogin ? "Connexion" : "Créer un compte"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isLogin
                ? "Accédez à votre compte et suivez vos commandes"
                : "Rejoignez-nous pour une expérience personnalisée"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 bg-card p-8 rounded-lg border">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => { setFirstName(e.target.value); if (errors.firstName) setErrors({ ...errors, firstName: "" }); }}
                      className={errors.firstName ? "border-destructive" : ""}
                    />
                    {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => { setLastName(e.target.value); if (errors.lastName) setErrors({ ...errors, lastName: "" }); }}
                      className={errors.lastName ? "border-destructive" : ""}
                    />
                    {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse complète</Label>
                  <Textarea
                    id="address"
                    placeholder="N° et rue, code postal, ville"
                    value={address}
                    onChange={(e) => { setAddress(e.target.value); if (errors.address) setErrors({ ...errors, address: "" }); }}
                    className={errors.address ? "border-destructive" : ""}
                    rows={2}
                  />
                  {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: "" }); }}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: "" }); }}
                  className={errors.password ? "border-destructive pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
            </Button>

            {isLogin && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resetting}
                  className="text-sm text-muted-foreground hover:text-primary hover:underline disabled:opacity-50"
                >
                  {resetting ? "Envoi..." : "Mot de passe oublié ?"}
                </button>
              </div>
            )}

            <div className="text-center">
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setErrors({}); }}
                className="text-sm text-primary hover:underline"
              >
                {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
