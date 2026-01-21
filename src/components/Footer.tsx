import { Link } from "react-router-dom";
import { Facebook, Instagram, MapPin, Phone, Mail, ArrowUp } from "lucide-react";
import { Button } from "./ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = {
    boutique: [
      { name: "Croix Touarègues", href: "/collection" },
      { name: "Bracelets", href: "/collection" },
      { name: "Colliers", href: "/collection" },
    ],
    informations: [
      { name: "Notre Histoire", href: "/notre-histoire" },
      { name: "L'Héritage Touareg", href: "/notre-histoire" },
      { name: "Guide des Tailles", href: "/guide-des-tailles" },
    ],
    service: [
      { name: "Contact", href: "/contact" },
      { name: "Livraison", href: "/contact" },
      { name: "Retours", href: "/contact" },
      { name: "FAQ", href: "/contact" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <footer id="contact" className="bg-obsidian text-cream relative">
      {/* Scroll to top button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -top-5 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-gold text-obsidian hover:bg-gold-dark hover:text-cream shadow-gold transition-all"
        onClick={scrollToTop}
      >
        <ArrowUp className="h-5 w-5" />
      </Button>

      <div className="container mx-auto px-4 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/">
              <h3 className="font-display text-2xl sm:text-3xl font-bold mb-2 tracking-wider">
                <span className="text-gradient-gold">ZEYANI</span>
              </h3>
            </Link>
            <p className="text-xs sm:text-sm text-cream/50 mb-4 tracking-widest uppercase">
              L'Élégance Touareg
            </p>
            <p className="text-cream/60 mb-6 leading-relaxed max-w-md text-xs sm:text-sm">
              Bijoux artisanaux authentiques du Niger. Les croix touarègues, 
              symboles ancestraux transmis de génération en génération, 
              désormais accessibles depuis la France.
            </p>
            
            {/* Contact */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-3 text-cream/60 text-xs sm:text-sm">
                <MapPin className="h-4 w-4 text-gold flex-shrink-0" />
                <span>Livraison dans toute la France</span>
              </div>
              <a href="tel:+33780170158" className="flex items-center gap-3 text-cream/60 text-xs sm:text-sm hover:text-gold transition-colors">
                <Phone className="h-4 w-4 text-gold flex-shrink-0" />
                <span>+33 7 80 17 01 58</span>
              </a>
              <a href="mailto:contact@zeyani.fr" className="flex items-center gap-3 text-cream/60 text-xs sm:text-sm hover:text-gold transition-colors">
                <Mail className="h-4 w-4 text-gold flex-shrink-0" />
                <span>contact@zeyani.fr</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cream/10 hover:bg-gold flex items-center justify-center transition-colors duration-300"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Boutique */}
          <div>
            <h4 className="font-display text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-cream">Boutique</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.boutique.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-cream/60 hover:text-gold transition-colors duration-200 text-xs sm:text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h4 className="font-display text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-cream">Informations</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.informations.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-cream/60 hover:text-gold transition-colors duration-200 text-xs sm:text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Client */}
          <div>
            <h4 className="font-display text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-cream">Service Client</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.service.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-cream/60 hover:text-gold transition-colors duration-200 text-xs sm:text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream/10">
        <div className="container mx-auto px-4 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-cream/40 text-xs sm:text-sm text-center sm:text-left">
              © {currentYear} ZEYANI. Tous droits réservés.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <Link to="/mentions-legales" className="text-cream/40 hover:text-gold transition-colors">
                Mentions Légales
              </Link>
              <Link to="/confidentialite" className="text-cream/40 hover:text-gold transition-colors">
                Confidentialité
              </Link>
              <Link to="/cgv" className="text-cream/40 hover:text-gold transition-colors">
                CGV
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
