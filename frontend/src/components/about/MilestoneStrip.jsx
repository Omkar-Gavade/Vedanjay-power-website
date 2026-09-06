import { useCallback, useEffect, useRef, useState } from 'react';
import { milestones } from '../../data/about.js';

/**
 * Milestones as a horizontal strip of connected cards.
 *
 * WHY IT MOVED OFF THE VERTICAL SPINE
 * Ten entries down the left edge left two thirds of the row empty beside them,
 * which read as an unfinished page rather than as space. Laid along a rail the
 * same ten entries fill the width, and the sequence — which is the whole point
 * of the section — becomes the thing you actually see.
 *
 * THE RAIL IS ONE LINE BEHIND THE WHOLE TRACK, not a border per card. Drawn per
 * card it breaks at every gap, which is the opposite of "connected"; drawn once
 * behind them, the cards sit ON it like stations.
 *
 * DRAGGING is pointer-based and additive: the strip is a native scroll
 * container first, so touch, trackpad, shift-wheel, keyboard and the arrow
 * buttons all work whether or not the drag handler runs. Nothing here is the
 * only way to move it.
 */
export function MilestoneStrip() {
  const viewport = useRef(null);
  const drag = useRef(null);
  const [progress, setProgress] = useState(0);
  const [ends, setEnds] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = viewport.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    /* 2px of slack: sub-pixel scroll widths never land exactly on the end. */
    setEnds({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 });
  }, []);

  useEffect(() => {
    const el = viewport.current;
    if (!el) return undefined;
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', measure); ro.disconnect(); };
  }, [measure]);

  /** One card plus its gap, so the arrows step rather than fling. */
  const step = (dir) => {
    const el = viewport.current;
    if (!el) return;
    const card = el.querySelector('.vp-ms__item');
    const by = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * by, behavior: 'smooth' });
  };

  const onPointerDown = (e) => {
    /* Let the arrows and any future links inside a card behave normally. */
    if (e.target.closest('button, a')) return;
    const el = viewport.current;
    drag.current = { x: e.clientX, left: el.scrollLeft, moved: false };
    el.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 3) d.moved = true;
    viewport.current.scrollLeft = d.left - dx;
  };
  const endDrag = (e) => {
    if (!drag.current) return;
    viewport.current?.releasePointerCapture?.(e.pointerId);
    drag.current = null;
  };

  return (
    <div className="vp-ms">
      <div
        className="vp-ms__viewport"
        ref={viewport}
        /* Focusable so the strip can be scrolled with the arrow keys, and
           labelled so it is announced as what it is rather than as a stray
           scrollable box. */
        tabIndex={0}
        role="group"
        aria-label="Milestones, scrollable"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <ol className="vp-ms__track">
          {milestones.map((m, i) => (
            <li className="vp-ms__item" key={m.name} style={{ '--i': i }}>
              <span className="vp-ms__dot" aria-hidden="true" />
              <p className="vp-ms__year">
                {m.year ?? `Step ${String(i + 1).padStart(2, '0')}`}
              </p>
              <h3 className="vp-ms__name">{m.name}</h3>
              <p className="vp-ms__text">{m.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="vp-ms__controls">
        <div className="vp-ms__progress" aria-hidden="true">
          <span className="vp-ms__progressFill" style={{ transform: `scaleX(${progress || 0.02})` }} />
        </div>
        <div className="vp-ms__arrows">
          <button type="button" className="vp-ms__arrow" onClick={() => step(-1)}
                  disabled={ends.start} aria-label="Previous milestones">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.6"
                    strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="vp-ms__arrow" onClick={() => step(1)}
                  disabled={ends.end} aria-label="More milestones">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.6"
                    strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
