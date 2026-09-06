import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.js';

/* The panel is loaded on first click. This file is just a button — the same
   lazy + Suspense pattern already used for the interim page in App.jsx. */
const ChatPanel = lazy(() => import('./ChatPanel.jsx'));

/**
 * Local to the launcher on purpose.
 *
 * `useScrollState` exists but reports {solid, hidden} at a 28px threshold for
 * the header, which is not what this needs — and widening it would risk the
 * header for a cosmetic gain. One extra passive, rAF-throttled listener is the
 * smaller and safer change.
 *
 * @param {boolean} gateOnHero wait until the visitor has passed the hero
 */
function useLauncherScroll(gateOnHero) {
  const [past, setPast] = useState(!gateOnHero);
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    if (!gateOnHero) { setPast(true); return undefined; }
    let ticking = false;
    let idle;
    const update = () => {
      setPast(window.scrollY > window.innerHeight * 0.6);
      ticking = false;
    };
    const onScroll = () => {
      setScrolling(true);
      clearTimeout(idle);
      idle = setTimeout(() => setScrolling(false), 220);
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(idle); };
  }, [gateOnHero]);

  return { past, scrolling };
}

function ChatIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M17 9.5c0 3.3-3.1 6-7 6-.86 0-1.68-.13-2.44-.37L3.5 16.5l1.1-3.03C3.6 12.4 3 11.02 3 9.5c0-3.31 3.13-6 7-6s7 2.69 7 6Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const { pathname } = useLocation();

  // On the homepage the hero is a full-viewport brand statement; a widget in
  // its corner cheapens it. Elsewhere the launcher is available immediately.
  const { past, scrolling } = useLauncherScroll(pathname === ROUTES.home);

  /* Not on the contact page. Everything the assistant does there — routing to
     the right team, giving the number, starting an enquiry — the page already
     does better, and the floating button overlaps the content that does it. */
  const suppressed = pathname === ROUTES.contact;

  /* There is no server-side kill switch any more, and nothing to be down: the
     assistant is local, so the launcher's only conditions are where it is
     allowed to appear. */
  const visible = past && !suppressed;

  /* Warm the panel chunk while the browser is idle so the first click feels
     instant — but never on a metered or slow connection, where prefetching a
     feature the visitor has not asked for is what makes sites feel heavy. */
  useEffect(() => {
    if (!visible || open) return undefined;
    const c = navigator.connection;
    if (c?.saveData || /(^|-)2g$/.test(c?.effectiveType ?? '')) return undefined;
    const idle = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 1200));
    const cancel = window.cancelIdleCallback ?? clearTimeout;
    const id = idle(() => { import('./ChatPanel.jsx').catch(() => {}); });
    return () => cancel(id);
  }, [visible, open]);

  /* Closing returns to the launcher — it must never disappear for the session,
     or the visitor has no way back in. useFocusTrap restores focus to the
     opener; the rAF is a cheap guard for the re-render. */
  const close = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => buttonRef.current?.focus());
  }, []);

  if (!visible) return null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="vp-chat-launcher"
        data-scrolling={scrolling && !open ? 'true' : 'false'}
        data-enter="true"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        hidden={open}
      >
        <ChatIcon />
        <span className="vp-chat-launcher__label">Ask Vedanjay</span>
      </button>

      {open && (
        <Suspense fallback={null}>
          <ChatPanel onClose={close} />
        </Suspense>
      )}
    </>
  );
}
