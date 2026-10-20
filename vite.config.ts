import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/** En local (npm run dev), sert /api/markets et /api/image comme le fera Vercel. Agenda : MARKETS_ICS_URL dans .env.local. */
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

export default defineConfig(({ mode }) => ({
  plugins: [react(), marketsApi(loadEnv(mode, '.', 'MARKETS_').MARKETS_ICS_URL)],
}));
