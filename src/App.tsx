import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Badge, Icon, MarketCalendar, Rating, type MarketEvent, type Product } from './components';
import { BrandIcon, BRAND_LABEL } from './components/BrandIcon';
import { useInstagramFeed } from './hooks/useInstagramFeed';
import { useMarkets } from './hooks/useMarkets';
import { ETSY, UGM } from './data/shops';
import { topEtsy, topUgm } from './data/products';
import { markets } from './data/markets';
import { instagramFeedUrl, socials } from './data/social';
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
              <p className="dash-tag">La passion, la création</p>
            </div>
          </div>
          {/* Résumé des descriptions Un grand marché, Etsy et de la bio Instagram */}
          <p className="dash-lead">
            Créatrice de bijoux fantaisie originaux et colorés, faits main à Nantes. Je réalise aussi vos bijoux
            sur commande, sans supplément de prix.
          </p>
          <ul className="dash-features">
            <li><Icon name="sparkle" size={16} />Fait main</li>
            <li><Icon name="flag" size={16} />Made in France</li>
            <li><Icon name="truck" size={16} />Envoi soigné et suivi</li>
            <li><Icon name="shield" size={16} />Satisfait ou remboursé</li>
          </ul>
          <dl className="dash-stats">
            <div><dt>Note</dt><dd>{reviewsSummary.average.toFixed(1).replace('.', ',')}<Icon name="star" size={16} filled /></dd></div>
            <div><dt>Ventes</dt><dd>1 900+</dd></div>
            <div><dt>Abonnés</dt><dd>{(instagram.followers ?? 1731).toLocaleString('fr-FR')}<span className="dash-stat-insta"><BrandIcon brand="instagram" size={14} /></span></dd></div>
          </dl>
          <div className="dash-shops">
            <a className="dash-shop dash-shop-etsy" href={ETSY} target="_blank" rel="noopener noreferrer">
              <BrandIcon brand="etsy" size={20} /><span><small>Acheter sur</small>Etsy</span>
            </a>
            <a className="dash-shop dash-shop-ugm" href={UGM} target="_blank" rel="noopener noreferrer">
              <BrandIcon brand="ungrandmarche" size={28} /><span><small>Acheter sur</small>Un grand marché</span>
            </a>
          </div>
        </section>

        <TopsPanel />

        <ReviewsCarousel />

        <section className="dash-panel dash-agenda" aria-labelledby="h-agenda">
          <div className="dash-panel-head">
            <h2 id="h-agenda" className="dash-h"><span className="dash-h-icon"><Icon name="calendar" size={18} /></span>Prochains marchés</h2>
            <button type="button" className="dash-link" onClick={() => setCalendarOpen(true)}><Icon name="calendar" size={15} />Calendrier</button>
          </div>
          <NextMarkets events={agenda.events} />
        </section>

        <section className="dash-panel dash-insta" aria-labelledby="h-insta">
          <div className="dash-panel-head">
            <h2 id="h-insta" className="dash-h"><span className="dash-h-icon dash-h-insta"><BrandIcon brand="instagram" size={18} /></span>Suivez-moi</h2>
            <ul className="dash-socials" aria-label="Réseaux sociaux">
              {socials.map(l => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" aria-label={BRAND_LABEL[l.network as 'instagram'] + ' : ' + l.handle}>
                    <BrandIcon brand={l.network as 'instagram'} size={16} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {instagram.posts.length > 0
            ? (
              <ul className="dash-thumbs">
                {instagram.posts.slice(0, 6).map(p => (
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

/** Avis qui défilent seuls toutes les 6 s, pause au survol. Le minuteur repart à chaque changement d'avis. */
function ReviewsCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => setI(x => (x + 1) % reviews.length), REVIEW_DELAY);
    return () => window.clearTimeout(t);
  }, [i, paused]);

  const r = reviews[i];
  return (
    <section className="dash-panel dash-reviews" aria-labelledby="h-reviews" aria-roledescription="carrousel"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="dash-panel-head">
        <h2 id="h-reviews" className="dash-h"><span className="dash-h-icon"><Icon name="star" size={18} filled /></span>Vos avis</h2>
        <span className="dash-score">
          <b>{reviewsSummary.average.toFixed(1).replace('.', ',')}</b>
          <Rating value={reviewsSummary.average} size={14} />
          <span>{reviewsSummary.count} avis</span>
        </span>
      </div>
      <figure key={r.id} className="dash-review" aria-live="off"
        aria-roledescription="avis" aria-label={`${i + 1} sur ${reviews.length}`}>
        {r.imageSrc && (
          <a className="dash-review-media" href={r.href} target="_blank" rel="noopener noreferrer" aria-label={'Voir ' + r.product}>
            <img src={r.imageSrc} alt="" />
          </a>
        )}
        <div className="dash-review-body">
          <blockquote>{r.text}</blockquote>
          <figcaption>
            <span className="jp-avatar" aria-hidden="true">{r.author.charAt(0)}</span>
            <span>
              <b>{r.author}</b>
              <span><Rating value={r.rating} size={12} /> {[r.product, r.date].filter(Boolean).join(' · ')}</span>
            </span>
            <BrandIcon brand="ungrandmarche" size={26} className="dash-review-src" />
          </figcaption>
        </div>
      </figure>
      <div className="dash-dots" role="group" aria-label="Choisir un avis">
        <button type="button" className="dash-arrow" onClick={() => setI(x => (x - 1 + reviews.length) % reviews.length)} aria-label="Avis précédent"><Icon name="chevron-left" size={16} /></button>
        {reviews.map((x, n) => (
          <button key={x.id} type="button" className={'dash-dot' + (n === i ? ' is-on' : '')}
            aria-label={`Avis ${n + 1}`} aria-current={n === i || undefined} onClick={() => setI(n)}>
            {n === i && !paused && <i key={i} style={{ animationDuration: REVIEW_DELAY + 'ms' }} />}
          </button>
        ))}
        <button type="button" className="dash-arrow" onClick={() => setI(x => (x + 1) % reviews.length)} aria-label="Avis suivant"><Icon name="chevron-right" size={16} /></button>
      </div>
    </section>
  );
}

const TOPS_DELAY = 8000;

/** Les 2 meilleures ventes ; Etsy et Un grand marché alternent toutes les 8 s, pause au survol. */
function TopsPanel() {
  const [shop, setShop] = useState<'etsy' | 'ugm'>('etsy');
  const [paused, setPaused] = useState(false);
  const products: Product[] = (shop === 'etsy' ? topEtsy : topUgm).slice(0, 2);

  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => setShop(x => (x === 'etsy' ? 'ugm' : 'etsy')), TOPS_DELAY);
    return () => window.clearTimeout(t);
  }, [shop, paused]);

  return (
    <section className="dash-tops" aria-labelledby="h-tops" aria-roledescription="carrousel"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="dash-panel-head">
        <h2 id="h-tops" className="dash-h"><span className="dash-h-icon dash-h-gold"><Icon name="trophy" size={18} /></span>Tops ventes</h2>
        <div className="jp-chips" role="group" aria-label="Boutique">
          {([['etsy', 'Etsy'], ['ugm', 'Un grand marché']] as const).map(([k, l]) => (
            <button key={k} type="button" className="jp-chip dash-tab" aria-pressed={shop === k} onClick={() => setShop(k)}>
              <BrandIcon brand={k === 'etsy' ? 'etsy' : 'ungrandmarche'} size={k === 'etsy' ? 14 : 20} />{l}
              {shop === k && !paused && <i key={shop} className="dash-tab-progress" style={{ animationDuration: TOPS_DELAY + 'ms' }} />}
            </button>
          ))}
        </div>
      </div>
      <ol key={shop} className="dash-products">
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

const DAY_MS = 86_400_000;
const WEEKDAYS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
const weekday = (iso: string) => WEEKDAYS[new Date(iso + 'T12:00:00').getDay()];
const daysBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / DAY_MS);
const mapsUrl = (e: MarketEvent) =>
  'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent([e.place, e.city].filter(Boolean).join(', '));

/** « Aujourd'hui », « Demain », « Dans 5 jours »… */
function countdown(e: MarketEvent, now: string) {
  if (e.date <= now) return 'En ce moment';
  const n = daysBetween(now, e.date);
  if (n === 1) return 'Demain';
  if (n < 7) return `Dans ${n} jours`;
  if (n < 14) return 'La semaine prochaine';
  return `Dans ${Math.round(n / 7)} semaines`;
}

const dayRange = (e: MarketEvent) => day(e.date) + (e.end && e.end !== e.date ? '–' + day(e.end) : '');

/** Le prochain marché en grand, les deux suivants en liste ; sans date à venir, les villes déjà visitées. */
function NextMarkets({ events }: { events: MarketEvent[] }) {
  const now = today();
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = sorted.filter(e => (e.end ?? e.date) >= now);

  if (!upcoming.length) {
    const cities = [...new Set(sorted.slice().reverse().map(e => e.city).filter(Boolean))].slice(0, 4);
    return (
      <div className="dash-nomarket">
        <span className="dash-nomarket-icon"><Icon name="sparkle" size={22} /></span>
        <p className="dash-nomarket-title">Prochaines dates en préparation</p>
        <p className="dash-text">Les nouvelles dates sont annoncées sur Instagram. Les boutiques en ligne restent ouvertes.</p>
        {cities.length > 0 && (
          <p className="dash-cities">
            <span>Déjà passée par</span>
            {cities.map(c => <span key={c} className="dash-city"><Icon name="pin" size={13} />{c}</span>)}
          </p>
        )}
      </div>
    );
  }

  const [next, ...rest] = upcoming;
  return (
    <>
      <article className={'dash-next is-' + next.kind}>
        <div className="dash-next-date" aria-hidden="true">
          <span className="dash-next-dow">{weekday(next.date)}</span>
          <span className="dash-next-day">{dayRange(next)}</span>
          <span className="dash-next-mon">{month(next.date)}</span>
        </div>
        <div className="dash-next-body">
          <span className="dash-next-when"><Badge tone={next.kind}>{countdown(next, now)}</Badge></span>
          <h3 className="dash-next-title">{next.title}</h3>
          <span className="dash-next-meta"><Icon name="pin" size={14} />{[next.place, next.city].filter(Boolean).join(', ')}</span>
          {next.hours && <span className="dash-next-meta"><Icon name="clock" size={14} />{next.hours}</span>}
          {(next.place || next.city) && (
            <a className="dash-link" href={mapsUrl(next)} target="_blank" rel="noopener noreferrer">Itinéraire <Icon name="arrow-up-right" size={14} /></a>
          )}
        </div>
      </article>
      {rest.length > 0 && (
        <ul className="dash-events">
          {rest.slice(0, 2).map(e => (
            <li key={e.id}>
              <span className={'dash-event-date is-' + e.kind}>{dayRange(e)} {month(e.date)}</span>
              <span className="dash-event-title">{e.title}</span>
              <span className="dash-event-meta">{e.city}</span>
            </li>
          ))}
        </ul>
      )}
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
