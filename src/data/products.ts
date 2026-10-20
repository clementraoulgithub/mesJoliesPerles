import type { Product } from '../components';

// Les ventes par article ne sont pas publiques : classement par nombre d'avis clients
// sur Un grand marché (sources/top_ventes.json, généré par scripts/fetch_shops.py).
export const topUgm: Product[] = [
  { id: 'p1', name: 'Créoles perles en résine, bleu royal marbré', price: '26,80 €', href: 'https://www.ungrandmarche.fr/boutiques/p/boucles-d-oreilles/boucles-d-oreilles-petit-modele-creoles-perles-bleu-roya/4759924', shop: 'Un grand marché', imageSrc: '/produits/ugm-4759924.jpeg', badge: { tone: 'top', label: 'Top vente' } },
  { id: 'p2', name: 'Boucles Eva, cercle évidé vert', price: '20,50 €', href: 'https://www.ungrandmarche.fr/boutiques/p/boucles-d-oreilles/boucles-d-oreilles-eva-pendentif-cercle-evide-vert-esp/4826878', shop: 'Un grand marché', imageSrc: '/produits/ugm-4826878.jpeg' },
  { id: 'p3', name: 'Boucles Agate, gouttes ambre abricot', price: '18,80 €', href: 'https://www.ungrandmarche.fr/boutiques/p/boucles-d-oreilles/boucles-d-oreilles-agate-gouttes-en-resine-ambre-abricot/3851135', shop: 'Un grand marché', imageSrc: '/produits/ugm-3851135.jpeg' },
  { id: 'p4', name: 'Créoles Gabrielle, fil coton bleu marine', price: '30,00 €', href: 'https://www.ungrandmarche.fr/boutiques/p/boucles-d-oreilles/boucles-d-oreilles-gabrielle-petit-modele-creoles-perles/4401649', shop: 'Un grand marché', imageSrc: '/produits/ugm-4401649.jpeg' },
];

// N° 1 Etsy : donné par la créatrice (Gestionnaire de boutique Etsy). Photo et prix repris de la même fiche sur
// Un grand marché, Etsy bloquant la lecture automatique : prix Etsy à vérifier.
// Les suivants ne sont pas encore confirmés par les statistiques Etsy.
export const topEtsy: Product[] = [
  { id: 'e0', name: 'Boucles Eva, cercle évidé ambre marbré', price: '20,50 €', href: 'https://www.etsy.com/fr/listing/1164499939/eva-earrings-marbled-amber-hollow-circle', shop: 'Etsy', imageSrc: '/produits/ugm-5113290.jpeg', badge: { tone: 'top', label: 'Top vente' } },
  { id: 'e1', name: 'Créoles perles en résine, bleu royal marbré', price: '25,00 €', href: 'https://www.etsy.com/fr/listing/1858030202/boucles-doreilles-creoles-perles-bleu', shop: 'Etsy', imageSrc: '/produits/etsy-1858030202.jpg' },
  { id: 'e2', name: 'Boucles Agate bis, gouttes en résine', price: '20,50 €', href: 'https://www.etsy.com/fr/listing/1210320368/boucles-doreilles-agate-bis-gouttes-en', shop: 'Etsy', imageSrc: '/produits/etsy-1210320368.jpg' },
];
