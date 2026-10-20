import type { Post, SocialLink, Story } from '../components';

// EXEMPLES : remplacez les identifiants et liens par vos vrais comptes.
export const socials: SocialLink[] = [
  { network: 'instagram', handle: '@lesjoliesperles', href: 'https://www.instagram.com/' },
  { network: 'facebook', handle: 'Les Jolies Perles', href: 'https://www.facebook.com/' },
  { network: 'pinterest', handle: 'lesjoliesperles', href: 'https://www.pinterest.fr/' },
];

// Stories et publications d'exemple. En production, chargez-les depuis l'API Instagram
// (Instagram Graph API) ou un widget, puis convertissez-les vers ces types.
export const stories: (Story & { caption: string })[] = [
  { id: 's1', label: 'Nouveautés', seed: 31, caption: 'La collection d’hiver arrive samedi.' },
  { id: 's2', label: 'Atelier', seed: 14, caption: 'Montage des boucles, perle par perle.' },
  { id: 's3', label: 'Marché', seed: 52, caption: 'Rendez-vous samedi à la halle couverte.' },
  { id: 's4', label: 'Noël', seed: 9, caption: 'Les idées cadeaux sont prêtes.' },
  { id: 's5', label: 'Coulisses', seed: 27, seen: true, caption: 'Tri des perles de verre à l’atelier.' },
  { id: 's6', label: 'Vos photos', seed: 18, seen: true, caption: 'Merci pour vos photos !' },
];

export const posts: Post[] = [
  { id: 'f1', network: 'instagram', caption: 'La collection d’hiver arrive samedi : corail, laiton et perles de verre.', likes: 128, comments: 14, date: 'il y a 2 j', href: 'https://www.instagram.com/', seed: 61 },
  { id: 'f2', network: 'instagram', caption: 'Montage des boucles Goutte de miel, perle par perle.', likes: 96, comments: 8, date: 'il y a 4 j', href: 'https://www.instagram.com/', seed: 72 },
  { id: 'f3', network: 'facebook', caption: 'Merci pour votre visite au marché des créateurs !', likes: 54, comments: 11, date: 'il y a 6 j', href: 'https://www.facebook.com/', seed: 83 },
  { id: 'f4', network: 'instagram', caption: 'Idée cadeau : le bracelet Jade & laiton dans sa pochette.', likes: 142, comments: 19, date: 'il y a 1 sem.', href: 'https://www.instagram.com/', seed: 94 },
  { id: 'f5', network: 'instagram', caption: 'Nouvelles perles reçues à l’atelier. Laquelle préférez-vous ?', likes: 87, comments: 23, date: 'il y a 1 sem.', href: 'https://www.instagram.com/', seed: 105 },
  { id: 'f6', network: 'facebook', caption: 'Le calendrier des marchés de Noël est en ligne.', likes: 63, comments: 6, date: 'il y a 2 sem.', href: 'https://www.facebook.com/', seed: 116 },
];
