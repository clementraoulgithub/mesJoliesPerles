/**
 * GET /api/markets : lit l'agenda des marchés (fichier ICS) et renvoie les dates au format du calendrier.
 *
 * L'adresse de l'agenda se règle dans Vercel : Settings → Environment Variables → MARKETS_ICS_URL
 * (Google Agenda : Paramètres de l'agenda → « Adresse publique au format iCal » ou « Adresse secrète au format iCal »).
 * Elle reste côté serveur : elle n'apparaît jamais dans le code envoyé aux visiteurs.
 *
 * Dans l'agenda, un événement = un marché :
 *   titre    → nom du marché ; « Noël » dans le titre le classe en marché de Noël
 *   lieu     → « Salle des fêtes, 1 rue …, 44119 Treillières, France » : 1re partie = lieu, ville déduite du code postal
 *   horaires → heure de début et de fin ; un événement « toute la journée » n'affiche pas d'horaire
 *   description → un lien vers l'image du marché (image directe, partage Google Drive, publication Instagram ou Facebook)
 */

declare const process: { env: Record<string, string | undefined> };

export interface MarketEvent {
  id: string; date: string; end?: string; title: string; place: string; city: string;
  hours?: string; kind: 'local' | 'noel'; href?: string; image?: string;
}

const TZ = 'Europe/Paris';
const DAY = 86_400_000;

interface Prop { value: string; params: Record<string, string> }
type VEvent = Record<string, Prop[]>;

/** Déplie les lignes (RFC 5545 §3.1) et regroupe les propriétés de chaque VEVENT. */
function parseEvents(ics: string): VEvent[] {
  const lines = ics.replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '').split('\n');
  const events: VEvent[] = [];
  let cur: VEvent | null = null;
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') { cur = {}; continue; }
    if (line === 'END:VEVENT') { if (cur) events.push(cur); cur = null; continue; }
    if (!cur) continue;
    const colon = line.indexOf(':');
    if (colon < 0) continue;
    const [name, ...rawParams] = line.slice(0, colon).split(';');
    const params = Object.fromEntries(rawParams.map(p => p.split('=') as [string, string]));
    (cur[name.toUpperCase()] ??= []).push({ value: line.slice(colon + 1), params });
  }
  return events;
}

const unescape = (s: string) => s.replace(/\\n/gi, '\n').replace(/\\([,;\\])/g, '$1').trim();

/** Date et heure locales (Paris) d'une valeur DTSTART / DTEND. */
function toLocal(p: Prop): { date: string; time?: string } {
  const v = p.value;
  const d = `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`;
  if (p.params.VALUE === 'DATE' || v.length === 8) return { date: d };
  const hm = `${v.slice(9, 11)}:${v.slice(11, 13)}`;
  if (!v.endsWith('Z')) return { date: d, time: hm }; // TZID=Europe/Paris ou heure flottante
  const parts = new Intl.DateTimeFormat('fr-FR', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date(`${d}T${hm}:00Z`));
  const get = (t: string) => parts.find(x => x.type === t)!.value;
  return { date: `${get('year')}-${get('month')}-${get('day')}`, time: `${get('hour')}:${get('minute')}` };
}

/** Premier lien de la description (Google Agenda y met parfois du HTML : <a href="…">). Partage Drive → image directe. */
export function imageLink(description: string): string | undefined {
  const url = description.match(/https?:\/\/[^\s"'<>]+/)?.[0]?.replace(/[).,;]+$/, '').replace(/&amp;/g, '&');
  if (!url) return undefined;
  const drive = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]+)/);
  return drive ? `https://drive.google.com/thumbnail?id=${drive[1]}&sz=w1200` : url;
}

const addDays = (iso: string, n: number) => new Date(Date.parse(iso + 'T00:00:00Z') + n * DAY).toISOString().slice(0, 10);
const fmtTime = (t: string) => { const [h, m] = t.split(':'); return `${Number(h)}h${m === '00' ? '' : m}`; };

/** « Salle des fêtes, 1 rue X, 44119 Treillières, France » → lieu « Salle des fêtes », ville « Treillières ». */
function splitLocation(loc: string) {
  const parts = loc.split(',').map(s => s.trim()).filter(Boolean).filter(s => !/^france$/i.test(s));
  const withZip = parts.find(s => /\b\d{5}\b/.test(s));
  const city = withZip ? withZip.replace(/\b\d{5}\b/, '').trim() : parts.length > 1 ? parts[parts.length - 1] : '';
  return { place: parts[0] && parts[0] !== withZip ? parts[0] : '', city };
}

function toMarkets(ev: VEvent): MarketEvent[] {
  const one = (k: string) => ev[k]?.[0];
  if (!one('DTSTART') || one('STATUS')?.value === 'CANCELLED') return [];
  const title = unescape(one('SUMMARY')?.value ?? 'Marché');
  const start = toLocal(one('DTSTART')!);
  const endProp = one('DTEND');
  const end = endProp ? toLocal(endProp) : undefined;
  // Pour un événement « toute la journée », DTEND est le lendemain du dernier jour.
  const lastDay = end ? (end.time ? end.date : addDays(end.date, -1)) : start.date;
  const { place, city } = splitLocation(unescape(one('LOCATION')?.value ?? ''));
  const kind = /no[eë]l/i.test(title + ' ' + (one('CATEGORIES')?.value ?? '')) ? 'noel' : 'local';
  const url = one('URL')?.value;
  const image = imageLink(unescape(one('DESCRIPTION')?.value ?? ''));
  const base = {
    title, place, city, kind, href: url, image,
    hours: start.time && end?.time ? `${fmtTime(start.time)} – ${fmtTime(end.time)}` : start.time ? `dès ${fmtTime(start.time)}` : undefined,
  } as const;
  const span = Math.max(0, Math.round((Date.parse(lastDay) - Date.parse(start.date)) / DAY));
  const uid = one('UID')?.value ?? title + start.date;

  // Répétitions simples : chaque semaine / chaque mois (RRULE FREQ=WEEKLY|MONTHLY, INTERVAL, COUNT, UNTIL), moins les EXDATE.
  const dates = [start.date];
  const rrule = one('RRULE')?.value;
  if (rrule) {
    const r = Object.fromEntries(rrule.split(';').map(x => x.split('=')));
    const step = Number(r.INTERVAL ?? 1);
    const count = Number(r.COUNT ?? 200);
    const until = r.UNTIL ? `${r.UNTIL.slice(0, 4)}-${r.UNTIL.slice(4, 6)}-${r.UNTIL.slice(6, 8)}` : addDays(start.date, 540);
    for (let i = 1; dates.length < count; i++) {
      let next: string;
      if (r.FREQ === 'WEEKLY') next = addDays(start.date, 7 * step * i);
      else if (r.FREQ === 'MONTHLY') { const d = new Date(start.date + 'T00:00:00Z'); d.setUTCMonth(d.getUTCMonth() + step * i); next = d.toISOString().slice(0, 10); }
      else break;
      if (next > until) break;
      dates.push(next);
    }
  }
  const excluded = new Set((ev.EXDATE ?? []).flatMap(p => p.value.split(',').map(v => toLocal({ value: v, params: p.params }).date)));

  return dates.filter(d => !excluded.has(d)).map(d => ({
    id: `${uid}-${d}`, date: d, ...(span ? { end: addDays(d, span) } : {}), ...base,
  }));
}

const SOCIAL = /^https?:\/\/(?:[\w-]+\.)?(?:facebook\.com|fb\.me|fb\.watch|instagram\.com)\//;

// Robots d'aperçu de lien auxquels Facebook / Instagram servent les balises og:, essayés dans l'ordre.
const PREVIEW_AGENTS = [
  'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
  'WhatsApp/2.23.20.0',
  'Twitterbot/1.0',
  'TelegramBot (like TwitterBot)',
];

export interface ImageLookup { link: string; image?: string; tries: string[] }

/** Image d'une publication Facebook ou Instagram : la balise og:image servie aux robots d'aperçu de lien. */
async function socialImage(url: string): Promise<ImageLookup> {
  const tries: string[] = [];
  for (const agent of PREVIEW_AGENTS) {
    const who = agent.split(/[/ ]/)[0];
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': agent, 'Accept-Language': 'fr-FR,fr;q=0.9' }, redirect: 'follow', signal: AbortSignal.timeout(5000),
      });
      const html = res.ok ? await res.text() : '';
      const og = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/)?.[1]
        ?? html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/)?.[1];
      const page = new URL(res.url).pathname.split('/').slice(0, 3).join('/');
      tries.push(`${who}: HTTP ${res.status} ${page}${og ? ' → image' : ' → pas d\'image'}`);
      // Passe par /api/image : certaines images Facebook ne s'affichent que pour les robots.
      if (og) return { link: url, image: '/api/image?u=' + encodeURIComponent(og.replace(/&amp;/g, '&')), tries };
    } catch (err) {
      tries.push(`${who}: ${(err as Error).name}`);
    }
  }
  return { link: url, tries };
}

/** Remplace les liens de publications Facebook / Instagram par l'adresse de leur image (un appel par lien). */
export async function resolveSocialImages(events: MarketEvent[], log?: ImageLookup[]): Promise<MarketEvent[]> {
  const links = [...new Set(events.map(e => e.image).filter((u): u is string => !!u && SOCIAL.test(u)))];
  const lookups = await Promise.all(links.map(socialImage));
  log?.push(...lookups);
  const found = new Map(lookups.map(l => [l.link, l.image]));
  return events.map(e => {
    if (!e.image || !found.has(e.image)) return e;
    const img = found.get(e.image);
    // Instagram introuvable : on garde le lien, le site le cherchera dans le flux Behold.
    return img ? { ...e, image: img } : /instagram\.com/.test(e.image) ? e : { ...e, image: undefined };
  });
}

export function parseMarkets(ics: string, today = new Date().toISOString().slice(0, 10)): MarketEvent[] {
  const from = addDays(today, -365);
  const to = addDays(today, 540);
  return parseEvents(ics)
    .flatMap(toMarkets)
    .filter(e => (e.end ?? e.date) >= from && e.date <= to)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function GET(request?: Request) {
  const debug = request ? new URL(request.url).searchParams.has('debug') : false;
  return marketsResponse(process.env.MARKETS_ICS_URL?.trim(), debug);
}

/** Lit l'agenda et renvoie la réponse JSON ; utilisé par Vercel (GET) et par le serveur local (vite.config.ts). */
export async function marketsResponse(url: string | undefined, debug = false) {
  if (!url) return Response.json({ error: 'MARKETS_ICS_URL non configurée' }, { status: 503 });
  try {
    const res = await fetch(url.replace(/^webcal:/, 'https:'));
    if (!res.ok) throw new Error(`agenda : HTTP ${res.status}`);
    const log: ImageLookup[] = [];
    const events = await resolveSocialImages(parseMarkets(await res.text()), log);
    // /api/markets?debug : ce que Facebook / Instagram ont répondu pour chaque lien d'image (sans l'adresse de l'agenda).
    if (debug) return Response.json({ images: log, events }, { headers: { 'Cache-Control': 'no-store' } });
    // Cache Vercel 10 min : une modification de l'agenda apparaît sur le site en 10 à 20 min environ
    // (Google Agenda met lui-même quelques minutes à mettre à jour son fichier ICS).
    return Response.json(events, { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=86400' } });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 502 });
  }
}
