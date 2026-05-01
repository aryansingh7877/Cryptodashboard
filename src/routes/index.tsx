import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, type RefObject } from "react";

import { AdvancedStatGrid } from "@/components/AdvancedStatGrid";
import { CategoryTabs } from "@/components/CategoryTabs";
import { CoinCluster } from "@/components/CoinCluster";
import { CoinModal } from "@/components/CoinModal";
import { ErrorState } from "@/components/ErrorState";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LogoMarquee } from "@/components/LogoMarquee";
import { MarketSentiment } from "@/components/MarketSentiment";
import { MarketTable } from "@/components/MarketTable";
import { MoversSection } from "@/components/MoversSection";
import { PageLoader } from "@/components/PageLoader";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import { SkeletonGrid } from "@/components/SkeletonRow";
import { TrendingTicker } from "@/components/TrendingTicker";
import { WatchlistSection } from "@/components/WatchlistSection";
import { Button } from "@/components/ui/button";
import { useCryptoData } from "@/hooks/useCryptoData";
import { useTheme } from "@/hooks/useTheme";
import { useWatchlist } from "@/hooks/useWatchlist";
import type { Coin } from "@/services/cryptoApi";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Nebula Markets - Live Crypto Dashboard" },
      {
        name: "description",
        content:
          "Real-time cryptocurrency market dashboard with live prices, 24h changes, and market caps for the top assets.",
      },
    ],
  }),
});

function Dashboard() {
  const LOADER_MIN_MS = 1100;
  const loaderStartAtRef = useRef(Date.now());
  const { theme, toggle } = useTheme();
  const [activeCategory, setActiveCategory] = useState("");
  const {
    data,
    filtered,
    loading,
    isRefreshing,
    error,
    lastUpdated,
    query,
    setQuery,
    totalMarketCap,
    avgChange,
    total24hVolume,
    assetsInProfit,
    topMover,
    biggestPullback,
    refresh,
  } = useCryptoData(activeCategory);
  const { watchlist, toggleWatchlist } = useWatchlist();
  const [selected, setSelected] = useState<Coin | null>(null);
  const [displayLimit, setDisplayLimit] = useState(25);
  const [knownCoins, setKnownCoins] = useState<Record<string, Coin>>({});
  const [isWindowLoaded, setIsWindowLoaded] = useState(() =>
    typeof document !== "undefined" ? document.readyState === "complete" : false,
  );
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [loaderMounted, setLoaderMounted] = useState(true);
  const sentimentSectionRef = useRef<HTMLElement | null>(null);
  const watchlistSectionRef = useRef<HTMLElement | null>(null);
  const moversSectionRef = useRef<HTMLElement | null>(null);

  // Keep track of all coins we've ever seen so we can display them in the watchlist
  // even if the user switches to a category where they aren't listed.
  useEffect(() => {
    if (data.length > 0) {
      setKnownCoins((prev) => {
        const next = { ...prev };
        let changed = false;
        data.forEach((c) => {
          if (
            !prev[c.id] ||
            prev[c.id].current_price !== c.current_price ||
            prev[c.id].price_change_percentage_24h !== c.price_change_percentage_24h
          ) {
            next[c.id] = c;
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }
  }, [data]);

  const watchlistCoins = Object.values(knownCoins);

  const hasData = data.length > 0;
  const showBlockingSkeleton = loading && !hasData;
  const showBlockingError = Boolean(error) && !hasData;
  const initialContentReady = isWindowLoaded && !showBlockingSkeleton;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.readyState === "complete") {
      setIsWindowLoaded(true);
      return;
    }

    const onLoad = () => setIsWindowLoaded(true);
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    if (!loaderMounted || !initialContentReady) return;

    const elapsed = Date.now() - loaderStartAtRef.current;
    const remaining = Math.max(0, LOADER_MIN_MS - elapsed);
    const id = window.setTimeout(() => {
      setLoaderVisible(false);
    }, remaining);

    return () => window.clearTimeout(id);
  }, [initialContentReady, loaderMounted]);

  const scrollToSection = (sectionRef: RefObject<HTMLElement | null>) => {
    sectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      {loaderMounted && <PageLoader visible={loaderVisible} onHidden={() => setLoaderMounted(false)} />}
      <ScrollIndicator />
      <TrendingTicker coins={data} />

      <main className="relative z-10 mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-12">
        <Header
          theme={theme}
          onToggleTheme={toggle}
          onRefresh={refresh}
          lastUpdated={lastUpdated}
          isRefreshing={isRefreshing}
          error={error}
          searchValue={query}
          onSearchChange={setQuery}
          searchCount={filtered.length}
          onJumpToWatchlist={() => scrollToSection(watchlistSectionRef)}
          onJumpToMovers={() => scrollToSection(moversSectionRef)}
          onJumpToSentiment={() => scrollToSection(sentimentSectionRef)}
        />

        {hasData && (
          <>
            <section
              className="mt-8 sm:mt-10"
              style={{ contentVisibility: "auto", containIntrinsicSize: "480px" }}
            >
              <CoinCluster coins={data} />
            </section>

            <section style={{ contentVisibility: "auto", containIntrinsicSize: "240px" }}>
              <AdvancedStatGrid
                trackedAssets={data.length}
                totalMarketCap={totalMarketCap}
                total24hVolume={total24hVolume}
                avgChange={avgChange}
                assetsInProfit={assetsInProfit}
              />
            </section>

            <section
              ref={sentimentSectionRef}
              style={{ contentVisibility: "auto", containIntrinsicSize: "180px" }}
            >
              <MarketSentiment
                avgChange={avgChange}
                assetsInProfit={assetsInProfit}
                totalAssets={data.length}
                total24hVolume={total24hVolume}
              />
            </section>

            <section
              ref={watchlistSectionRef}
              style={{ contentVisibility: "auto", containIntrinsicSize: "220px" }}
            >
              <WatchlistSection
                coins={watchlistCoins}
                watchlistIds={watchlist}
                onSelect={setSelected}
              />
            </section>

            <section
              ref={moversSectionRef}
              style={{ contentVisibility: "auto", containIntrinsicSize: "180px" }}
            >
              <MoversSection
                topMover={topMover}
                biggestPullback={biggestPullback}
                onSelect={setSelected}
              />
            </section>

            <CategoryTabs activeCategory={activeCategory} onSelect={setActiveCategory} />
          </>
        )}

        <section className="mt-6">
          {showBlockingSkeleton && <SkeletonGrid />}
          {showBlockingError && (
            <ErrorState message={error ?? "Failed to load market data"} onRetry={refresh} />
          )}

          {hasData && (
            <>
              <MarketTable
                coins={filtered.slice(0, displayLimit)}
                onSelect={setSelected}
                watchlistIds={watchlist}
                onTogglePin={(event, coin) => {
                  event.stopPropagation();
                  toggleWatchlist(coin.id);
                }}
              />

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {displayLimit > 25 && (
                  <Button
                    variant="outline"
                    onClick={() => setDisplayLimit((prev) => Math.max(25, prev - 25))}
                  >
                    View less
                  </Button>
                )}
                {filtered.length > displayLimit && (
                  <Button variant="outline" onClick={() => setDisplayLimit((prev) => prev + 25)}>
                    Display more assets
                  </Button>
                )}
              </div>
            </>
          )}
        </section>

        {hasData && (
          <section
            className="mt-12 sm:mt-16"
            style={{ contentVisibility: "auto", containIntrinsicSize: "260px" }}
          >
            <LogoMarquee coins={data} />
          </section>
        )}
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
      <CoinModal coin={selected} onClose={() => setSelected(null)} />
    </>
  );
}
