import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CGV = () => {
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
              Conditions Générales de Vente
            </h1>

            <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Article 1 - Objet</h2>
                <p>
                  Les présentes Conditions Générales de Vente (CGV) régissent les ventes de 
                  bijoux artisanaux proposés par ZEYANI sur le site zeyani.fr. Toute commande 
                  implique l'acceptation sans réserve de ces conditions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Article 2 - Produits</h2>
                <p>
                  Les produits proposés sont des bijoux artisanaux fabriqués à la main. 
                  Chaque pièce étant unique, de légères variations peuvent exister par rapport 
                  aux photos présentées. Ces variations font partie du caractère artisanal 
                  et ne constituent pas un défaut.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Article 3 - Prix</h2>
                <p>
                  Les prix sont indiqués en euros TTC. ZEYANI se réserve le droit de modifier 
                  ses prix à tout moment. Les produits sont facturés au prix en vigueur lors 
                  de la validation de la commande.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Article 4 - Commande</h2>
                <p>
                  La commande devient définitive après confirmation du paiement. Un email de 
                  confirmation vous sera envoyé. ZEYANI se réserve le droit de refuser toute 
                  commande pour motif légitime.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Article 5 - Paiement</h2>
                <p>
                  Le paiement s'effectue par PayPal, garantissant une transaction sécurisée. 
                  Le paiement est exigible immédiatement à la commande.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Article 6 - Livraison</h2>
                <p>
                  La livraison est effectuée en France métropolitaine uniquement. 
                  Les délais de livraison sont donnés à titre indicatif (généralement 5 à 10 jours ouvrés). 
                  ZEYANI ne peut être tenu responsable des retards de livraison dus au transporteur.
                </p>
                <p className="mt-2">
                  Options de livraison disponibles :
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Livraison gratuite (dès 100€ d'achat)</li>
                  <li>Mondial Relay Locker</li>
                  <li>Mondial Relay Point</li>
                  <li>Livraison à domicile</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Article 7 - Droit de rétractation</h2>
                <p>
                  Conformément à l'article L221-18 du Code de la consommation, vous disposez 
                  d'un délai de 14 jours à compter de la réception de votre commande pour 
                  exercer votre droit de rétractation, sans avoir à justifier de motifs.
                </p>
                <p className="mt-2">
                  Pour exercer ce droit, contactez-nous par email à contact@zeyani.fr. 
                  Les produits doivent être retournés dans leur état d'origine, non portés, 
                  avec leur emballage. Les frais de retour sont à la charge du client.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Article 8 - Garantie</h2>
                <p>
                  Tous nos bijoux bénéficient d'une garantie de <strong>2 mois</strong> contre 
                  les défauts de fabrication. Cette garantie ne couvre pas l'usure normale, 
                  les dommages causés par une mauvaise utilisation ou un accident.
                </p>
                <p className="mt-2">
                  En cas de défaut couvert par la garantie, le produit sera réparé ou remplacé 
                  gratuitement.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Article 9 - Réclamations</h2>
                <p>
                  Toute réclamation doit être adressée par email à contact@zeyani.fr dans un 
                  délai de 14 jours suivant la réception de la commande. Joignez des photos 
                  si nécessaire pour faciliter le traitement.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Article 10 - Propriété intellectuelle</h2>
                <p>
                  Tous les éléments du site (textes, images, logos) sont protégés par le 
                  droit de la propriété intellectuelle. Toute reproduction est interdite 
                  sans autorisation.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Article 11 - Données personnelles</h2>
                <p>
                  Le traitement de vos données personnelles est régi par notre{" "}
                  <a href="/confidentialite" className="text-gold-dark hover:underline">
                    Politique de Confidentialité
                  </a>
                  , conforme au RGPD.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Article 12 - Médiation</h2>
                <p>
                  En cas de litige, une solution amiable sera recherchée avant toute action 
                  judiciaire. Vous pouvez recourir gratuitement au service de médiation de 
                  la consommation. La plateforme européenne de règlement des litiges en ligne 
                  est accessible à :{" "}
                  <a 
                    href="https://ec.europa.eu/consumers/odr" 
                    className="text-gold-dark hover:underline"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    ec.europa.eu/consumers/odr
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Article 13 - Droit applicable</h2>
                <p>
                  Les présentes CGV sont soumises au droit français. Tout litige relatif 
                  à leur interprétation ou leur exécution relève des tribunaux français.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Article 14 - Contact</h2>
                <p>
                  Pour toute question concernant ces CGV :
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

export default CGV;
