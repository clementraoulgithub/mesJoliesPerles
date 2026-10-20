import type { Product } from '../components';

// N° 1 et 2 Un grand marché : donnés par la créatrice (historique des ventes).
export const topUgm: Product[] = [
  { id: 'p4', name: 'Créoles Gabrielle, fil coton bleu marine', href: 'https://www.ungrandmarche.fr/boutiques/p/boucles-d-oreilles/boucles-d-oreilles-gabrielle-petit-modele-creoles-perles/4401649', shop: 'Un grand marché', imageSrc: '/produits/ugm-4401649.jpeg', badge: { tone: 'top', label: 'Top vente' } },
  { id: 'p5', name: 'Boucles Léopard, pendentif ovale en acétate', href: 'https://www.ungrandmarche.fr/boutiques/p/boucles-d-oreilles/boucles-d-oreilles-leopard-pendentif-ovale-en-acetate/4941143', shop: 'Un grand marché', imageSrc: '/produits/ugm-4941143.jpeg' },
];

// N° 1 et 2 Etsy : donnés par la créatrice (Gestionnaire de boutique Etsy). Etsy bloquant la lecture automatique,
// la photo du n° 1 vient du même modèle sur Un grand marché.
// Pas de prix ici : ils changent sur les boutiques, « Voir la fiche » mène au prix à jour.
export const topEtsy: Product[] = [
  { id: 'e0', name: 'Boucles Eva, cercle évidé ambre marbré', href: 'https://www.etsy.com/fr/listing/1164499939/eva-earrings-marbled-amber-hollow-circle', shop: 'Etsy', imageSrc: '/produits/ugm-5113290.jpeg', badge: { tone: 'top', label: 'Top vente' } },
  { id: 'e1', name: 'Boucles Agate petit modèle, gouttes en résine', href: 'https://www.etsy.com/fr/listing/987535046/agate-earrings-small-size-resin-drops', shop: 'Etsy', imageSrc: '/produits/etsy-987535046.jpg' },
];
