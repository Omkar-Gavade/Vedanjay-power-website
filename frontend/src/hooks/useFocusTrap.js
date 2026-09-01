import { useEffect } from 'react';

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Traps focus, locks body scroll without a layout shift, restores focus on close. */
export function useFocusTrap(ref, active, onClose) {
  useEffect(() => {
    if (!active) return undefined;
    const node = ref.current;
    const previous = document.activeElement;

    const sbw = window.innerWidth - document.documentElement.clientWidth;
    const prevPad = document.body.style.paddingRight;
    document.body.classList.add('vp-scroll-locked');
    if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;

    const items = () => Array.from(node?.querySelectorAll(FOCUSABLE) ?? []);
    requestAnimationFrame(() => items()[0]?.focus());

    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose?.(); return; }
      if (e.key !== 'Tab') return;
      const list = items();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('vp-scroll-locked');
      document.body.style.paddingRight = prevPad;
      previous?.focus?.();
    };
  }, [ref, active, onClose]);
}
