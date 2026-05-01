interface Props {
  activeCategory: string;
  onSelect: (id: string) => void;
}

export function CategoryTabs({ activeCategory, onSelect }: Props) {
  const categories = [
    { id: "", label: "All" },
    { id: "layer-1", label: "Layer 1" },
    { id: "decentralized-finance-defi", label: "DeFi" },
    { id: "stablecoins", label: "Stablecoins" },
    { id: "meme-token", label: "Meme" },
    { id: "artificial-intelligence", label: "AI" },
  ];

  return (
    <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`min-h-12 rounded-2xl border px-4 py-2 text-center text-sm font-medium transition-colors sm:min-h-0 sm:w-auto sm:rounded-full sm:px-4 sm:py-1.5 ${
            activeCategory === cat.id
              ? "border-primary/25 bg-primary/18 text-primary shadow-soft"
              : "border-border/70 bg-card/45 text-muted-foreground hover:border-primary/18 hover:bg-surface-elevated hover:text-foreground"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
