import type { Coin } from "@/services/cryptoApi";
import { fmtPct, fmtUSD } from "@/utils/format";

interface Props {
  coins: Coin[];
}

export function TrendingTicker({ coins }: Props) {
  if (!coins.length) return null;

  // Get top 5 gainers
  const topGainers = [...coins]
    .sort((a, b) => (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0))
    .slice(0, 5);

  // duplicate for seamless loop
  const loop = [...topGainers, ...topGainers, ...topGainers];

  return (
    <div className="w-full border-b border-border bg-surface-elevated/30 py-2">
      <div className="mx-auto flex max-w-6xl items-center px-4 sm:px-6">
        <div className="z-10 flex shrink-0 items-center gap-1.5 border-r border-border pr-3 bg-background/80 backdrop-blur-sm sm:gap-2 sm:pr-4">
          <span className="text-sm">🔥</span>
          <span className="hidden text-xs font-bold uppercase tracking-widest text-muted-foreground xs:block sm:block">
            Trending
          </span>
        </div>
        
        <div
          className="relative ml-4 flex-1 overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          }}
        >
          <div className="flex w-max gap-5 animate-marquee sm:gap-8">
            {loop.map((c, i) => {
              const change = c.price_change_percentage_24h ?? 0;
              const up = change >= 0;
              return (
                <div key={`${c.id}-${i}`} className="flex items-center gap-3">
                  <span className="font-display text-sm font-semibold text-foreground">
                    {c.name}
                  </span>
                  <span className="font-mono text-sm text-foreground">
                    {fmtUSD(c.current_price)}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      up ? "text-success" : "text-danger"
                    }`}
                  >
                    {up ? "+" : ""}
                    {change.toFixed(2)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
