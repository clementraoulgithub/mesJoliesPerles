import type { Product } from '../components';

// Les ventes par article ne sont pas publiques : classement par nombre d'avis clients
// sur Un grand marché (sources/top_ventes.json, généré par scripts/fetch_shops.py).
export const topUgm: Product[] = [
  { id: 'p1', name: 'Créoles perles en résine, bleu royal marbré', price: '26,80 €', href: 'https://www.ungrandmarche.fr/boutiques/p/boucles-d-oreilles/boucles-d-oreilles-petit-modele-creoles-perles-bleu-roya/4759924', shop: 'Un grand marché', imageSrc: '/produits/ugm-4759924.jpeg', badge: { tone: 'top', label: 'Top vente' } },
  { id: 'p2', name: 'Boucles Eva, cercle évidé vert', price: '20,50 €', href: 'https://www.ungrandmarche.fr/boutiques/p/boucles-d-oreilles/boucles-d-oreilles-eva-pendentif-cercle-evide-vert-esp/4826878', shop: 'Un grand marché', imageSrc: '/produits/ugm-4826878.jpeg' },
  { id: 'p3', name: 'Boucles Agate, gouttes ambre abricot', price: '18,80 €', href: 'https://www.ungrandmarche.fr/boutiques/p/boucles-d-oreilles/boucles-d-oreilles-agate-gouttes-en-resine-ambre-abricot/3851135', shop: 'Un grand marché', imageSrc: '/produits/ugm-3851135.jpeg' },
  { id: 'p4', name: 'Créoles Gabrielle, fil coton bleu marine', price: '30,00 €', href: 'https://www.ungrandmarche.fr/boutiques/p/boucles-d-oreilles/boucles-d-oreilles-gabrielle-petit-modele-creoles-perles/4401649', shop: 'Un grand marché', imageSrc: '/produits/ugm-4401649.jpeg' },
];

// Etsy ne publie pas ses ventes par article : mêmes modèles phares, fiches Etsy (sources/etsy_recent.json).
export const topEtsy: Product[] = [
  { id: 'e1', name: 'Créoles perles en résine, bleu royal marbré', price: '25,00 €', href: 'https://www.etsy.com/fr/listing/1858030202/boucles-doreilles-creoles-perles-bleu', shop: 'Etsy', imageSrc: '/produits/etsy-1858030202.jpg', badge: { tone: 'top', label: 'Top vente' } },
  { id: 'e2', name: 'Boucles Agate bis, gouttes en résine', price: '20,50 €', href: 'https://www.etsy.com/fr/listing/1210320368/boucles-doreilles-agate-bis-gouttes-en', shop: 'Etsy', imageSrc: '/produits/etsy-1210320368.jpg' },
  { id: 'e3', name: 'Créoles perles, ambre marbré', price: '25,00 €', href: 'https://www.etsy.com/fr/listing/4594039402/boucles-doreilles-creoles-perles-ambre', shop: 'Etsy', imageSrc: '/produits/etsy-4594039402.jpg', badge: { tone: 'nouveau', label: 'Nouveau' } },
  { id: 'e4', name: 'Créoles perles, vert malachite', price: '25,00 €', href: 'https://www.etsy.com/fr/listing/4591865537/boucles-doreilles-creoles-perles-vert', shop: 'Etsy', imageSrc: '/produits/etsy-4591865537.jpg' },
];
