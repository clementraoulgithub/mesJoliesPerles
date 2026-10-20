import type { Shop } from '../components';

export const ETSY = 'https://www.etsy.com/fr/shop/Mesjoliesperles';
export const UGM = 'https://www.ungrandmarche.fr/boutique/les-jolies-perles';

// Chiffres relevés le 20/10/2026 (scripts/fetch_shops.py et page publique Etsy).
export const shops: Shop[] = [
  { name: 'Etsy', description: 'La boutique complète, surtout des boucles d’oreilles. Envoi soigné et suivi depuis Nantes.', href: ETSY, cta: 'Voir sur Etsy', note: 'Mesjoliesperles · Star Seller · plus de 1 400 ventes' },
  { name: 'Un grand marché', description: 'La place de marché des créateurs français. Bijoux sur commande sans supplément de prix.', href: UGM, cta: 'Voir sur Un grand marché', note: 'Les Jolies Perles · 5,0/5 sur 86 avis · 499 ventes' },
];
