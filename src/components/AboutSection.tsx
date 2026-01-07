import { Button } from "./ui/button";
import { ArrowRight, Award, Heart, Truck } from "lucide-react";
import artisanImg from "@/assets/artisan-workshop.jpg";

const features = [
  {
    icon: Award,
    title: "Artisanat Authentique",
    description: "Chaque bijou est façonné à la main par des artisans Touaregs héritiers d'un savoir-faire ancestral.",
  },
  {
    icon: Heart,
    title: "Commerce Équitable",
    description: "Nous travaillons directement avec les artisans pour garantir une rémunération juste.",
  },
  {
    icon: Truck,
    title: "Livraison Mondiale",
    description: "Expédition soignée vers le monde entier avec suivi et assurance inclus.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 lg:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <img
                src={artisanImg}
                alt="Artisan Touareg au travail"
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-accent/20 rounded-full -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-accent/30 rounded-full -z-10" />
            
            {/* Stats card */}
            <div className="absolute -bottom-8 -right-4 lg:-right-8 bg-card rounded-xl p-6 shadow-card">
              <div className="text-center">
                <span className="block text-3xl font-display font-bold text-gradient-gold">25+</span>
                <span className="text-sm text-muted-foreground">Années d'expérience</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="inline-block mb-4 text-accent font-medium text-sm tracking-widest uppercase">
              Notre Histoire
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              L'Héritage des
              <br />
              <span className="text-gradient-gold">Artisans du Sahara</span>
            </h2>
            
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Ténéré Bijoux est née d'une passion pour l'artisanat nigérien et d'un 
              profond respect pour les traditions ancestrales des peuples Touaregs. 
              Depuis plus de 25 ans, nous collaborons avec des artisans locaux pour 
              vous offrir des pièces uniques.
            </p>
            
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Chaque bijou raconte une histoire — celle du désert du Ténéré, 
              des caravanes de sel, et d'un savoir-faire transmis de génération en génération.
            </p>

            <Button variant="terracotta" size="lg">
              En Savoir Plus
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 lg:mt-32">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center p-8 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-6">
                <feature.icon className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
