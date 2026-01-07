import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    boutique: [
      { name: "Bracelets", href: "#" },
      { name: "Colliers", href: "#" },
      { name: "Bagues", href: "#" },
      { name: "Nouvelles Arrivées", href: "#" },
      { name: "Promotions", href: "#" },
    ],
    informations: [
      { name: "Notre Histoire", href: "#" },
      { name: "Artisans Partenaires", href: "#" },
      { name: "Guide des Tailles", href: "#" },
      { name: "Entretien des Bijoux", href: "#" },
      { name: "FAQ", href: "#" },
    ],
    service: [
      { name: "Contact", href: "#" },
      { name: "Livraison", href: "#" },
      { name: "Retours & Remboursements", href: "#" },
      { name: "Suivi de Commande", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  return (
    <footer className="bg-chocolate text-cream">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-3xl font-bold mb-4">
              Ténéré <span className="text-gradient-gold">Bijoux</span>
            </h3>
            <p className="text-cream/70 mb-6 leading-relaxed max-w-md">
              Bijoux artisanaux du Niger, façonnés avec amour par les maîtres 
              artisans Touaregs. Chaque pièce est unique et raconte une histoire.
            </p>
            
            {/* Contact */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-cream/70">
                <MapPin className="h-5 w-5 text-accent" />
                <span>Niamey, Niger</span>
              </div>
              <div className="flex items-center gap-3 text-cream/70">
                <Phone className="h-5 w-5 text-accent" />
                <span>+227 XX XX XX XX</span>
              </div>
              <div className="flex items-center gap-3 text-cream/70">
                <Mail className="h-5 w-5 text-accent" />
                <span>contact@tenere-bijoux.ne</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-cream/10 hover:bg-accent flex items-center justify-center transition-colors duration-300"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Boutique */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Boutique</h4>
            <ul className="space-y-3">
              {footerLinks.boutique.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-cream/70 hover:text-accent transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Informations</h4>
            <ul className="space-y-3">
              {footerLinks.informations.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-cream/70 hover:text-accent transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Client */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Service Client</h4>
            <ul className="space-y-3">
              {footerLinks.service.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-cream/70 hover:text-accent transition-colors duration-200"
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
            <p className="text-cream/50 text-sm">
              © {currentYear} Ténéré Bijoux. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-cream/50 hover:text-accent transition-colors">
                Mentions Légales
              </a>
              <a href="#" className="text-cream/50 hover:text-accent transition-colors">
                Politique de Confidentialité
              </a>
              <a href="#" className="text-cream/50 hover:text-accent transition-colors">
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
