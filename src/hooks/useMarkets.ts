import { useEffect, useState } from 'react';
import type { MarketEvent } from '../components';

/** Dates des marchés lues dans l'agenda (/api/markets). Garde `fallback` si l'agenda ne répond pas. */
export function useMarkets(fallback: MarketEvent[]) {
  const [state, setState] = useState<{ events: MarketEvent[]; status: 'loading' | 'live' | 'fallback' }>(
    { events: fallback, status: 'loading' },
  );

  useEffect(() => {
    const ctrl = new AbortController();
    fetch('/api/markets', { signal: ctrl.signal })
      .then(r => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then((events: MarketEvent[]) => setState({ events, status: 'live' }))
      .catch(err => { if (err.name !== 'AbortError') setState({ events: fallback, status: 'fallback' }); });
    return () => ctrl.abort();
  }, [fallback]);

  return state;
}
