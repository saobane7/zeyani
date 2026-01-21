import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Confidentialite = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-8">
              Politique de Confidentialité
            </h1>

            <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
              <p className="text-lg">
                ZEYANI s'engage à protéger votre vie privée conformément au Règlement Général 
                sur la Protection des Données (RGPD).
              </p>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">1. Données collectées</h2>
                <p>Nous collectons uniquement les données nécessaires au traitement de vos commandes :</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Adresse de livraison</li>
                  <li>Numéro de téléphone (optionnel)</li>
                  <li>Historique des commandes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">2. Finalités du traitement</h2>
                <p>Vos données sont utilisées pour :</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Traiter et expédier vos commandes</li>
                  <li>Vous contacter concernant votre commande</li>
                  <li>Répondre à vos demandes de service client</li>
                  <li>Améliorer nos services (données anonymisées)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">3. Base légale</h2>
                <p>
                  Le traitement de vos données est fondé sur l'exécution du contrat de vente 
                  (article 6.1.b du RGPD) et, le cas échéant, sur votre consentement 
                  (article 6.1.a du RGPD).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">4. Durée de conservation</h2>
                <p>
                  Vos données sont conservées pendant la durée nécessaire à la gestion de la 
                  relation commerciale, puis archivées conformément aux obligations légales 
                  (factures : 10 ans, données clients : 3 ans après le dernier achat).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">5. Partage des données</h2>
                <p>
                  Vos données ne sont jamais vendues. Elles peuvent être partagées uniquement avec :
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Nos prestataires de livraison (pour l'expédition)</li>
                  <li>Notre prestataire de paiement (PayPal, pour les transactions sécurisées)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">6. Vos droits</h2>
                <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
                  <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
                  <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
                  <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                  <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
                </ul>
                <p className="mt-4">
                  Pour exercer ces droits, contactez-nous à : <strong>contact@zeyani.fr</strong>
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">7. Cookies</h2>
                <p>
                  Ce site utilise des cookies essentiels au fonctionnement du site (panier, session). 
                  Aucun cookie publicitaire ou de traçage n'est utilisé.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">8. Sécurité</h2>
                <p>
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées 
                  pour protéger vos données contre tout accès non autorisé, modification, 
                  divulgation ou destruction.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">9. Réclamation</h2>
                <p>
                  Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire 
                  une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et 
                  des Libertés) : <a href="https://www.cnil.fr" className="text-gold-dark hover:underline" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">10. Contact</h2>
                <p>
                  Pour toute question relative à cette politique de confidentialité :
                </p>
                <ul className="list-none space-y-1 mt-2">
                  <li>Email : contact@zeyani.fr</li>
                  <li>Téléphone : +33 7 80 17 01 58</li>
                </ul>
              </section>

              <p className="text-sm text-muted-foreground/70 pt-4 border-t border-border">
                Dernière mise à jour : Janvier 2026
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Confidentialite;
