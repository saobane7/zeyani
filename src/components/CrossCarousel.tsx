import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { crossDescriptions } from "@/data/products";

const CrossCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % crossDescriptions.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + crossDescriptions.length) % crossDescriptions.length);
  }, []);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const currentCross = crossDescriptions[currentIndex];

  return (
    <section className="py-16 lg:py-24 bg-primary overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="gold-line w-16 mx-auto mb-4" />
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-cream mb-4">
            Les <span className="text-gradient-gold font-semibold">Croix du Niger</span>
          </h2>
          <p className="text-cream/70 max-w-2xl mx-auto text-base sm:text-lg">
            Découvrez les différentes croix touareg, chacune avec sa propre histoire et symbolique
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[400px] lg:min-h-[450px]">
            {/* Image Side */}
            <div className="relative aspect-square max-w-sm mx-auto w-full order-1 lg:order-1">
              <div className="absolute inset-0 rounded-2xl overflow-hidden bg-primary-foreground/5">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.img
                    key={currentIndex}
                    src={currentCross.image}
                    alt={currentCross.name}
                    className="w-full h-full object-cover"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                  />
                </AnimatePresence>
              </div>
              
              {/* Decorative frame */}
              <div className="absolute -inset-3 border border-gold/20 rounded-2xl pointer-events-none" />
              <div className="absolute -inset-6 border border-gold/10 rounded-3xl pointer-events-none hidden lg:block" />
            </div>

            {/* Content Side */}
            <div className="text-center lg:text-left order-2 lg:order-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-gold text-sm font-medium tracking-widest uppercase mb-3 block">
                    {currentIndex + 1} / {crossDescriptions.length}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-cream mb-4">
                    {currentCross.name}
                  </h3>
                  <p className="text-cream/70 text-base sm:text-lg leading-relaxed mb-6 max-w-md mx-auto lg:mx-0">
                    {currentCross.description}
                  </p>
                  <Link to={`/produit/${currentCross.slug}`}>
                    <Button variant="gold" size="lg" className="group">
                      Découvrir ce collier
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-2 lg:-mx-16">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSlide}
              className="pointer-events-auto h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-cream/10 hover:bg-cream/20 text-cream backdrop-blur-sm"
            >
              <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              className="pointer-events-auto h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-cream/10 hover:bg-cream/20 text-cream backdrop-blur-sm"
            >
              <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6" />
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {crossDescriptions.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-gold w-8"
                    : "bg-cream/30 hover:bg-cream/50"
                }`}
                aria-label={`Aller à la croix ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrossCarousel;
