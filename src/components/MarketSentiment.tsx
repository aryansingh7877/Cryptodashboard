import { fmtCompact } from "@/utils/format";

interface Props {
  avgChange: number;
  assetsInProfit: number;
  totalAssets: number;
  total24hVolume: number;
}

export function MarketSentiment({
  avgChange,
  assetsInProfit,
  totalAssets,
  total24hVolume,
}: Props) {
  const isBullish = avgChange >= 0;
  const pctGreen = totalAssets ? Math.round((assetsInProfit / totalAssets) * 100) : 0;

  return (
    <div className="glass mt-3 flex flex-col justify-between gap-4 rounded-xl border border-border p-4 shadow-sm sm:flex-row sm:items-center sm:p-5">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Market Sentiment
        </div>
        <div
          className={`mt-1 font-display text-2xl font-black uppercase ${
            isBullish ? "text-success" : "text-danger"
          }`}
        >
          {isBullish ? "Bullish" : "Bearish"}
        </div>
      </div>

      <div className="flex flex-wrap gap-6 sm:gap-16">
        <div>
          <div className="text-[11px] text-muted-foreground">Assets green</div>
          <div className="mt-1 font-display text-lg font-bold text-foreground">
            {assetsInProfit}/{totalAssets}{" "}
            <span className="text-sm font-medium text-muted-foreground">
              ({pctGreen}%)
            </span>
          </div>
        </div>

        <div>
          <div className="text-[11px] text-muted-foreground">
            Average 24h move
          </div>
          <div className="mt-1 font-display text-lg font-bold text-foreground">
            {avgChange >= 0 ? "+" : ""}
            {avgChange.toFixed(2)}%
          </div>
        </div>

        <div>
          <div className="text-[11px] text-muted-foreground">Tracked volume</div>
          <div className="mt-1 font-display text-lg font-bold text-foreground">
            ${fmtCompact(total24hVolume)}
          </div>
        </div>
      </div>
    </div>
  );
}
