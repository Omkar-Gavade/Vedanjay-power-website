import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { primaryNav } from '../../data/navigation.js';
import { enquiryHref, ROUTES } from '../../constants/routes.js';
import { useScrollState } from '../../hooks/useScrollState.js';
import { Brand } from './Brand.jsx';
import { ThemeToggle } from './ThemeToggle.jsx';
import { ServicesMega, SimpleDropdown } from './MegaMenu.jsx';
import { MobileDrawer } from './MobileDrawer.jsx';
import { Button } from '../ui/Button.jsx';

const OPEN_DELAY = 130;   // hover intent
const CLOSE_DELAY = 220;  // forgives a diagonal cursor path into the panel

export function Header({ overHero = false }) {
  const { solid, hidden } = useScrollState();
  const { pathname } = useLocation();

  const [openId, setOpenId] = useState(null);
  const [drawer, setDrawer] = useState(false);

  const openT = useRef(null);
  const closeT = useRef(null);
  const triggers = useRef({});
  const items = useRef([]);
  const root = useRef(null);

  // Transparent only over a dark hero, at the top, with nothing open.
  const transparent = overHero && !solid && !openId && !drawer;

  const clearTimers = () => { clearTimeout(openT.current); clearTimeout(closeT.current); };

  const close = useCallback((focusId) => {
    clearTimers();
    setOpenId(null);
    items.current = [];
    if (focusId) triggers.current[focusId]?.focus();
  }, []);

  const open = useCallback((id) => { clearTimers(); items.current = []; setOpenId(id); }, []);
  const registerItem = useCallback((i, el) => { items.current[i] = el; }, []);

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

  /* ---- WAI-ARIA disclosure keyboard model ---- */
  const onTriggerKey = (e, item) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openId === item.id ? close(item.id) : open(item.id);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      open(item.id);
      requestAnimationFrame(() => items.current.filter(Boolean)[0]?.focus());
    } else if (e.key === 'Escape' && openId) {
      e.preventDefault();
      close(item.id);
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
        data-solid={transparent ? 'false' : 'true'}
        data-hidden={hidden && !openId && !drawer ? 'true' : 'false'}
        onMouseLeave={() => {
          if (!openId) return;
          clearTimers();
          closeT.current = setTimeout(() => setOpenId(null), CLOSE_DELAY);
        }}
      >
        {overHero && <div className="vp-header__scrim" aria-hidden="true" />}

        <div className="vp-header__bar">
          <div className="vp-container">
            <div className="vp-header__inner">
              <Brand />

              <nav className="vp-nav" aria-label="Primary">
                <ul className="vp-nav__list">
                  {primaryNav.map((item) => {
                    const hasMenu = Boolean(item.menu);
                    const isOpen = openId === item.id;
                    return (
                      <li
                        key={item.id}
                        className="vp-nav__item"
                        data-open={isOpen ? 'true' : 'false'}
                        onMouseEnter={() => {
                          if (!hasMenu) return;
                          clearTimers();
                          openT.current = setTimeout(() => setOpenId(item.id), OPEN_DELAY);
                        }}
                      >
                        {/* Parent items navigate on click and open on hover — a
                            trigger that does nothing when clicked is a common
                            and frustrating failure. */}
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
                          {hasMenu && <span className="vp-nav__caret" aria-hidden="true">&#9660;</span>}
                        </Link>

                        {item.menu === 'dropdown' && (
                          <div hidden={!isOpen} className="vp-dropdown" onKeyDown={(e) => onPanelKey(e, item)}>
                            <SimpleDropdown item={item} onNavigate={() => close()} registerItem={registerItem} />
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="d-none d-lg-flex align-items-center gap-2 ms-3">
                <ThemeToggle />
                <Button to={enquiryHref('general')} variant="accent" size="sm" arrow>Enquire</Button>
              </div>

              <div className="d-flex d-lg-none align-items-center gap-1 ms-auto">
                <ThemeToggle />
                <button
                  type="button"
                  className="vp-burger"
                  aria-label="Open menu"
                  aria-expanded={drawer}
                  onClick={() => setDrawer(true)}
                >
                  <span /><span /><span />
                </button>
              </div>
            </div>
          </div>

          {/* Mega panel spans the full bar width */}
          {primaryNav.filter((i) => i.menu === 'mega').map((item) => (
            <div
              key={item.id}
              hidden={openId !== item.id}
              className="vp-mega"
              onKeyDown={(e) => onPanelKey(e, item)}
            >
              <ServicesMega item={item} onNavigate={() => close()} registerItem={registerItem} />
            </div>
          ))}
        </div>
      </header>

      <MobileDrawer open={drawer} onClose={() => setDrawer(false)} isActive={isActive} />
    </>
  );
}
