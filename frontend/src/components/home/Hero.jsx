import { useCallback, useEffect, useRef, useState } from 'react';
import { heroSequence, getMedia } from '../../data/media.js';
import { credentials } from '../../data/credentials.js';
import { onlyVerified } from '../../data/verification.js';
import { company } from '../../data/company.js';
import { ROUTES, enquiryHref } from '../../constants/routes.js';
import { Button } from '../ui/Button.jsx';
import { RevealLines } from '../ui/Reveal.jsx';

const DWELL = 6500;

/**
 * Rotating photographic hero.
 *
 * Why stills and not video: Vedanjay's subject matter is static infrastructure —
 * substations, feeder bays, metering, arrays. It photographs far better than it
 * films, and four stills cost roughly 260 KB against several megabytes of video,
 * with no autoplay, battery or mobile-data penalty. Recorded as D-034.
 *
 * The rotation pauses on hover/focus, when the tab is hidden, and entirely under
 * prefers-reduced-motion — where it becomes a single static frame.
 */
export function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);
  const timer = useRef(null);

  const proof = onlyVerified(credentials).slice(0, 4);

  const go = useCallback((i) => setIndex(((i % heroSequence.length) + heroSequence.length) % heroSequence.length), []);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced.current) return undefined;

    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (reduced.current || paused) return undefined;
    timer.current = setTimeout(() => go(index + 1), DWELL);
    return () => clearTimeout(timer.current);
  }, [index, paused, go]);

  return (
    <section
      className="vp-hero"
      data-paused={paused ? 'true' : 'false'}
      aria-roledescription="carousel"
      aria-label="Vedanjay Power capabilities"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="vp-hero__stage">
        {heroSequence.map((slug, i) => {
          const item = getMedia(slug);
          if (!item) return null;
          const active = i === index;
          return (
            <div
              key={slug}
              className="vp-hero-slide"
              data-active={active ? 'true' : 'false'}
              aria-hidden={!active}
            >
              <img
                src={item.src}
                srcSet={`${item.src.replace('/images/', '/images/sm/')} 1000w, ${item.src} 1800w`}
                sizes="100vw"
                alt={i === 0 ? item.alt : ''}
                style={{ objectPosition: item.focal }}
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : 'low'}
                decoding={i === 0 ? 'sync' : 'async'}
                draggable="false"
              />
            </div>
          );
        })}
      </div>

      <div className="vp-hero__scrim" aria-hidden="true" />

      <div className="vp-hero__body">
        <div className="vp-container">
          <div className="row">
            <div className="col-12 col-lg-11 col-xl-9">
              <p className="vp-eyebrow vp-label vp-hero__eyebrow mb-3">
                Renewable power consultancy &middot; Est. {company.incorporated}
              </p>

              <h1 className="vp-display vp-hero__title mb-0">
                <RevealLines
                  lines={['We get renewable projects', 'approved, connected', 'and scheduled.']}
                  delay={120}
                />
              </h1>

              <p className="vp-lead vp-hero__lead mt-4 mb-0">
                Open access, grid connectivity, forecasting and O&amp;M for India&rsquo;s renewable
                generators, utilities and industrial power buyers.
              </p>

              <div className="d-flex flex-column flex-sm-row gap-3 mt-4 mt-lg-5">
                <Button to={ROUTES.services} variant="accent" size="lg" arrow>Explore our services</Button>
                <Button to={enquiryHref('general')} variant="ghostLight" size="lg">Talk to an engineer</Button>
              </div>
            </div>
          </div>

          {/* Frame control + scroll cue */}
          <div className="d-flex align-items-center justify-content-between gap-3 mt-5 pt-2">
            <div className="vp-hero__nav" role="group" aria-label="Choose hero image">
              {heroSequence.map((slug, i) => (
                <button
                  key={slug}
                  type="button"
                  className="vp-hero__dot"
                  aria-current={i === index ? 'true' : 'false'}
                  aria-label={`Image ${i + 1} of ${heroSequence.length}`}
                  data-seen={i < index ? 'true' : 'false'}
                  style={{ '--hero-dwell': `${DWELL}ms` }}
                  onClick={() => go(i)}
                >
                  <span className="vp-mono d-none d-sm-inline" style={{ fontSize: '.75rem' }}>
                    0{i + 1}
                  </span>
                  <span className="vp-hero__dot-track" aria-hidden="true">
                    <span className="vp-hero__dot-fill" />
                  </span>
                </button>
              ))}
            </div>

            <span className="vp-hero__cue vp-label" aria-hidden="true">
              <span className="vp-hero__cue-line" />
              Scroll
            </span>
          </div>
        </div>
      </div>

      {/* Proof strip — verified credentials only */}
      <div className="vp-hero__proof">
        <div className="vp-container">
          <ul className="row g-0">
            {proof.map((c) => (
              <li key={c.id} className="col-6 col-lg-3 vp-hero__proof-item pe-3">
                <p className="vp-sm vp-hero__proof-value mb-1">{c.label}</p>
                <p className="vp-sm vp-hero__proof-label mb-0">{c.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
