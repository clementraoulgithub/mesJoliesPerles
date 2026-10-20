import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Badge, Icon, MarketCalendar, Rating, type MarketEvent, type Product } from './components';
import { BrandIcon, BRAND_LABEL } from './components/BrandIcon';
import { useInstagramFeed } from './hooks/useInstagramFeed';
import { useMarkets } from './hooks/useMarkets';
import { ETSY, UGM } from './data/shops';
import { topEtsy, topUgm } from './data/products';
import { markets } from './data/markets';
import { INSTAGRAM, instagramFeedUrl, socials } from './data/social';
import { reviews, reviewsSummary } from './data/reviews';

const MONTHS_SHORT = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const today = () => new Date().toISOString().slice(0, 10);
const day = (iso: string) => Number(iso.slice(8, 10));
const month = (iso: string) => MONTHS_SHORT[Number(iso.slice(5, 7)) - 1];

/** Page sur un seul écran : présentation et tops ventes en haut ; avis, marchés et Instagram en bas. */
export default function App() {
  const instagram = useInstagramFeed(instagramFeedUrl);
  const agenda = useMarkets(markets);
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <div className="jp-root dash">
      <main className="dash-main">
        <section className="dash-intro" aria-labelledby="h-intro">
          <div className="dash-brand">
            <img className="dash-logo" src="/marque/logo.jpeg" alt="" />
            <div>
              <h1 id="h-intro" className="dash-name">Les Jolies Perles</h1>
              <p className="dash-tag">Bijoux faits main · Nantes</p>
            </div>
          </div>
          <p className="dash-lead">
            Des bijoux originaux et colorés, montés à la main en petites séries : créoles en perles de résine,
            pendentifs en acétate, fleurs, coquillages. Sur commande sans supplément, envoi soigné.
          </p>
          <dl className="dash-stats">
            <div><dt>Note</dt><dd>{reviewsSummary.average.toFixed(1).replace('.', ',')}<Icon name="star" size={16} filled /></dd></div>
            <div><dt>Ventes</dt><dd>1 900+</dd></div>
            <div><dt>Abonnés</dt><dd>{(instagram.followers ?? 1731).toLocaleString('fr-FR')}</dd></div>
          </dl>
          <div className="dash-shops">
            <a className="dash-shop dash-shop-etsy" href={ETSY} target="_blank" rel="noopener noreferrer">
              <BrandIcon brand="etsy" size={20} /><span><small>Acheter sur</small>Etsy</span>
            </a>
            <a className="dash-shop dash-shop-ugm" href={UGM} target="_blank" rel="noopener noreferrer">
              <BrandIcon brand="ungrandmarche" size={28} /><span><small>Acheter sur</small>Un grand marché</span>
            </a>
          </div>
          <ul className="dash-socials" aria-label="Réseaux sociaux">
            {socials.map(l => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" aria-label={BRAND_LABEL[l.network as 'instagram']}>
                  <BrandIcon brand={l.network as 'instagram'} size={18} />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <TopsPanel />

        <ReviewsCarousel />

        <section className="dash-panel dash-agenda" aria-labelledby="h-agenda">
          <div className="dash-panel-head">
            <h2 id="h-agenda" className="dash-h"><span className="dash-h-icon"><Icon name="calendar" size={18} /></span>Prochains marchés</h2>
            <button type="button" className="dash-link" onClick={() => setCalendarOpen(true)}>Voir le calendrier</button>
          </div>
          <NextMarkets events={agenda.events} />
        </section>

        <section className="dash-panel dash-insta" aria-labelledby="h-insta">
          <div className="dash-panel-head">
            <h2 id="h-insta" className="dash-h"><span className="dash-h-icon dash-h-insta"><BrandIcon brand="instagram" size={18} /></span>Instagram</h2>
            <a className="dash-link" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">@les_joliesperles <Icon name="arrow-up-right" size={14} /></a>
          </div>
          {instagram.posts.length > 0
            ? (
              <ul className="dash-thumbs">
                {instagram.posts.slice(0, 3).map(p => (
                  <li key={p.id}>
                    <a href={p.href} target="_blank" rel="noopener noreferrer" title={p.caption}>
                      {p.imageSrc && <img src={p.imageSrc} alt={p.caption} loading="lazy" />}
                    </a>
                  </li>
                ))}
              </ul>
            )
            : instagram.status !== 'loading' && <p className="dash-text">Toutes nos publications sont sur Instagram.</p>}
        </section>
      </main>

      <footer className="dash-bottom">
        <a className="dash-shop dash-shop-etsy" href={ETSY} target="_blank" rel="noopener noreferrer"><BrandIcon brand="etsy" size={18} /><span>Etsy</span></a>
        <a className="dash-shop dash-shop-ugm" href={UGM} target="_blank" rel="noopener noreferrer"><BrandIcon brand="ungrandmarche" size={24} /><span>Un grand marché</span></a>
      </footer>

      <CalendarDialog open={calendarOpen} onClose={() => setCalendarOpen(false)}>
        <MarketCalendar key={agenda.status} events={agenda.events} />
      </CalendarDialog>
    </div>
  );
}

const REVIEW_DELAY = 6000;

/** Avis qui défilent seuls toutes les 6 s ; pause au survol ou au clavier, et arrêt si l'utilisateur limite les animations. */
function ReviewsCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const playing = !paused && !reduced;

  useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(() => {
      if (!document.hidden) setI(x => (x + 1) % reviews.length);
    }, REVIEW_DELAY);
    return () => window.clearInterval(t);
  }, [playing]);

  const r = reviews[i];
  return (
    <section className="dash-panel dash-reviews" aria-labelledby="h-reviews" aria-roledescription="carrousel"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="dash-panel-head">
        <h2 id="h-reviews" className="dash-h"><span className="dash-h-icon"><Icon name="star" size={18} filled /></span>Vos avis</h2>
        <span className="dash-score">
          <b>{reviewsSummary.average.toFixed(1).replace('.', ',')}</b>
          <Rating value={reviewsSummary.average} size={14} />
          <span>{reviewsSummary.count} avis</span>
        </span>
      </div>
      <figure key={r.id} className="dash-quote" aria-live={playing ? 'off' : 'polite'}
        aria-roledescription="avis" aria-label={`${i + 1} sur ${reviews.length}`}>
        <blockquote>« {r.text} »</blockquote>
        <figcaption>{r.author} · {[r.product, r.source].filter(Boolean).join(', ')}</figcaption>
      </figure>
      <div className="dash-dots" role="group" aria-label="Choisir un avis">
        {reviews.map((x, n) => (
          <button key={x.id} type="button" className={'dash-dot' + (n === i ? ' is-on' : '')}
            aria-label={`Avis ${n + 1}`} aria-current={n === i || undefined} onClick={() => setI(n)}>
            {n === i && playing && <i style={{ animationDuration: REVIEW_DELAY + 'ms' }} />}
          </button>
        ))}
      </div>
    </section>
  );
}

/** Les 2 meilleures ventes, une boutique à la fois. */
function TopsPanel() {
  const [shop, setShop] = useState<'etsy' | 'ugm'>('etsy');
  const products: Product[] = (shop === 'etsy' ? topEtsy : topUgm).slice(0, 2);
  return (
    <section className="dash-tops" aria-labelledby="h-tops">
      <div className="dash-panel-head">
        <h2 id="h-tops" className="dash-h">Tops ventes</h2>
        <div className="jp-chips" role="group" aria-label="Boutique">
          {([['etsy', 'Etsy'], ['ugm', 'Un grand marché']] as const).map(([k, l]) => (
            <button key={k} type="button" className="jp-chip" aria-pressed={shop === k} onClick={() => setShop(k)}>
              <BrandIcon brand={k === 'etsy' ? 'etsy' : 'ungrandmarche'} size={k === 'etsy' ? 14 : 20} />{l}
            </button>
          ))}
        </div>
      </div>
      <ol className="dash-products">
        {products.map((p, n) => (
          <li key={p.id}>
            <a className="dash-product" href={p.href} target="_blank" rel="noopener noreferrer">
              <span className="dash-product-media">
                {p.imageSrc && <img src={p.imageSrc} alt="" />}
                <span className="dash-product-rank">{n + 1}</span>
                {p.badge && <Badge tone={p.badge.tone} className="dash-product-badge">{p.badge.label}</Badge>}
              </span>
              <span className="dash-product-name">{p.name}</span>
              <span className="dash-product-meta">
                <span className="dash-product-price">{p.price}</span>
                <span className="dash-product-shop"><BrandIcon brand={shop === 'etsy' ? 'etsy' : 'ungrandmarche'} size={shop === 'etsy' ? 14 : 20} />Voir la fiche</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Les 3 prochains marchés ; à défaut, les 3 derniers passés. */
function NextMarkets({ events }: { events: MarketEvent[] }) {
  const now = today();
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = sorted.filter(e => (e.end ?? e.date) >= now).slice(0, 3);
  const list = upcoming.length ? upcoming : sorted.slice(-3).reverse();
  if (!list.length) return <p className="dash-text">Les prochaines dates arrivent bientôt.</p>;
  return (
    <>
      {!upcoming.length && <p className="dash-text dash-muted">Prochaines dates bientôt annoncées. Derniers marchés :</p>}
      <ul className="dash-events">
        {list.map(e => (
          <li key={e.id} className={(e.end ?? e.date) < now ? 'is-past' : undefined}>
            <span className={'jp-event-date jp-event-date-' + e.kind}>
              <span className="jp-event-day">{day(e.date)}{e.end && e.end !== e.date ? '–' + day(e.end) : ''}</span>
              <span className="jp-event-mon">{month(e.date)}</span>
            </span>
            <span className="dash-event-body">
              <span className="dash-event-title">{e.title}</span>
              <span className="dash-event-meta">{[e.city, e.hours].filter(Boolean).join(' · ')}</span>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

/** Fenêtre du calendrier complet (élément <dialog> natif : Échap ferme, focus piégé). */
function CalendarDialog({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className="dash-dialog" aria-label="Calendrier des marchés" onClose={onClose}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="dash-dialog-head">
        <h2 className="dash-h">Calendrier des marchés</h2>
        <button type="button" className="jp-iconbtn" onClick={onClose} aria-label="Fermer"><Icon name="close" /></button>
      </div>
      {open && children}
    </dialog>
  );
}
