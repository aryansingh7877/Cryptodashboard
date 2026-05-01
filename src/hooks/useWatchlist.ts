import { useState, useEffect } from "react";

const WATCHLIST_KEY = "cryptopulse_watchlist";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WATCHLIST_KEY);
      if (stored) {
        setWatchlist(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load watchlist", e);
    }
  }, []);

  const toggleWatchlist = (coinId: string) => {
    setWatchlist((prev) => {
      const isWatchlisted = prev.includes(coinId);
      const next = isWatchlisted
        ? prev.filter((id) => id !== coinId)
        : [...prev, coinId];
        
      try {
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save watchlist", e);
      }
      return next;
    });
  };

  const isWatchlisted = (coinId: string) => watchlist.includes(coinId);

  return { watchlist, toggleWatchlist, isWatchlisted };
}
