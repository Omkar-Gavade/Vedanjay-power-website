import { useEffect, useRef } from 'react';

/**
 * Scroll reveal. ONE shared IntersectionObserver for the whole page.
 *
 * Elements render visible; they are only "armed" (hidden) once JS has confirmed
 * motion is permitted. That ordering makes stranded-invisible content
 * impossible — the classic failure of scroll-reveal implementations.
 */
let observer = null;

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.dataset.anim = 'in';
        observer.unobserve(entry.target); // fires once
      }
    },
    // Near-zero threshold: a larger one can never fire for elements taller
    // than the viewport.
    { threshold: 0.01, rootMargin: '0px 0px -12% 0px' },
  );
  return observer;
}

export function useReveal({ delay = 0, type = 'rise', disabled = false } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return undefined;

    el.dataset.animType = type;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.dataset.anim = 'in';
      return undefined;
    }

    el.dataset.anim = 'armed';
    if (delay) el.style.setProperty('--d', `${delay}ms`);

    const io = getObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, [delay, type, disabled]);

  return ref;
}
