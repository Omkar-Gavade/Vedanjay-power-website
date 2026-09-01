import { useEffect, useRef, useState } from 'react';

/**
 * Counts up on first entry. The final value is already in the DOM before this
 * runs, so the figure is correct without JS, for screen readers, and under
 * reduced motion — the animation is pure enhancement.
 */
export function useCountUp(target, { duration = 1100 } = {}) {
  const [value, setValue] = useState(target);
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || done.current) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let raf;
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting || done.current) return;
      done.current = true;
      io.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        // easeOutExpo: fast commit, gentle settle — reads as a meter landing.
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setValue(Math.round(target * eased));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      setValue(0);
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.35 });

    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target, duration]);

  return [value, ref];
}
