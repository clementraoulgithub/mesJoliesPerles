import type { MarketEvent } from '../components';

// Dates come from the markets calendar (api/markets.ts, Vercel variable MARKETS_ICS_URL).
// This list is only a fallback when the calendar does not answer: markets announced on Instagram.
// kind: 'local' (local market) or 'noel' (Christmas market). end: last day when it spans several days.
export const markets: MarketEvent[] = [
  { id: 'treillieres-2026-06', date: '2026-06-13', title: 'Marché des créateurs', place: 'Sous les halles', city: 'Treillières', startTime: '17:00', kind: 'local' },
  { id: 'frossay-2026-07', date: '2026-07-18', end: '2026-07-19', title: 'Marché des créateurs', place: 'Quai Vert, le long du canal', city: 'Frossay', kind: 'local' },
  { id: 'treillieres-2026-10', date: '2026-10-04', title: 'Marché des créateurs d’automne', place: 'Salle Simone de Beauvoir', city: 'Treillières', startTime: '09:00', kind: 'local' },
];
