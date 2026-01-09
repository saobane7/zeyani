import { motion } from "framer-motion";
import { Award, Shield, Truck, HeartHandshake, Check } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Authenticité Certifiée",
    description: "Chaque bijou est accompagné d'un certificat d'authenticité garantissant son origine nigérienne.",
  },
  {
    icon: Shield,
    title: "Artisanat Préservé",
    description: "Nous soutenons les artisans Touaregs en préservant leurs techniques ancestrales.",
  },
  {
    icon: Truck,
    title: "Livraison France",
    description: "Expédition soignée depuis la France avec suivi et emballage cadeau offert.",
  },
  {
    icon: HeartHandshake,
    title: "Commerce Équitable",
    description: "Rémunération juste des artisans et contribution au développement local.",
  },
];

const trustBadges = [
  "Paiement Sécurisé",
  "Satisfait ou Remboursé",
  "Service Client Réactif",
  "Garantie 2 Ans",
];

const AboutSection = () => {
  return (
    <section id="about" className="py-16 lg:py-24 xl:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="gold-line w-16 mx-auto mb-6 lg:mb-8" />
          <span className="inline-block mb-4 text-gold-dark font-medium text-sm tracking-[0.25em] uppercase">
            Pourquoi ZEYANI
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-foreground mb-4 lg:mb-6">
            Notre <span className="text-gradient-gold font-semibold">Engagement</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base lg:text-lg px-4">
            ZEYANI est née d'une passion pour l'artisanat Touareg et d'un 
            engagement profond envers l'authenticité et le commerce équitable.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative p-6 lg:p-8 rounded-lg bg-card border border-border hover:border-gold/30 hover:shadow-card transition-all duration-500 text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 bg-gold/10 rounded-full mb-4 lg:mb-6 group-hover:bg-gold/20 transition-colors duration-300">
                <feature.icon className="h-7 w-7 lg:h-8 lg:w-8 text-gold" />
              </div>
              
              <h3 className="font-display text-lg lg:text-xl font-semibold text-foreground mb-2 lg:mb-3">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Decorative corners */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold/0 group-hover:border-gold/30 transition-colors duration-300 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold/0 group-hover:border-gold/30 transition-colors duration-300 rounded-bl-lg" />
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div 
          className="mt-12 lg:mt-20 pt-8 lg:pt-12 border-t border-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {trustBadges.map((badge, index) => (
              <div 
                key={badge}
                className="flex items-center justify-center gap-2 text-muted-foreground p-3 lg:p-4 rounded-lg bg-muted/50"
              >
                <Check className="h-4 w-4 lg:h-5 lg:w-5 text-gold flex-shrink-0" />
                <span className="text-xs sm:text-sm tracking-wide text-center">{badge}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
