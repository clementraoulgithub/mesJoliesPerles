/**
 * GET /api/image?u=<address>: proxy for pictures of Facebook / Instagram posts and Google Drive files.
 *
 * Some Facebook image addresses (lookaside.fbsbx.com/…/crawler/…) only serve the picture to link-preview
 * crawlers; a browser gets an HTML page instead. This function fetches the picture as a crawler and passes it
 * on to the browser. Google Drive pictures (calendar attachments) are proxied too: Google rate-limits direct
 * hotlinking, and the one-day cache below means Drive is asked about once a day instead of on every visit.
 * Only Facebook, Instagram and Google Drive image domains are accepted.
 */

const ALLOWED = /(^|\.)(fbcdn\.net|fbsbx\.com|cdninstagram\.com|drive\.google\.com|googleusercontent\.com)$/;
const AGENT = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)';

export function GET(request: Request) {
  return imageResponse(new URL(request.url).searchParams.get('u'));
}

/** Used by Vercel (GET) and by the local dev server (vite.config.ts). */
export async function imageResponse(target: string | null) {
  let url: URL;
  try {
    url = new URL(target ?? '');
  } catch {
    return new Response('Invalid address', { status: 400 });
  }
  if (url.protocol !== 'https:' || !ALLOWED.test(url.hostname)) return new Response('Domain not allowed', { status: 403 });

  try {
    const google = /google/.test(url.hostname);
    const res = await fetch(url, { headers: google ? {} : { 'User-Agent': AGENT }, redirect: 'follow', signal: AbortSignal.timeout(8000) });
    const type = res.headers.get('content-type') ?? '';
    if (!res.ok || !type.startsWith('image/')) return new Response('Image not found', { status: 502 });
    // One-day Vercel cache: the picture is not requested from Facebook on every visit.
    return new Response(res.body, {
      headers: { 'Content-Type': type, 'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800' },
    });
  } catch {
    return new Response('Image not found', { status: 502 });
  }
}
