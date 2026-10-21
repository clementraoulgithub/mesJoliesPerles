# Les-jolies-perles — showcase website

One-screen showcase site for a handmade costume jewellery maker, built with React 18 + TypeScript + Vite and deployed on Vercel. The site is bilingual (French / English).

## Getting started

Requires Node.js 18 or later.

```bash
npm install
npm run dev       # local site on http://localhost:5173
npm run build     # production build in dist/
npm run preview   # preview the production build
```

`npm run build` outputs a static site in `dist/`. The two serverless functions in `api/` (markets calendar, image proxy) run on Vercel; `npm run dev` serves them locally too.

## Where to change what

| I want to change…                     | File                                   |
| ------------------------------------- | -------------------------------------- |
| Shop links                            | `src/data/shops.ts`                    |
| Best sellers (Etsy and Un grand marché) | `src/data/products.ts`               |
| Market dates                          | the markets calendar (see below)       |
| Social accounts and Instagram feed    | `src/data/social.ts`                   |
| Reviews, rating, number of sales      | `src/data/reviews.ts`                  |
| Contact form (Formspree)              | `src/data/site.ts`                     |
| Page texts (French and English)       | `src/i18n.tsx`                         |
| Colours, spacing, fonts               | `src/styles/tokens.css`                |

## Languages

All interface texts live in `src/i18n.tsx`, in a French dictionary (`fr`) and an English one (`en`) with the same keys; TypeScript reports any missing translation. Dates, months, weekdays, numbers and opening hours are formatted with `Intl` for the current language.

- The **FR | EN** switch, next to the tagline in the introduction block, changes the language; the choice is saved in the browser.
- On a first visit, the site follows the browser language (French unless the browser is set to another language).
- Data with a translation: product names (`nameEn` in `products.ts`), customer reviews and reviewed product names (`textEn`, `productEn` in `reviews.ts`). In English, reviews show their translation with a "Translated from French" note.
- Market titles and places come from the calendar as typed.

## Updating from the shops

```bash
python3 scripts/fetch_shops.py
```

Fetches the rating, reviews, sales, logo and photos from Un grand marché, the 10 latest Etsy listings (RSS feed) and the Instagram profile. Raw data goes to `sources/`, images to `public/marque/` and `public/produits/`. Then copy what you need into `src/data/`.

Etsy blocks automated access: Etsy reviews and best sellers are copied by hand into `src/data/`.

## Markets

Dates come from a calendar (Google Calendar, Apple Calendar, Outlook…) read by the Vercel function `api/markets.ts`. No code change needed: add an event to the calendar and it shows up on the site 10 to 20 minutes later.

In the calendar, one event = one market:

- **Title**: the market name. If it contains "Noël", it is a Christmas market.
- **Location**: "Salle Simone de Beauvoir, 12 rue …, 44119 Treillières". The site shows the venue and the town.
- **Times**: start and end of the event. "All day" shows no hours; over several days, the market covers every day.
- **Description**: a link to the market's picture (poster, photo of the stand): a direct image link, a Google Drive share link (shared with "Anyone with the link") or a link to a public Instagram or Facebook post (e.g. `https://www.facebook.com/share/p/…`).
- "Weekly" and "monthly" repeats are supported; cancelled events are ignored.

One-time setup:

1. Google Calendar: create a dedicated calendar, then *Calendar settings → Integrate calendar* and copy the **secret address in iCal format**.
2. Vercel: *Settings → Environment Variables*, add `MARKETS_ICS_URL` with that address, then redeploy.

The address stays server-side, invisible to visitors. If the calendar does not answer, the site shows the fallback list in `src/data/markets.ts`. Locally, put `MARKETS_ICS_URL=…` in `.env.local` so that `npm run dev` reads the calendar.

Missing picture on the live site? Open `/api/markets?debug`: for each Facebook or Instagram link, it shows what the platform answered. Facebook and Instagram pictures go through `/api/image`, because some of them are only served to link-preview crawlers.

## Contact form

The ✉ button ("Follow me" block) opens a form sent through [Formspree](https://formspree.io): each message arrives by email, with the visitor's address as "Reply-To".

1. On formspree.io, create a form with the email address that should receive the messages. Formspree gives an address like `https://formspree.io/f/xxxxxxxx`.
2. Put `xxxxxxxx` in `src/data/site.ts` (`formspreeId`), or in the Vercel variable `VITE_FORMSPREE_ID`, then redeploy.

This id is public: it only allows sending a message. Without an id, the form is shown but the send button stays disabled. An invisible field traps bots, and Formspree filters spam too.

## Link previews

`index.html` holds the Open Graph tags read by WhatsApp, Facebook, iMessage, LinkedIn… (title, description, `public/og-image.jpg` at 1200×630). Link previews need absolute URLs: `%SITE_URL%` is filled in at build time with Vercel's production domain (`VERCEL_PROJECT_PRODUCTION_URL`). With a custom domain, set the Vercel variable `SITE_URL` (e.g. `https://www.lesjoliesperles.fr`).

## Search engines

The build also writes `robots.txt` and `sitemap.xml` (with the same absolute URL), and `index.html` holds a canonical link and schema.org structured data (`Store`: description, logo, rating, shop and social links). Update the rating/review count there when they change.

## Live Instagram posts

The "Follow me" block shows the latest Instagram posts, read on every visit from a [Behold](https://behold.so) feed (`src/hooks/useInstagramFeed.ts`). The number of followers in the introduction comes from the same feed.

1. Create an account on behold.so, connect the `@les_joliesperles` Instagram account and create a **JSON** feed. Behold gives a URL like `https://feeds.behold.so/xxxxxxxx`.
2. The URL is set in `src/data/social.ts`. To change it without touching the code: in Vercel, *Settings → Environment Variables*, add `VITE_INSTAGRAM_FEED` with the new URL, then redeploy.

The feed URL is public: it gives access to nothing but the posts.

## Structure

```
api/
  markets.ts              Vercel function: reads the markets calendar (ICS) and post pictures
  image.ts                Vercel function: proxy for Facebook / Instagram pictures
src/
  App.tsx                 the one-screen page: introduction, best sellers, reviews, markets, Instagram, dialogs
  i18n.tsx                French and English texts, language switch, date and number formatting
  components/index.tsx    shared components (Icon, Badge, Rating, MarketCalendar) and data types
  components/ContactForm.tsx  Formspree contact form
  components/BrandIcon.tsx    Instagram, Facebook, Pinterest, Etsy and Un grand marché logos
  hooks/                  Instagram feed and markets calendar loading
  data/                   content to keep up to date
  styles/tokens.css       design tokens (colours, spacing…)
  styles/components.css   component styles
  styles/app.css          page layout
scripts/fetch_shops.py    fetches public data from the shops
```
