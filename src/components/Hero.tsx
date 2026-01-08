import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-croix-agadez.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 lg:pt-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Croix d'Agadez - Bijou ancestral du Niger"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto animate-fade-up">
          {/* Decorative line */}
          <div className="gold-line w-24 mx-auto mb-8" />
          
          <span className="inline-block mb-6 px-6 py-2 border border-gold/30 rounded-full text-cream font-medium text-sm tracking-[0.3em] uppercase">
            Artisanat d'Exception
          </span>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-cream mb-6 leading-[1.1] tracking-wide">
            La Croix
            <br />
            <span className="text-gradient-gold font-semibold">d'Agadez</span>
          </h1>
          
          <p className="text-lg md:text-xl text-cream/85 mb-10 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
            Symbole ancestral du Niger, transmis de génération en génération. 
            Découvrez l'héritage Touareg à travers nos créations uniques, 
            directement de France.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/collection">
              <Button variant="gold" size="xl">
                Découvrir la Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/notre-histoire">
              <Button 
                variant="heroOutline" 
                size="xl" 
                className="text-cream border-cream/40 hover:bg-cream/10 hover:border-cream"
              >
                Notre Histoire
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-cream/40 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-gold rounded-full" />
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-24 left-8 w-20 h-20 border-l-2 border-t-2 border-gold/20 hidden lg:block" />
      <div className="absolute bottom-24 right-8 w-20 h-20 border-r-2 border-b-2 border-gold/20 hidden lg:block" />
    </section>
  );
};

export default Hero;
