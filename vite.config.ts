import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

declare const process: { env: Record<string, string | undefined> };

/** Local dev (npm run dev): serves /api/markets and /api/image like Vercel does. Calendar: MARKETS_ICS_URL in .env.local. */
function marketsApi(icsUrl?: string): Plugin {
  return {
    name: 'markets-api',
    configureServer(server) {
      server.middlewares.use('/api/markets', async (req, res) => {
        const { marketsResponse } = await server.ssrLoadModule('/api/markets.ts');
        const r: Response = await marketsResponse(icsUrl, ((req as { url?: string }).url ?? '').includes('debug'));
        res.statusCode = r.status;
        res.setHeader('Content-Type', 'application/json');
        res.end(await r.text());
      });
      server.middlewares.use('/api/image', async (req, res) => {
        const { imageResponse } = await server.ssrLoadModule('/api/image.ts');
        const u = new URL((req as { url?: string }).url ?? '/', 'http://local').searchParams.get('u');
        const r: Response = await imageResponse(u);
        res.statusCode = r.status;
        res.setHeader('Content-Type', r.headers.get('content-type') ?? 'text/plain');
        res.end(new Uint8Array(await r.arrayBuffer()));
      });
    },
  };
}

/**
 * Fills %SITE_URL% in index.html (link-preview tags need absolute URLs).
 * Uses SITE_URL when set (custom domain), otherwise Vercel's production domain, available at build time.
 */
function siteUrl(env: Record<string, string>): Plugin {
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const url = (env.SITE_URL || process.env.SITE_URL || (vercel ? `https://${vercel}` : 'http://localhost:5173')).replace(/\/$/, '');
  return { name: 'site-url', transformIndexHtml: html => html.split('%SITE_URL%').join(url) };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', ['MARKETS_', 'SITE_']);
  return { plugins: [react(), marketsApi(env.MARKETS_ICS_URL), siteUrl(env)] };
});
