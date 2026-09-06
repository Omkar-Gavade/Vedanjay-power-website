import { useCallback, useEffect, useRef, useState } from 'react';
import { technologies } from '../../data/capabilities.js';
import { Media } from '../ui/Media.jsx';

const MEDIA_FOR = { Solar: 'tech-solar', Wind: 'tech-wind', Hybrid: 'tech-hybrid' };
const DWELL = 5200;

/**
 * Solar / Wind / Hybrid as a rotating coverflow — the front card is the big
 * one, its neighbours sit back and to the side.
 *
 * ALL THREE CARDS STAY IN THE DOM AND IN THE ACCESSIBILITY TREE.
 * The rotation is a visual arrangement, not a disclosure: there are only three
 * short cards, so hiding two of them from assistive technology would remove
 * real content to imitate a slideshow. Nothing here is aria-hidden, and a
 * screen reader or a printed page gets the lot.
 *
 * The auto-advance stops on hover, on focus anywhere inside, and entirely under
 * prefers-reduced-motion — an animation that moves the thing you are reading
 * away from you is the specific failure that setting exists to prevent.
 */
export function TechCarousel() {
  const n = technologies.length;
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const drag = useRef(null);

  const go = useCallback((d) => setActive((a) => (a + d + n) % n), [n]);

  useEffect(() => {
    if (held) return undefined;
    const still = typeof matchMedia === 'function'
      && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still) return undefined;
    const id = setInterval(() => go(1), DWELL);
    return () => clearInterval(id);
  }, [held, go]);

  /* Signed distance from the active card, wrapped so the ring has no seam:
     with three cards the last one sits to the LEFT of the first, not two
     places to its right. */
  const offset = (i) => {
    let p = i - active;
    if (p > n / 2) p -= n;
    if (p < -n / 2) p += n;
    return p;
  };

  const onDown = (e) => { drag.current = { x: e.clientX, t: Date.now() }; };
  const onUp = (e) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const dx = e.clientX - d.x;
    /* 40px so a tap that wobbles is still a tap. */
    if (Math.abs(dx) > 40 && Date.now() - d.t < 900) go(dx < 0 ? 1 : -1);
  };

  return (
    <div
      className="vp-flow"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      <div
        className="vp-flow__stage"
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => { drag.current = null; }}
      >
        {technologies.map((t, i) => {
          const p = offset(i);
          return (
            <figure
              key={t.name}
              className="vp-flow__card"
              style={{ '--p': p, '--d': Math.abs(p) }}
              data-active={p === 0 ? 'true' : undefined}
              /* Inert while behind: clicking a back card brings it forward
                 rather than following a link inside it. */
              onClick={p === 0 ? undefined : () => setActive(i)}
            >
              <Media
                slug={MEDIA_FOR[t.name]}
                ratio="3x2"
                className="vp-flow__media"
                sizes="(max-width: 768px) 82vw, 40vw"
              />
              <figcaption className="vp-flow__cap">
                <h3 className="vp-flow__name">{t.name}</h3>
                <p className="vp-flow__body">{t.body}</p>
              </figcaption>
            </figure>
          );
        })}
      </div>

      <div className="vp-flow__controls">
        <button type="button" className="vp-flow__arrow" onClick={() => go(-1)}
                aria-label="Previous technology">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.6"
                  strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="vp-flow__dots">
          {technologies.map((t, i) => (
            <button
              key={t.name}
              type="button"
              className="vp-flow__dot"
              aria-label={`Show ${t.name}`}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
            />
          ))}
        </div>

        <button type="button" className="vp-flow__arrow" onClick={() => go(1)}
                aria-label="Next technology">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.6"
                  strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
