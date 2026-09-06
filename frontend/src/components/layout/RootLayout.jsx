import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../nav/Header.jsx';
import { Footer } from './Footer.jsx';
import { ChatLauncher } from '../chat/ChatLauncher.jsx';
import { hasOverlayHero } from '../../constants/routes.js';

export function RootLayout() {
  const { pathname } = useLocation();
  const main = useRef(null);
  const first = useRef(true);

  /* Scroll to top and move focus on navigation — SPAs otherwise break
     screen-reader orientation silently. */
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    window.scrollTo(0, 0);
    main.current?.focus();
  }, [pathname]);

  return (
    <>
      {/* Pages whose hero is full-bleed and dark let the header sit inside it;
          everywhere else it is the normal themed bar. Declared once in
          constants/routes.js so this stays a global rule, not a per-page hack. */}
      <Header overlay={hasOverlayHero(pathname)} />
      <main id="main" ref={main} tabIndex={-1} style={{ outline: 'none' }}>
        <Outlet />
      </main>
      <Footer />
      {/* After the footer in DOM order so the tab sequence stays sensible;
          position:fixed keeps it out of layout, so it cannot affect CLS. */}
      <ChatLauncher />
    </>
  );
}
