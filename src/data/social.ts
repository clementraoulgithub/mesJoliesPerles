import type { SocialLink } from '../components';

export const INSTAGRAM = 'https://www.instagram.com/les_joliesperles/';
const FACEBOOK = 'https://www.facebook.com/Les-jolies-perles-1657622727841765/';

// Comptes liés depuis la boutique Un grand marché. Instagram : 1 729 abonnés, 401 publications (20/10/2026).
export const socials: SocialLink[] = [
  { network: 'instagram', handle: '@les_joliesperles', href: INSTAGRAM },
  { network: 'facebook', handle: 'Les Jolies Perles', href: FACEBOOK },
  { network: 'pinterest', handle: 'raphallegdmt', href: 'https://www.pinterest.fr/raphallegdmt/' },
];

// Flux JSON Behold (behold.so) relié à @les_joliesperles. La variable Vercel VITE_INSTAGRAM_FEED, si elle existe, le remplace.
export const instagramFeedUrl: string = import.meta.env.VITE_INSTAGRAM_FEED || 'https://feeds.behold.so/FRWnVuvpN6ieDdLJD43Q';
