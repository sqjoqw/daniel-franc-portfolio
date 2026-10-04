"use client";

import { useEffect, useState } from "react";

/**
 * Current time, ticking at the given interval. SSR-safe: null until mounted
 * (avoids hydration mismatch for live clocks and date tiles).
 */
export function useNow(tickMs = 30_000): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const update = () => setNow(new Date());
    const raf = requestAnimationFrame(update);
    const t = setInterval(update, tickMs);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(t);
    };
  }, [tickMs]);
  return now;
}
