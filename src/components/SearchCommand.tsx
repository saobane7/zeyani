import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useProducts } from "@/hooks/useProducts";
import { formatPrice } from "@/hooks/useProducts";

interface SearchCommandProps {
  isScrolled?: boolean;
}

const SearchCommand = ({ isScrolled = false }: SearchCommandProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { data: products, isLoading } = useProducts();

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Open with keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filteredProducts = products?.filter((product) => {
    if (!search) return false;
    const searchLower = search.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      product.material?.toLowerCase().includes(searchLower)
    );
  });

  const handleSelect = useCallback((slug: string) => {
    setOpen(false);
    setSearch("");
    navigate(`/produit/${slug}`);
  }, [navigate]);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setSearch("");
    }
  };

  const handleButtonClick = () => {
    console.log("Search button clicked");
    setOpen(true);
  };

  // Group products by category
  const colliers = filteredProducts?.filter(p => p.category === "colliers") || [];
  const bracelets = filteredProducts?.filter(p => p.category === "bracelets") || [];
  const autres = filteredProducts?.filter(p => !["colliers", "bracelets"].includes(p.category)) || [];

  return (
    <>
      <button
        type="button"
        onClick={handleButtonClick}
        className={`flex items-center justify-center h-10 w-10 rounded-md transition-colors cursor-pointer ${
          isScrolled 
            ? "hover:bg-muted" 
            : "text-cream hover:bg-cream/10"
        }`}
        aria-label="Rechercher"
      >
        <Search className="h-5 w-5" />
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
          <div className="flex items-center border-b px-4 py-3">
            <Search className="mr-3 h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              className="flex h-8 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="p-1.5 hover:bg-muted rounded-md ml-2"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Chargement...
              </div>
            ) : !search ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Tapez pour rechercher parmi nos produits...
              </div>
            ) : filteredProducts?.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">Aucun produit trouvé pour "{search}"</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Essayez avec un autre terme de recherche
                </p>
              </div>
            ) : (
              <div className="py-2">
                {/* Colliers */}
                {colliers.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Colliers
                    </div>
                    {colliers.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleSelect(product.slug)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors cursor-pointer text-left"
                      >
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{product.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {product.description}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-gold-dark">
                          {formatPrice(product.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Bracelets */}
                {bracelets.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Bracelets
                    </div>
                    {bracelets.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleSelect(product.slug)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors cursor-pointer text-left"
                      >
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{product.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {product.description}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-gold-dark">
                          {formatPrice(product.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Autres */}
                {autres.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Autres
                    </div>
                    {autres.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleSelect(product.slug)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors cursor-pointer text-left"
                      >
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{product.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {product.description}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-gold-dark">
                          {formatPrice(product.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t px-4 py-2 text-center text-xs text-muted-foreground bg-muted/30">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium">
              <span className="text-xs">⌘</span>K
            </kbd>
            <span className="ml-2">pour ouvrir la recherche</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchCommand;
