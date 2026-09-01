import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../nav/Header.jsx';
import { Footer } from './Footer.jsx';
import { VerificationBadge } from './VerificationBadge.jsx';
import { ROUTES } from '../../constants/routes.js';

/** Routes whose hero is dark, and which therefore get the transparent header. */
const DARK_HERO = new Set([ROUTES.home]);

export function RootLayout() {
  const { pathname } = useLocation();
  const main = useRef(null);
  const first = useRef(true);

  /* Scroll to top and move focus on navigation — without this, SPAs silently
     break screen-reader orientation. */
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    window.scrollTo(0, 0);
    main.current?.focus();
  }, [pathname]);

  return (
    <>
      <Header overHero={DARK_HERO.has(pathname)} />
      <main id="main" ref={main} tabIndex={-1} style={{ outline: 'none' }}>
        <Outlet />
      </main>
      <Footer />
      <VerificationBadge />
    </>
  );
}
