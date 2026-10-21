import { useEffect, useState } from 'react';
import type { MarketEvent } from '../components';

/** Market dates read from the calendar (/api/markets). Keeps `fallback` when the calendar does not answer. */
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
