import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { primaryNav } from '../../data/navigation.js';
import { ROUTES } from '../../constants/routes.js';
import { useScrollState } from '../../hooks/useScrollState.js';
import { Logo } from './Logo.jsx';
import { ThemeToggle } from './ThemeToggle.jsx';
import { MobileDrawer } from './MobileDrawer.jsx';
import { Button } from '../ui/Button.jsx';

const OPEN_DELAY = 120;
const CLOSE_DELAY = 200;

const Caret = () => (
  <svg className="vp-nav__caret" viewBox="0 0 12 12" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m3 4.5 3 3 3-3" />
  </svg>
);

export function Header({ overlay = false }) {
  // Only the opacity/blur state is used. Hide-on-scroll was considered and
  // dropped: it removes the Contact CTA mid-scroll and reads as a motion trick
  // rather than a corporate navigation pattern. The glass bar stays put.
  const { solid } = useScrollState();
  const { pathname } = useLocation();

  const [openId, setOpenId] = useState(null);
  const [drawer, setDrawer] = useState(false);

  const openT = useRef(null);
  const closeT = useRef(null);
  const triggers = useRef({});
  const items = useRef([]);
  const root = useRef(null);

  const clearTimers = () => { clearTimeout(openT.current); clearTimeout(closeT.current); };
  const close = useCallback((focusId) => {
    clearTimers(); setOpenId(null); items.current = [];
    if (focusId) triggers.current[focusId]?.focus();
  }, []);
  const open = useCallback((id) => { clearTimers(); items.current = []; setOpenId(id); }, []);

  useEffect(() => { setOpenId(null); setDrawer(false); }, [pathname]);
  useEffect(() => () => clearTimers(), []);
  useEffect(() => {
    if (!openId) return undefined;
    const onDown = (e) => { if (!root.current?.contains(e.target)) close(); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [openId, close]);

  const isActive = useCallback(
    (href) => (href === ROUTES.home ? pathname === href : pathname.startsWith(href)),
    [pathname],
  );

  const onTriggerKey = (e, item) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openId === item.id ? close(item.id) : open(item.id);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault(); open(item.id);
      requestAnimationFrame(() => items.current.filter(Boolean)[0]?.focus());
    } else if (e.key === 'Escape' && openId) {
      e.preventDefault(); close(item.id);
    }
  };

  const onPanelKey = (e, item) => {
    const list = items.current.filter(Boolean);
    const i = list.indexOf(document.activeElement);
    if (e.key === 'Escape') { e.preventDefault(); close(item.id); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); list[Math.min(i + 1, list.length - 1)]?.focus(); }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (i <= 0) triggers.current[item.id]?.focus(); else list[i - 1]?.focus();
    } else if (e.key === 'Tab' && !e.shiftKey && i === list.length - 1) close();
  };

  return (
    <>
      <a href="#main" className="vp-skip">Skip to content</a>

      <header
        ref={root}
        className="vp-header"
        data-scrolled={solid ? 'true' : 'false'}
        data-overlay={overlay && !solid ? 'true' : 'false'}
        onMouseLeave={() => {
          if (!openId) return;
          clearTimers();
          closeT.current = setTimeout(() => setOpenId(null), CLOSE_DELAY);
        }}
      >
        <div className="vp-header__rule" aria-hidden="true" />
        <div className="vp-header__bar">
          <div className="vp-container">
            <div className="vp-header__inner">
              <Logo />

              <nav className="vp-nav" aria-label="Primary">
                <ul className="vp-nav__list">
                  {primaryNav.map((item) => {
                    const hasMenu = Boolean(item.menu);
                    const isOpen = openId === item.id;
                    return (
                      <li key={item.id} className="vp-nav__item" data-open={isOpen ? 'true' : 'false'}
                          onMouseEnter={() => {
                            if (!hasMenu) return;
                            clearTimers();
                            openT.current = setTimeout(() => setOpenId(item.id), OPEN_DELAY);
                          }}>
                        <Link
                          to={item.href}
                          ref={(el) => { triggers.current[item.id] = el; }}
                          className="vp-nav__link"
                          aria-current={isActive(item.href) ? 'page' : undefined}
                          aria-expanded={hasMenu ? isOpen : undefined}
                          aria-haspopup={hasMenu ? 'true' : undefined}
                          onKeyDown={hasMenu ? (e) => onTriggerKey(e, item) : undefined}
                        >
                          {item.label}
                          {hasMenu && <Caret />}
                        </Link>

                        {hasMenu && (
                          <div hidden={!isOpen} className="vp-dropdown" onKeyDown={(e) => onPanelKey(e, item)}>
                            <ul>
                              {item.children.filter((c) => !c.pending).map((c, i) => (
                                <li key={c.href}>
                                  <Link ref={(el) => { items.current[i] = el; }} to={c.href}
                                        className="vp-menu-link" onClick={() => close()}>
                                    <span className="vp-menu-link__title">{c.label}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                            {/* Sections declared in the IA but not yet built. Shown as
                                context rather than as links that go nowhere. */}
                            {item.children.some((c) => c.pending) && (
                              <p className="vp-menu-note mb-0">
                                {item.children.filter((c) => c.pending).map((c) => c.label).join(' · ')}
                                {' '}— coming soon
                              </p>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="d-none d-xl-flex align-items-center gap-2 ms-3">
                <ThemeToggle />
                <Button to={ROUTES.contact} variant="primary" size="sm">Contact Us</Button>
              </div>

              <div className="d-flex d-xl-none align-items-center gap-1 ms-auto">
                <ThemeToggle />
                <button type="button" className="vp-burger" aria-label="Open menu"
                        aria-expanded={drawer} onClick={() => setDrawer(true)}>
                  <span /><span /><span />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileDrawer open={drawer} onClose={() => setDrawer(false)} isActive={isActive} />
    </>
  );
}
