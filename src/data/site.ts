// Formspree contact form: the "xxxxxxxx" id from https://formspree.io/f/xxxxxxxx.
// Public (it only allows sending a message); the Vercel variable VITE_FORMSPREE_ID overrides it when set.
export const formspreeId: string = import.meta.env.VITE_FORMSPREE_ID || 'mzedlvvp';
