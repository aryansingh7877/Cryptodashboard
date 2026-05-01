import { useMemo } from "react";
import type { Coin } from "@/services/cryptoApi";
import { CoinRow } from "./CoinRow";

interface Props {
  coins: Coin[];
  onSelect: (coin: Coin) => void;
  watchlistIds?: string[];
  onTogglePin?: (event: React.MouseEvent, coin: Coin) => void;
}

export function MarketTable({ coins, onSelect, watchlistIds = [], onTogglePin }: Props) {
  const pinnedIds = useMemo(() => new Set(watchlistIds), [watchlistIds]);

  return (
    <div className="space-y-2">
      <div className="hidden grid-cols-[2rem_2.5rem_minmax(0,2fr)_1fr_1fr_1fr_1fr] gap-4 px-5 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground md:grid">
        <span>Watch</span>
        <span>#</span>
        <span>Asset</span>
        <span>Price</span>
        <span>1H</span>
        <span>24H</span>
        <span className="text-right">Market Cap</span>
      </div>

      <div
        className="space-y-2"
        style={{ contentVisibility: "auto", containIntrinsicSize: "1200px" }}
      >
        {coins.map((coin) => (
          <CoinRow
            key={coin.id}
            coin={coin}
            onClick={onSelect}
            isPinned={pinnedIds.has(coin.id)}
            onTogglePin={onTogglePin}
          />
        ))}

        {coins.length === 0 && (
          <div className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
            No assets match your search.
          </div>
        )}
      </div>
    </div>
  );
}
