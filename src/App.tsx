import {
  Button, Hero, MarketCalendar, Reviews, Section, ShopLinks,
  SiteFooter, SiteHeader, SocialFeed, SocialLinks, TopSales,
} from './components';
import { useActiveSection } from './hooks/useActiveSection';
import { useInstagramFeed } from './hooks/useInstagramFeed';
import { useMarkets } from './hooks/useMarkets';
import { ETSY, shops } from './data/shops';
import { topProducts } from './data/products';
import { markets } from './data/markets';
import { INSTAGRAM, instagramFeedUrl, socials } from './data/social';
import { reviews, reviewsSummary } from './data/reviews';
import { contactEmail, nav } from './data/site';

const SECTION_IDS = nav.map(n => n.href.slice(1));

export default function App() {
  const active = useActiveSection(SECTION_IDS);
  const instagram = useInstagramFeed(instagramFeedUrl);
  const agenda = useMarkets(markets);

  return (
    <div className="jp-root">
      <SiteHeader links={nav} active={active} cta={{ label: 'Boutique', href: ETSY }} />

      <main>
        <Hero
          eyebrow="Bijoux fantaisie faits main"
          title="Des perles qui racontent une histoire"
          lead="Colliers, bracelets et boucles d’oreilles montés à la main, à retrouver en ligne et sur les marchés de la région."
          actions={<>
            <Button href={ETSY} external icon="bag">Voir la boutique</Button>
            <Button variant="secondary" href="#marches" icon="calendar">Les prochains marchés</Button>
          </>}
          imageSrc="/marque/logo.jpeg"
          imageAlt="Six boucles d’oreilles en perles de verre colorées suspendues à une baguette"
        />

        <Section id="apropos" eyebrow="La créatrice" title="Un atelier, des milliers de perles" tone="sable">
          <div className="about">
            <div className="about-visual"><img src="/produits/ugm-4401649.jpeg" alt="Créoles Gabrielle en perles et fil de coton bleu marine" /></div>
            <div>
              <p className="jp-lead" style={{ marginTop: 0 }}>
                Les Jolies Perles, ce sont des bijoux fantaisie imaginés et assemblés à la main : perles de verre,
                de bois, pierres et apprêts dorés, choisis un à un.
              </p>
              <p>
                Chaque modèle est fabriqué en petite série. Vous les trouverez sur les boutiques en ligne toute
                l’année, et en vrai sur les marchés locaux et les marchés de Noël.
              </p>
              <div className="about-points">
                <div><b>Fait main</b><span>Monté à l’atelier, perle par perle</span></div>
                <div><b>Petites séries</b><span>Des modèles qui changent avec les saisons</span></div>
                <div><b>Prêt à offrir</b><span>Chaque bijou part dans sa pochette</span></div>
              </div>
            </div>
          </div>
          <div className="shops-block"><ShopLinks shops={shops} /></div>
        </Section>

        <Section id="tops" eyebrow="Les plus aimés" title="Tops ventes" lead="Les modèles qui recueillent le plus d’avis clients."
          action={<Button variant="secondary" size="sm" href={ETSY} external>Tout le catalogue</Button>}>
          <TopSales products={topProducts} />
        </Section>

        <Section id="marches" eyebrow="Où nous trouver" title="Les marchés de la saison" tone="sable"
          lead="Marchés locaux toute l’année, marchés de Noël en novembre et décembre. Venez voir les bijoux de près.">
          <MarketCalendar key={agenda.status} events={agenda.events} />
        </Section>

        <Section id="reseaux" eyebrow="En ce moment" title="Sur nos réseaux"
          lead="Nouveautés, coulisses de l’atelier et photos des marchés."
          action={<SocialLinks links={socials} />}>
          {instagram.posts.length > 0
            ? <SocialFeed posts={instagram.posts} />
            : instagram.status !== 'loading' && (
              <p className="feed-fallback">
                Toutes nos publications sont sur Instagram.{' '}
                <Button variant="secondary" size="sm" href={INSTAGRAM} external>Voir @les_joliesperles</Button>
              </p>
            )}
        </Section>

        <Section id="avis" eyebrow="Ils les portent" title="Vos avis" tone="sable">
          <Reviews reviews={reviews} average={reviewsSummary.average} count={reviewsSummary.count} />
        </Section>
      </main>

      <SiteFooter tagline="Bijoux fantaisie faits main, perle par perle." shops={shops} socials={socials} email={contactEmail} />

    </div>
  );
}
