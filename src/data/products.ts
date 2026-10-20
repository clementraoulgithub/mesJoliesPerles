import type { Product } from '../components';

// Les ventes par article ne sont pas publiques : classement par nombre d'avis clients
// sur Un grand marché (sources/top_ventes.json, généré par scripts/fetch_shops.py).
export const topProducts: Product[] = [
  { id: 'p1', name: 'Créoles perles en résine, bleu royal marbré', price: '26,80 €', href: 'https://www.ungrandmarche.fr/boutiques/p/boucles-d-oreilles/boucles-d-oreilles-petit-modele-creoles-perles-bleu-roya/4759924', shop: 'Un grand marché', imageSrc: '/produits/ugm-4759924.jpeg', badge: { tone: 'top', label: 'Top vente' } },
  { id: 'p2', name: 'Boucles Eva, cercle évidé vert', price: '20,50 €', href: 'https://www.ungrandmarche.fr/boutiques/p/boucles-d-oreilles/boucles-d-oreilles-eva-pendentif-cercle-evide-vert-esp/4826878', shop: 'Un grand marché', imageSrc: '/produits/ugm-4826878.jpeg' },
  { id: 'p3', name: 'Boucles Agate, gouttes ambre abricot', price: '18,80 €', href: 'https://www.ungrandmarche.fr/boutiques/p/boucles-d-oreilles/boucles-d-oreilles-agate-gouttes-en-resine-ambre-abricot/3851135', shop: 'Un grand marché', imageSrc: '/produits/ugm-3851135.jpeg' },
  { id: 'p4', name: 'Créoles Gabrielle, fil coton bleu marine', price: '30,00 €', href: 'https://www.ungrandmarche.fr/boutiques/p/boucles-d-oreilles/boucles-d-oreilles-gabrielle-petit-modele-creoles-perles/4401649', shop: 'Un grand marché', imageSrc: '/produits/ugm-4401649.jpeg' },
];
