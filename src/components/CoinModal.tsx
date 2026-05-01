import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { Coin } from "@/services/cryptoApi";
import { fmtUSD, fmtCompact, fmtPct } from "@/utils/format";

interface Props {
  coin: Coin | null;
  onClose: () => void;
}

type Range = "1D" | "7D" | "1M" | "1Y";

function ChangeTag({ value }: { value?: number | null }) {
  if (value == null) return <span className="text-muted-foreground text-xs">—</span>;
  const up = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-bold tabular-nums ${
        up ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
      }`}
    >
      <svg className={`h-2.5 w-2.5 ${up ? "" : "rotate-180"}`} viewBox="0 0 12 12" fill="currentColor">
        <path d="M6 2l4 6H2l4-6z" />
      </svg>
      {fmtPct(value)}
    </span>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-white/5 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 font-mono text-sm font-semibold tabular-nums ${highlight ? "text-primary" : "text-foreground"}`}>
        {value}
      </div>
    </div>
  );
}

function PerformanceBar({ label, value }: { label: string; value?: number | null }) {
  if (value == null) return null;
  const up = value >= 0;
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-white/5 px-3 py-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <span className={`font-mono text-lg font-bold tabular-nums ${up ? "text-emerald-400" : "text-red-400"}`}>
        {fmtPct(value)}
      </span>
    </div>
  );
}

function sliceSparkline(prices: number[], range: Range) {
  if (!prices.length) return prices;
  // Sparkline from CoinGecko is 7 days of hourly data (~168 points)
  const count = prices.length;
  if (range === "1D") return prices.slice(-24);
  if (range === "7D") return prices;
  if (range === "1M") return prices; // we only have 7d, show all
  return prices; // 1Y same
}

export function CoinModal({ coin, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState<Range>("7D");

  useEffect(() => {
    if (!coin) return;
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;
    gsap.timeline()
      .fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" })
      .fromTo(panel, { opacity: 0, y: 30, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" }, "-=0.15");

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coin]);

  const handleClose = () => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return onClose();
    gsap.to(panel, { opacity: 0, y: 20, scale: 0.97, duration: 0.2, ease: "power2.in" });
    gsap.to(overlay, { opacity: 0, duration: 0.25, delay: 0.05, onComplete: onClose });
  };

  if (!coin) return null;

  const up = (coin.price_change_percentage_24h ?? 0) >= 0;
  const color = up ? "#10b981" : "#ef4444";
  const rawPrices = coin.sparkline_in_7d?.price ?? [];
  const sliced = sliceSparkline(rawPrices, range);
  const chartData = sliced.map((price, i) => ({ time: i, price }));

  const athChange = coin.ath > 0 ? ((coin.current_price - coin.ath) / coin.ath) * 100 : null;
  const change7d = rawPrices.length > 1
    ? ((rawPrices[rawPrices.length - 1] - rawPrices[0]) / rawPrices[0]) * 100
    : null;

  const RANGES: Range[] = ["1D", "7D", "1M", "1Y"];

  return (
    <div
      ref={overlayRef}
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/75 px-2 py-4 backdrop-blur-md sm:px-4 sm:py-8"
    >
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className="glass relative w-full max-w-3xl rounded-xl shadow-elevated sm:rounded-2xl"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between rounded-t-xl border-b border-border px-4 py-3 sm:rounded-t-2xl sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <img src={coin.image} alt={coin.name} className="h-9 w-9 shrink-0 rounded-full ring-2 ring-border sm:h-11 sm:w-11" />
            <div className="min-w-0">
              <h2 className="truncate font-display text-base font-bold text-foreground sm:text-xl">{coin.name}</h2>
              <p className="truncate text-[10px] uppercase tracking-wider text-muted-foreground sm:text-xs">
                {coin.symbol} · Rank #{coin.market_cap_rank}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="ml-2 shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {/* Price + badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="font-display text-2xl font-bold tabular-nums text-foreground sm:text-4xl">
              {fmtUSD(coin.current_price)}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <ChangeTag value={coin.price_change_percentage_1h_in_currency} />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">1h</span>
              <ChangeTag value={coin.price_change_percentage_24h} />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">24h</span>
            </div>
          </div>

          {/* 24h range bar */}
          {coin.high_24h > 0 && (
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                <span>24h Low — {fmtUSD(coin.low_24h)}</span>
                <span>24h High — {fmtUSD(coin.high_24h)}</span>
              </div>
              <div className="relative h-1.5 rounded-full bg-border">
                <div
                  className="absolute left-0 h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-500"
                  style={{
                    width: `${Math.min(100, ((coin.current_price - coin.low_24h) / (coin.high_24h - coin.low_24h)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="mt-5">
              {/* Range selector */}
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground xs:block">
                  {range === "7D" ? "7-Day" : range === "1D" ? "24h" : range} Price Chart
                </span>
                <div className="flex gap-1">
                  {RANGES.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRange(r)}
                      className={`rounded px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                        range === r
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[180px] w-full rounded-xl overflow-hidden border border-border bg-white/5 sm:h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.28} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="price" stroke={color} strokeWidth={2} fill="url(#grad)" dot={false} isAnimationActive animationDuration={800} />
                    <XAxis dataKey="time" hide />
                    <YAxis domain={["dataMin", "dataMax"]} hide />
                    <Tooltip
                      content={({ active, payload }) =>
                        active && payload?.length ? (
                          <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-mono text-foreground shadow-lg">
                            {fmtUSD(payload[0].value as number)}
                          </div>
                        ) : null
                      }
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Performance cards */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3 sm:grid-cols-4">
            <PerformanceBar label="1h performance" value={coin.price_change_percentage_1h_in_currency} />
            <PerformanceBar label="24h performance" value={coin.price_change_percentage_24h} />
            <PerformanceBar label="7d performance" value={change7d} />
            <PerformanceBar label="ATH change" value={athChange} />
          </div>

          {/* Stats grid */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3 sm:grid-cols-3">
            <Stat label="Market Cap Rank" value={`#${coin.market_cap_rank}`} />
            <Stat label="Market Cap" value={`$${fmtCompact(coin.market_cap)}`} />
            <Stat label="24h Volume" value={`$${fmtCompact(coin.total_volume)}`} />
            <Stat label="Circulating Supply" value={`${fmtCompact(coin.circulating_supply)} ${coin.symbol.toUpperCase()}`} />
            <Stat label="Max Supply" value={coin.max_supply ? `${fmtCompact(coin.max_supply)} ${coin.symbol.toUpperCase()}` : "Unlimited ∞"} />
            <Stat label="All-Time High" value={fmtUSD(coin.ath)} highlight />
            <Stat label="All-Time Low" value={fmtUSD(coin.atl)} />
            <Stat label="24h High" value={fmtUSD(coin.high_24h)} />
            <Stat label="24h Low" value={fmtUSD(coin.low_24h)} />
          </div>

          {/* Supply utilisation bar */}
          {coin.max_supply && (
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                <span>Supply in circulation</span>
                <span>{((coin.circulating_supply / coin.max_supply) * 100).toFixed(1)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-primary/70"
                  style={{ width: `${Math.min(100, (coin.circulating_supply / coin.max_supply) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer tip */}
          <p className="mt-5 text-center text-[11px] text-muted-foreground">
            Press <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">Esc</kbd> or click outside to close
          </p>
        </div>
      </div>
    </div>
  );
}
