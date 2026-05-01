import { fmtCompact } from "@/utils/format";

interface Props {
  trackedAssets: number;
  totalMarketCap: number;
  total24hVolume: number;
  avgChange: number;
  assetsInProfit: number;
}

export function AdvancedStatGrid({
  trackedAssets,
  totalMarketCap,
  total24hVolume,
  avgChange,
  assetsInProfit,
}: Props) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <StatBox label="Tracked assets" value={trackedAssets.toString()} />
      <StatBox label="Total market cap" value={`$${fmtCompact(totalMarketCap)}`} />
      <StatBox label="24h volume" value={`$${fmtCompact(total24hVolume)}`} />
      <StatBox
        label="Average 24h move"
        value={`${avgChange >= 0 ? "+" : ""}${avgChange.toFixed(2)}%`}
      />
      <StatBox label="Assets in profit" value={`${assetsInProfit}/${trackedAssets}`} />
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass flex flex-col justify-center rounded-xl border border-border p-4 shadow-sm">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="mt-1 break-words font-display text-lg font-bold text-foreground">{value}</div>
    </div>
  );
}
