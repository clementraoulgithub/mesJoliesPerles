import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/**
 * Lightweight i18n: two languages, a flat message dictionary and Intl-based date/number formatting.
 * The chosen language is kept in localStorage; the first visit follows the browser language (French by default).
 */

export type Lang = 'fr' | 'en';

const fr = {
  pageTitle: 'Les-jolies-perles · Bijoux fantaisie faits main',
  tagline: 'La passion, la création',
  lead: 'Je confectionne depuis 2017 des bijoux fantaisie originaux et colorés, faits main dans la région nantaise. Je réalise aussi vos bijoux sur commande, sans supplément de prix.',
  featHandmade: 'Fait main',
  featFrance: 'Made in France',
  featShipping: 'Envoi soigné et suivi',
  featRefund: 'Satisfait ou remboursé',
  statRating: 'Note',
  statSales: 'Ventes',
  statFollowers: 'Abonnés',
  orderOn: 'Commander sur',
  contact: 'Me contacter',
  contactByEmail: 'Me contacter par e-mail',
  language: 'Langue',
  topSales: 'Tops ventes',
  shop: 'Boutique',
  topSale: 'Top vente',
  seeListing: 'Voir la fiche',
  photoOf: (name: string, n: number, total: number) => `${name} — photo ${n} sur ${total}`,
  prevPhoto: 'Photo précédente',
  nextPhoto: 'Photo suivante',
  reviews: 'Vos avis',
  reviewCount: (n: string) => `${n} avis`,
  reviewOf: (n: number, total: number) => `Avis ${n} sur ${total}`,
  chooseReview: 'Choisir un avis',
  prevReview: 'Avis précédent',
  nextReview: 'Avis suivant',
  see: (what: string) => `Voir ${what}`,
  etsyReview: 'Avis Etsy',
  translated: '',
  carousel: 'carrousel',
  review: 'avis',
  nextMarkets: 'Prochains marchés',
  calendar: 'Calendrier',
  calendarTitle: 'Calendrier des marchés',
  noMarketTitle: 'Prochaines dates en préparation',
  noMarketText: 'Les nouvelles dates sont annoncées sur Instagram. Les boutiques en ligne restent ouvertes.',
  alreadyIn: 'Déjà passée par',
  now: 'En ce moment',
  tomorrow: 'Demain',
  inDays: (n: number) => `Dans ${n} jours`,
  nextWeek: 'La semaine prochaine',
  inWeeks: (n: number) => `Dans ${n} semaines`,
  directions: 'Itinéraire',
  poster: (title: string) => `Affiche : ${title}`,
  followMe: 'Suivez-moi',
  socialsAndContact: 'Réseaux sociaux et contact',
  instagramFallback: 'Toutes nos publications sont sur Instagram.',
  close: 'Fermer',
  // Calendar
  prevMonth: 'Mois précédent',
  nextMonth: 'Mois suivant',
  marketType: 'Type de marché',
  all: 'Tous',
  localMarkets: 'Marchés locaux',
  christmas: 'Noël',
  localMarket: 'Marché local',
  christmasMarket: 'Marché de Noël',
  inMonth: (month: string) => `En ${month}`,
  onDay: (day: string) => `Le ${day}`,
  dates: (n: number) => `${n} ${n > 1 ? 'dates' : 'date'}`,
  noMarketMonth: 'Pas de marché ce mois-ci. Les boutiques en ligne restent ouvertes.',
  fromTo: (a: string, b: string) => `du ${a} au ${b}`,
  // Contact form
  contactIntro: 'Une question, une envie de bijou sur mesure, une invitation à un marché ? Écrivez-moi.',
  name: 'Nom',
  email: 'E-mail',
  subject: 'Sujet',
  message: 'Message',
  messagePlaceholder: 'Modèle, couleur, date souhaitée…',
  subjects: ['Une question sur un bijou', 'Une commande sur mesure', 'Un marché ou un événement', 'Autre chose'],
  send: 'Envoyer',
  sending: 'Envoi…',
  emailUse: 'Votre adresse ne sert qu’à vous répondre.',
  formSoon: 'L’envoi de messages sera bientôt disponible.',
  formNotReady: 'Formulaire pas encore configuré',
  sendError: (detail: string) => `L’envoi n’a pas abouti${detail ? ` : ${detail}` : ''}. Réessayez dans un instant.`,
  sentTitle: 'Merci, votre message est envoyé !',
  sentText: 'Je vous réponds dès que possible, en général sous 48 h.',
  emailSubject: 'Nouveau message depuis le site Les-jolies-perles',
};

type Messages = typeof fr;

const en: Messages = {
  pageTitle: 'Les-jolies-perles · Handmade costume jewellery',
  tagline: 'Passion and creation',
  lead: 'Since 2017 I have been handcrafting original, colourful costume jewellery in the Nantes area, France. I also make pieces to order at no extra cost.',
  featHandmade: 'Handmade',
  featFrance: 'Made in France',
  featShipping: 'Careful, tracked shipping',
  featRefund: 'Money-back guarantee',
  statRating: 'Rating',
  statSales: 'Sales',
  statFollowers: 'Followers',
  orderOn: 'Order on',
  contact: 'Contact me',
  contactByEmail: 'Contact me by email',
  language: 'Language',
  topSales: 'Best sellers',
  shop: 'Shop',
  topSale: 'Best seller',
  seeListing: 'View item',
  photoOf: (name, n, total) => `${name} — photo ${n} of ${total}`,
  prevPhoto: 'Previous photo',
  nextPhoto: 'Next photo',
  reviews: 'Reviews',
  reviewCount: n => `${n} reviews`,
  reviewOf: (n, total) => `Review ${n} of ${total}`,
  chooseReview: 'Choose a review',
  prevReview: 'Previous review',
  nextReview: 'Next review',
  see: what => `View ${what}`,
  etsyReview: 'Etsy review',
  translated: 'Translated from French',
  carousel: 'carousel',
  review: 'review',
  nextMarkets: 'Upcoming markets',
  calendar: 'Calendar',
  calendarTitle: 'Market calendar',
  noMarketTitle: 'New dates coming soon',
  noMarketText: 'New dates are announced on Instagram. The online shops stay open.',
  alreadyIn: 'Previously in',
  now: 'On now',
  tomorrow: 'Tomorrow',
  inDays: n => `In ${n} days`,
  nextWeek: 'Next week',
  inWeeks: n => `In ${n} weeks`,
  directions: 'Directions',
  poster: title => `Poster: ${title}`,
  followMe: 'Follow me',
  socialsAndContact: 'Social media and contact',
  instagramFallback: 'All our posts are on Instagram.',
  close: 'Close',
  prevMonth: 'Previous month',
  nextMonth: 'Next month',
  marketType: 'Market type',
  all: 'All',
  localMarkets: 'Local markets',
  christmas: 'Christmas',
  localMarket: 'Local market',
  christmasMarket: 'Christmas market',
  inMonth: month => `In ${month}`,
  onDay: day => day,
  dates: n => `${n} ${n > 1 ? 'dates' : 'date'}`,
  noMarketMonth: 'No market this month. The online shops stay open.',
  fromTo: (a, b) => `${a} – ${b}`,
  contactIntro: 'A question, a custom piece in mind, an invitation to a market? Write to me.',
  name: 'Name',
  email: 'Email',
  subject: 'Subject',
  message: 'Message',
  messagePlaceholder: 'Model, colour, desired date…',
  subjects: ['A question about a piece', 'A custom order', 'A market or an event', 'Something else'],
  send: 'Send',
  sending: 'Sending…',
  emailUse: 'Your address is only used to reply to you.',
  formSoon: 'Sending messages will be available soon.',
  formNotReady: 'Form not configured yet',
  sendError: detail => `Your message could not be sent${detail ? `: ${detail}` : ''}. Please try again in a moment.`,
  sentTitle: 'Thank you, your message has been sent!',
  sentText: 'I will get back to you as soon as possible, usually within 48 hours.',
  emailSubject: 'New message from the Les-jolies-perles website',
};

const MESSAGES: Record<Lang, Messages> = { fr, en };
const LOCALE: Record<Lang, string> = { fr: 'fr-FR', en: 'en-GB' };
const STORAGE_KEY = 'lang';

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'fr' || saved === 'en') return saved;
  } catch { /* storage unavailable (private mode…) */ }
  return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : navigator.language ? 'en' : 'fr';
}

/** Parses "YYYY-MM-DD" (or "YYYY-MM") at noon local time, so formatting never shifts the day. */
const parseIso = (iso: string) => new Date(iso.length === 7 ? iso + '-01T12:00:00' : iso + 'T12:00:00');

function makeI18n(lang: Lang) {
  const locale = LOCALE[lang];
  const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, opts);
  const monthLong = fmt({ month: 'long' });
  const monthShort = fmt({ month: 'short' });
  const weekdayShort = fmt({ weekday: 'short' });
  const weekdayLong = fmt({ weekday: 'long' });
  const monthYear = fmt({ month: 'short', year: 'numeric' });
  const dayMonth = fmt({ day: 'numeric', month: 'long' });
  const fullDay = fmt({ weekday: 'long', day: 'numeric', month: 'long' });
  return {
    lang,
    locale,
    t: MESSAGES[lang],
    number: (n: number, digits = 0) => n.toLocaleString(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }),
    /** "novembre" / "November" */
    monthLong: (iso: string) => monthLong.format(parseIso(iso)),
    /** "nov." / "Nov" */
    monthShort: (iso: string) => monthShort.format(parseIso(iso)),
    /** "sam." / "Sat" */
    weekdayShort: (iso: string) => weekdayShort.format(parseIso(iso)),
    /** Monday-first short weekday names for the calendar header. */
    weekdayNames: () => Array.from({ length: 7 }, (_, i) => weekdayShort.format(new Date(2024, 0, 1 + i, 12)).replace('.', '')),
    weekdayLong: (iso: string) => weekdayLong.format(parseIso(iso)),
    /** "mai 2022" / "May 2022", from "YYYY-MM" */
    monthYear: (iso: string) => monthYear.format(parseIso(iso)),
    /** "18 juillet" / "18 July" */
    dayMonth: (iso: string) => dayMonth.format(parseIso(iso)),
    /** "samedi 18 juillet" / "Saturday 18 July" */
    fullDay: (iso: string) => fullDay.format(parseIso(iso)),
    /** Opening hours from "HH:MM" times: "10h – 18h" / "dès 9h", "10am – 6pm" / "from 9am". */
    hours: (start?: string, end?: string) => {
      if (!start) return undefined;
      const one = (hm: string) => {
        const [h, m] = hm.split(':').map(Number);
        if (lang === 'fr') return `${h}h${m ? String(m).padStart(2, '0') : ''}`;
        const h12 = h % 12 || 12;
        return `${h12}${m ? ':' + String(m).padStart(2, '0') : ''}${h < 12 ? 'am' : 'pm'}`;
      };
      if (end) return `${one(start)} – ${one(end)}`;
      return lang === 'fr' ? `dès ${one(start)}` : `from ${one(start)}`;
    },
  };
}

export type I18n = ReturnType<typeof makeI18n> & { setLang: (l: Lang) => void };

const I18nContext = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const value = useMemo<I18n>(() => ({
    ...makeI18n(lang),
    setLang: (l: Lang) => {
      setLangState(l);
      try { localStorage.setItem(STORAGE_KEY, l); } catch { /* ignore */ }
    },
  }), [lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = MESSAGES[lang].pageTitle;
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}

/** Picks the English variant of a data field when it exists ("name" → "nameEn"). */
export const localized = (lang: Lang, fr: string, en?: string) => (lang === 'en' && en ? en : fr);
