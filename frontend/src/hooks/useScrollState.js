import { useEffect, useState } from 'react';

const SOLID_AT = 28;
const HIDE_AT = 520;

/** The single scroll listener on the site. Passive and rAF-throttled. */
export function useScrollState() {
  const [state, setState] = useState({ solid: false, hidden: false });

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    // Hiding the header removes navigation — never do it for reduced-motion users.
    const allowHide = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const update = () => {
      const y = window.scrollY;
      const solid = y > SOLID_AT;
      const hidden = allowHide && y > lastY && y > HIDE_AT;
      setState((p) => (p.solid === solid && p.hidden === hidden ? p : { solid, hidden }));
      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return state;
}
