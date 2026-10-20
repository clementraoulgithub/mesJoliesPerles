import type { MarketEvent } from '../components';

// Les dates viennent de l'agenda des marchés (api/markets.ts, variable Vercel MARKETS_ICS_URL).
// Cette liste ne sert que de secours si l'agenda ne répond pas : marchés annoncés sur Instagram.
// kind : 'local' (marché local) ou 'noel' (marché de Noël). end : dernier jour si plusieurs jours.
export const markets: MarketEvent[] = [
  { id: 'treillieres-2026-06', date: '2026-06-13', title: 'Marché des créateurs', place: 'Sous les halles', city: 'Treillières', hours: 'dès 17h', kind: 'local' },
  { id: 'frossay-2026-07', date: '2026-07-18', end: '2026-07-19', title: 'Marché des créateurs', place: 'Quai Vert, le long du canal', city: 'Frossay', kind: 'local' },
  { id: 'treillieres-2026-10', date: '2026-10-04', title: 'Marché des créateurs d’automne', place: 'Salle Simone de Beauvoir', city: 'Treillières', hours: 'dès 9h', kind: 'local' },
];
