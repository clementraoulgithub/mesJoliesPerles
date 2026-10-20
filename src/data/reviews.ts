import type { Review } from '../components';

// Avis recopiés d'Un grand marché, avec la photo du bijou concerné (tous dans sources/ugm_reviews.json).
// Note et total : Un grand marché 5,0 sur 86 avis + Etsy 5,0 sur 397 avis (relevé du 20/10/2026).
export const reviewsSummary = { average: 5.0, count: 483 };

const P = 'https://www.ungrandmarche.fr/boutiques/p/boucles-d-oreilles/';

export const reviews: Review[] = [
  { id: 'r1', rating: 5, text: 'Trop contente ! Exactement la couleur que je cherchais. Jamais vu un emballage aussi soigné. Chouette petit paquet fait avec amour ! Un grand merci et bravo pour votre talent !', author: 'Nolwenn D.', product: 'Créoles perles rouge corail', source: 'Un grand marché', date: 'mai 2022', imageSrc: '/produits/ugm-3687009.jpeg', href: P + 'boucles-d-oreilles-petit-modele-creoles-perles-rouge-cor/3687009' },
  { id: 'r2', rating: 5, text: 'Sublimes. Le bleu est plus proche d’un bleu roi que d’un bleu marine, et est conforme aux photos. Rendu très élégant.', author: 'Flora P.', product: 'Créoles Gabrielle bleu marine', source: 'Un grand marché', date: 'mai 2024', imageSrc: '/produits/ugm-4401649.jpeg', href: P + 'boucles-d-oreilles-gabrielle-petit-modele-creoles-perles/4401649' },
  { id: 'r3', rating: 5, text: 'Livraison rapide, boucles d’oreilles conformes aux images. Je suis ravie car elles sont très belles. Merci pour la pochette mise dans le colis, un petit geste qui fait très plaisir.', author: 'Murielle F.', product: 'Boucles Eva rouge foncé', source: 'Un grand marché', date: 'mars 2025', imageSrc: '/produits/ugm-4769573.jpeg', href: P + 'boucles-d-oreilles-eva-pendentif-cercle-evide-rouge-fonc/4769573' },
  { id: 'r4', rating: 5, text: 'Comme d’habitude, bijoux magnifiques très bien réalisés. Envoi plus que rapide et soigné. Créatrice au top à recommander.', author: 'Hélène M.', product: 'Boucles Agate bleu royal', source: 'Un grand marché', date: 'déc. 2021', imageSrc: '/produits/ugm-3776702.jpeg', href: P + 'boucles-d-oreilles-agate-gouttes-en-resine-bleu-royal-mar/3776702' },
  { id: 'r5', rating: 5, text: 'Très jolie paire, légère et facile à porter. Produit qualitatif. Je recommande vivement la créatrice des Jolies Perles.', author: 'Amélie B.', product: 'Boucles Nina nacre noire', source: 'Un grand marché', date: 'janv. 2021', imageSrc: '/produits/ugm-3591456.jpeg', href: P + 'boucles-d-oreilles-nina-pendentif-en-nacre-noir-et-clou-fl/3591456' },
  { id: 'r6', rating: 5, text: 'Les boucles d’oreilles sont magnifiques. Cette créatrice a beaucoup de talent, bravo !', author: 'Virginie S.', product: 'Créoles Aurore dorées', source: 'Un grand marché', date: 'janv. 2022', imageSrc: '/produits/ugm-3794102.jpeg', href: P + 'boucles-d-oreilles-aurore-creoles-perles-dorees-et-bleu/3794102' },
];
