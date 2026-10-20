import type { NavLink } from '../components';

export const nav: NavLink[] = [
  { label: 'La créatrice', href: '#apropos' },
  { label: 'Tops ventes', href: '#tops' },
  { label: 'Marchés', href: '#marches' },
  { label: 'Actualités', href: '#reseaux' },
  { label: 'Avis', href: '#avis' },
];

// Formulaire de contact Formspree : l'identifiant « xxxxxxxx » de https://formspree.io/f/xxxxxxxx.
// Public (il permet seulement d'envoyer un message) ; la variable Vercel VITE_FORMSPREE_ID, si elle existe, le remplace.
export const formspreeId: string = import.meta.env.VITE_FORMSPREE_ID || 'mzedlvvp';
