import { Suspense, lazy, useEffect, useRef, useState } from 'react';

/**
 * Shell for the client marquee.
 *
 * Same budget decision as the portfolio map: the homepage is the initial route
 * and its CSS headroom is zero, so the band's stylesheet and its two dozen
 * marks load with a chunk fetched once the section is near the viewport. The
 * shell itself carries no styling of its own.
 */
const ClientStripBody = lazy(() => import('./ClientStripBody.jsx'));

export function ClientStrip() {
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
    <section className="vp-section vp-section--tight-top" aria-labelledby="cl-h" ref={ref}>
      {near && (
        <Suspense fallback={null}>
          <ClientStripBody />
        </Suspense>
      )}
    </section>
  );
}
