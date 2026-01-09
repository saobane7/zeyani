import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      toast({
        title: "Inscription réussie !",
        description: "Vous recevrez bientôt nos actualités exclusives.",
      });
      setEmail("");
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-16 lg:py-20 xl:py-24 bg-primary overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="gold-line w-16 mx-auto mb-6 lg:mb-8" />
          
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-primary-foreground mb-4">
            Rejoignez la <span className="text-gradient-gold font-semibold">Communauté ZEYANI</span>
          </h2>
          
          <p className="text-primary-foreground/75 text-base lg:text-lg mb-6 lg:mb-8 px-4">
            Inscrivez-vous pour recevoir en avant-première nos nouvelles collections, 
            offres exclusives et histoires d'artisans.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto px-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              className="flex-1 h-11 lg:h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-gold focus:ring-gold"
              required
            />
            <Button 
              variant="gold" 
              size="lg" 
              type="submit"
              className="h-11 lg:h-12"
              disabled={isSubmitted}
            >
              {isSubmitted ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Inscrit !
                </>
              ) : (
                <>
                  S'inscrire
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-primary-foreground/50 text-xs sm:text-sm mt-4 lg:mt-6 px-4">
            En vous inscrivant, vous acceptez notre politique de confidentialité. 
            Désabonnement possible à tout moment.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
