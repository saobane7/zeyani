import { Award, Shield, Truck, HeartHandshake } from "lucide-react";

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

const AboutSection = () => {
  return (
    <section id="about" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="gold-line w-16 mx-auto mb-8" />
          <span className="inline-block mb-4 text-gold-dark font-medium text-sm tracking-[0.25em] uppercase">
            Pourquoi ZEYANI
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-6">
            Notre <span className="text-gradient-gold font-semibold">Engagement</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            ZEYANI est née d'une passion pour l'artisanat Touareg et d'un 
            engagement profond envers l'authenticité et le commerce équitable.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-8 rounded-lg bg-card border border-border hover:border-gold/30 hover:shadow-card transition-all duration-500 text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-full mb-6 group-hover:bg-gold/20 transition-colors duration-300">
                <feature.icon className="h-8 w-8 text-gold" />
              </div>
              
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold/0 group-hover:border-gold/30 transition-colors duration-300 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold/0 group-hover:border-gold/30 transition-colors duration-300 rounded-bl-lg" />
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-20 pt-12 border-t border-border">
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-gold text-2xl">✓</span>
              <span className="text-sm tracking-wide">Paiement Sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold text-2xl">✓</span>
              <span className="text-sm tracking-wide">Satisfait ou Remboursé</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold text-2xl">✓</span>
              <span className="text-sm tracking-wide">Service Client Réactif</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold text-2xl">✓</span>
              <span className="text-sm tracking-wide">Garantie 2 Ans</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
