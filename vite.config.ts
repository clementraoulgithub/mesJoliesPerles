import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/** En local (npm run dev), sert /api/markets comme le fera Vercel. Agenda : MARKETS_ICS_URL dans .env.local. */
function marketsApi(icsUrl?: string): Plugin {
  return {
    name: 'markets-api',
    configureServer(server) {
      server.middlewares.use('/api/markets', async (_req, res) => {
        const { GET } = await server.ssrLoadModule('/api/markets.ts');
        const r: Response = await GET(undefined, icsUrl);
        res.statusCode = r.status;
        res.setHeader('Content-Type', 'application/json');
        res.end(await r.text());
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), marketsApi(loadEnv(mode, '.', 'MARKETS_').MARKETS_ICS_URL)],
}));
