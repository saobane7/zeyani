import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="py-20 lg:py-24 bg-primary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Restez Informé
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Inscrivez-vous à notre newsletter pour découvrir nos nouvelles collections, 
            offres exclusives et histoires d'artisans.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-accent"
            />
            <Button variant="gold" size="lg" type="submit">
              S'inscrire
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <p className="text-primary-foreground/60 text-sm mt-4">
            En vous inscrivant, vous acceptez notre politique de confidentialité.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
