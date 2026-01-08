import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message envoyé !",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Banner */}
        <section className="bg-primary py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <div className="gold-line w-16 mx-auto mb-6" />
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-cream mb-4">
              Nous <span className="text-gradient-gold font-semibold">Contacter</span>
            </h1>
            <p className="text-cream/80 max-w-2xl mx-auto text-lg">
              Une question sur nos produits ? Besoin d'un conseil ? 
              Notre équipe est à votre écoute.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Contact Info */}
              <div>
                <h2 className="font-display text-2xl lg:text-3xl font-semibold text-foreground mb-8">
                  Informations de contact
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-gold-dark" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <a href="mailto:contact@zeyani.fr" className="text-muted-foreground hover:text-gold-dark transition-colors">
                        contact@zeyani.fr
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-gold-dark" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Téléphone</h3>
                      <a href="tel:+33123456789" className="text-muted-foreground hover:text-gold-dark transition-colors">
                        +33 1 23 45 67 89
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-gold-dark" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Adresse</h3>
                      <p className="text-muted-foreground">
                        Paris, France<br />
                        Livraison dans toute la France
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-6 bg-sand-light rounded-lg">
                  <h3 className="font-display text-lg font-semibold mb-3">Horaires</h3>
                  <p className="text-muted-foreground text-sm">
                    Lundi - Vendredi : 9h00 - 18h00<br />
                    Samedi : 10h00 - 16h00<br />
                    Dimanche : Fermé
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="font-display text-2xl lg:text-3xl font-semibold text-foreground mb-8">
                  Envoyez-nous un message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Nom complet
                      </label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="votre@email.fr"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Sujet
                    </label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Le sujet de votre message"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Votre message..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" variant="gold" size="lg" className="w-full sm:w-auto">
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer le message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
