import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import { I18nProvider } from './i18n';
import './styles/tokens.css';
import './styles/components.css';
import './styles/app.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <App />
      {/* Vercel Web Analytics: page views, sent only on the deployed site (no-op in local dev) */}
      <Analytics />
    </I18nProvider>
  </StrictMode>,
);
