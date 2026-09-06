import { Suspense, lazy, useEffect, useRef, useState } from 'react';

/**
 * Shell for the interactive portfolio map.
 *
 * The body is split off and loaded only when the section is near the viewport.
 * That is a budget decision, not a preference: the homepage is the initial
 * route, its JS headroom is a few hundred bytes and its CSS headroom is zero,
 * and the map carries its own stylesheet plus a 327 KB geometry fetch. Keeping
 * the shell empty of styling keeps all of that out of the first paint.
 */
const PortfolioBody = lazy(() => import('./PortfolioBody.jsx'));

export function PortfolioMap() {
  const ref = useRef(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    /* No IntersectionObserver (or no element) must never mean no section. */
    if (typeof IntersectionObserver !== 'function') { setNear(true); return undefined; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setNear(true); io.disconnect(); }
    }, { rootMargin: '400px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="vp-section" aria-labelledby="map-h" ref={ref}>
      {near && (
        <Suspense fallback={null}>
          <PortfolioBody />
        </Suspense>
      )}
    </section>
  );
}
