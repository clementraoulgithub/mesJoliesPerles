import type { Review } from '../components';

// EXEMPLES : remplacez par de vrais avis recopiés de vos boutiques (avec leur provenance).
export const reviewsSummary = { average: 4.9, count: 126 };

export const reviews: Review[] = [
  { id: 'r1', rating: 5, text: 'Encore plus jolies qu’en photo, et le paquet cadeau est adorable.', author: 'Camille R.', product: 'Boucles Goutte de miel', source: 'Etsy', date: 'oct. 2026' },
  { id: 'r2', rating: 5, text: 'Bracelet léger et solide, je le porte tous les jours depuis un mois.', author: 'Sophie M.', product: 'Bracelet Jade & laiton', source: 'Etsy', date: 'sept. 2026' },
  { id: 'r3', rating: 4, text: 'Très beau collier, envoi rapide. Rencontrée au marché, je recommande.', author: 'Julien D.', product: 'Collier Corail d’hiver', source: 'Un grand marché', date: 'sept. 2026' },
];
