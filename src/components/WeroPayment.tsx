import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Smartphone, Copy, Check, Upload, ShieldCheck, Loader2, Info, Apple, Smartphone as Android } from "lucide-react";
import { toast } from "sonner";
import { ShippingInfo } from "@/pages/Checkout";

interface WeroPaymentProps {
  onSuccess: (orderId: string) => void;
  shippingOption: ShippingInfo;
}

const WERO_PHONE = "+33 7 80 17 01 58";
const WERO_PHONE_RAW = "+33780170158";

const WeroPayment = ({ onSuccess, shippingOption }: WeroPaymentProps) => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const finalTotal = totalPrice + shippingOption.price;

  const handleCopy = () => {
    navigator.clipboard.writeText(WERO_PHONE_RAW);
    setCopied(true);
    toast.success("Numéro copié");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!proofFile) {
      toast.error("Veuillez joindre la capture de votre virement Wero");
      return;
    }
    if (!user) {
      toast.error("Vous devez être connecté");
      return;
    }
    setSubmitting(true);
    try {
      const ext = proofFile.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("payment-proofs")
        .upload(path, proofFile);
      if (upErr) throw upErr;

      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          payment_method: "wero",
          payment_proof_url: path,
          status: "pending",
          total_amount: finalTotal,
          currency: "EUR",
          payer_email: user.email,
          items: items.map((i) => ({
            id: i.product.id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
          })) as any,
          shipping_address: { method: shippingOption.label, price: shippingOption.price } as any,
        })
        .select()
        .single();
      if (orderErr) throw orderErr;

      clearCart();
      toast.success("Preuve bien envoyée — notre service confirmera votre commande sous 24h");
      onSuccess(order.id);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Erreur lors de l'envoi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <Alert>
        <ShieldCheck className="h-4 w-4" />
        <AlertDescription className="text-xs">
          Wero est le service de paiement européen 100% sécurisé, opéré par les banques
          françaises (BNP, Crédit Agricole, Société Générale, BPCE, Crédit Mutuel…).
          Vos données restent dans votre banque.
        </AlertDescription>
      </Alert>

      <div className="bg-secondary/40 rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-gold-dark" />
          <h3 className="font-semibold">Étape 1 — Envoyez le paiement via Wero</h3>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <Label className="text-xs text-muted-foreground">Montant exact à envoyer</Label>
            <p className="text-2xl font-display text-gold-dark font-semibold">
              {finalTotal.toFixed(2)} €
            </p>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Numéro Wero du bénéficiaire (Zeyanii)</Label>
            <div className="flex items-center gap-2 mt-1">
              <code className="flex-1 bg-background border rounded px-3 py-2 font-mono">
                {WERO_PHONE}
              </code>
              <Button type="button" variant="outline" size="icon" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground pt-2 border-t">
            <p className="font-medium text-foreground mb-1">Comment payer :</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Ouvrez l'application de votre banque (ou l'app Wero)</li>
              <li>Choisissez "Envoyer de l'argent" via Wero / Paylib</li>
              <li>Saisissez le numéro ci-dessus et le montant exact</li>
              <li>Validez le virement (instantané et gratuit)</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
        <div className="flex gap-2 items-start">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-xs space-y-2">
            <p className="font-semibold text-blue-900 dark:text-blue-200">
              Vous n'avez pas encore Wero ?
            </p>
            <p className="text-blue-800 dark:text-blue-300">
              Wero est intégré gratuitement à votre application bancaire (BNP, Crédit Agricole,
              Société Générale, BPCE, Crédit Mutuel, La Banque Postale…). Si votre banque ne le
              propose pas encore, téléchargez l'application <strong>Wero</strong> et liez-la à
              votre compte en moins de 2 minutes :
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="https://apps.apple.com/app/wero/id6502943756"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-black text-white text-xs px-3 py-1.5 rounded hover:opacity-90"
              >
                <Apple className="h-3.5 w-3.5" /> App Store
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.epi.wero"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-black text-white text-xs px-3 py-1.5 rounded hover:opacity-90"
              >
                <Android className="h-3.5 w-3.5" /> Google Play
              </a>
            </div>
            <p className="text-blue-800 dark:text-blue-300 pt-1">
              🔒 100% sécurisé — agréé par la Banque Centrale Européenne, aucune donnée
              bancaire ne nous est transmise.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-secondary/40 rounded-lg p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-gold-dark" />
          <h3 className="font-semibold">Étape 2 — Envoyez la capture du virement</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Faites une capture d'écran de la confirmation Wero et téléversez-la ci-dessous.
          Dès réception et vérification, vous recevrez un email de confirmation et votre
          commande sera préparée.
        </p>
        <div>
          <Label htmlFor="proof" className="text-xs">Capture d'écran du virement</Label>
          <Input
            id="proof"
            type="file"
            accept="image/*"
            onChange={(e) => setProofFile(e.target.files?.[0] || null)}
            className="mt-1"
          />
          {proofFile && (
            <p className="text-xs text-green-600 mt-1">✓ {proofFile.name}</p>
          )}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!proofFile || submitting}
        variant="gold"
        size="lg"
        className="w-full"
      >
        {submitting ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Envoi en cours…</>
        ) : (
          <>Valider ma commande</>
        )}
      </Button>
    </div>
  );
};

export default WeroPayment;
