import type { Coin } from "@/services/cryptoApi";
import { fmtPct, fmtUSD } from "@/utils/format";

interface Props {
  topMover: Coin | null;
  biggestPullback: Coin | null;
  onSelect: (c: Coin) => void;
}

export function MoversSection({ topMover, biggestPullback, onSelect }: Props) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <MoverCard
        title="Top mover"
        coin={topMover}
        onClick={() => topMover && onSelect(topMover)}
      />
      <MoverCard
        title="Biggest pullback"
        coin={biggestPullback}
        onClick={() => biggestPullback && onSelect(biggestPullback)}
      />
    </div>
  );
}

function MoverCard({
  title,
  coin,
  onClick,
}: {
  title: string;
  coin: Coin | null;
  onClick: () => void;
}) {
  if (!coin) return null;
  const change = coin.price_change_percentage_24h ?? 0;
  const up = change >= 0;

  return (
    <div
      onClick={onClick}
      className="glass flex cursor-pointer items-center justify-between rounded-xl border border-border p-4 transition-colors hover:bg-surface-elevated/50"
    >
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={coin.image}
          alt={coin.name}
          className="h-10 w-10 shrink-0 rounded-full ring-2 ring-border"
        />
        <div className="min-w-0">
          <div className="text-[11px] text-muted-foreground">{title}</div>
          <div className="truncate font-display font-bold text-foreground">
            {coin.name}
          </div>
          <div className="truncate text-[10px] uppercase text-muted-foreground">
            {coin.symbol} · {fmtUSD(coin.current_price)}
          </div>
        </div>
      </div>
      <div
        className={`rounded-md px-2 py-1 text-xs font-semibold ${
          up ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
        }`}
      >
        {up ? "+" : ""}
        {change.toFixed(2)}%
      </div>
    </div>
  );
}
