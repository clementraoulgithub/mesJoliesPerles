import { useCallback, useState } from 'react';
import {
  BeadArt, Button, Hero, MarketCalendar, Reviews, Section, ShopLinks,
  SiteFooter, SiteHeader, SocialFeed, SocialLinks, StoryRow, TopSales, type Story,
} from './components';
import { StoryViewer } from './components/StoryViewer';
import { useActiveSection } from './hooks/useActiveSection';
import { ETSY, shops } from './data/shops';
import { topProducts } from './data/products';
import { markets } from './data/markets';
import { posts, socials, stories as initialStories } from './data/social';
import { reviews, reviewsSummary } from './data/reviews';
import { contactEmail, nav } from './data/site';

const SECTION_IDS = nav.map(n => n.href.slice(1));

export default function App() {
  const active = useActiveSection(SECTION_IDS);
  const [stories, setStories] = useState(initialStories);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const markSeen = (i: number) =>
    setStories(list => list.map((s, j) => (j === i ? { ...s, seen: true } : s)));

  const openStory = (s: Story) => {
    const i = stories.findIndex(x => x.id === s.id);
    setOpenIndex(i);
    markSeen(i);
  };

  const go = useCallback((delta: number) => {
    setOpenIndex(i => {
      if (i == null) return null;
      const n = i + delta;
      if (n < 0) return 0;
      if (n >= stories.length) return null;
      markSeen(n);
      return n;
    });
  }, [stories.length]);
  const next = useCallback(() => go(1), [go]);
  const prev = useCallback(() => go(-1), [go]);
  const close = useCallback(() => setOpenIndex(null), []);

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
        />

        <Section id="apropos" eyebrow="La créatrice" title="Un atelier, des milliers de perles" tone="sable">
          <div className="about">
            <div className="about-visual"><BeadArt seed={58} beads={13} ratio={0.8} /></div>
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

        <Section id="tops" eyebrow="Les plus aimés" title="Tops ventes" lead="Les bijoux les plus commandés ce mois-ci."
          action={<Button variant="secondary" size="sm" href={ETSY} external>Tout le catalogue</Button>}>
          <TopSales products={topProducts} />
        </Section>

        <Section id="marches" eyebrow="Où nous trouver" title="Les marchés de la saison" tone="sable"
          lead="Marchés locaux toute l’année, marchés de Noël en novembre et décembre. Venez voir les bijoux de près.">
          <MarketCalendar events={markets} />
        </Section>

        <Section id="reseaux" eyebrow="En ce moment" title="Sur nos réseaux"
          lead="Nouveautés, coulisses de l’atelier et photos des marchés."
          action={<SocialLinks links={socials} />}>
          <StoryRow stories={stories} onOpen={openStory} />
          <SocialFeed posts={posts} />
        </Section>

        <Section id="avis" eyebrow="Ils les portent" title="Vos avis" tone="sable">
          <Reviews reviews={reviews} average={reviewsSummary.average} count={reviewsSummary.count} />
        </Section>
      </main>

      <SiteFooter tagline="Bijoux fantaisie faits main, perle par perle." shops={shops} socials={socials} email={contactEmail} />

      {openIndex != null && (
        <StoryViewer stories={stories} index={openIndex} onClose={close} onNext={next} onPrev={prev} />
      )}
    </div>
  );
}
