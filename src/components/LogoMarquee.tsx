import type { Coin } from "@/services/cryptoApi";

interface Props {
  coins: Coin[];
}

/**
 * Right-to-left infinite scrolling marquee of coin logos.
 */
export function LogoMarquee({ coins }: Props) {
  const list = coins.slice(0, 20);
  if (!list.length) return null;
  // duplicate for seamless loop
  const loop = [...list, ...list];

  return (
    <div className="relative w-full overflow-hidden py-10">
      <div className="mb-6 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Trusted Markets
        </div>
        <h3 className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
          Tracking the world's <span className="gradient-text">leading assets</span>
        </h3>
      </div>

      <div
        className="relative w-full"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div className="flex w-max gap-10 animate-marquee">
          {loop.map((c, i) => (
            <div
              key={`${c.id}-${i}`}
              className="flex shrink-0 items-center gap-3 rounded-2xl border border-border bg-card/40 px-5 py-3 backdrop-blur transition-transform hover:scale-105"
            >
              <img src={c.image} alt={c.name} className="h-10 w-10 rounded-full" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">{c.name}</span>
                <span className="font-mono text-[10px] uppercase text-muted-foreground">
                  {c.symbol}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
