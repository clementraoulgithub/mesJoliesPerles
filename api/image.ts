/**
 * GET /api/image?u=<adresse> : relais pour les images de publications Facebook / Instagram.
 *
 * Certaines adresses d'images Facebook (lookaside.fbsbx.com/…/crawler/…) ne servent l'image qu'aux robots
 * d'aperçu de lien ; un navigateur y reçoit une page HTML. Cette fonction va chercher l'image comme un robot
 * et la renvoie au navigateur. Seuls les domaines d'images Facebook et Instagram sont acceptés.
 */

const ALLOWED = /(^|\.)(fbcdn\.net|fbsbx\.com|cdninstagram\.com)$/;
const AGENT = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)';

export function GET(request: Request) {
  return imageResponse(new URL(request.url).searchParams.get('u'));
}

/** Utilisé par Vercel (GET) et par le serveur local (vite.config.ts). */
export async function imageResponse(target: string | null) {
  let url: URL;
  try {
    url = new URL(target ?? '');
  } catch {
    return new Response('Adresse invalide', { status: 400 });
  }
  if (url.protocol !== 'https:' || !ALLOWED.test(url.hostname)) return new Response('Domaine non autorisé', { status: 403 });

  try {
    const res = await fetch(url, { headers: { 'User-Agent': AGENT }, signal: AbortSignal.timeout(8000) });
    const type = res.headers.get('content-type') ?? '';
    if (!res.ok || !type.startsWith('image/')) return new Response('Image introuvable', { status: 502 });
    // Cache 1 jour sur Vercel : l'image n'est pas redemandée à Facebook à chaque visite.
    return new Response(res.body, {
      headers: { 'Content-Type': type, 'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800' },
    });
  } catch {
    return new Response('Image introuvable', { status: 502 });
  }
}
