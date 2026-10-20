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
| Les tops ventes                     | `src/data/products.ts`       |
| Les dates des marchés               | `src/data/markets.ts`        |
| Les réseaux, stories, publications  | `src/data/social.ts`         |
| Les avis et la note moyenne         | `src/data/reviews.ts`        |
| Le menu et l'e-mail de contact      | `src/data/site.ts`           |
| Les textes de la page               | `src/App.tsx`                |
| Les couleurs, espacements, polices  | `src/styles/tokens.css`      |

Les produits, dates, publications, avis et comptes sociaux livrés ici sont des **exemples** : remplacez-les par les vrais avant la mise en ligne.

### Photos

Déposez les photos dans `public/` (par exemple `public/produits/boucles-miel.jpg`) et indiquez `imageSrc: '/produits/boucles-miel.jpg'` sur le produit, la story ou la publication. Sans photo, un collier dessiné (`BeadArt`) s'affiche à la place.

### Marchés

Chaque marché a une `date` au format `AAAA-MM-JJ`, une `end` facultative s'il dure plusieurs jours, et un `kind` : `'local'` ou `'noel'`. Le calendrier s'ouvre sur le mois du prochain marché et atténue les dates passées.

### Stories et feed Instagram

Les stories et publications sont pour l'instant des données fixes. Pour les afficher en direct, récupérez-les avec l'API Instagram (Instagram Graph API, compte professionnel) ou un service de widget, puis convertissez-les vers les types `Story` et `Post` de `src/components/index.tsx`. Le jeton d'accès doit rester côté serveur, jamais dans le code du site.

## Structure

```
src/
  App.tsx                 la page : en-tête, hero, créatrice, tops ventes, marchés, réseaux, avis, pied de page
  components/index.tsx    les composants du design system (Button, MarketCalendar, StoryRow…)
  components/StoryViewer.tsx  visionneuse plein écran des stories
  hooks/useActiveSection.ts   souligne dans le menu la section affichée
  data/                   le contenu à mettre à jour
  styles/tokens.css       jetons de design (couleurs, espacements…)
  styles/components.css   styles des composants
  styles/app.css          styles propres à la page
```
