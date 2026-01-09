import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock, MessageCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({
      title: "Message envoyé !",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
    
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "contact@zeyani.fr",
      href: "mailto:contact@zeyani.fr",
    },
    {
      icon: Phone,
      title: "Téléphone",
      content: "+33 1 23 45 67 89",
      href: "tel:+33123456789",
    },
    {
      icon: MapPin,
      title: "Adresse",
      content: "Paris, France",
      subContent: "Livraison dans toute la France",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-20">
        {/* Hero Banner */}
        <section className="bg-primary py-12 sm:py-16 lg:py-24">
          <motion.div 
            className="container mx-auto px-4 lg:px-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="gold-line w-16 mx-auto mb-4 sm:mb-6" />
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-cream mb-3 sm:mb-4">
              Nous <span className="text-gradient-gold font-semibold">Contacter</span>
            </h1>
            <p className="text-cream/80 max-w-2xl mx-auto text-base sm:text-lg px-4">
              Une question sur nos produits ? Besoin d'un conseil ? 
              Notre équipe est à votre écoute.
            </p>
          </motion.div>
        </section>

        {/* Contact Content */}
        <section className="py-12 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-20">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground mb-6 lg:mb-8">
                  Informations de contact
                </h2>
                
                <div className="space-y-4 sm:space-y-6">
                  {contactInfo.map((info) => (
                    <div key={info.title} className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-4 w-4 sm:h-5 sm:w-5 text-gold-dark" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base">{info.title}</h3>
                        {info.href ? (
                          <a 
                            href={info.href} 
                            className="text-muted-foreground hover:text-gold-dark transition-colors text-sm sm:text-base"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <>
                            <p className="text-muted-foreground text-sm sm:text-base">{info.content}</p>
                            {info.subContent && (
                              <p className="text-muted-foreground/70 text-xs sm:text-sm">{info.subContent}</p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hours */}
                <div className="mt-8 lg:mt-12 p-4 sm:p-6 bg-sand-light rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-5 w-5 text-gold-dark" />
                    <h3 className="font-display text-base sm:text-lg font-semibold">Horaires</h3>
                  </div>
                  <div className="text-muted-foreground text-sm space-y-1">
                    <p>Lundi - Vendredi : 9h00 - 18h00</p>
                    <p>Samedi : 10h00 - 16h00</p>
                    <p>Dimanche : Fermé</p>
                  </div>
                </div>

                {/* Response time */}
                <div className="mt-4 p-4 sm:p-6 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="h-5 w-5 text-gold-dark" />
                    <h3 className="font-display text-base sm:text-lg font-semibold">Temps de réponse</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Nous répondons généralement sous 24h ouvrées.
                  </p>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground mb-6 lg:mb-8">
                  Envoyez-nous un message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
                        className="h-11 sm:h-12"
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
                        className="h-11 sm:h-12"
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
                      className="h-11 sm:h-12"
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
                      className="resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="gold" 
                    size="lg" 
                    className="w-full sm:w-auto"
                    disabled={isSubmitting || isSubmitted}
                  >
                    {isSubmitted ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Message envoyé !
                      </>
                    ) : isSubmitting ? (
                      <>
                        <div className="h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Teaser */}
        <section className="py-12 lg:py-20 bg-sand-light">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-display text-2xl sm:text-3xl font-light text-foreground mb-4">
                Questions <span className="text-gradient-gold font-semibold">Fréquentes</span>
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Livraison, retours, entretien des bijoux... Trouvez rapidement 
                les réponses à vos questions.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="p-4 bg-card rounded-lg text-left">
                  <h3 className="font-semibold mb-2 text-sm">Délais de livraison</h3>
                  <p className="text-muted-foreground text-xs">2-5 jours ouvrés en France métropolitaine</p>
                </div>
                <div className="p-4 bg-card rounded-lg text-left">
                  <h3 className="font-semibold mb-2 text-sm">Retours gratuits</h3>
                  <p className="text-muted-foreground text-xs">30 jours pour changer d'avis</p>
                </div>
                <div className="p-4 bg-card rounded-lg text-left">
                  <h3 className="font-semibold mb-2 text-sm">Paiement sécurisé</h3>
                  <p className="text-muted-foreground text-xs">CB, PayPal, virement bancaire</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
