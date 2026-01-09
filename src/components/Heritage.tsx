import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import artisanImg from "@/assets/artisan-tuareg.jpg";

const Heritage = () => {
  return (
    <section id="heritage" className="py-16 lg:py-24 xl:py-32 bg-primary text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center">
          {/* Content */}
          <motion.div 
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="gold-line w-16 mb-6 lg:mb-8" />
            
            <span className="inline-block mb-4 text-gold font-medium text-sm tracking-[0.25em] uppercase">
              L'Héritage Touareg
            </span>
            
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-6 lg:mb-8 leading-tight">
              La Croix d'Agadez
              <br />
              <span className="text-gradient-gold font-semibold">Un Symbole Éternel</span>
            </h2>
            
            <div className="space-y-4 lg:space-y-6 text-primary-foreground/80 text-base lg:text-lg leading-relaxed">
              <p>
                La Croix d'Agadez, symbole emblématique du peuple Touareg, 
                représente bien plus qu'un simple bijou. Elle incarne les 
                <strong className="text-gold"> quatre points cardinaux</strong>, 
                guidant les nomades à travers l'immensité du désert du Sahara.
              </p>
              
              <p>
                Traditionnellement offerte de père en fils, elle porte en elle 
                une bénédiction ancestrale : <em className="text-cream italic">
                "Je te donne les quatre directions du monde, 
                car on ne sait pas où tu mourras."</em>
              </p>
              
              <p className="hidden sm:block">
                Chaque croix est unique, façonnée à la main par des maîtres 
                artisans d'Agadez selon des techniques transmises depuis des siècles.
              </p>
            </div>

            <Link to="/notre-histoire" className="inline-block mt-6 lg:mt-8">
              <Button variant="gold" size="lg" className="group">
                Découvrir notre histoire
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-10 lg:mt-12 pt-8 lg:pt-10 border-t border-primary-foreground/20">
              <div className="text-center sm:text-left">
                <span className="block text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gradient-gold">21</span>
                <span className="text-xs sm:text-sm text-primary-foreground/60 tracking-wide">Formes Différentes</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="block text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gradient-gold">100%</span>
                <span className="text-xs sm:text-sm text-primary-foreground/60 tracking-wide">Fait Main</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="block text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gradient-gold">∞</span>
                <span className="text-xs sm:text-sm text-primary-foreground/60 tracking-wide">Héritage</span>
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div 
            className="order-1 lg:order-2 relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative rounded-lg overflow-hidden shadow-card">
              <img
                src={artisanImg}
                alt="Artisan Touareg façonnant une Croix d'Agadez"
                className="w-full h-auto object-cover aspect-[4/5] sm:aspect-[3/4]"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -left-4 w-16 sm:w-24 h-16 sm:h-24 border-2 border-gold/30 rounded-lg -z-10 hidden sm:block" />
            <div className="absolute -top-4 -right-4 w-12 sm:w-16 h-12 sm:h-16 bg-gold/10 rounded-lg -z-10 hidden sm:block" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Heritage;
