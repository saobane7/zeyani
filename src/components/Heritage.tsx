import artisanImg from "@/assets/artisan-tuareg.jpg";

const Heritage = () => {
  return (
    <section id="heritage" className="py-24 lg:py-32 bg-primary text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <div className="gold-line w-16 mb-8" />
            
            <span className="inline-block mb-4 text-gold font-medium text-sm tracking-[0.25em] uppercase">
              L'Héritage Touareg
            </span>
            
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light mb-8 leading-tight">
              La Croix d'Agadez
              <br />
              <span className="text-gradient-gold font-semibold">Un Symbole Éternel</span>
            </h2>
            
            <div className="space-y-6 text-primary-foreground/80 text-lg leading-relaxed">
              <p>
                La Croix d'Agadez, symbole emblématique du peuple Touareg, 
                représente bien plus qu'un simple bijou. Elle incarne les 
                <strong className="text-gold"> quatre points cardinaux</strong>, 
                guidant les nomades à travers l'immensité du désert du Sahara.
              </p>
              
              <p>
                Traditionnellement offerte de père en fils, elle porte en elle 
                une bénédiction ancestrale : <em className="text-cream italic">
                "Je te donne les quatre directions du monde, 
                car on ne sait pas où tu mourras."</em>
              </p>
              
              <p>
                Chaque croix est unique, façonnée à la main par des maîtres 
                artisans d'Agadez selon des techniques transmises depuis des siècles.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-primary-foreground/20">
              <div>
                <span className="block text-3xl md:text-4xl font-display font-bold text-gradient-gold">21</span>
                <span className="text-sm text-primary-foreground/60 tracking-wide">Formes Différentes</span>
              </div>
              <div>
                <span className="block text-3xl md:text-4xl font-display font-bold text-gradient-gold">100%</span>
                <span className="text-sm text-primary-foreground/60 tracking-wide">Fait Main</span>
              </div>
              <div>
                <span className="block text-3xl md:text-4xl font-display font-bold text-gradient-gold">∞</span>
                <span className="text-sm text-primary-foreground/60 tracking-wide">Héritage</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={artisanImg}
                alt="Artisan Touareg façonnant une Croix d'Agadez"
                className="w-full h-auto object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-2 border-gold/30 rounded-lg -z-10" />
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gold/10 rounded-lg -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Heritage;
