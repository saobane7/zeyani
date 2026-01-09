import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-croix-agadez.jpg";

const Hero = () => {
  const scrollToCollection = () => {
    const element = document.getElementById("collection");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 lg:pt-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <motion.img
          src={heroImage}
          alt="Croix d'Agadez - Bijou ancestral du Niger"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Decorative line */}
          <motion.div 
            className="gold-line w-24 mx-auto mb-8"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
          
          <motion.span 
            className="inline-block mb-6 px-6 py-2 border border-gold/30 rounded-full text-cream font-medium text-sm tracking-[0.3em] uppercase backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Artisanat d'Exception
          </motion.span>
          
          <motion.h1 
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-cream mb-6 leading-[1.1] tracking-wide"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            La Croix
            <br />
            <span className="text-gradient-gold font-semibold">d'Agadez</span>
          </motion.h1>
          
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-cream/85 mb-10 max-w-2xl mx-auto font-light leading-relaxed tracking-wide px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Symbole ancestral du Niger, transmis de génération en génération. 
            Découvrez l'héritage Touareg à travers nos créations uniques, 
            directement de France.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <Link to="/collection" className="w-full sm:w-auto">
              <Button variant="gold" size="xl" className="w-full sm:w-auto group">
                Découvrir la Collection
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/notre-histoire" className="w-full sm:w-auto">
              <Button 
                variant="heroOutline" 
                size="xl" 
                className="w-full sm:w-auto text-cream border-cream/40 hover:bg-cream/10 hover:border-cream"
              >
                Notre Histoire
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-cream/60 hover:text-cream transition-colors cursor-pointer"
        onClick={scrollToCollection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        whileHover={{ y: -5 }}
      >
        <span className="text-xs tracking-widest uppercase mb-2 hidden sm:block">Découvrir</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </motion.button>

      {/* Decorative corners */}
      <div className="absolute top-24 left-4 lg:left-8 w-12 lg:w-20 h-12 lg:h-20 border-l-2 border-t-2 border-gold/20 hidden md:block" />
      <div className="absolute bottom-24 right-4 lg:right-8 w-12 lg:w-20 h-12 lg:h-20 border-r-2 border-b-2 border-gold/20 hidden md:block" />
    </section>
  );
};

export default Hero;
