import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Ruler, Info } from "lucide-react";

const SizeGuide = () => {
  const necklaceSizes = [
    { size: "40 cm", description: "Ras du cou", recommendation: "Tour de cou ajusté" },
    { size: "45 cm", description: "Court", recommendation: "Au niveau de la clavicule" },
    { size: "50 cm", description: "Standard", recommendation: "Taille la plus courante" },
    { size: "55 cm", description: "Mi-long", recommendation: "Sous la clavicule" },
    { size: "60 cm", description: "Long", recommendation: "Au niveau du buste" },
  ];

  const braceletSizes = [
    { size: "16 cm", description: "XS", recommendation: "Poignet très fin" },
    { size: "17 cm", description: "S", recommendation: "Poignet fin" },
    { size: "18 cm", description: "M", recommendation: "Poignet moyen (femme)" },
    { size: "19 cm", description: "L", recommendation: "Poignet moyen (homme)" },
    { size: "20 cm", description: "XL", recommendation: "Poignet large" },
    { size: "21 cm", description: "XXL", recommendation: "Poignet très large" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-full mb-6">
              <Ruler className="h-8 w-8 text-gold-dark" />
            </div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Guide des Tailles
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Trouvez la taille parfaite pour vos bijoux touarègues. 
              Suivez nos conseils pour mesurer correctement votre tour de cou ou de poignet.
            </p>
          </motion.div>

          {/* Comment mesurer */}
          <motion.section 
            className="mb-12 bg-sand-light rounded-2xl p-6 lg:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-start gap-4">
              <Info className="h-6 w-6 text-gold-dark flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                  Comment mesurer ?
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Pour les colliers :</h3>
                    <p>
                      Utilisez un mètre ruban souple et mesurez autour de votre cou à l'endroit 
                      où vous souhaitez que le collier repose. Ajoutez 2 à 5 cm selon le style 
                      désiré (ajusté ou ample).
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Pour les bracelets :</h3>
                    <p>
                      Enroulez le mètre ruban autour de votre poignet, juste au-dessus de l'os. 
                      Ajoutez 1 à 2 cm pour un bracelet confortable. Si vous n'avez pas de mètre ruban, 
                      utilisez une ficelle puis mesurez-la avec une règle.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Tailles colliers */}
          <motion.section 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
              Tailles des Colliers
            </h2>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Longueur</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Style</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground hidden sm:table-cell">Position</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {necklaceSizes.map((item, index) => (
                    <tr key={index} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-semibold text-gold-dark">{item.size}</span>
                      </td>
                      <td className="px-4 py-3 text-foreground">{item.description}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{item.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* Tailles bracelets */}
          <motion.section 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
              Tailles des Bracelets
            </h2>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Tour de poignet</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Taille</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground hidden sm:table-cell">Pour qui ?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {braceletSizes.map((item, index) => (
                    <tr key={index} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-semibold text-gold-dark">{item.size}</span>
                      </td>
                      <td className="px-4 py-3 text-foreground">{item.description}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{item.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* Conseil */}
          <motion.div 
            className="bg-gold/10 border border-gold/20 rounded-xl p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-foreground">
              <span className="font-semibold">Besoin d'aide ?</span>
              {" "}Contactez-nous au{" "}
              <a href="tel:+33780170158" className="text-gold-dark hover:underline font-medium">
                +33 7 80 17 01 58
              </a>
              {" "}pour des conseils personnalisés.
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SizeGuide;
