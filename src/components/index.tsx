import * as React from 'react';
import { useI18n } from '../i18n';

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');

/* ───────────────────────── Icons ───────────────────────── */

export type IconName =
  | 'arrow-up-right' | 'chevron-left' | 'chevron-right' | 'star' | 'heart'
  | 'pin' | 'clock' | 'calendar' | 'close' | 'truck' | 'shield' | 'sparkle' | 'flag' | 'mail' | 'award';

const ICON_PATHS: Record<IconName, string> = {
  'arrow-up-right': 'M7 17 17 7M8 7h9v9',
  'chevron-left': 'M15 18l-6-6 6-6',
  'chevron-right': 'M9 6l6 6-6 6',
  star: 'M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  pin: 'M12 21s-6-5.6-6-11a6 6 0 1 1 12 0c0 5.4-6 11-6 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  calendar: 'M4 6.5h16v13H4zM4 10.5h16M8.5 4v4M15.5 4v4',
  close: 'M6 6l12 12M18 6 6 18',
  truck: 'M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3v3h-7M6.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  shield: 'M12 3l7 3v5.5c0 4.3-3 7.6-7 9.5-4-1.9-7-5.2-7-9.5V6zM9 12l2 2 4-4',
  sparkle: 'M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9zM18.5 16l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z',
  flag: 'M5 21V4M5 4.5h12l-2.5 4 2.5 4H5',
  award: 'M12 15a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM12 7.3l.9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2L9.1 9.4l2-.3zM8.6 13.8 7 21l5-2.6 5 2.6-1.6-7.2',
  mail: 'M3.5 6h17v12h-17zM3.5 6.5l8.5 6.5 8.5-6.5',
};

export interface IconProps { name: IconName; size?: number; filled?: boolean; className?: string; title?: string }
/** 1.5px stroke pictogram; inherits the text colour. */
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

/* ───────────────────────── Badge & rating ───────────────────────── */

export type BadgeTone = 'local' | 'noel' | 'top' | 'neutral';
export interface BadgeProps { tone?: BadgeTone; children?: React.ReactNode; className?: string }
/** One or two words, upper case. Colour always doubles a word, never stands alone. */
export function Badge({ tone = 'neutral', children, className }: BadgeProps) {
  return <span className={cx('jp-badge', 'jp-badge-' + tone, className)}>{children}</span>;
}

export interface RatingProps { value: number; outOf?: number; size?: number }
/** Brass stars, with a readable label for screen readers. */
export function Rating({ value, outOf = 5, size = 16 }: RatingProps) {
  return (
    <span className="jp-rating" role="img" aria-label={`${value} / ${outOf}`}>
      {Array.from({ length: outOf }, (_, i) => (
        <Icon key={i} name="star" size={size} filled={i < Math.round(value)} className={i < Math.round(value) ? 'is-on' : 'is-off'} />
      ))}
    </span>
  );
}

/* ───────────────────────── Data types ───────────────────────── */

export interface Product {
  id: string;
  name: string;
  /** English name (falls back to `name`). */
  nameEn?: string;
  href: string;
  shop?: string;
  /** All photos of the piece (gallery). */
  images: string[];
  /** Shows the "Best seller" badge. */
  top?: boolean;
}

export interface Review {
  id: string;
  rating: number;
  /** Quoted as written by the customer (French). */
  text: string;
  /** English translation, shown with a "Translated from French" note. */
  textEn?: string;
  author: string;
  /** "YYYY-MM" */
  date?: string;
  product?: string;
  productEn?: string;
  source?: 'Etsy' | 'Un grand marché';
  imageSrc?: string;
  href?: string;
}

export type Network = 'instagram' | 'facebook' | 'pinterest';
export interface SocialLink { network: Network; handle: string; href: string }
export interface Post { id: string; caption: string; href: string; imageSrc?: string }

/* ───────────────────────── Market calendar ───────────────────────── */

export type MarketKind = 'local' | 'noel';
export interface MarketEvent {
  id: string;
  /** ISO date "YYYY-MM-DD". */
  date: string;
  /** Last day when the event spans several days. */
  end?: string;
  title: string;
  place: string;
  city: string;
  /** Opening and closing times, "HH:MM". */
  startTime?: string;
  endTime?: string;
  kind: MarketKind;
  href?: string;
  /** Market picture (poster, photo of the stand). */
  image?: string;
}
export interface MarketCalendarProps {
  events: MarketEvent[];
  /** Month shown first, "YYYY-MM". Defaults to the month of the next market. */
  initialMonth?: string;
  /** Today's ISO date, used to dim past dates; defaults to today. */
  today?: string;
}

const iso = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const covers = (e: MarketEvent, day: string) => day >= e.date && day <= (e.end ?? e.date);
const dayOf = (s: string) => Number(s.slice(8, 10));

/** Google Maps link to the market venue (opens directions on mobile). */
export const mapsUrl = (e: MarketEvent) =>
  'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent([e.place, e.city].filter(Boolean).join(', '));

/** Monthly calendar of local and Christmas markets, with filters and the list of the month's dates. */
export function MarketCalendar({ events, initialMonth, today }: MarketCalendarProps) {
  const i18n = useI18n();
  const { t } = i18n;
  const now = today ?? new Date().toISOString().slice(0, 10);
  const sorted = React.useMemo(() => [...events].sort((a, b) => a.date.localeCompare(b.date)), [events]);
  const first = initialMonth ?? (sorted.find(e => (e.end ?? e.date) >= now)?.date ?? now).slice(0, 7);
  const [month, setMonth] = React.useState(first);
  const [filter, setFilter] = React.useState<'all' | MarketKind>('all');
  const [selected, setSelected] = React.useState<string | null>(null);

  const [y, m] = month.split('-').map(Number);
  const mi = m - 1;
  const monthName = i18n.monthLong(month);
  const shift = (k: number) => { const d = new Date(y, mi + k, 1); setMonth(iso(d.getFullYear(), d.getMonth(), 1).slice(0, 7)); setSelected(null); };
  const visible = sorted.filter(e => filter === 'all' || e.kind === filter);
  const daysIn = new Date(y, mi + 1, 0).getDate();
  const lead = (new Date(y, mi, 1).getDay() + 6) % 7;
  const cells: Array<number | null> = [...Array(lead).fill(null), ...Array.from({ length: daysIn }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);

  const inMonth = visible.filter(e => (e.end ?? e.date) >= iso(y, mi, 1) && e.date <= iso(y, mi, daysIn));
  const list = selected ? inMonth.filter(e => covers(e, selected)) : inMonth;
  const kindLabel = (k: MarketKind) => (k === 'noel' ? t.christmasMarket : t.localMarket);
  const range = (e: MarketEvent) => (!e.end || e.end === e.date
    ? i18n.fullDay(e.date)
    : t.fromTo(e.date.slice(0, 7) === e.end.slice(0, 7) ? String(dayOf(e.date)) : i18n.dayMonth(e.date), i18n.dayMonth(e.end)));

  return (
    <div className="jp-cal">
      <div className="jp-cal-board">
        <div className="jp-cal-top">
          <button type="button" className="jp-iconbtn" onClick={() => shift(-1)} aria-label={t.prevMonth}><Icon name="chevron-left" /></button>
          <p className="jp-cal-month" aria-live="polite">{monthName} {y}</p>
          <button type="button" className="jp-iconbtn" onClick={() => shift(1)} aria-label={t.nextMonth}><Icon name="chevron-right" /></button>
        </div>
        <div className="jp-chips" role="group" aria-label={t.marketType}>
          {([['all', t.all], ['local', t.localMarkets], ['noel', t.christmas]] as const).map(([k, l]) => (
            <button key={k} type="button" className={cx('jp-chip', k !== 'all' && 'jp-chip-' + k)} aria-pressed={filter === k}
              onClick={() => { setFilter(k); setSelected(null); }}>{k !== 'all' && <span className="jp-dot" />}{l}</button>
          ))}
        </div>
        <div className="jp-cal-grid" role="grid" aria-label={`${monthName} ${y}`}>
          {i18n.weekdayNames().map(d => <span key={d} className="jp-cal-dow" role="columnheader">{d}</span>)}
          {cells.map((d, i) => {
            if (d == null) return <span key={i} className="jp-cal-cell is-empty" />;
            const day = iso(y, mi, d);
            const evs = visible.filter(e => covers(e, day));
            const kind = evs.some(e => e.kind === 'noel') ? 'noel' : evs.length ? 'local' : null;
            return (
              <button key={i} type="button" role="gridcell" disabled={!evs.length}
                className={cx('jp-cal-cell', kind && 'has-' + kind, selected === day && 'is-selected', day === now && 'is-today', day < now && 'is-past')}
                aria-pressed={evs.length ? selected === day : undefined}
                aria-label={`${i18n.dayMonth(day)}${evs.length ? ' : ' + evs.map(e => i18n.title(e.title)).join(', ') : ''}`}
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
          {selected ? t.onDay(i18n.dayMonth(selected)) : t.inMonth(monthName)}
          <span> · {t.dates(list.length)}</span>
        </p>
        {list.length === 0 && <p className="jp-empty">{t.noMarketMonth}</p>}
        <ul>
          {list.map(e => (
            <li key={e.id} className={cx('jp-event', (e.end ?? e.date) < now && 'is-past', e.image && 'has-img')}>
              <span className={'jp-event-date jp-event-date-' + e.kind}>
                <span className="jp-event-day">{i18n.dayRange(e)}</span>
                <span className="jp-event-mon">{i18n.monthShort(e.end ?? e.date)}</span>
              </span>
              <span className="jp-event-body">
                <Badge tone={e.kind}>{kindLabel(e.kind)}</Badge>
                <span className="jp-event-title">{i18n.title(e.title)}</span>
                <span className="jp-event-meta"><Icon name="calendar" size={15} />{range(e)}</span>
                <span className="jp-event-meta"><Icon name="pin" size={15} />{[e.place, e.city].filter(Boolean).join(', ')}</span>
                {e.startTime && <span className="jp-event-meta"><Icon name="clock" size={15} />{i18n.hours(e)}</span>}
                {(e.place || e.city) && (
                  <a className="jp-event-link" href={mapsUrl(e)} target="_blank" rel="noopener noreferrer">
                    {t.directions} <Icon name="arrow-up-right" size={14} />
                  </a>
                )}
              </span>
              {e.image && <img className="jp-event-img" src={e.image} alt="" loading="lazy" onError={ev => { ev.currentTarget.parentElement?.classList.remove('has-img'); ev.currentTarget.remove(); }} />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
