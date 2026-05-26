import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { crossDescriptions } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";

interface HeroSlide {
  name: string;
  highlight?: string;
  description: string;
  image: string;
  slug?: string;
}

const defaultSlides: HeroSlide[] = crossDescriptions.map((c) => ({
  name: c.name,
  highlight: c.name.replace("Croix ", ""),
  description: c.description,
  image: c.image,
  slug: c.slug,
}));

const Hero = () => {
  const [slides, setSlides] = useState<HeroSlide[]>(defaultSlides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Charge les diapositives gérées depuis l'admin (si présentes)
  useEffect(() => {
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "hero_slides")
      .maybeSingle()
      .then(({ data }) => {
        const v = (data?.value as any) || [];
        if (Array.isArray(v) && v.length > 0) {
          const mapped: HeroSlide[] = v
            .filter((s: any) => s?.name && s?.image_url)
            .map((s: any) => ({
              name: s.name,
              highlight: s.highlight || s.name,
              description: s.description || "",
              image: s.image_url,
              slug: s.slug || "",
            }));
          if (mapped.length > 0) setSlides(mapped);
        }
      });
  }, []);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;
    const interval = setInterval(nextSlide, 30000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, slides.length]);

  // Garde l'index dans les bornes si la liste change
  useEffect(() => {
    if (currentIndex >= slides.length) setCurrentIndex(0);
  }, [slides.length, currentIndex]);

  const scrollToCollection = () => {
    const element = document.getElementById("collection");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  const current = slides[currentIndex] || slides[0];
  const titleHighlight = current.highlight || current.name;
  const titleStart = current.highlight && current.name.includes(current.highlight)
    ? current.name.replace(current.highlight, "").trim()
    : "La Croix";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 lg:pt-20">
      {/* Background Image with Carousel */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.img
            key={currentIndex}
            src={current.image}
            alt={current.name}
            className="w-full h-full object-cover"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
            }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-overlay" />
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 lg:left-8 lg:right-8 flex justify-between z-20 pointer-events-none">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className="pointer-events-auto h-12 w-12 lg:h-14 lg:w-14 rounded-full bg-cream/10 hover:bg-cream/20 text-cream backdrop-blur-sm border border-cream/20"
          >
            <ChevronLeft className="h-6 w-6 lg:h-7 lg:w-7" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="pointer-events-auto h-12 w-12 lg:h-14 lg:w-14 rounded-full bg-cream/10 hover:bg-cream/20 text-cream backdrop-blur-sm border border-cream/20"
          >
            <ChevronRight className="h-6 w-6 lg:h-7 lg:w-7" />
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="gold-line w-24 mx-auto mb-8"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />

            <motion.span
              className="inline-block mb-6 px-6 py-2 border border-gold/30 rounded-full text-cream font-medium text-sm tracking-[0.3em] uppercase backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {currentIndex + 1} / {slides.length} • Artisanat d'Exception
            </motion.span>

            <motion.h1
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-cream mb-6 leading-[1.1] tracking-wide"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {titleStart}
              <br />
              <span className="text-gradient-gold font-semibold">{titleHighlight}</span>
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-cream/85 mb-10 max-w-2xl mx-auto font-light leading-relaxed tracking-wide px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {current.description}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {current.slug && (
                <Link to={`/produit/${current.slug}`} className="w-full sm:w-auto">
                  <Button variant="gold" size="xl" className="w-full sm:w-auto group">
                    Découvrir ce collier
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
              <Link to="/collection" className="w-full sm:w-auto">
                <Button
                  variant="heroOutline"
                  size="xl"
                  className="w-full sm:w-auto text-cream border-cream/40 hover:bg-cream/10 hover:border-cream"
                >
                  Toute la Collection
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-gold w-10"
                  : "bg-cream/40 hover:bg-cream/60 w-2"
              }`}
              aria-label={`Aller à la diapositive ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      <motion.button
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-cream/60 hover:text-cream transition-colors cursor-pointer z-20"
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
