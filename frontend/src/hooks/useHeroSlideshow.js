import { useCallback, useEffect, useState } from 'react';

const DWELL = 6500; // ms per slide — matches --vp-hero-dwell in hero.css

/**
 * Hero slideshow timing.
 *
 * Deliberately not a carousel: no track transform, no drag, no wrap maths —
 * just an index advanced on a timer, with all visual work done in CSS.
 *
 * The interval id is a LOCAL of the effect, not a ref. A ref is shared across
 * StrictMode's two effect instances, so the first cleanup clears the second
 * instance's interval and the slideshow advances once and stops. Scoping it to
 * the effect makes each instance own exactly its own timer.
 *
 * `nudge` restarts the dwell when a slide is chosen manually, so the new frame
 * gets its full time rather than whatever remained of the previous tick.
 */
export function useHeroSlideshow(count) {
  const [index, setIndex] = useState(0);
  const [nudge, setNudge] = useState(0);
  const [reduced, setReduced] = useState(true); // fail safe: no motion until confirmed

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (reduced || count < 2) return undefined;

    let id = null;
    const tick = () => setIndex((i) => (i + 1) % count);
    const start = () => { if (id === null) id = setInterval(tick, DWELL); };
    const stop = () => { if (id !== null) { clearInterval(id); id = null; } };

    // A background tab advancing frames is wasted CPU and battery.
    const onVisibility = () => (document.hidden ? stop() : start());

    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduced, count, nudge]);

  const go = useCallback((i) => {
    setIndex(((i % count) + count) % count);
    setNudge((n) => n + 1); // restart the dwell for the chosen frame
  }, [count]);

  return { index, go, reduced, dwell: DWELL };
}
