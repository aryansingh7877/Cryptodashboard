import { Line, LineChart, YAxis } from "recharts";

import type { Coin } from "@/services/cryptoApi";
import { fmtUSD } from "@/utils/format";

interface Props {
  coins: Coin[];
  watchlistIds: string[];
  onSelect: (c: Coin) => void;
}

export function WatchlistSection({ coins, watchlistIds, onSelect }: Props) {
  const watchlistedCoins = coins.filter((coin) => watchlistIds.includes(coin.id));

  return (
    <div className="glass mt-4 rounded-xl border border-border p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">My Watchlist</h3>
          <p className="text-xs text-muted-foreground">Pinned coins for faster monitoring</p>
        </div>
        <div className="self-start rounded-md bg-yellow-500/10 px-2 py-1 text-xs font-semibold text-yellow-500">
          {watchlistIds.length} tracked
        </div>
      </div>

      {watchlistedCoins.length === 0 ? (
        <div className="mt-6 flex h-24 items-center justify-center rounded-lg border border-dashed border-border/50 px-4 text-center text-sm text-muted-foreground">
          No coins pinned yet. Star a coin in the market table below.
        </div>
      ) : (
        <div className="relative mt-4">
          <div className="no-scrollbar mt-2 grid grid-cols-1 gap-3 sm:flex sm:gap-4 sm:overflow-x-auto sm:pb-2">
            {watchlistedCoins.map((coin) => (
              <WatchlistCard key={coin.id} coin={coin} onClick={onSelect} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function WatchlistCard({ coin, onClick }: { coin: Coin; onClick: (c: Coin) => void }) {
  const change = coin.price_change_percentage_24h ?? 0;
  const up = change >= 0;

  const chartData =
    coin.sparkline_in_7d?.price.map((price, index) => ({
      time: index,
      price,
    })) || [];

  return (
    <div
      onClick={() => onClick(coin)}
      className="flex w-full cursor-pointer flex-col justify-between rounded-lg border border-border bg-surface-elevated/50 p-4 transition-colors hover:bg-surface-elevated sm:min-w-[240px] sm:flex-none"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <img src={coin.image} alt={coin.name} className="h-8 w-8 shrink-0 rounded-full" />
          <div className="min-w-0">
            <div className="truncate font-display text-sm font-bold text-foreground">
              {coin.name}
            </div>
            <div className="text-[10px] uppercase text-muted-foreground">{coin.symbol}</div>
          </div>
        </div>
        <div
          className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${
            up ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
          }`}
        >
          {up ? "+" : ""}
          {change.toFixed(2)}%
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="font-mono text-sm font-bold text-foreground">
          {fmtUSD(coin.current_price)}
        </div>
        <div className="h-8 w-20 shrink-0">
          {chartData.length > 0 && (
            <LineChart width={80} height={32} data={chartData}>
              <Line
                type="monotone"
                dataKey="price"
                stroke={up ? "#10b981" : "#ef4444"}
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
              <YAxis domain={["dataMin", "dataMax"]} hide />
            </LineChart>
          )}
        </div>
      </div>
    </div>
  );
}
