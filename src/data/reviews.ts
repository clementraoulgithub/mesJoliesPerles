import type { Review } from '../components';

// Avis recopiés d'Un grand marché (tous dans sources/ugm_reviews.json).
// Note et total : Un grand marché 5,0 sur 86 avis + Etsy 5,0 sur 397 avis (relevé du 20/10/2026).
export const reviewsSummary = { average: 5.0, count: 483 };

export const reviews: Review[] = [
  { id: 'r1', rating: 5, text: 'Magnifique boucle d’oreille, avec petite pochette en tissu offerte. Merci pour cette délicate attention. Envoi rapide.', author: 'Murielle F.', source: 'Un grand marché', date: 'mars 2025' },
  { id: 'r2', rating: 5, text: 'Sublimes. Le bleu est plus proche d’un bleu roi que d’un bleu marine, et est conforme aux photos. Rendu très élégant.', author: 'Flora', product: 'Créoles Gabrielle', source: 'Un grand marché', date: 'mai 2024' },
  { id: 'r3', rating: 5, text: 'Je suis ravie, les boucles sont sublimes ! C’est rare de trouver d’aussi jolies clips ! N’ayant pas les oreilles percées je suis super contente, merci !', author: 'Lucile D.', source: 'Un grand marché', date: 'févr. 2024' },
  { id: 'r4', rating: 5, text: 'Boucles reçues très rapidement dans un emballage très soigné. Le produit est très fidèle à l’image et je suis ravie.', author: 'Pierre et Françoise N.', source: 'Un grand marché', date: 'août 2023' },
  { id: 'r5', rating: 5, text: 'Superbes et parfaitement conformes à la description et à la photo. Un grand merci pour le petit mot manuscrit qui était joint.', author: 'Caroline L.', source: 'Un grand marché', date: 'mai 2023' },
  { id: 'r6', rating: 5, text: 'Très jolies boucles de qualité avec un envoi très soigné, merci !', author: 'anso40', product: 'Boucles Eva', source: 'Un grand marché', date: 'mai 2026' },
];
