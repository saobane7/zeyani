import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const MentionsLegales = () => {
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
              Mentions Légales
            </h1>

            <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">1. Éditeur du site</h2>
                <p>
                  Le site ZEYANI est édité par ZEYANI, entreprise spécialisée dans la vente 
                  de bijoux artisanaux touarègues.
                </p>
                <ul className="list-none space-y-1 mt-4">
                  <li><strong>Nom commercial :</strong> ZEYANI</li>
                  <li><strong>Email :</strong> contact@zeyani.fr</li>
                  <li><strong>Téléphone :</strong> +33 7 80 17 01 58</li>
                  <li><strong>Pays :</strong> France</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">2. Hébergement</h2>
                <p>
                  Ce site est hébergé par des services cloud professionnels garantissant 
                  la sécurité et la disponibilité des données.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">3. Propriété intellectuelle</h2>
                <p>
                  L'ensemble du contenu de ce site (textes, images, logos, graphismes) 
                  est protégé par le droit d'auteur et le droit des marques. Toute reproduction, 
                  même partielle, est interdite sans autorisation préalable écrite de ZEYANI.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">4. Responsabilité</h2>
                <p>
                  ZEYANI s'efforce d'assurer l'exactitude des informations diffusées sur ce site. 
                  Toutefois, ZEYANI ne peut garantir l'exactitude, la précision ou l'exhaustivité 
                  des informations mises à disposition.
                </p>
                <p className="mt-2">
                  ZEYANI décline toute responsabilité pour les éventuelles imprécisions, 
                  inexactitudes ou omissions portant sur les informations disponibles sur ce site.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">5. Liens hypertextes</h2>
                <p>
                  Le site peut contenir des liens vers d'autres sites. ZEYANI n'exerce aucun 
                  contrôle sur ces sites et n'assume aucune responsabilité quant à leur contenu.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">6. Droit applicable</h2>
                <p>
                  Les présentes mentions légales sont régies par le droit français. 
                  En cas de litige, les tribunaux français seront seuls compétents.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">7. Contact</h2>
                <p>
                  Pour toute question concernant ces mentions légales, vous pouvez nous contacter :
                </p>
                <ul className="list-none space-y-1 mt-2">
                  <li>Par email : contact@zeyani.fr</li>
                  <li>Par téléphone : +33 7 80 17 01 58</li>
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

export default MentionsLegales;
