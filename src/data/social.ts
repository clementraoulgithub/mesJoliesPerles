import type { SocialLink } from '../components';

export const INSTAGRAM = 'https://www.instagram.com/les_joliesperles/';
const FACEBOOK = 'https://www.facebook.com/Les-jolies-perles-1657622727841765/';

// Accounts linked from the Un grand marché shop.
export const socials: SocialLink[] = [
  { network: 'instagram', handle: '@les_joliesperles', href: INSTAGRAM },
  { network: 'facebook', handle: 'Les Jolies Perles', href: FACEBOOK },
  { network: 'pinterest', handle: 'raphallegdmt', href: 'https://www.pinterest.fr/raphallegdmt/' },
];

// Behold JSON feed (behold.so) connected to @les_joliesperles. The Vercel variable VITE_INSTAGRAM_FEED overrides it when set.
export const instagramFeedUrl: string = import.meta.env.VITE_INSTAGRAM_FEED || 'https://feeds.behold.so/FRWnVuvpN6ieDdLJD43Q';
