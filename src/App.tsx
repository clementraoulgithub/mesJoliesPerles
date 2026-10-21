import { useEffect, useLayoutEffect, useMemo, useRef, useState, type DependencyList, type ReactNode } from 'react';
import { Badge, Icon, MarketCalendar, Rating, mapsUrl, type MarketEvent, type Post, type Product } from './components';
import { BrandIcon, BRAND_LABEL } from './components/BrandIcon';
import { ContactForm } from './components/ContactForm';
import { useInstagramFeed } from './hooks/useInstagramFeed';
import { useMarkets } from './hooks/useMarkets';
import { localized, useI18n } from './i18n';
import { ETSY, UGM } from './data/shops';
import { topEtsy, topUgm } from './data/products';
import { markets } from './data/markets';
import { instagramFeedUrl, socials } from './data/social';
import { formspreeId } from './data/site';
import { reviews, reviewsSummary } from './data/reviews';

const today = () => new Date().toISOString().slice(0, 10);

/** One-screen page: introduction and best sellers on top; reviews, markets and Instagram below. */
export default function App() {
  const i18n = useI18n();
  const { t, lang, setLang } = i18n;
  const instagram = useInstagramFeed(instagramFeedUrl);
  const agenda = useMarkets(markets);
  const events = useMemo(() => withImages(agenda.events, instagram.posts), [agenda.events, instagram.posts]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const introRef = useFit<HTMLElement>(5, [lang]);
  const agendaRef = useFit<HTMLElement>(4, [lang, events]);

  return (
    <div className="jp-root dash">
      <main className="dash-main">
        <section ref={introRef} className="dash-intro" aria-labelledby="h-intro">
          <div className="dash-brand">
            <img className="dash-logo" src="/marque/logo.jpeg" alt="" />
            <div className="dash-brand-text">
              <h1 id="h-intro" className="dash-name">Les-jolies-perles</h1>
              <div className="dash-tagrow">
                <p className="dash-tag">{t.tagline}</p>
                <div className="dash-langs" role="group" aria-label={t.language}>
                  {(['fr', 'en'] as const).map(l => (
                    <button key={l} type="button" lang={l} aria-pressed={lang === l} onClick={() => setLang(l)}
                      title={l === 'fr' ? 'Français' : 'English'}>{l.toUpperCase()}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Summary of the Un grand marché and Etsy descriptions and the Instagram bio */}
          <p className="dash-lead">
            {/* Full text on roomy screens, a shorter complete version on tight ones (never cut mid-sentence) */}
            <span className="dash-lead-long">{t.lead}</span>
            <span className="dash-lead-short">{t.leadShort}</span>
          </p>
          <ul className="dash-features">
            <li><Icon name="sparkle" size={16} />{t.featHandmade}</li>
            <li><Icon name="flag" size={16} />{t.featFrance}</li>
            <li><Icon name="truck" size={16} />{t.featShipping}</li>
            <li><Icon name="shield" size={16} />{t.featRefund}</li>
          </ul>
          <dl className="dash-stats">
            <div><dt>{t.statRating}</dt><dd>{i18n.number(reviewsSummary.average, 1)}<Icon name="star" size={16} filled /></dd></div>
            {/* Etsy sales are an estimate: rounded down to the hundred ("1,900+") */}
            <div><dt>{t.statSales}</dt><dd>{i18n.number(Math.floor(reviewsSummary.sales / 100) * 100)}+</dd></div>
            <div><dt>{t.statFollowers}</dt><dd>{i18n.number(instagram.followers ?? 1731)}<span className="dash-stat-insta"><BrandIcon brand="instagram" size={14} /></span></dd></div>
          </dl>
          <div className="dash-shops">
            <a className="dash-shop dash-shop-etsy" href={ETSY} target="_blank" rel="noopener noreferrer">
              <BrandIcon brand="etsy" size={20} /><span><small>{t.orderOn}</small>Etsy</span>
            </a>
            <a className="dash-shop dash-shop-ugm" href={UGM} target="_blank" rel="noopener noreferrer">
              <BrandIcon brand="ungrandmarche" size={24} /><span><small>{t.orderOn}</small>Un grand marché</span>
            </a>
          </div>
        </section>

        <TopsPanel />

        <ReviewsCarousel />

        <section ref={agendaRef} className="dash-panel dash-agenda" aria-labelledby="h-agenda">
          <div className="dash-panel-head">
            <h2 id="h-agenda" className="dash-h"><span className="dash-h-icon"><Icon name="calendar" size={18} /></span>{t.nextMarkets}</h2>
            <button type="button" className="dash-link" onClick={() => setCalendarOpen(true)}><Icon name="calendar" size={15} />{t.calendar}</button>
          </div>
          {agenda.status === 'loading' ? <MarketsLoading /> : <NextMarkets events={events} />}
        </section>

        <section className="dash-panel dash-insta" aria-labelledby="h-insta">
          <div className="dash-panel-head">
            <h2 id="h-insta" className="dash-h"><span className="dash-h-icon dash-h-insta"><BrandIcon brand="instagram" size={18} /></span>{t.followMe}</h2>
            <ul className="dash-socials" aria-label={t.socialsAndContact}>
              <li>
                <button type="button" onClick={() => setContactOpen(true)} aria-label={t.contactByEmail} title={t.contact}>
                  <Icon name="mail" size={16} />
                </button>
              </li>
              {socials.map(l => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" aria-label={BRAND_LABEL[l.network] + ' : ' + l.handle}>
                    <BrandIcon brand={l.network} size={16} />
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
            : instagram.status !== 'loading' && <p className="dash-text">{t.instagramFallback}</p>}
        </section>
      </main>

      <footer className="dash-bottom">
        <a className="dash-shop dash-shop-etsy" href={ETSY} target="_blank" rel="noopener noreferrer"><BrandIcon brand="etsy" size={18} /><span>Etsy</span></a>
        <a className="dash-shop dash-shop-ugm" href={UGM} target="_blank" rel="noopener noreferrer"><BrandIcon brand="ungrandmarche" size={24} /><span>Un grand marché</span></a>
      </footer>

      <Dialog title={t.calendarTitle} open={calendarOpen} onClose={() => setCalendarOpen(false)}>
        {agenda.status === 'loading' ? <MarketsLoading /> : <MarketCalendar key={agenda.status} events={events} />}
      </Dialog>

      <Dialog title={t.contact} narrow open={contactOpen} onClose={() => setContactOpen(false)}>
        <p className="jp-contact-intro">{t.contactIntro}</p>
        <ContactForm formId={formspreeId} onDone={() => setContactOpen(false)} />
      </Dialog>
    </div>
  );
}

const REVIEW_DELAY = 6000;

/** Reviews rotate on their own every 6 s and pause on hover. The timer restarts on every change. */
function ReviewsCarousel() {
  const i18n = useI18n();
  const { t, lang } = i18n;
  const [i, setI] = useState(0);
  const [paused, hoverProps] = useHover();
  const fitRef = useFit<HTMLElement>(3, [lang, i]);

  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(() => setI(x => (x + 1) % reviews.length), REVIEW_DELAY);
    return () => window.clearTimeout(timer);
  }, [i, paused]);

  const r = reviews[i];
  const product = r.product && localized(lang, r.product, r.productEn);
  return (
    <section ref={fitRef} className="dash-panel dash-reviews" aria-labelledby="h-reviews" aria-roledescription={t.carousel}
      {...hoverProps}>
      <div className="dash-panel-head">
        <h2 id="h-reviews" className="dash-h"><span className="dash-h-icon"><Icon name="star" size={18} filled /></span>{t.reviews}</h2>
        <span className="dash-score">
          <b>{i18n.number(reviewsSummary.average, 1)}</b>
          <Rating value={reviewsSummary.average} size={14} />
          <span>{t.reviewCount(i18n.number(reviewsSummary.count))}</span>
        </span>
      </div>
      {/* Customer quotes: original French text, or its English translation with a "Translated from French" note. */}
      <figure key={r.id} className="dash-review" aria-live="off"
        aria-roledescription={t.review} aria-label={t.reviewOf(i + 1, reviews.length)}>
        {r.imageSrc && (
          <a className="dash-review-media" href={r.href} target="_blank" rel="noopener noreferrer" aria-label={t.see(product ?? '')}>
            <img src={r.imageSrc} alt="" />
          </a>
        )}
        <div className="dash-review-body">
          {lang === 'en' && r.textEn
            ? <blockquote lang="en">{r.textEn}</blockquote>
            : <blockquote lang="fr">{r.text}</blockquote>}
          <figcaption>
            <span className="jp-avatar" aria-hidden="true">{r.author.charAt(0)}</span>
            <span>
              <span className="dash-review-who">
                <b>{r.author}</b>
                {lang === 'en' && r.textEn && <i className="dash-review-tr">{t.translated}</i>}
              </span>
              <span><Rating value={r.rating} size={12} /> {[product, r.date && i18n.monthYear(r.date)].filter(Boolean).join(' · ')}</span>
            </span>
            {r.source === 'Etsy'
              ? <span className="dash-review-src dash-review-etsy" title={t.etsyReview}><BrandIcon brand="etsy" size={16} /></span>
              : <BrandIcon brand="ungrandmarche" size={26} className="dash-review-src" />}
          </figcaption>
        </div>
      </figure>
      <div className="dash-dots" role="group" aria-label={t.chooseReview}>
        <button type="button" className="dash-arrow" onClick={() => setI(x => (x - 1 + reviews.length) % reviews.length)} aria-label={t.prevReview}><Icon name="chevron-left" size={16} /></button>
        {reviews.map((x, n) => (
          <button key={x.id} type="button" className={'dash-dot' + (n === i ? ' is-on' : '')}
            aria-label={t.reviewOf(n + 1, reviews.length)} aria-current={n === i || undefined} onClick={() => setI(n)}>
            {n === i && !paused && <i key={i} style={{ animationDuration: REVIEW_DELAY + 'ms' }} />}
          </button>
        ))}
        <button type="button" className="dash-arrow" onClick={() => setI(x => (x + 1) % reviews.length)} aria-label={t.nextReview}><Icon name="chevron-right" size={16} /></button>
      </div>
    </section>
  );
}

const TOPS_DELAY = 8000;

/** The 2 best sellers; Etsy and Un grand marché alternate every 8 s and pause on hover. */
function TopsPanel() {
  const { t, lang } = useI18n();
  const [shop, setShop] = useState<'etsy' | 'ugm'>('etsy');
  const [paused, hoverProps] = useHover();
  const products: Product[] = (shop === 'etsy' ? topEtsy : topUgm).slice(0, 2);

  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(() => setShop(x => (x === 'etsy' ? 'ugm' : 'etsy')), TOPS_DELAY);
    return () => window.clearTimeout(timer);
  }, [shop, paused]);

  return (
    <section className="dash-tops" aria-labelledby="h-tops" aria-roledescription={t.carousel}
      {...hoverProps}>
      <div className="dash-panel-head">
        <h2 id="h-tops" className="dash-h"><span className="dash-h-icon dash-h-gold"><Icon name="award" size={18} /></span>{t.topSales}</h2>
        <div className="jp-chips" role="group" aria-label={t.shop}>
          {([['etsy', 'Etsy'], ['ugm', 'Un grand marché']] as const).map(([k, l]) => (
            <button key={k} type="button" className="jp-chip dash-tab" aria-pressed={shop === k} onClick={() => setShop(k)}>
              <BrandIcon brand={k === 'etsy' ? 'etsy' : 'ungrandmarche'} size={k === 'etsy' ? 14 : 20} />{l}
              {shop === k && !paused && <i key={shop} className="dash-tab-progress" style={{ animationDuration: TOPS_DELAY + 'ms' }} />}
            </button>
          ))}
        </div>
      </div>
      <ol key={shop} className="dash-products">
        {products.map((p, n) => {
          const name = localized(lang, p.name, p.nameEn);
          return (
            <li key={p.id}>
              <div className="dash-product">
                <Gallery images={p.images} href={p.href} name={name}>
                  <span className="dash-product-rank">{n + 1}</span>
                  {p.top && <Badge tone="top" className="dash-product-badge">{t.topSale}</Badge>}
                </Gallery>
                <a className="dash-product-meta" href={p.href} target="_blank" rel="noopener noreferrer">
                  <span className="dash-product-name">{name}</span>
                  <span className="dash-product-shop"><BrandIcon brand={shop === 'etsy' ? 'etsy' : 'ungrandmarche'} size={shop === 'etsy' ? 14 : 20} />{t.seeListing}</span>
                </a>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

const overflows = (el: HTMLElement) => el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1;

/**
 * Fit to the box: while the block overflows, add compaction steps fit-1, fit-2… (defined in app.css) one by one.
 * Re-run when the block is resized (window resize, layout change), when fonts load and when `deps` change.
 * Works for any window size, instead of relying on fixed breakpoints only.
 */
function useFit<T extends HTMLElement>(steps: number, deps: DependencyList) {
  const ref = useRef<T>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      for (let n = 1; n <= steps; n++) el.classList.remove('fit-' + n);
      for (let n = 1; n <= steps && overflows(el); n++) el.classList.add('fit-' + n);
    };
    // Fit now, then once more after the resize settles (viewport units and grid rows update a little later).
    let timer = 0;
    const refit = () => { fit(); window.clearTimeout(timer); timer = window.setTimeout(fit, 150); };
    fit();
    const ro = new ResizeObserver(refit);
    ro.observe(el);
    window.addEventListener('resize', refit);
    document.fonts?.ready.then(fit);
    return () => { ro.disconnect(); window.removeEventListener('resize', refit); window.clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/**
 * Reliable hover: browsers send no "mouseleave" when a click opens a new tab.
 * Hover is therefore reset when the page loses focus or gets hidden, and resumed on the next mouse move.
 */
function useHover() {
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const off = () => setHover(false);
    const onVisibility = () => { if (document.hidden) off(); };
    window.addEventListener('blur', off);
    document.addEventListener('visibilitychange', onVisibility);
    return () => { window.removeEventListener('blur', off); document.removeEventListener('visibilitychange', onVisibility); };
  }, []);
  return [hover, { onMouseEnter: () => setHover(true), onMouseMove: () => setHover(true), onMouseLeave: () => setHover(false) }] as const;
}

/** Photos of a piece: arrows and dots, swipe on touch screens (native snap scrolling). No autoplay. */
function Gallery({ images, href, name, children }: { images: string[]; href: string; name: string; children?: ReactNode }) {
  const { t } = useI18n();
  const track = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const many = images.length > 1;

  const go = (n: number) => {
    const el = track.current;
    if (!el) return;
    const k = (n + images.length) % images.length;
    setI(k);
    el.scrollTo({ left: k * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className="dash-gallery">
      <div ref={track} className="dash-gallery-track"
        onScroll={e => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
        {images.map((src, n) => (
          <a key={src} href={href} target="_blank" rel="noopener noreferrer" tabIndex={n === i ? 0 : -1}
            aria-label={t.photoOf(name, n + 1, images.length)}>
            <img src={src} alt="" loading={n ? 'lazy' : undefined} draggable={false} />
          </a>
        ))}
      </div>
      {children}
      {many && <>
        <button type="button" className="dash-gallery-btn is-prev" onClick={() => go(i - 1)} aria-label={t.prevPhoto}><Icon name="chevron-left" size={16} /></button>
        <button type="button" className="dash-gallery-btn is-next" onClick={() => go(i + 1)} aria-label={t.nextPhoto}><Icon name="chevron-right" size={16} /></button>
        <span className="dash-gallery-dots" aria-hidden="true">
          {images.map((src, n) => <i key={src} className={n === i ? 'is-on' : undefined} />)}
        </span>
      </>}
    </div>
  );
}

const DAY_MS = 86_400_000;
const daysBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / DAY_MS);

/** An Instagram post link in the calendar becomes that post's picture (Behold feed). */
function withImages(events: MarketEvent[], posts: Post[]): MarketEvent[] {
  return events.map(e => {
    const code = e.image?.match(/instagram\.com\/(?:[\w.]+\/)?(?:p|reel)\/([\w-]+)/)?.[1];
    if (!code) return e;
    return { ...e, image: posts.find(p => p.href.includes('/' + code))?.imageSrc };
  });
}


/** Placeholder while the calendar loads: avoids flashing "new dates coming soon" before the real dates arrive. */
function MarketsLoading() {
  const { t } = useI18n();
  return (
    <div className="dash-loading" role="status" aria-label={t.loadingDates}>
      <span className="dash-loading-card" aria-hidden="true"><i /><span><b /><b /><b /></span></span>
    </div>
  );
}

/** The next market as a card, the following two as a list; with no upcoming date, the towns already visited. */
function NextMarkets({ events }: { events: MarketEvent[] }) {
  const i18n = useI18n();
  const { t } = i18n;
  const now = today();
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = sorted.filter(e => (e.end ?? e.date) >= now);
  const [imgFailed, setImgFailed] = useState(false);
  const imageKey = upcoming[0]?.image;
  useEffect(() => setImgFailed(false), [imageKey]);
  const showImg = !!imageKey && !imgFailed;

  /** "Tomorrow", "In 5 days"… */
  const countdown = (e: MarketEvent) => {
    if (e.date <= now) return t.now;
    const n = daysBetween(now, e.date);
    if (n === 1) return t.tomorrow;
    if (n < 7) return t.inDays(n);
    if (n < 14) return t.nextWeek;
    return t.inWeeks(Math.round(n / 7));
  };

  if (!upcoming.length) {
    const cities = [...new Set(sorted.slice().reverse().map(e => e.city).filter(Boolean))].slice(0, 4);
    return (
      <div className="dash-nomarket">
        <span className="dash-nomarket-icon"><Icon name="sparkle" size={22} /></span>
        <p className="dash-nomarket-title">{t.noMarketTitle}</p>
        <p className="dash-text">{t.noMarketText}</p>
        {cities.length > 0 && (
          <p className="dash-cities">
            <span>{t.alreadyIn}</span>
            {cities.map(c => <span key={c} className="dash-city"><Icon name="pin" size={13} />{c}</span>)}
          </p>
        )}
      </div>
    );
  }

  const [next, ...rest] = upcoming;
  const hours = i18n.hours(next);
  return (
    <>
      <article className={'dash-next is-' + next.kind + (showImg ? ' has-img' : '')}>
        {showImg ? (
          <div className="dash-next-visual">
            <img src={next.image} alt={t.poster(next.title)} onError={() => setImgFailed(true)} />
            <span className="dash-next-chip"><span className="dash-next-chip-dow">{i18n.weekdayShort(next.date)} </span>{i18n.dayRange(next)} {i18n.monthShort(next.end ?? next.date)}</span>
          </div>
        ) : (
          <div className="dash-next-date" aria-hidden="true">
            <span className="dash-next-dow">{i18n.weekdayShort(next.date)}</span>
            <span className="dash-next-day">{i18n.dayRange(next)}</span>
            <span className="dash-next-mon">{i18n.monthShort(next.end ?? next.date)}</span>
          </div>
        )}
        <div className="dash-next-body">
          <span className="dash-next-when"><Badge tone={next.kind}>{countdown(next)}</Badge></span>
          <h3 className="dash-next-title">{next.title}</h3>
          {(next.city || next.place) && (
            <span className="dash-next-meta dash-next-where">
              <Icon name="pin" size={14} />
              <span>{next.city && <b>{next.city}</b>}{next.place && <small>{next.place}</small>}</span>
            </span>
          )}
          {hours && <span className="dash-next-meta"><Icon name="clock" size={14} />{hours}</span>}
          {(next.place || next.city) && (
            <a className="dash-link" href={mapsUrl(next)} target="_blank" rel="noopener noreferrer">{t.directions} <Icon name="arrow-up-right" size={14} /></a>
          )}
        </div>
      </article>
      {rest.length > 0 && (
        <ul className="dash-events">
          {rest.slice(0, 2).map(e => (
            <li key={e.id}>
              <span className={'dash-event-date is-' + e.kind}>{i18n.dayRange(e)} {i18n.monthShort(e.end ?? e.date)}</span>
              <span className="dash-event-title">{e.title}</span>
              <span className="dash-event-meta">{e.city}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/** Modal window (native <dialog>: Escape closes it, focus is trapped): full calendar, contact form. */
function Dialog({ title, open, onClose, narrow, children }: { title: string; open: boolean; onClose: () => void; narrow?: boolean; children: ReactNode }) {
  const { t } = useI18n();
  const ref = useRef<HTMLDialogElement>(null);
  // Closes only on a click that starts and ends outside the box (the grey backdrop), not in its inner padding.
  const downOutside = useRef(false);
  const isOutside = (e: { clientX: number; clientY: number }) => {
    const r = ref.current?.getBoundingClientRect();
    return !!r && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom);
  };
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className={'dash-dialog' + (narrow ? ' is-narrow' : '')} aria-label={title} onClose={onClose}
      onPointerDown={e => { downOutside.current = isOutside(e); }}
      onClick={e => { if (downOutside.current && isOutside(e)) onClose(); downOutside.current = false; }}>
      <div className="dash-dialog-head">
        <h2 className="dash-h">{title}</h2>
        <button type="button" className="jp-iconbtn" onClick={onClose} aria-label={t.close}><Icon name="close" /></button>
      </div>
      {open && children}
    </dialog>
  );
}
