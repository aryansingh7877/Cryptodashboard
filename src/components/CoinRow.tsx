import { memo } from "react";

import type { Coin } from "@/services/cryptoApi";
import { fmtCompact, fmtPct, fmtUSD } from "@/utils/format";

interface Props {
  coin: Coin;
  onClick: (coin: Coin) => void;
  isPinned?: boolean;
  onTogglePin?: (event: React.MouseEvent, coin: Coin) => void;
}

function ChangeCell({ value }: { value?: number | null }) {
  if (value == null) return <span className="text-xs text-muted-foreground/50">-</span>;

  const up = value >= 0;

  return (
    <span
      className={`inline-flex items-center gap-1 text-sm font-semibold tabular-nums ${
        up ? "text-success" : "text-danger"
      }`}
    >
      <svg
        className={`h-3 w-3 shrink-0 ${up ? "" : "rotate-180"}`}
        viewBox="0 0 12 12"
        fill="currentColor"
      >
        <path d="M6 2l4 6H2l4-6z" />
      </svg>
      {fmtPct(value)}
    </span>
  );
}

function CoinRowBase({ coin, onClick, isPinned = false, onTogglePin }: Props) {
  const change1h = coin.price_change_percentage_1h_in_currency;
  const change24h = coin.price_change_percentage_24h;
  const priceUp = (change24h ?? 0) >= 0;

  return (
    <div
      data-coin-row
      className="group grid w-full grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-card/60 px-3 py-3 shadow-soft transition-all hover:border-primary/40 hover:bg-card hover:shadow-elevated sm:px-4 md:grid-cols-[2rem_2.5rem_minmax(0,2fr)_1fr_1fr_1fr_1fr] md:gap-4 md:px-5 md:py-3.5"
    >
      <button
        onClick={(event) => {
          event.stopPropagation();
          onTogglePin?.(event, coin);
        }}
        aria-label={isPinned ? "Remove from watchlist" : "Add to watchlist"}
        className="flex items-center justify-center focus:outline-none"
      >
        <svg
          viewBox="0 0 24 24"
          fill={isPinned ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={2}
          className={`h-4 w-4 transition-colors ${
            isPinned
              ? "text-yellow-400"
              : "text-muted-foreground/40 group-hover:text-muted-foreground"
          }`}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>

      <div className="hidden text-xs font-mono text-muted-foreground md:block">
        {coin.market_cap_rank}
      </div>

      <button
        onClick={() => onClick(coin)}
        className="hidden min-w-0 items-center gap-3 text-left focus:outline-none md:flex"
      >
        <img
          src={coin.image}
          alt={coin.name}
          loading="lazy"
          className="h-8 w-8 rounded-full ring-1 ring-border transition-transform group-hover:scale-110"
        />
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground">{coin.name}</div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            {coin.symbol}
          </div>
        </div>
      </button>

      <button
        onClick={() => onClick(coin)}
        className="flex min-w-0 items-center gap-3 text-left focus:outline-none md:hidden"
      >
        <img
          src={coin.image}
          alt={coin.name}
          loading="lazy"
          className="h-8 w-8 shrink-0 rounded-full ring-1 ring-border transition-transform group-hover:scale-110"
        />
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground">{coin.name}</div>
          <div className="truncate text-xs uppercase tracking-wider text-muted-foreground">
            #{coin.market_cap_rank} {coin.symbol}
          </div>
        </div>
      </button>

      <button onClick={() => onClick(coin)} className="text-right md:text-left focus:outline-none">
        <div className="font-mono text-sm font-semibold tabular-nums text-foreground">
          {fmtUSD(coin.current_price)}
        </div>
        <div
          className={`text-xs font-medium md:hidden ${priceUp ? "text-success" : "text-danger"}`}
        >
          {fmtPct(change24h)}
        </div>
      </button>

      <div className="hidden md:block">
        <ChangeCell value={change1h} />
      </div>

      <div className="hidden md:block">
        <ChangeCell value={change24h} />
      </div>

      <div className="hidden text-right font-mono text-sm tabular-nums text-muted-foreground md:block">
        {fmtCompact(coin.market_cap)}
      </div>
    </div>
  );
}

export const CoinRow = memo(CoinRowBase);
