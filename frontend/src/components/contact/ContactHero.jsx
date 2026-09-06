import { getMedia, smallSrc } from '../../data/media.js';
import { company } from '../../data/company.js';
import { Button } from '../ui/Button.jsx';
import { Reveal, RevealLines } from '../ui/Reveal.jsx';

/**
 * Contact hero.
 *
 * The first version had no call to action at all — a conversion page whose
 * hero stated facts and asked for nothing. This one leads with the action.
 *
 * Composition: a type panel over a full-bleed transmission photograph, with the
 * image weighted right and a horizontal scrim so the left column stays legible.
 * The photograph is decorative (alt=""): it carries tone, not information, and
 * everything it depicts is said in the copy.
 */
export function ContactHero() {
  const img = getMedia('contact-hero');

  return (
    <section className="vp-chero" aria-labelledby="ch-h">
      <div className="vp-chero__media" aria-hidden="true">
        {img && (
          <img
            src={img.src}
            srcSet={`${smallSrc(img.src)} 1000w, ${img.src} 1800w`}
            sizes="100vw"
            alt=""
            /* The only above-the-fold image on the route — decoded eagerly so it
               does not pop in after the type has painted. */
            fetchPriority="high"
            decoding="async"
            style={{ objectPosition: img.focal }}
          />
        )}
      </div>

      <div className="vp-chero__inner vp-container">
        <div className="vp-chero__panel">
          <Reveal>
            <span className="vp-eyebrow vp-label mb-3">Contact Vedanjay Power</span>
          </Reveal>

          <h1 id="ch-h" className="vp-chero__title mb-3">
            <RevealLines lines={['Start the', 'conversation.']} />
          </h1>

          <Reveal delay={140}>
            <p className="vp-lead vp-chero__lead mb-0">
              Forecasting and scheduling, open access, metering, electrical
              infrastructure or grid studies — tell us what you are working on and
              the right team will respond.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="vp-chero__cta">
              <Button href="#enquiry" variant="primary" size="lg" arrow>
                Start an enquiry
              </Button>
              <Button href={company.phone.href} variant="outline" size="lg">
                Call +91 {company.phone.display}
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
