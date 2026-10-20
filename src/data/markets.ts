import type { MarketEvent } from '../components';

// EXEMPLES : remplacez par vos vraies dates.
// kind : 'local' (marché local) ou 'noel' (marché de Noël). end : dernier jour si plusieurs jours.
export const markets: MarketEvent[] = [
  { id: 'e1', date: '2026-10-24', title: 'Marché des créateurs', place: 'Halle couverte', city: 'centre-ville', hours: '9h – 13h', kind: 'local' },
  { id: 'e2', date: '2026-11-07', title: 'Marché du samedi', place: 'Place de l’église', city: 'centre-ville', hours: '8h – 13h', kind: 'local' },
  { id: 'e3', date: '2026-11-21', end: '2026-11-22', title: 'Marché de Noël artisanal', place: 'Salle des fêtes', city: 'quartier de la gare', hours: '10h – 18h', kind: 'noel' },
  { id: 'e4', date: '2026-11-28', title: 'Marché de Noël des créateurs', place: 'Cour de l’école', city: 'vieille ville', hours: '10h – 19h', kind: 'noel' },
  { id: 'e5', date: '2026-12-05', end: '2026-12-06', title: 'Village de Noël', place: 'Place de la mairie', city: 'centre-ville', hours: '10h – 20h', kind: 'noel' },
  { id: 'e6', date: '2026-12-12', title: 'Marché du samedi', place: 'Halle couverte', city: 'centre-ville', hours: '8h – 13h', kind: 'local' },
  { id: 'e7', date: '2026-12-19', end: '2026-12-20', title: 'Grand marché de Noël', place: 'Parc du château', city: 'vieille ville', hours: '10h – 19h', kind: 'noel' },
];
