import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Cookie, Shield } from "lucide-react";

const STORAGE_KEY = "zeyanii_cookie_consent_v1";

type Consent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  date: string;
};

const getStored = (): Consent | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
};

const save = (consent: Consent) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: consent }));
};

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!getStored()) setVisible(true);
  }, []);

  const acceptAll = () => {
    save({ essential: true, analytics: true, marketing: true, date: new Date().toISOString() });
    setVisible(false);
    setCustomizeOpen(false);
  };

  const refuseAll = () => {
    save({ essential: true, analytics: false, marketing: false, date: new Date().toISOString() });
    setVisible(false);
    setCustomizeOpen(false);
  };

  const saveCustom = () => {
    save({ essential: true, analytics, marketing, date: new Date().toISOString() });
    setVisible(false);
    setCustomizeOpen(false);
  };

  if (!visible) return null;

  return (
    <>
      <div
        role="dialog"
        aria-live="polite"
        aria-label="Bandeau de consentement aux cookies"
        className="fixed inset-x-0 bottom-0 z-[100] border-t border-border bg-background/95 backdrop-blur shadow-2xl"
      >
        <div className="container mx-auto px-4 py-5 md:py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="h-6 w-6 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <h2 className="font-serif text-lg font-semibold">Respect de votre vie privée</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Zeyanii utilise des cookies pour assurer le bon fonctionnement du site et,
                  avec votre accord, pour mesurer l'audience et améliorer votre expérience.
                  Vous pouvez accepter, refuser ou personnaliser vos choix à tout moment.
                  Aucun cookie non essentiel n'est déposé avant votre consentement.{" "}
                  <a href="/confidentialite" className="underline hover:text-primary">
                    En savoir plus
                  </a>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 md:items-center md:shrink-0">
              <Button
                variant="outline"
                size="lg"
                onClick={refuseAll}
                className="min-w-[140px]"
              >
                Tout refuser
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={acceptAll}
                className="min-w-[140px]"
              >
                Tout accepter
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setCustomizeOpen(true)}
                className="min-w-[180px]"
              >
                Personnaliser mes choix
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={customizeOpen} onOpenChange={setCustomizeOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-serif">
              <Shield className="h-5 w-5 text-primary" />
              Personnaliser mes choix
            </DialogTitle>
            <DialogDescription>
              Gérez vos préférences. Vous pouvez modifier ces choix à tout moment depuis la
              page « Politique de confidentialité ».
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
              <div className="space-y-1">
                <p className="font-medium">Cookies essentiels</p>
                <p className="text-sm text-muted-foreground">
                  Indispensables au fonctionnement du site (panier, session, sécurité).
                  Toujours actifs.
                </p>
              </div>
              <Switch checked disabled aria-label="Cookies essentiels (toujours actifs)" />
            </div>

            <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
              <div className="space-y-1">
                <p className="font-medium">Mesure d'audience</p>
                <p className="text-sm text-muted-foreground">
                  Statistiques anonymes pour comprendre l'usage du site et l'améliorer.
                </p>
              </div>
              <Switch
                checked={analytics}
                onCheckedChange={setAnalytics}
                aria-label="Activer la mesure d'audience"
              />
            </div>

            <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
              <div className="space-y-1">
                <p className="font-medium">Marketing & personnalisation</p>
                <p className="text-sm text-muted-foreground">
                  Permet d'afficher des contenus et des publicités adaptés à vos centres
                  d'intérêt.
                </p>
              </div>
              <Switch
                checked={marketing}
                onCheckedChange={setMarketing}
                aria-label="Activer le marketing"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={refuseAll} className="sm:flex-1">
              Tout refuser
            </Button>
            <Button variant="outline" onClick={acceptAll} className="sm:flex-1">
              Tout accepter
            </Button>
            <Button onClick={saveCustom} className="sm:flex-1">
              Enregistrer mes choix
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieBanner;
