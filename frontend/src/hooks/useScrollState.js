import { useEffect, useState } from 'react';

const SOLID_AT = 28;
const HIDE_AT = 520;

/**
 * The single scroll listener on the site. Passive and rAF-throttled.
 *
 * `solid` flips after SOLID_AT pixels by default. Given `heroSelector`, it flips
 * instead when the bottom of that hero has scrolled up behind the header — so a
 * page with a full-bleed hero keeps a transparent bar for as long as the
 * photograph is under it, and turns solid as soon as content is.
 *
 * `key` re-runs the effect on route change, because each route has its own hero.
 */
export function useScrollState({ heroSelector = null, key = null } = {}) {
  const [state, setState] = useState({ solid: false, hidden: false });

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    let solidNow = false;
    let hero = null;
    let headerH = 0;
    // Hiding the header removes navigation — never do it for reduced-motion users.
    const allowHide = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const threshold = () => {
      if (!heroSelector) return SOLID_AT;
      /* Routes are lazy, so the hero can mount after this effect has run. It is
         looked up again whenever the cached element is missing or has left the
         document, rather than once. */
      if (!hero || !hero.isConnected) hero = document.querySelector(heroSelector);
      if (!hero) return SOLID_AT;
      /* The bar is shorter once solid. Measured every frame, that difference
         would move the threshold the instant the state flipped and the bar
         would flicker between states at the boundary — so the height is only
         taken while the bar is still transparent. */
      if (!solidNow) headerH = document.querySelector('.vp-header__bar')?.offsetHeight ?? 0;
      const bottom = hero.getBoundingClientRect().bottom + window.scrollY;
      return Math.max(SOLID_AT, bottom - headerH);
    };

    const update = () => {
      const y = window.scrollY;
      const solid = y > threshold();
      const hidden = allowHide && y > lastY && y > HIDE_AT;
      solidNow = solid;
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
    // The hero's height depends on the viewport, so the threshold does too.
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [heroSelector, key]);

  return state;
}
