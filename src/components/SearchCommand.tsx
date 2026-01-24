import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useProducts } from "@/hooks/useProducts";
import { formatPrice } from "@/hooks/useProducts";

interface SearchCommandProps {
  isScrolled?: boolean;
}

const SearchCommand = ({ isScrolled = false }: SearchCommandProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { data: products, isLoading } = useProducts();

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

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center justify-center h-10 w-10 rounded-md transition-colors ${
          isScrolled 
            ? "hover:bg-muted" 
            : "text-cream hover:bg-cream/10"
        }`}
        aria-label="Rechercher"
      >
        <Search className="h-5 w-5" />
      </button>

      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="h-4 w-4 opacity-50" />
            </button>
          )}
        </div>
        <CommandList>
          {isLoading ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Chargement...
            </div>
          ) : search.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Tapez pour rechercher parmi nos produits...
            </div>
          ) : filteredProducts?.length === 0 ? (
            <CommandEmpty>
              <div className="flex flex-col items-center gap-2 py-4">
                <p>Aucun produit trouvé pour "{search}"</p>
                <p className="text-xs text-muted-foreground">
                  Essayez avec un autre terme de recherche
                </p>
              </div>
            </CommandEmpty>
          ) : (
            <>
              {/* Colliers */}
              {filteredProducts?.filter(p => p.category === "colliers").length > 0 && (
                <CommandGroup heading="Colliers">
                  {filteredProducts
                    .filter(p => p.category === "colliers")
                    .map((product) => (
                      <CommandItem
                        key={product.id}
                        value={product.name}
                        onSelect={() => handleSelect(product.slug)}
                        className="flex items-center gap-3 py-3 cursor-pointer"
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
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}

              {/* Bracelets */}
              {filteredProducts?.filter(p => p.category === "bracelets").length > 0 && (
                <CommandGroup heading="Bracelets">
                  {filteredProducts
                    .filter(p => p.category === "bracelets")
                    .map((product) => (
                      <CommandItem
                        key={product.id}
                        value={product.name}
                        onSelect={() => handleSelect(product.slug)}
                        className="flex items-center gap-3 py-3 cursor-pointer"
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
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}

              {/* Autres catégories */}
              {filteredProducts?.filter(p => !["colliers", "bracelets"].includes(p.category)).length > 0 && (
                <CommandGroup heading="Autres">
                  {filteredProducts
                    .filter(p => !["colliers", "bracelets"].includes(p.category))
                    .map((product) => (
                      <CommandItem
                        key={product.id}
                        value={product.name}
                        onSelect={() => handleSelect(product.slug)}
                        className="flex items-center gap-3 py-3 cursor-pointer"
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
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>

        <div className="border-t p-2 text-center text-xs text-muted-foreground">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
          <span className="ml-2">pour ouvrir la recherche</span>
        </div>
      </CommandDialog>
    </>
  );
};

export default SearchCommand;
