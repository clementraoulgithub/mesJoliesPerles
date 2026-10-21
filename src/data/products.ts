import type { Product } from '../components';

// Un grand marché #1 and #2: given by the maker (sales history).
export const topUgm: Product[] = [
  { id: 'p4', name: 'Créoles Gabrielle, fil coton bleu marine', nameEn: 'Gabrielle hoops, navy cotton thread', href: 'https://www.ungrandmarche.fr/boutiques/p/boucles-d-oreilles/boucles-d-oreilles-gabrielle-petit-modele-creoles-perles/4401649', shop: 'Un grand marché', images: ['/produits/ugm-4401649-1.jpeg', '/produits/ugm-4401649-2.jpeg', '/produits/ugm-4401649-3.jpeg', '/produits/ugm-4401649-4.jpeg'], top: true },
  { id: 'p5', name: 'Boucles Léopard, pendentif ovale en acétate', nameEn: 'Leopard earrings, oval acetate pendant', href: 'https://www.ungrandmarche.fr/boutiques/p/boucles-d-oreilles/boucles-d-oreilles-leopard-pendentif-ovale-en-acetate/4941143', shop: 'Un grand marché', images: ['/produits/ugm-4941143-1.jpeg', '/produits/ugm-4941143-2.jpeg', '/produits/ugm-4941143-3.jpeg', '/produits/ugm-4941143-4.jpeg', '/produits/ugm-4941143-5.jpeg'] },
];

// Etsy #1 and #2: given by the maker (Etsy Shop Manager). Etsy blocks automated access, so the photos come from
// the same models on Un grand marché (except the first Agate photo, taken from Etsy).
// No prices here: they change on the shops, "View item" leads to the current price.
export const topEtsy: Product[] = [
  { id: 'e0', name: 'Boucles Eva, cercle évidé ambre marbré', nameEn: 'Eva earrings, marbled amber hollow circle', href: 'https://www.etsy.com/fr/listing/1164499939/eva-earrings-marbled-amber-hollow-circle', shop: 'Etsy', images: ['/produits/ugm-5113290-1.jpeg', '/produits/ugm-5113290-2.jpeg', '/produits/ugm-5113290-3.jpeg', '/produits/ugm-5113290-4.jpeg'], top: true },
  { id: 'e1', name: 'Boucles Agate petit modèle, gouttes en résine', nameEn: 'Agate earrings, small resin drops', href: 'https://www.etsy.com/fr/listing/987535046/agate-earrings-small-size-resin-drops', shop: 'Etsy', images: ['/produits/etsy-987535046.jpg', '/produits/ugm-5047491-2.jpeg', '/produits/ugm-5047491-3.jpeg', '/produits/ugm-5047491-4.jpeg', '/produits/ugm-5047491-5.jpeg', '/produits/ugm-5047491-6.jpeg'] },
];
