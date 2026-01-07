import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-jewelry.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 lg:pt-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Collection de bijoux Touareg du Niger"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto animate-fade-up">
          <span className="inline-block mb-4 px-4 py-2 bg-accent/20 backdrop-blur-sm rounded-full text-cream font-medium text-sm tracking-widest uppercase">
            Artisanat du Niger
          </span>
          
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-cream mb-6 leading-tight">
            L'Élégance
            <br />
            <span className="text-gradient-gold">Sahélienne</span>
          </h1>
          
          <p className="text-lg md:text-xl text-cream/90 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            Découvrez notre collection exclusive de bijoux artisanaux du Niger. 
            Chaque pièce raconte l'histoire millénaire des artisans Touaregs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="gold" size="xl">
              Découvrir la Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="heroOutline" size="xl" className="text-cream border-cream/50 hover:bg-cream/10">
              Notre Histoire
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-cream/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-cream/70 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
