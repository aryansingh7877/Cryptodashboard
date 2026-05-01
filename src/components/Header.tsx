import type { ReactNode } from "react";

import { SearchBar } from "@/components/SearchBar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Props {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onRefresh: () => void;
  lastUpdated: Date | null;
  isRefreshing: boolean;
  error: string | null;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchCount: number;
  onJumpToWatchlist: () => void;
  onJumpToMovers: () => void;
  onJumpToSentiment: () => void;
}

export function Header({
  theme,
  onToggleTheme,
  onRefresh,
  lastUpdated,
  isRefreshing,
  error,
  searchValue,
  onSearchChange,
  searchCount,
  onJumpToWatchlist,
  onJumpToMovers,
  onJumpToSentiment,
}: Props) {
  const statusText =
    error && lastUpdated
      ? "Update failed. Showing the last good snapshot."
      : isRefreshing
        ? "Refreshing market data..."
        : lastUpdated
          ? `Updated ${lastUpdated.toLocaleTimeString()}`
          : "Loading market data...";

  return (
    <header className="order-1 flex w-full flex-col gap-4">
      <div className="hidden w-full grid-cols-[auto_minmax(300px,420px)_auto] items-start gap-4 lg:grid">
        <BrandBlock statusText={statusText} />

        <div className="pt-1">
          <SearchBar value={searchValue} onChange={onSearchChange} count={searchCount} />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <QuickFeature label="Watchlist" onClick={onJumpToWatchlist} />
          <QuickFeature label="Top Movers" onClick={onJumpToMovers} />
          <IconButton onClick={onRefresh} ariaLabel="Refresh">
            <RefreshIcon />
          </IconButton>
          <IconButton onClick={onToggleTheme} ariaLabel="Toggle theme">
            <ThemeIcon theme={theme} />
          </IconButton>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 lg:hidden">
        <div className="flex items-start justify-between gap-3">
          <BrandBlock statusText={statusText} compact />

          <div className="flex items-center gap-2 pt-1">
            <IconButton onClick={onRefresh} ariaLabel="Refresh">
              <RefreshIcon />
            </IconButton>
            <IconButton onClick={onToggleTheme} ariaLabel="Toggle theme">
              <ThemeIcon theme={theme} />
            </IconButton>
            <HeaderMenu
              theme={theme}
              onToggleTheme={onToggleTheme}
              onRefresh={onRefresh}
              onJumpToWatchlist={onJumpToWatchlist}
              onJumpToMovers={onJumpToMovers}
              onJumpToSentiment={onJumpToSentiment}
            />
          </div>
        </div>

        <SearchBar value={searchValue} onChange={onSearchChange} count={searchCount} />
      </div>
    </header>
  );
}

function BrandBlock({ statusText, compact = false }: { statusText: string; compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-primary shadow-glow sm:h-10 sm:w-10">
        <svg className="h-5 w-5 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zm0 13L2 10v7l10 5 10-5v-7l-10 5z" />
        </svg>
      </div>
      <div className="min-w-0">
        <h1
          className={`font-display font-bold leading-none tracking-tight text-foreground ${
            compact
              ? "text-[1.2rem] min-[380px]:text-[1.35rem] min-[420px]:text-[1.55rem]"
              : "text-2xl"
          }`}
        >
          Nebula <span className="gradient-text">Markets</span>
        </h1>
        <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-2 sm:mt-2">
          <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-2 py-0.5">
            <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-success">
              Live Data
            </span>
          </div>
          <p className={`${compact ? "text-[11px] xs:text-xs" : "text-xs"} min-w-0 text-muted-foreground`}>
            {statusText}
          </p>
        </div>
      </div>
    </div>
  );
}

function QuickFeature({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-border/70 bg-card/45 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-primary/20 hover:bg-surface-elevated hover:text-foreground"
    >
      {label}
    </button>
  );
}

function IconButton({
  children,
  onClick,
  ariaLabel,
}: {
  children: ReactNode;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-border bg-card/60 p-2.5 text-muted-foreground transition-all hover:scale-105 hover:border-primary/40 hover:text-foreground active:scale-95"
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

function HeaderMenu({
  theme,
  onToggleTheme,
  onRefresh,
  onJumpToWatchlist,
  onJumpToMovers,
  onJumpToSentiment,
}: {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onRefresh: () => void;
  onJumpToWatchlist: () => void;
  onJumpToMovers: () => void;
  onJumpToSentiment: () => void;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="rounded-lg border border-border bg-card/60 p-2.5 text-muted-foreground transition-all hover:scale-105 hover:border-primary/40 hover:text-foreground active:scale-95"
          aria-label="Open menu"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[88vw] border-border bg-[linear-gradient(180deg,rgba(9,16,30,0.98),rgba(8,14,26,0.98))] p-0 sm:max-w-sm"
      >
        <div className="h-full overflow-y-auto p-6">
          <SheetHeader className="text-left">
            <SheetTitle className="font-display text-xl">Menu</SheetTitle>
            <SheetDescription>
              Jump through the dashboard quickly on phone and tablet.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-8 grid gap-3">
            <SheetClose asChild>
              <button
                type="button"
                onClick={onJumpToWatchlist}
                className="rounded-2xl border border-border/70 bg-card/45 px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:border-primary/20 hover:bg-surface-elevated"
              >
                Watchlist
              </button>
            </SheetClose>
            <SheetClose asChild>
              <button
                type="button"
                onClick={onJumpToMovers}
                className="rounded-2xl border border-border/70 bg-card/45 px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:border-primary/20 hover:bg-surface-elevated"
              >
                Top Movers
              </button>
            </SheetClose>
            <SheetClose asChild>
              <button
                type="button"
                onClick={onJumpToSentiment}
                className="rounded-2xl border border-border/70 bg-card/45 px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:border-primary/20 hover:bg-surface-elevated"
              >
                Market Mood
              </button>
            </SheetClose>
          </div>

          <div className="mt-8 grid gap-3">
            <SheetClose asChild>
              <button
                type="button"
                onClick={onRefresh}
                className="rounded-2xl border border-border/70 bg-card/35 px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:border-primary/20 hover:bg-surface-elevated hover:text-foreground"
              >
                Refresh Data
              </button>
            </SheetClose>
            <SheetClose asChild>
              <button
                type="button"
                onClick={onToggleTheme}
                className="rounded-2xl border border-border/70 bg-card/35 px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:border-primary/20 hover:bg-surface-elevated hover:text-foreground"
              >
                {theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
              </button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function RefreshIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.582M20 20v-5h-.581M5.054 9A7.5 7.5 0 0119 12m-14 0a7.5 7.5 0 0014 3"
      />
    </svg>
  );
}

function ThemeIcon({ theme }: { theme: "dark" | "light" }) {
  if (theme === "dark") {
    return (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    );
  }

  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );
}
