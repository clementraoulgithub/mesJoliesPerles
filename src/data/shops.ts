import type { Shop } from '../components';

export const ETSY = 'https://www.etsy.com/fr/shop/Mesjoliesperles';
export const UGM = 'https://www.ungrandmarche.fr/boutique/les-jolies-perles';

export const shops: Shop[] = [
  { name: 'Etsy', description: 'La boutique complète : colliers, bracelets, boucles d’oreilles. Livraison en France et en Europe.', href: ETSY, cta: 'Voir sur Etsy', note: 'Boutique Mesjoliesperles' },
  { name: 'Un grand marché', description: 'La place de marché des créateurs français, idéale pour les idées cadeaux.', href: UGM, cta: 'Voir sur Un grand marché', note: 'Boutique Les Jolies Perles' },
];
