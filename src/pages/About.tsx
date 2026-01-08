import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";
import Heritage from "@/components/Heritage";
import artisanImage from "@/assets/artisan-tuareg.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Banner */}
        <section className="relative bg-primary py-20 lg:py-32">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <div className="gold-line w-16 mx-auto mb-6" />
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-cream mb-4">
              Notre <span className="text-gradient-gold font-semibold">Histoire</span>
            </h1>
            <p className="text-cream/80 max-w-2xl mx-auto text-lg">
              Découvrez l'héritage millénaire de l'artisanat Touareg 
              et notre mission de le faire rayonner en France.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-gold-dark font-medium text-sm tracking-[0.25em] uppercase mb-4 block">
                  Qui sommes-nous
                </span>
                <h2 className="font-display text-3xl lg:text-4xl font-light text-foreground mb-6">
                  ZEYANI, <span className="text-gradient-gold font-semibold">passeur de traditions</span>
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Fondée avec la passion de préserver et partager l'artisanat ancestral du Niger, 
                    ZEYANI est née d'une rencontre entre deux mondes : la France et le Sahara.
                  </p>
                  <p>
                    Notre mission est de faire découvrir aux Français la richesse culturelle du peuple 
                    Touareg à travers ses bijoux emblématiques : la Croix d'Agadez, les bracelets gravés, 
                    les colliers de perles traditionnelles.
                  </p>
                  <p>
                    Chaque pièce que nous proposons est fabriquée par des artisans Touaregs du Niger, 
                    perpétuant des techniques transmises de génération en génération depuis des siècles.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img
                  src={artisanImage}
                  alt="Artisan Touareg"
                  className="rounded-lg shadow-card w-full"
                />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-gold/30 rounded-lg -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 lg:py-24 bg-sand-light">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <div className="gold-line w-16 mx-auto mb-6" />
              <h2 className="font-display text-3xl lg:text-4xl font-light text-foreground">
                Nos <span className="text-gradient-gold font-semibold">Valeurs</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg p-8 text-center shadow-soft">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">Commerce Équitable</h3>
                <p className="text-muted-foreground text-sm">
                  Nous travaillons directement avec les artisans pour garantir une rémunération juste.
                </p>
              </div>
              <div className="bg-card rounded-lg p-8 text-center shadow-soft">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">Authenticité</h3>
                <p className="text-muted-foreground text-sm">
                  Chaque bijou est unique, façonné à la main selon des méthodes ancestrales.
                </p>
              </div>
              <div className="bg-card rounded-lg p-8 text-center shadow-soft">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">Héritage</h3>
                <p className="text-muted-foreground text-sm">
                  Nous préservons et transmettons le savoir-faire millénaire des Touaregs.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Heritage />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
