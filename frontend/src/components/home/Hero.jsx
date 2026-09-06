import { company } from '../../data/company.js';
import { proofPoints } from '../../data/stats.js';
import { getMedia, smallSrc, heroSlides } from '../../data/media.js';
import { ROUTES } from '../../constants/routes.js';
import { useHeroSlideshow } from '../../hooks/useHeroSlideshow.js';
import { Button } from '../ui/Button.jsx';
import { RevealLines } from '../ui/Reveal.jsx';

/**
 * Hero with a cross-dissolving slideshow.
 *
 * Only the first frame is fetched eagerly; the rest are lazy, so the slideshow
 * costs one image on first paint and the others arrive during the first dwell.
 * All movement is transform/opacity only — no layout property animates.
 */
export function Hero() {
  const { index, go, reduced } = useHeroSlideshow(heroSlides.length);

  /**
   * Scrolls to whatever section follows the hero.
   *
   * Smoothness comes from `html { scroll-behavior: smooth }` in base.css, which
   * already switches to `auto` under prefers-reduced-motion — so this stays a
   * plain scrollIntoView rather than duplicating the motion decision here.
   */
  const scrollToNext = () => {
    document.querySelector('.vp-hero')?.nextElementSibling
      ?.scrollIntoView({ block: 'start' });
  };

  return (
    <section className="vp-hero" aria-labelledby="hero-h">
      <div className="vp-hero__media" role="presentation">
        {heroSlides.map((slide, i) => {
          const img = getMedia(slide.slug);
          if (!img) return null;
          const active = i === index;
          return (
            <div
              key={slide.slug}
              className="vp-hero__slide"
              data-active={active ? 'true' : 'false'}
              data-pan={slide.pan}
              aria-hidden="true"
            >
              <img
                src={img.src}
                srcSet={`${smallSrc(img.src)} 1000w, ${img.src} 1800w`}
                sizes="100vw"
                alt=""
                width="1800" height="1013"
                style={{ objectPosition: img.focal }}
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

      <div className="vp-hero__body vp-container">
        <div className="row">
          <div className="col-12 col-lg-10 col-xl-8">
            <p className="vp-hero__kicker vp-label mb-3 vp-enter" style={{ '--enter': '0ms' }}>
              Power-sector solutions · Established {company.established}
            </p>

            <h1 id="hero-h" className="vp-h1 vp-hero__title mb-0">
              <RevealLines lines={['Connecting to a More', 'Sustainable Future']} delay={90} />
            </h1>

            <p className="vp-lead vp-hero__lead mt-4 mb-0 vp-enter" style={{ '--enter': '360ms' }}>
              {company.overview}
            </p>

            <div className="d-flex flex-column flex-sm-row gap-3 mt-4 mt-lg-5 vp-enter"
                 style={{ '--enter': '460ms' }}>
              <Button to={ROUTES.services} variant="primary" size="lg">Explore Our Capabilities</Button>
              <Button to={ROUTES.contact} variant="ghostLight" size="lg">Contact Us</Button>
            </div>
          </div>
        </div>

        {/* Bottom row: numbered slide indicators on the left, scroll cue on the
            right. Indicators use our own numeral + rule treatment rather than the
            reference's styling. */}
        <div className="vp-hero__foot vp-enter" style={{ '--enter': '620ms' }}>
          {heroSlides.length > 1 ? (
            <div className="vp-hero__dots" role="group" aria-label="Hero image">
              {heroSlides.map((s, i) => (
                <button
                  key={s.slug}
                  type="button"
                  className="vp-hero__dot"
                  aria-current={i === index ? 'true' : 'false'}
                  aria-label={`Show image ${i + 1} of ${heroSlides.length}`}
                  onClick={() => go(i)}
                >
                  <span className="vp-hero__dot-num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="vp-hero__dot-track" aria-hidden="true">
                    {/* The fill doubles as the dwell timer; static under reduced motion. */}
                    {!reduced && i === index && <span className="vp-hero__dot-fill" />}
                  </span>
                </button>
              ))}
            </div>
          ) : <span />}

          <button
            type="button"
            className="vp-hero__scroll"
            onClick={scrollToNext}
            aria-label="Scroll to the next section"
          >
            <span className="vp-hero__scroll-label" aria-hidden="true">Scroll</span>
            <span className="vp-hero__scroll-line" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Proof strip — verified statistics only (source document §14, §4). */}
      <div className="vp-proof">
        <div className="vp-container">
          <ul className="vp-proof__list">
            {proofPoints.map((p, i) => (
              <li key={p.id} className="vp-proof__item vp-enter" style={{ '--enter': `${700 + i * 70}ms` }}>
                <span className="vp-proof__value">
                  {p.value}{p.unit && <span className="vp-proof__unit"> {p.unit}</span>}
                </span>
                <span className="vp-proof__label">{p.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
