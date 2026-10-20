# Les Jolies Perles — site vitrine

Site vitrine d'une page (SPA) en React 18 + TypeScript + Vite.

## Démarrer

Il faut Node.js 18 ou plus récent.

```bash
npm install
npm run dev       # site en local sur http://localhost:5173
npm run build     # version de production dans dist/
npm run preview   # tester la version de production
```

Le dossier `dist/` produit par `npm run build` se dépose tel quel sur n'importe quel hébergement statique (Netlify, Vercel, GitHub Pages, OVH…).

## Où modifier quoi

| Je veux changer…                    | Fichier                      |
| ----------------------------------- | ---------------------------- |
| Les liens des boutiques             | `src/data/shops.ts`          |
| Les tops ventes (Etsy et UGM)       | `src/data/products.ts`       |
| Les dates des marchés               | l'agenda des marchés (voir plus bas) |
| Les comptes et le flux Instagram    | `src/data/social.ts`         |
| Les avis et la note moyenne         | `src/data/reviews.ts`        |
| Le menu et l'e-mail de contact      | `src/data/site.ts`           |
| Les textes de la page               | `src/App.tsx`                |
| Les couleurs, espacements, polices  | `src/styles/tokens.css`      |

Les produits, dates, publications, avis et comptes sociaux livrés ici sont des **exemples** : remplacez-les par les vrais avant la mise en ligne.

### Mettre à jour depuis les boutiques

```bash
python3 scripts/fetch_shops.py
```

Récupère la note, les avis, les ventes, le logo et les photos d'Un grand marché, les 10 dernières fiches Etsy (flux RSS) et le profil Instagram. Les données brutes vont dans `sources/`, les images dans `public/marque/` et `public/produits/`. Recopiez ensuite ce qui vous intéresse dans `src/data/`.

### Photos

Déposez les photos dans `public/` (par exemple `public/produits/boucles-miel.jpg`) et indiquez `imageSrc: '/produits/boucles-miel.jpg'` sur le produit, la story ou la publication. Sans photo, un collier dessiné (`BeadArt`) s'affiche à la place.

### Marchés

Les dates viennent d'un agenda (Google Agenda, Apple Calendrier, Outlook…) lu par la fonction Vercel `api/markets.ts`. Pas besoin de toucher au code : on ajoute un événement dans l'agenda, il apparaît sur le site 10 à 20 minutes plus tard.

Dans l'agenda, un événement = un marché :

- **Titre** : le nom du marché. S'il contient « Noël », c'est un marché de Noël.
- **Lieu** : « Salle Simone de Beauvoir, 12 rue …, 44119 Treillières ». Le site affiche le lieu et la ville.
- **Horaires** : début et fin de l'événement. « Toute la journée » n'affiche pas d'horaire ; sur plusieurs jours, le marché couvre tous les jours.
- **Description** : un lien vers l'image du marché (affiche, photo du stand). Au choix : lien direct vers une image, lien de partage Google Drive (partagé à « Tous les utilisateurs disposant du lien ») ou lien d'une publication Instagram ou Facebook publique (ex. `https://www.facebook.com/share/p/…`).
- Les répétitions « chaque semaine » et « chaque mois » sont prises en compte, les événements annulés sont ignorés.

Mise en place, une seule fois :

1. Google Agenda : créez un agenda dédié (« Marchés Les Jolies Perles »), puis *Paramètres de l'agenda → Intégrer l'agenda* et copiez l'**adresse secrète au format iCal**.
2. Vercel : *Settings → Environment Variables*, ajoutez `MARKETS_ICS_URL` avec cette adresse, puis redéployez.

L'adresse reste côté serveur, invisible des visiteurs. Si l'agenda ne répond pas, le site affiche la liste de secours de `src/data/markets.ts`. En local, mettez `MARKETS_ICS_URL=…` dans `.env.local` pour que `npm run dev` lise l'agenda.

### Publications Instagram en direct

La section « Sur nos réseaux » affiche les dernières publications Instagram, lues à chaque visite depuis un flux [Behold](https://behold.so) (`src/hooks/useInstagramFeed.ts`).

1. Créez un compte sur behold.so, connectez le compte Instagram `@les_joliesperles` et créez un flux **JSON**. Behold donne une URL du type `https://feeds.behold.so/xxxxxxxx`.
2. L'URL est réglée dans `src/data/social.ts`. Pour en changer sans toucher au code : dans Vercel, *Settings → Environment Variables*, ajoutez `VITE_INSTAGRAM_FEED` avec la nouvelle URL, puis redéployez.

L'URL du flux est publique : elle ne donne accès à rien d'autre que les publications. Sans URL, ou si Behold ne répond pas, la section affiche un lien vers le compte Instagram.

## Structure

```
src/
  App.tsx                 la page sur un seul écran : boutiques, créatrice, avis, tops ventes, marchés, Instagram
  components/index.tsx    les composants du design system (Button, MarketCalendar, StoryRow…)
  components/StoryViewer.tsx  visionneuse plein écran des stories
  hooks/useActiveSection.ts   souligne dans le menu la section affichée
  data/                   le contenu à mettre à jour
  styles/tokens.css       jetons de design (couleurs, espacements…)
  styles/components.css   styles des composants
  styles/app.css          styles propres à la page
```
