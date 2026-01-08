import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="py-20 lg:py-24 bg-primary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="gold-line w-16 mx-auto mb-8" />
          
          <h2 className="font-display text-3xl md:text-4xl font-light text-primary-foreground mb-4">
            Rejoignez la <span className="text-gradient-gold font-semibold">Communauté ZEYANI</span>
          </h2>
          
          <p className="text-primary-foreground/75 text-lg mb-8">
            Inscrivez-vous pour recevoir en avant-première nos nouvelles collections, 
            offres exclusives et histoires d'artisans.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-gold focus:ring-gold"
            />
            <Button variant="gold" size="lg" type="submit">
              S'inscrire
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <p className="text-primary-foreground/50 text-sm mt-6">
            En vous inscrivant, vous acceptez notre politique de confidentialité. 
            Désabonnement possible à tout moment.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
