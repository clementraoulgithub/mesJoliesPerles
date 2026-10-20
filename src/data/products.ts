import type { Product } from '../components';

// N° 1 et 2 Un grand marché : donnés par la créatrice (historique des ventes).
export const topUgm: Product[] = [
  { id: 'p4', name: 'Créoles Gabrielle, fil coton bleu marine', href: 'https://www.ungrandmarche.fr/boutiques/p/boucles-d-oreilles/boucles-d-oreilles-gabrielle-petit-modele-creoles-perles/4401649', shop: 'Un grand marché', images: ['/produits/ugm-4401649-1.jpeg', '/produits/ugm-4401649-2.jpeg', '/produits/ugm-4401649-3.jpeg', '/produits/ugm-4401649-4.jpeg'], badge: { tone: 'top', label: 'Top vente' } },
  { id: 'p5', name: 'Boucles Léopard, pendentif ovale en acétate', href: 'https://www.ungrandmarche.fr/boutiques/p/boucles-d-oreilles/boucles-d-oreilles-leopard-pendentif-ovale-en-acetate/4941143', shop: 'Un grand marché', images: ['/produits/ugm-4941143-1.jpeg', '/produits/ugm-4941143-2.jpeg', '/produits/ugm-4941143-3.jpeg', '/produits/ugm-4941143-4.jpeg', '/produits/ugm-4941143-5.jpeg'] },
];

// N° 1 et 2 Etsy : donnés par la créatrice (Gestionnaire de boutique Etsy). Etsy bloquant la lecture automatique,
// les photos viennent des mêmes modèles sur Un grand marché (sauf la 1re de l'Agate, photo Etsy).
// Pas de prix ici : ils changent sur les boutiques, « Voir la fiche » mène au prix à jour.
export const topEtsy: Product[] = [
  { id: 'e0', name: 'Boucles Eva, cercle évidé ambre marbré', href: 'https://www.etsy.com/fr/listing/1164499939/eva-earrings-marbled-amber-hollow-circle', shop: 'Etsy', images: ['/produits/ugm-5113290-1.jpeg', '/produits/ugm-5113290-2.jpeg', '/produits/ugm-5113290-3.jpeg', '/produits/ugm-5113290-4.jpeg'], badge: { tone: 'top', label: 'Top vente' } },
  { id: 'e1', name: 'Boucles Agate petit modèle, gouttes en résine', href: 'https://www.etsy.com/fr/listing/987535046/agate-earrings-small-size-resin-drops', shop: 'Etsy', images: ['/produits/etsy-987535046.jpg', '/produits/ugm-5047491-2.jpeg', '/produits/ugm-5047491-3.jpeg', '/produits/ugm-5047491-4.jpeg', '/produits/ugm-5047491-5.jpeg', '/produits/ugm-5047491-6.jpeg'] },
];
