import type { Product } from '../components';
import { ETSY, UGM } from './shops';

// EXEMPLES : remplacez par vos meilleures ventes (du plus vendu au moins vendu).
// imageSrc : mettez vos photos dans /public/produits/ puis imageSrc: '/produits/boucles-miel.jpg'.
// href : collez le lien de la fiche produit sur la boutique.
export const topProducts: Product[] = [
  { id: 'p1', name: 'Boucles Goutte de miel', price: '18,00 €', href: ETSY, shop: 'Etsy', seed: 11, badge: { tone: 'top', label: 'Top vente' } },
  { id: 'p2', name: 'Bracelet Jade & laiton', price: '22,00 €', href: ETSY, shop: 'Etsy', seed: 23 },
  { id: 'p3', name: 'Collier Corail d’hiver', price: '34,00 €', href: UGM, shop: 'Un grand marché', seed: 42, badge: { tone: 'nouveau', label: 'Nouveau' } },
  { id: 'p4', name: 'Bague Perle de nacre', price: '15,00 €', href: ETSY, shop: 'Etsy', seed: 7 },
];
