import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ThemeProvider } from './hooks/useTheme.jsx';
import './styles/index.css';

/**
 * Hand the head back to React.
 *
 * scripts/prerender.mjs bakes this route's title, description, canonical, Open
 * Graph and JSON-LD into the served HTML, because social scrapers never run
 * JavaScript and would otherwise see the bare SPA shell. Once JavaScript IS
 * running, <Seo> renders the same tags itself and React hoists them into the
 * head — so leaving the static ones in place gives the document two titles, two
 * canonicals and two JSON-LD blocks, which is the exact duplicate-metadata
 * fault the prerender exists to avoid.
 *
 * Removing them here, before the first render, means: no JavaScript → the
 * static tags stand; JavaScript → React owns the head, including on every
 * client-side navigation afterwards.
 */
for (const el of document.querySelectorAll('[data-seo="static"]')) el.remove();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
