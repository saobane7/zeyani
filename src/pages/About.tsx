import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";
import { motion } from "framer-motion";
import hommeTouaregImg from "@/assets/homme-touareg.webp";
import aboutImage from "@/assets/about-jewelry.jpg";

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
              L'histoire des croix <span className="text-gradient-gold font-semibold">Touarègues</span>
            </h1>
            <p className="text-cream/80 max-w-2xl mx-auto text-lg">
              Découvrez l'héritage millénaire d'un symbole sacré transmis de génération en génération.
            </p>
          </div>
        </section>

        {/* Main History Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-gold-dark font-medium text-sm tracking-[0.25em] uppercase mb-4 block">
                  Au cœur du Sahara
                </span>
                <h2 className="font-display text-3xl lg:text-4xl font-light text-foreground mb-6">
                  Un peuple, <span className="text-gradient-gold font-semibold">une tradition</span>
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Au cœur du Sahara, là où le sable rencontre le ciel et où le silence a valeur de sagesse, 
                    vit depuis des siècles le peuple touareg. Nomades du désert, les Touaregs ont transmis 
                    leur histoire non par des livres, mais par des symboles, des gestes et des objets sacrés.
                  </p>
                  <p>
                    Parmi eux, la croix touarègue occupe une place centrale. Contrairement à ce que son nom 
                    pourrait suggérer, la croix touarègue n'a aucune origine religieuse chrétienne. Elle est 
                    un symbole ancestral, bien plus ancien, transmis de père en fils.
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <img
                  src={hommeTouaregImg}
                  alt="Homme Touareg avec le voile traditionnel bleu indigo"
                  className="rounded-lg shadow-card w-full object-cover aspect-[4/3]"
                />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-gold/30 rounded-lg -z-10" />
              </motion.div>
            </div>

            {/* Quote Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-primary rounded-lg p-8 lg:p-12 text-center mb-16"
            >
              <div className="gold-line w-16 mx-auto mb-6" />
              <blockquote className="font-display text-2xl lg:text-3xl text-cream italic mb-4">
                « Je te donne les quatre directions du monde, car nul ne sait où tu iras mourir. »
              </blockquote>
              <p className="text-cream/70">
                — Paroles traditionnelles d'un père à son fils lors de la transmission de la croix
              </p>
            </motion.div>

            {/* Symbolism Section */}
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-2 lg:order-1"
              >
                <span className="text-gold-dark font-medium text-sm tracking-[0.25em] uppercase mb-4 block">
                  Symbolisme
                </span>
                <h2 className="font-display text-3xl lg:text-4xl font-light text-foreground mb-6">
                  Les quatre <span className="text-gradient-gold font-semibold">points cardinaux</span>
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    La croix touarègue représente les quatre points cardinaux : le nord, le sud, l'est 
                    et l'ouest. Elle rappelle au porteur qu'il doit être capable de s'orienter dans le 
                    désert, mais aussi dans la vie.
                  </p>
                  <p>
                    C'est un symbole de <strong className="text-foreground">liberté</strong>, de 
                    <strong className="text-foreground"> responsabilité</strong>, et de 
                    <strong className="text-foreground"> protection</strong>.
                  </p>
                  <p>
                    Traditionnellement, un père offrait une croix à son fils lorsqu'il atteignait l'âge 
                    adulte. Ce geste marquait le passage vers l'autonomie et la capacité de tracer son 
                    propre chemin à travers l'immensité du désert.
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="order-1 lg:order-2 relative"
              >
                <img
                  src={aboutImage}
                  alt="Bijoux Touareg authentiques"
                  className="rounded-lg shadow-card w-full"
                />
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gold/10 rounded-lg -z-10" />
              </motion.div>
            </div>

            {/* Varieties Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-sand-light rounded-lg p-8 lg:p-12 mb-16"
            >
              <div className="text-center mb-8">
                <span className="text-gold-dark font-medium text-sm tracking-[0.25em] uppercase mb-4 block">
                  Diversité
                </span>
                <h2 className="font-display text-3xl lg:text-4xl font-light text-foreground">
                  Plus de <span className="text-gradient-gold font-semibold">vingt formes</span> différentes
                </h2>
              </div>
              <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground leading-relaxed text-center">
                <p>
                  Il n'existe pas une seule croix touarègue, mais plus de vingt formes différentes, 
                  chacune liée à une région précise du Sahara : Agadez, In Gall, Tahoua, Zinder, et bien d'autres.
                </p>
                <p>
                  Chaque variante possède ses propres lignes, ses proportions et son identité, servant 
                  autrefois de marque d'appartenance culturelle. Un Touareg pouvait reconnaître l'origine 
                  d'un autre simplement en observant la forme de sa croix.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
                <div className="text-center">
                  <span className="block text-2xl font-display font-bold text-gradient-gold">Agadez</span>
                  <span className="text-sm text-muted-foreground">La plus célèbre</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-display font-bold text-gradient-gold">Tahoua</span>
                  <span className="text-sm text-muted-foreground">Élégante et fine</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-display font-bold text-gradient-gold">Zinder</span>
                  <span className="text-sm text-muted-foreground">Aux motifs complexes</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-display font-bold text-gradient-gold">In Gall</span>
                  <span className="text-sm text-muted-foreground">Géométrique</span>
                </div>
              </div>
            </motion.div>

            {/* Protection Section */}
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-gold-dark font-medium text-sm tracking-[0.25em] uppercase mb-4 block">
                  Protection
                </span>
                <h2 className="font-display text-3xl lg:text-4xl font-light text-foreground mb-6">
                  Une amulette <span className="text-gradient-gold font-semibold">sacrée</span>
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Forgée à la main, souvent en argent, la croix touarègue n'était pas seulement un bijou. 
                    Elle servait aussi d'amulette, portée contre la poitrine pour protéger le voyageur des 
                    dangers du désert.
                  </p>
                  <p>
                    La soif, la perte de repères, les tempêtes de sable et les mauvais esprits selon les 
                    croyances anciennes : tous ces périls étaient tenus à distance par ce symbole puissant.
                  </p>
                  <p className="text-foreground font-medium">
                    Aujourd'hui encore, porter une croix touarègue, c'est porter un héritage vivant. Elle 
                    incarne le courage, l'orientation, l'identité et le respect des traditions d'un peuple 
                    libre, fier et profondément lié à la nature.
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-primary rounded-lg p-8 lg:p-12 text-center"
              >
                <div className="gold-line w-16 mx-auto mb-6" />
                <p className="font-display text-xl lg:text-2xl text-cream italic mb-6">
                  Chaque croix raconte une histoire.<br />
                  Celle du désert.<br />
                  Celle du voyage.<br />
                  Et peut-être bientôt, la vôtre.
                </p>
                <div className="flex justify-center gap-8 mt-8">
                  <div className="text-center">
                    <span className="block text-3xl font-display font-bold text-gradient-gold">20+</span>
                    <span className="text-sm text-cream/60">Formes</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-3xl font-display font-bold text-gradient-gold">100%</span>
                    <span className="text-sm text-cream/60">Fait Main</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-3xl font-display font-bold text-gradient-gold">∞</span>
                    <span className="text-sm text-cream/60">Héritage</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 lg:py-24 bg-sand-light">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <div className="gold-line w-16 mx-auto mb-6" />
              <h2 className="font-display text-3xl lg:text-4xl font-light text-foreground">
                Notre <span className="text-gradient-gold font-semibold">Mission</span>
              </h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                ZEYANI est née d'une passion pour préserver et partager l'artisanat ancestral du Niger.
              </p>
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

        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
