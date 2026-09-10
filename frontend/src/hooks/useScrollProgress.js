import { useEffect, useRef } from 'react';

/**
 * Scroll-linked progress, written to a CSS custom property.
 *
 * `--p` runs 0 → 1 as the element travels up the viewport: 0 when its top
 * reaches `from`, 1 when its bottom reaches `to` (both fractions of the
 * viewport height, measured from the top). CSS does the rest, so a scroll frame
 * costs one style write and never a React render.
 *
 * It only listens while the element is near the screen, and settles on the
 * right end value when it leaves. Under reduced motion `--p` is pinned at 1 —
 * the finished state, with nothing moving.
 *
 * `onChange(p)` is optional, for the rare case that needs the number in JS
 * (a counter). Keep what it does cheap: it runs on scroll frames.
 */
export function useScrollProgress({ from = 0.85, to = 0.35, onChange } = {}) {
  const ref = useRef(null);
  const listener = useRef(onChange);

  useEffect(() => { listener.current = onChange; });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--p', '1');
      listener.current?.(1);
      return undefined;
    }

    let frame = 0;
    let last = -1;
    const measure = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const span = r.height + vh * (from - to);
      const p = Math.min(1, Math.max(0, (vh * from - r.top) / (span || 1)));
      if (Math.abs(p - last) < 0.0005) return;
      last = p;
      el.style.setProperty('--p', p.toFixed(4));
      listener.current?.(p);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure); };
    const listen = (on) => {
      const method = on ? 'addEventListener' : 'removeEventListener';
      window[method]('scroll', onScroll, { passive: true });
      window[method]('resize', onScroll, { passive: true });
    };

    const io = new IntersectionObserver(([entry]) => {
      listen(entry.isIntersecting);
      if (frame) cancelAnimationFrame(frame);
      measure();
    }, { rootMargin: '25% 0px' });

    measure();
    io.observe(el);
    return () => {
      io.disconnect();
      listen(false);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [from, to]);

  return ref;
}
