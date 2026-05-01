import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { fetchMarkets, type Coin } from "@/services/cryptoApi";

export function useCryptoData(category?: string, refreshMs = 60_000) {
  const [data, setData] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [query, setQuery] = useState("");
  const mounted = useRef(true);
  const hasDataRef = useRef(false);

  useEffect(() => {
    hasDataRef.current = data.length > 0;
  }, [data.length]);

  const load = useCallback(
    async (options?: { silent?: boolean; force?: boolean }) => {
      const silent = options?.silent ?? false;
      const force = options?.force ?? false;
      const hasExistingData = hasDataRef.current;

      try {
        if (!silent && !hasExistingData) {
          setLoading(true);
        } else {
          setIsRefreshing(true);
        }

        const coins = await fetchMarkets(category, { force });
        if (!mounted.current) return;
        setData(coins);
        setError(null);
        setLastUpdated(new Date());
      } catch (e) {
        if (!mounted.current) return;
        const msg = e instanceof Error ? e.message : "Failed to load market data";
        setError(msg);
      } finally {
        if (mounted.current) {
          setLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [category],
  );

  useEffect(() => {
    mounted.current = true;
    load();
    const id = setInterval(() => load({ silent: true, force: true }), refreshMs);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [load, refreshMs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q),
    );
  }, [data, query]);

  const totalMarketCap = useMemo(() => data.reduce((s, c) => s + (c.market_cap ?? 0), 0), [data]);

  const avgChange = useMemo(() => {
    if (!data.length) return 0;
    return data.reduce((s, c) => s + (c.price_change_percentage_24h ?? 0), 0) / data.length;
  }, [data]);

  const total24hVolume = useMemo(() => data.reduce((s, c) => s + (c.total_volume ?? 0), 0), [data]);

  const assetsInProfit = useMemo(
    () => data.filter((c) => (c.price_change_percentage_24h ?? 0) > 0).length,
    [data],
  );

  const topMover = useMemo(() => {
    if (!data.length) return null;
    return data.reduce(
      (max, c) =>
        (c.price_change_percentage_24h ?? 0) > (max.price_change_percentage_24h ?? 0) ? c : max,
      data[0],
    );
  }, [data]);

  const biggestPullback = useMemo(() => {
    if (!data.length) return null;
    return data.reduce(
      (min, c) =>
        (c.price_change_percentage_24h ?? 0) < (min.price_change_percentage_24h ?? 0) ? c : min,
      data[0],
    );
  }, [data]);

  return {
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
    refresh: () => load({ force: true }),
  };
}
