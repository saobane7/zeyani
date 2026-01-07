import braceletImg from "@/assets/bracelet-1.jpg";
import necklaceImg from "@/assets/necklace-1.jpg";
import ringImg from "@/assets/ring-1.jpg";

const categories = [
  {
    name: "Bracelets",
    description: "Manchettes et bracelets aux motifs géométriques ancestraux",
    image: braceletImg,
    count: 24,
  },
  {
    name: "Colliers",
    description: "Colliers ornés de perles d'ambre et pendentifs traditionnels",
    image: necklaceImg,
    count: 18,
  },
  {
    name: "Bagues",
    description: "Bagues gravées aux symboles berbères authentiques",
    image: ringImg,
    count: 32,
  },
];

const Categories = () => {
  return (
    <section id="categories" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block mb-4 text-accent font-medium text-sm tracking-widest uppercase">
            Nos Collections
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Catégories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Explorez notre sélection de bijoux artisanaux, façonnés avec passion 
            par les maîtres artisans du Niger.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <a
              key={category.name}
              href="#"
              className="group relative overflow-hidden rounded-2xl bg-card shadow-soft hover:shadow-card transition-all duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="aspect-square overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-chocolate/80 via-chocolate/20 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-cream mb-2">
                      {category.name}
                    </h3>
                    <p className="text-cream/80 text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                  <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    {category.count}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
