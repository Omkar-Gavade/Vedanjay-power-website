import { useState } from 'react';
import { capabilities } from '../../data/capabilities.js';
import { getMedia, smallSrc } from '../../data/media.js';
import { ROUTES } from '../../constants/routes.js';
import { Reveal } from '../ui/Reveal.jsx';
import { SectionHead } from '../ui/SectionHead.jsx';
import { Button } from '../ui/Button.jsx';

/**
 * Core capabilities as a numbered engineering index driving one large image,
 * rather than six identical cards. Selecting a row expands its detail in place
 * and cross-fades the photograph.
 */
export function Capabilities() {
  const [active, setActive] = useState(0);
  const current = capabilities[active];

  return (
    <section className="vp-section vp-bg-alt" aria-labelledby="cap-h">
      <div className="vp-container">
        <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3">
          <SectionHead
            id="cap-h"
            eyebrow="Core capabilities"
            title="Six lines of technical and commercial work."
            lead="Delivered individually or combined into a single engagement across the power value chain."
          />
          <Reveal delay={70} className="flex-shrink-0">
            <Button to={ROUTES.services} variant="outline">All services</Button>
          </Reveal>
        </div>

        <div className="row g-4 g-lg-5 mt-2 mt-lg-3">
          <div className="col-12 col-lg-7 order-lg-1">
            <div className="vp-index" role="tablist" aria-label="Core capabilities" aria-orientation="vertical">
              {capabilities.map((c, i) => (
                <button
                  key={c.id}
                  type="button" role="tab"
                  id={`cap-${c.id}`}
                  aria-selected={i === active}
                  tabIndex={i === active ? 0 : -1}
                  className="vp-index__row"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onKeyDown={(e) => {
                    const n = e.key === 'ArrowDown' ? (i + 1) % capabilities.length
                      : e.key === 'ArrowUp' ? (i - 1 + capabilities.length) % capabilities.length : null;
                    if (n === null) return;
                    e.preventDefault(); setActive(n);
                    document.getElementById(`cap-${capabilities[n].id}`)?.focus();
                  }}
                >
                  <span className="vp-index__num">{c.index}</span>
                  <span className="vp-index__main">
                    <span className="vp-index__name">{c.name}</span>
                    <span className="vp-index__detail">
                      <span className="vp-body vp-text-soft d-block">{c.summary}</span>
                      <ul className="vp-index__points">
                        {c.points.map((p) => <li key={p}>{p}</li>)}
                      </ul>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="col-12 col-lg-5 order-lg-2">
            <Reveal className="vp-index__stage">
              <div className="vp-media vp-media--4x3 vp-scrim">
                {capabilities.map((c, i) => {
                  const m = getMedia(c.media);
                  return (
                    <div key={c.id} className="vp-index__frame" data-active={i === active ? 'true' : 'false'} aria-hidden="true">
                      {m && (
                        <img src={m.src} srcSet={`${smallSrc(m.src)} 1000w, ${m.src} 1800w`}
                             sizes="(max-width: 992px) 100vw, 40vw" alt=""
                             style={{ objectPosition: m.focal }}
                             loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
                      )}
                    </div>
                  );
                })}
                <div className="vp-index__caption">
                  <span className="vp-mono">{current.index} / 06</span>
                  <span className="vp-h4 d-block mt-1">{current.name}</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
