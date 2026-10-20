import * as React from 'react';

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');

/* ───────────────────────── Icônes ───────────────────────── */

export type IconName =
  | 'arrow-up-right' | 'chevron-left' | 'chevron-right' | 'star' | 'heart'
  | 'pin' | 'clock' | 'calendar' | 'menu' | 'close' | 'bag' | 'chat'
  | 'truck' | 'shield' | 'gift' | 'sparkle' | 'flag' | 'quote' | 'flame';

const ICON_PATHS: Record<IconName, string> = {
  'arrow-up-right': 'M7 17 17 7M8 7h9v9',
  'chevron-left': 'M15 18l-6-6 6-6',
  'chevron-right': 'M9 6l6 6-6 6',
  star: 'M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  pin: 'M12 21s-6-5.6-6-11a6 6 0 1 1 12 0c0 5.4-6 11-6 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  calendar: 'M4 6.5h16v13H4zM4 10.5h16M8.5 4v4M15.5 4v4',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  bag: 'M5 8h14l-1 12H6zM9 8V6.5a3 3 0 0 1 6 0V8',
  chat: 'M5 5h14v10H10l-4 4v-4H5z',
  truck: 'M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3v3h-7M6.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  shield: 'M12 3l7 3v5.5c0 4.3-3 7.6-7 9.5-4-1.9-7-5.2-7-9.5V6zM9 12l2 2 4-4',
  gift: 'M4.5 11h15v9h-15zM3.5 7.5h17V11h-17zM12 7.5V20M12 7.5C10.5 4.5 7 4.5 7 6.2S10 7.5 12 7.5zM12 7.5c1.5-3 5-3 5-1.3S14 7.5 12 7.5z',
  sparkle: 'M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9zM18.5 16l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z',
  flag: 'M5 21V4M5 4.5h12l-2.5 4 2.5 4H5',
  flame: 'M12 21c3.6 0 6-2.5 6-6 0-4-3-6.5-4.5-10-1 2.6-2.4 3.8-3.6 5C8.6 8.6 8 7.5 8 6c-1.6 1.6-2 3.6-2 5.5V15c0 3.5 2.4 6 6 6zM12 21c-1.7 0-3-1.2-3-3 0-1.9 1.6-2.8 3-4.5 1.4 1.7 3 2.6 3 4.5 0 1.8-1.3 3-3 3z',
  quote: 'M9.5 7C6.5 8 5 10.5 5 14v3h4.5v-4.5H7c0-2.2 1-3.6 3-4.3zM18.5 7c-3 1-4.5 3.5-4.5 7v3h4.5v-4.5H16c0-2.2 1-3.6 3-4.3z',
};

export interface IconProps { name: IconName; size?: number; filled?: boolean; className?: string; title?: string }
/** Pictogramme au trait 1.5px, hérite de la couleur du texte. */
export function Icon({ name, size = 18, filled = false, className, title }: IconProps) {
  return (
    <svg
      className={cx('jp-icon', className)} width={size} height={size} viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true} aria-label={title}
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}

/* ───────────────────────── Bouton & badge ───────────────────────── */

export interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'sm';
  /** Ouvre dans un nouvel onglet et ajoute la flèche ↗ (liens vers les boutiques). */
  external?: boolean;
  icon?: IconName;
  as?: 'a' | 'button';
  onClick?: (e: React.MouseEvent<any>) => void;
}
/** Bouton en forme de perle allongée. Rendu en <a> si `href`, sinon en <button>. */
export function Button({ variant = 'primary', size = 'md', external, icon, className, children, href, as, ...rest }: ButtonProps) {
  const cls = cx('jp-btn', 'jp-btn-' + variant, size === 'sm' && 'jp-btn-sm', className);
  const inner = (
    <>
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} />}
      <span>{children}</span>
      {external && <Icon name="arrow-up-right" size={size === 'sm' ? 14 : 16} />}
    </>
  );
  if (as === 'button' || !href) {
    return <button type="button" className={cls} {...(rest as any)}>{inner}</button>;
  }
  return (
    <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
      {inner}
    </a>
  );
}

export type BadgeTone = 'local' | 'noel' | 'nouveau' | 'top' | 'neutral';
export interface BadgeProps { tone?: BadgeTone; children?: React.ReactNode; className?: string }
/** Un ou deux mots d'étiquette, en capitales. La couleur double toujours un mot, jamais seule. */
export function Badge({ tone = 'neutral', children, className }: BadgeProps) {
  return <span className={cx('jp-badge', 'jp-badge-' + tone, className)}>{children}</span>;
}

/* ───────────────────────── Illustration perles ───────────────────────── */

const BEAD_TONES = ['corail', 'laiton', 'jade', 'ink', 'corail-soft', 'laiton-soft'] as const;
function rng(seed: number) {
  let s = (seed * 9301 + 49297) % 233280 || 1;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

export interface BeadArtProps {
  /** Graine : la même graine donne toujours le même collier. */
  seed?: number;
  /** Nombre de perles (6 à 18). */
  beads?: number;
  /** Ratio largeur / hauteur. */
  ratio?: number;
  className?: string;
  label?: string;
}
/** Collier abstrait : un fil courbe et des perles. Sert de visuel quand une photo manque. */
export function BeadArt({ seed = 1, beads = 11, ratio = 1, className, label }: BeadArtProps) {
  const r = rng(seed);
  const W = 100 * ratio, H = 100;
  const sag = 28 + r() * 30;
  const y0 = 18 + r() * 14;
  const pts: Array<{ x: number; y: number; rad: number; tone: string }> = [];
  const n = Math.max(6, Math.min(18, beads));
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const x = W * 0.08 + t * W * 0.84;
    const y = y0 + Math.sin(t * Math.PI) * sag;
    const big = i === Math.floor(n / 2);
    const rad = big ? 9 + r() * 3 : 3 + r() * 4.5;
    pts.push({ x, y, rad, tone: big ? 'corail' : BEAD_TONES[Math.floor(r() * BEAD_TONES.length)] });
  }
  const d = `M ${W * 0.02} ${y0 - 6} Q ${W / 2} ${y0 + sag * 2.05} ${W * 0.98} ${y0 - 6}`;
  return (
    <svg className={cx('jp-beadart', className)} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice"
      role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <rect className="jp-beadart-ground" x="0" y="0" width={W} height={H} />
      <path className="jp-beadart-thread" d={d} />
      {pts.map((p, i) => (
        <g key={i}>
          <circle className={'jp-bead jp-bead-' + p.tone} cx={p.x} cy={p.y} r={p.rad} />
          <circle className="jp-bead-shine" cx={p.x - p.rad * 0.35} cy={p.y - p.rad * 0.35} r={p.rad * 0.22} />
        </g>
      ))}
    </svg>
  );
}

/* ───────────────────────── Structure de page ───────────────────────── */

export interface NavLink { label: string; href: string }
export interface SiteHeaderProps {
  brand?: string;
  links: NavLink[];
  cta?: { label: string; href: string };
  /** Ancre active (ex. « #marches »), soulignée. */
  active?: string;
}
/** Barre de navigation collante de la page unique : ancres internes + un appel vers la boutique. */
export function SiteHeader({ brand = 'Les Jolies Perles', links, cta, active }: SiteHeaderProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <header className="jp-header">
      <div className="jp-header-inner">
        <a className="jp-wordmark" href="#accueil">
          <span className="jp-wordmark-bead" aria-hidden="true" />
          {brand}
        </a>
        <nav className={cx('jp-nav', open && 'is-open')} aria-label="Sections">
          {links.map(l => (
            <a key={l.href} href={l.href} className={cx('jp-nav-link', active === l.href && 'is-active')}
              aria-current={active === l.href ? 'location' : undefined} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          {cta && <Button href={cta.href} size="sm" external icon="bag">{cta.label}</Button>}
        </nav>
        <button type="button" className="jp-nav-toggle" aria-expanded={open} aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} onClick={() => setOpen(o => !o)}>
          <Icon name={open ? 'close' : 'menu'} size={22} />
        </button>
      </div>
    </header>
  );
}

export interface SectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  /** Fond `sable` pour alterner les sections. */
  tone?: 'nacre' | 'sable';
  action?: React.ReactNode;
  children?: React.ReactNode;
}
/** Section de la page unique : sur-titre, titre h2, chapeau, contenu. */
export function Section({ id, eyebrow, title, lead, tone = 'nacre', action, children }: SectionProps) {
  return (
    <section id={id} className={cx('jp-section', tone === 'sable' && 'jp-section-sable')}>
      <div className="jp-container">
        <div className="jp-section-head">
          <div>
            {eyebrow && <p className="jp-eyebrow">{eyebrow}</p>}
            <h2 className="jp-h2">{title}</h2>
            {lead && <p className="jp-lead">{lead}</p>}
          </div>
          {action && <div className="jp-section-action">{action}</div>}
        </div>
        {children}
      </div>
    </section>
  );
}

export interface HeroProps {
  eyebrow?: string;
  title: string;
  lead: string;
  actions?: React.ReactNode;
  /** Visuel : une photo (`imageSrc`) sinon un collier BeadArt. */
  imageSrc?: string;
  imageAlt?: string;
  seed?: number;
}
/** Ouverture de page : promesse de la marque, deux actions, un visuel. */
export function Hero({ eyebrow, title, lead, actions, imageSrc, imageAlt = '', seed = 7 }: HeroProps) {
  return (
    <section id="accueil" className="jp-hero">
      <div className="jp-container jp-hero-grid">
        <div className="jp-hero-text">
          {eyebrow && <p className="jp-eyebrow">{eyebrow}</p>}
          <h1 className="jp-h1">{title}</h1>
          <p className="jp-lead">{lead}</p>
          {actions && <div className="jp-actions">{actions}</div>}
        </div>
        <div className="jp-hero-visual">
          {imageSrc ? <img src={imageSrc} alt={imageAlt} /> : <BeadArt seed={seed} beads={15} ratio={1.1} />}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Points de vente ───────────────────────── */

export interface Shop { name: string; description: string; href: string; cta?: string; note?: string }
export interface ShopLinksProps { shops: Shop[] }
/** Les boutiques en ligne : une carte cliquable par point de vente, ouverte dans un nouvel onglet. */
export function ShopLinks({ shops }: ShopLinksProps) {
  return (
    <div className="jp-shops">
      {shops.map(s => (
        <a key={s.href} className="jp-shop" href={s.href} target="_blank" rel="noopener noreferrer">
          <span className="jp-shop-icon"><Icon name="bag" size={22} /></span>
          <span className="jp-shop-body">
            <span className="jp-shop-name">{s.name}</span>
            <span className="jp-shop-desc">{s.description}</span>
            {s.note && <span className="jp-shop-note">{s.note}</span>}
          </span>
          <span className="jp-shop-cta">{s.cta ?? 'Voir la boutique'} <Icon name="arrow-up-right" size={16} /></span>
        </a>
      ))}
    </div>
  );
}

/* ───────────────────────── Produits ───────────────────────── */

export interface Product {
  id: string; name: string; price?: string; href: string;
  shop?: string; imageSrc?: string; seed?: number; badge?: { tone: BadgeTone; label: string };
}
export interface ProductCardProps extends Product { rank?: number }
/** Carte produit : visuel carré, nom, prix, boutique. Le lien mène à la fiche sur la boutique. */
export function ProductCard({ name, price, href, shop, imageSrc, seed = 1, badge, rank }: ProductCardProps) {
  return (
    <a className="jp-product" href={href} target="_blank" rel="noopener noreferrer">
      <span className="jp-product-media">
        {imageSrc ? <img src={imageSrc} alt="" /> : <BeadArt seed={seed} />}
        {rank != null && <span className="jp-product-rank" aria-label={'N° ' + rank}>{rank}</span>}
        {badge && <Badge tone={badge.tone} className="jp-product-badge">{badge.label}</Badge>}
      </span>
      <span className="jp-product-info">
        <span className="jp-product-name">{name}</span>
        <span className="jp-product-meta">
          {price && <span className="jp-product-price">{price}</span>}
          {shop && <span className="jp-product-shop">sur {shop} <Icon name="arrow-up-right" size={13} /></span>}
        </span>
      </span>
    </a>
  );
}

export interface TopSalesProps { products: Product[]; ranked?: boolean }
/** Grille des meilleures ventes, numérotées 1, 2, 3… */
export function TopSales({ products, ranked = true }: TopSalesProps) {
  return (
    <div className="jp-grid jp-grid-products">
      {products.map((p, i) => <ProductCard key={p.id} {...p} rank={ranked ? i + 1 : undefined} />)}
    </div>
  );
}

/* ───────────────────────── Calendrier des marchés ───────────────────────── */

export type MarketKind = 'local' | 'noel';
export interface MarketEvent {
  id: string;
  /** Date ISO « AAAA-MM-JJ ». */
  date: string;
  /** Dernier jour si l'événement dure plusieurs jours. */
  end?: string;
  title: string;
  place: string;
  city: string;
  hours?: string;
  kind: MarketKind;
  href?: string;
}
export interface MarketCalendarProps {
  events: MarketEvent[];
  /** Mois affiché au départ, « AAAA-MM ». Par défaut : le mois du prochain marché. */
  initialMonth?: string;
  /** Date du jour (ISO) pour masquer le passé ; par défaut aujourd'hui. */
  today?: string;
}

const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const MONTHS_SHORT = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const DOW = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'];
const DOW_LONG = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const KIND_LABEL: Record<MarketKind, string> = { local: 'Marché local', noel: 'Marché de Noël' };
const iso = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const parse = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d || 1); };
const covers = (e: MarketEvent, day: string) => day >= e.date && day <= (e.end ?? e.date);

function formatRange(e: MarketEvent) {
  const a = parse(e.date);
  const one = `${DOW_LONG[a.getDay()]} ${a.getDate()} ${MONTHS[a.getMonth()]}`;
  if (!e.end || e.end === e.date) return one;
  const b = parse(e.end);
  return `du ${a.getDate()}${a.getMonth() !== b.getMonth() ? ' ' + MONTHS[a.getMonth()] : ''} au ${b.getDate()} ${MONTHS[b.getMonth()]}`;
}

/** Calendrier mensuel des marchés locaux et de Noël, avec filtres et liste des dates du mois. */
export function MarketCalendar({ events, initialMonth, today }: MarketCalendarProps) {
  const now = today ?? new Date().toISOString().slice(0, 10);
  const sorted = React.useMemo(() => [...events].sort((a, b) => a.date.localeCompare(b.date)), [events]);
  const first = initialMonth ?? (sorted.find(e => (e.end ?? e.date) >= now)?.date ?? now).slice(0, 7);
  const [month, setMonth] = React.useState(first);
  const [filter, setFilter] = React.useState<'all' | MarketKind>('all');
  const [selected, setSelected] = React.useState<string | null>(null);

  const [y, m] = month.split('-').map(Number);
  const mi = m - 1;
  const shift = (k: number) => { const d = new Date(y, mi + k, 1); setMonth(iso(d.getFullYear(), d.getMonth(), 1).slice(0, 7)); setSelected(null); };
  const visible = sorted.filter(e => filter === 'all' || e.kind === filter);
  const daysIn = new Date(y, mi + 1, 0).getDate();
  const lead = (new Date(y, mi, 1).getDay() + 6) % 7;
  const cells: Array<number | null> = [...Array(lead).fill(null), ...Array.from({ length: daysIn }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);

  const inMonth = visible.filter(e => (e.end ?? e.date) >= iso(y, mi, 1) && e.date <= iso(y, mi, daysIn));
  const list = selected ? inMonth.filter(e => covers(e, selected)) : inMonth;

  return (
    <div className="jp-cal">
      <div className="jp-cal-board">
        <div className="jp-cal-top">
          <button type="button" className="jp-iconbtn" onClick={() => shift(-1)} aria-label="Mois précédent"><Icon name="chevron-left" /></button>
          <p className="jp-cal-month" aria-live="polite">{MONTHS[mi]} {y}</p>
          <button type="button" className="jp-iconbtn" onClick={() => shift(1)} aria-label="Mois suivant"><Icon name="chevron-right" /></button>
        </div>
        <div className="jp-chips" role="group" aria-label="Type de marché">
          {([['all', 'Tous'], ['local', 'Marchés locaux'], ['noel', 'Noël']] as const).map(([k, l]) => (
            <button key={k} type="button" className={cx('jp-chip', k !== 'all' && 'jp-chip-' + k)} aria-pressed={filter === k}
              onClick={() => { setFilter(k); setSelected(null); }}>{k !== 'all' && <span className="jp-dot" />}{l}</button>
          ))}
        </div>
        <div className="jp-cal-grid" role="grid" aria-label={`Marchés de ${MONTHS[mi]} ${y}`}>
          {DOW.map(d => <span key={d} className="jp-cal-dow" role="columnheader">{d}</span>)}
          {cells.map((d, i) => {
            if (d == null) return <span key={i} className="jp-cal-cell is-empty" />;
            const day = iso(y, mi, d);
            const evs = visible.filter(e => covers(e, day));
            const kind = evs.some(e => e.kind === 'noel') ? 'noel' : evs.length ? 'local' : null;
            return (
              <button key={i} type="button" role="gridcell" disabled={!evs.length}
                className={cx('jp-cal-cell', kind && 'has-' + kind, selected === day && 'is-selected', day === now && 'is-today', day < now && 'is-past')}
                aria-pressed={evs.length ? selected === day : undefined}
                aria-label={`${d} ${MONTHS[mi]}${evs.length ? ' : ' + evs.map(e => e.title).join(', ') : ''}`}
                onClick={() => setSelected(s => (s === day ? null : day))}>
                <span>{d}</span>
                {kind && <span className="jp-cal-mark" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </div>
      <div className="jp-cal-list">
        <p className="jp-cal-list-head">
          {selected ? `Le ${parse(selected).getDate()} ${MONTHS[mi]}` : `En ${MONTHS[mi]}`}
          <span> · {list.length} {list.length > 1 ? 'dates' : 'date'}</span>
        </p>
        {list.length === 0 && <p className="jp-empty">Pas de marché ce mois-ci. Les boutiques en ligne restent ouvertes.</p>}
        <ul>
          {list.map(e => (
            <li key={e.id} className={cx('jp-event', (e.end ?? e.date) < now && 'is-past')}>
              <span className={'jp-event-date jp-event-date-' + e.kind}>
                <span className="jp-event-day">{parse(e.date).getDate()}</span>
                <span className="jp-event-mon">{MONTHS_SHORT[parse(e.date).getMonth()]}</span>
              </span>
              <span className="jp-event-body">
                <Badge tone={e.kind}>{KIND_LABEL[e.kind]}</Badge>
                <span className="jp-event-title">{e.title}</span>
                <span className="jp-event-meta"><Icon name="calendar" size={15} />{formatRange(e)}</span>
                <span className="jp-event-meta"><Icon name="pin" size={15} />{[e.place, e.city].filter(Boolean).join(', ')}</span>
                {e.hours && <span className="jp-event-meta"><Icon name="clock" size={15} />{e.hours}</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ───────────────────────── Réseaux sociaux ───────────────────────── */

export interface Story { id: string; label: string; seed?: number; imageSrc?: string; seen?: boolean; href?: string }
export interface StoryRowProps { stories: Story[]; onOpen?: (s: Story) => void }
/** Rangée de stories : anneau corail = nouvelle, anneau fin = déjà vue. Défile horizontalement. */
export function StoryRow({ stories, onOpen }: StoryRowProps) {
  return (
    <ul className="jp-stories" aria-label="Stories récentes">
      {stories.map(s => {
        const content = (
          <>
            <span className={cx('jp-story-ring', s.seen && 'is-seen')}>
              <span className="jp-story-img">{s.imageSrc ? <img src={s.imageSrc} alt="" /> : <BeadArt seed={s.seed ?? 3} beads={7} />}</span>
            </span>
            <span className="jp-story-label">{s.label}</span>
            {!s.seen && <span className="jp-sr">(nouvelle)</span>}
          </>
        );
        return (
          <li key={s.id}>
            {s.href
              ? <a className="jp-story" href={s.href} target="_blank" rel="noopener noreferrer">{content}</a>
              : <button type="button" className="jp-story" onClick={() => onOpen?.(s)}>{content}</button>}
          </li>
        );
      })}
    </ul>
  );
}

export type Network = 'instagram' | 'facebook' | 'tiktok' | 'pinterest';
export interface Post { id: string; network: Network; caption: string; likes?: number; comments?: number; date?: string; href: string; seed?: number; imageSrc?: string }
export interface SocialFeedProps { posts: Post[]; columns?: 2 | 3 | 4 }
const NET_LABEL: Record<Network, string> = { instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok', pinterest: 'Pinterest' };
/** Grille des dernières publications ; chaque vignette ouvre la publication d'origine. */
export function SocialFeed({ posts, columns = 3 }: SocialFeedProps) {
  return (
    <div className={cx('jp-feed', 'jp-feed-' + columns)}>
      {posts.map(p => (
        <a key={p.id} className="jp-post" href={p.href} target="_blank" rel="noopener noreferrer">
          <span className="jp-post-media">{p.imageSrc ? <img src={p.imageSrc} alt="" /> : <BeadArt seed={p.seed ?? 5} />}</span>
          <span className="jp-post-body">
            <span className="jp-post-net">{NET_LABEL[p.network]}{p.date && <> · {p.date}</>}</span>
            <span className="jp-post-caption">{p.caption}</span>
            <span className="jp-post-stats">
              {p.likes != null && <span><Icon name="heart" size={15} />{p.likes}<span className="jp-sr"> J'aime</span></span>}
              {p.comments != null && <span><Icon name="chat" size={15} />{p.comments}<span className="jp-sr"> commentaires</span></span>}
            </span>
          </span>
        </a>
      ))}
    </div>
  );
}

export interface SocialLink { network: Network; handle: string; href: string }
export interface SocialLinksProps { links: SocialLink[] }
/** Liens vers les comptes : nom du réseau + identifiant, en texte (pas de logos). */
export function SocialLinks({ links }: SocialLinksProps) {
  return (
    <div className="jp-socials">
      {links.map(l => (
        <a key={l.href} className="jp-social" href={l.href} target="_blank" rel="noopener noreferrer">
          <span className="jp-social-net">{NET_LABEL[l.network]}</span>
          <span className="jp-social-handle">{l.handle}</span>
          <Icon name="arrow-up-right" size={15} />
        </a>
      ))}
    </div>
  );
}

/* ───────────────────────── Avis ───────────────────────── */

export interface RatingProps { value: number; outOf?: number; size?: number }
/** Note en étoiles laiton, toujours doublée d'un texte lisible par les lecteurs d'écran. */
export function Rating({ value, outOf = 5, size = 16 }: RatingProps) {
  return (
    <span className="jp-rating" role="img" aria-label={`${value} sur ${outOf}`}>
      {Array.from({ length: outOf }, (_, i) => (
        <Icon key={i} name="star" size={size} filled={i < Math.round(value)} className={i < Math.round(value) ? 'is-on' : 'is-off'} />
      ))}
    </span>
  );
}

export interface Review { id: string; rating: number; text: string; author: string; date?: string; product?: string; source?: string; imageSrc?: string; href?: string }
export interface ReviewCardProps extends Review {}
/** Avis client : étoiles, citation en italique, auteur, produit et provenance. */
export function ReviewCard({ rating, text, author, date, product, source }: ReviewCardProps) {
  return (
    <figure className="jp-review">
      <Rating value={rating} />
      <blockquote className="jp-review-text">« {text} »</blockquote>
      <figcaption className="jp-review-foot">
        <span className="jp-avatar" aria-hidden="true">{author.trim().charAt(0).toUpperCase()}</span>
        <span>
          <span className="jp-review-author">{author}</span>
          <span className="jp-review-meta">{[product, source && 'avis ' + source, date].filter(Boolean).join(' · ')}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export interface ReviewsProps { reviews: Review[]; average?: number; count?: number }
/** Bloc d'avis : moyenne en tête puis cartes en grille. */
export function Reviews({ reviews, average, count }: ReviewsProps) {
  return (
    <div className="jp-reviews">
      {average != null && (
        <div className="jp-reviews-summary">
          <span className="jp-reviews-avg">{average.toFixed(1).replace('.', ',')}</span>
          <span><Rating value={average} size={20} /><span className="jp-reviews-count">{count != null ? `${count} avis vérifiés sur les boutiques` : 'sur les boutiques'}</span></span>
        </div>
      )}
      <div className="jp-grid jp-grid-reviews">
        {reviews.map(r => <ReviewCard key={r.id} {...r} />)}
      </div>
    </div>
  );
}

/* ───────────────────────── Pied de page ───────────────────────── */

export interface SiteFooterProps { brand?: string; tagline?: string; shops: Shop[]; socials: SocialLink[]; email?: string }
/** Pied de page : rappel de la marque, boutiques, réseaux, contact. */
export function SiteFooter({ brand = 'Les Jolies Perles', tagline, shops, socials, email }: SiteFooterProps) {
  return (
    <footer className="jp-footer">
      <div className="jp-container jp-footer-grid">
        <div>
          <p className="jp-footer-brand">{brand}</p>
          {tagline && <p className="jp-footer-tag">{tagline}</p>}
        </div>
        <div>
          <p className="jp-footer-h">Boutiques</p>
          {shops.map(s => <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">{s.name}</a>)}
        </div>
        <div>
          <p className="jp-footer-h">Suivre</p>
          {socials.map(s => <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">{NET_LABEL[s.network]}</a>)}
        </div>
        {email && (
          <div>
            <p className="jp-footer-h">Contact</p>
            <a href={'mailto:' + email}>{email}</a>
          </div>
        )}
      </div>
    </footer>
  );
}
