import { forwardRef } from "react";

export interface StatCardProps {
  label: string;
  value: string;
  accent: "primary" | "accent" | "success" | "danger";
}

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  function StatCard({ label, value, accent }, ref) {
    const accentClass = {
      primary: "from-primary/20 to-transparent",
      accent: "from-accent/20 to-transparent",
      success: "from-success/20 to-transparent",
      danger: "from-danger/20 to-transparent",
    }[accent];
    
    const textClass = {
      primary: "text-foreground",
      accent: "text-foreground",
      success: "text-success",
      danger: "text-danger",
    }[accent];

    return (
      <div
        ref={ref}
        className="glass relative overflow-hidden rounded-2xl p-5 shadow-soft transition-transform hover:scale-[1.02]"
      >
        <div className="relative">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className={`mt-2 font-display text-2xl font-bold tabular-nums ${textClass}`}>
            {value}
          </div>
        </div>
      </div>
    );
  }
);
