import { Facebook, Instagram, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    boutique: [
      { name: "Croix d'Agadez", href: "#" },
      { name: "Pendentifs", href: "#" },
      { name: "Bracelets", href: "#" },
      { name: "Nouvelles Arrivées", href: "#" },
    ],
    informations: [
      { name: "Notre Histoire", href: "#about" },
      { name: "L'Héritage Touareg", href: "#heritage" },
      { name: "Guide des Tailles", href: "#" },
      { name: "Entretien des Bijoux", href: "#" },
    ],
    service: [
      { name: "Contact", href: "#contact" },
      { name: "Livraison", href: "#" },
      { name: "Retours", href: "#" },
      { name: "FAQ", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <footer id="contact" className="bg-obsidian text-cream">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-3xl font-bold mb-2 tracking-wider">
              <span className="text-gradient-gold">ZEYANI</span>
            </h3>
            <p className="text-sm text-cream/50 mb-4 tracking-widest uppercase">
              L'Élégance Touareg
            </p>
            <p className="text-cream/60 mb-6 leading-relaxed max-w-md text-sm">
              Bijoux artisanaux authentiques du Niger. La Croix d'Agadez, 
              symbole ancestral transmis de génération en génération, 
              désormais accessible depuis la France.
            </p>
            
            {/* Contact */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-cream/60 text-sm">
                <MapPin className="h-4 w-4 text-gold" />
                <span>France - Livraison Internationale</span>
              </div>
              <div className="flex items-center gap-3 text-cream/60 text-sm">
                <Phone className="h-4 w-4 text-gold" />
                <span>+33 1 XX XX XX XX</span>
              </div>
              <div className="flex items-center gap-3 text-cream/60 text-sm">
                <Mail className="h-4 w-4 text-gold" />
                <span>contact@zeyani.fr</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-cream/10 hover:bg-gold flex items-center justify-center transition-colors duration-300"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Boutique */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-cream">Boutique</h4>
            <ul className="space-y-3">
              {footerLinks.boutique.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-cream/60 hover:text-gold transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-cream">Informations</h4>
            <ul className="space-y-3">
              {footerLinks.informations.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-cream/60 hover:text-gold transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Client */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-cream">Service Client</h4>
            <ul className="space-y-3">
              {footerLinks.service.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-cream/60 hover:text-gold transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream/10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-cream/40 text-sm">
              © {currentYear} ZEYANI. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-cream/40 hover:text-gold transition-colors">
                Mentions Légales
              </a>
              <a href="#" className="text-cream/40 hover:text-gold transition-colors">
                Confidentialité
              </a>
              <a href="#" className="text-cream/40 hover:text-gold transition-colors">
                CGV
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
