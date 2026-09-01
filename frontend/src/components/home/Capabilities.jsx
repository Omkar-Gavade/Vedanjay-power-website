import { useState } from 'react';
import { services } from '../../data/services.js';
import { getMedia } from '../../data/media.js';
import { ROUTES } from '../../constants/routes.js';
import { Button } from '../ui/Button.jsx';
import { Reveal } from '../ui/Reveal.jsx';
import { SectionHeading } from '../ui/SectionHeading.jsx';

/** Each service maps to a photograph; selecting a row cross-fades the stage. */
const IMAGE_FOR = {
  'open-access': 'svc-open-access',
  'forecasting-scheduling': 'svc-forecasting',
  liaisoning: 'svc-liaisoning',
  'electrical-infrastructure': 'svc-electrical',
  'rooftop-solar': 'svc-rooftop',
  'operations-maintenance': 'svc-om',
};

/**
 * Capabilities as an editorial index rather than a grid of identical cards:
 * a numbered list drives one large sticky photograph. Selecting a row expands
 * its description in place and cross-fades the image — the whole section reads
 * as one composition instead of six repeated tiles.
 */
export function Capabilities() {
  const [active, setActive] = useState(0);

  return (
    <section className="vp-section vp-bg-alt" aria-labelledby="cap-h">
      <div className="vp-container">
        <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3 gap-md-4">
          <SectionHeading
            id="cap-h"
            eyebrow="Capabilities"
            title="Six lines of work."
            lead="Each is a discipline in its own right. Most clients start with one and return for others."
          />
          <Reveal delay={80} className="flex-shrink-0">
            <Button to={ROUTES.services} variant="outline" arrow>All services</Button>
          </Reveal>
        </div>

        <div className="vp-cap row g-4 g-lg-5 mt-3 mt-lg-4">
          {/* Sticky photographic stage */}
          <div className="col-12 col-lg-6 order-lg-2">
            <Reveal className="vp-cap__stage">
              <div className="vp-media vp-media--4x3 vp-scrim">
                {services.map((s, i) => {
                  const item = getMedia(IMAGE_FOR[s.slug]);
                  return (
                    <div key={s.slug} className="vp-cap__frame" data-active={i === active ? 'true' : 'false'} aria-hidden="true">
                      {item ? (
                        <img
                          src={item.src}
                          srcSet={`${item.src.replace('/images/', '/images/sm/')} 1000w, ${item.src} 1800w`}
                          sizes="(max-width: 992px) 100vw, 50vw"
                          alt=""
                          style={{ objectPosition: item.focal }}
                          loading={i === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                        />
                      ) : <div className="vp-media__placeholder" />}
                    </div>
                  );
                })}
                <div className="vp-cap__caption">
                  <p className="vp-label mb-1" style={{ color: 'var(--vp-green-300)' }}>
                    {services[active].index} / 06
                  </p>
                  <p className="vp-h4 mb-0">{services[active].name}</p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Index */}
          <div className="col-12 col-lg-6 order-lg-1">
            <div className="vp-cap__list" role="tablist" aria-label="Service capabilities" aria-orientation="vertical">
              {services.map((s, i) => (
                <button
                  key={s.slug}
                  type="button"
                  role="tab"
                  id={`cap-tab-${s.slug}`}
                  aria-selected={i === active}
                  aria-controls="cap-stage"
                  tabIndex={i === active ? 0 : -1}
                  className="vp-cap__row"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                      e.preventDefault();
                      const n = (i + 1) % services.length;
                      setActive(n);
                      document.getElementById(`cap-tab-${services[n].slug}`)?.focus();
                    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                      e.preventDefault();
                      const n = (i - 1 + services.length) % services.length;
                      setActive(n);
                      document.getElementById(`cap-tab-${services[n].slug}`)?.focus();
                    }
                  }}
                >
                  <span className="vp-cap__idx">{s.index}</span>
                  <span>
                    <span className="vp-cap__name d-block">{s.name}</span>
                    <span className="vp-cap__desc">{s.summary}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
