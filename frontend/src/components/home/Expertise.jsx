import { coreExpertise, technologies } from '../../data/capabilities.js';
import { trackPointer } from '../../utils/pointerLight.js';
import { Media } from '../ui/Media.jsx';
import { Reveal } from '../ui/Reveal.jsx';
import { SectionHead } from '../ui/SectionHead.jsx';

const MEDIA_FOR = { Solar: 'tech-solar', Wind: 'tech-wind', Hybrid: 'tech-hybrid' };

/** Renewable-energy and technical expertise. */
export function Expertise() {
  return (
    <section className="vp-section" aria-labelledby="exp-h">
      <div className="vp-container">
        <SectionHead
          id="exp-h"
          eyebrow="Renewable-energy expertise"
          title="Forecasting and scheduling across solar, wind and hybrid generation."
          lead="Registered QCA operations with state load despatch centres in Maharashtra, Madhya Pradesh and Telangana, and with WRLDC for the Western Region."
        />

        {/* Three cards, all visible at once. This was a rotating coverflow;
            with only three items it hid two of them to imitate a slideshow. */}
        <div className="vp-xcards mt-4 mt-lg-5">
          {technologies.map((t, i) => (
            <Reveal key={t.name} delay={i * 110}>
              <figure className="vp-xcard" onPointerMove={trackPointer}>
                <Media
                  slug={MEDIA_FOR[t.name]}
                  ratio="4x3"
                  className="vp-xcard__media"
                  sizes="(max-width: 767px) 92vw, 32vw"
                />
                <figcaption className="vp-xcard__cap">
                  <div className="vp-xcard__head">
                    <h3 className="vp-xcard__name">{t.name}</h3>
                    <span className="vp-xcard__num" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="vp-xcard__rule" aria-hidden="true" />
                  <p className="vp-xcard__body">{t.body}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140}>
          <div className="vp-expertise-strip mt-5">
            <p className="vp-label vp-text-soft mb-3">Core expertise</p>
            <ul className="vp-taglist">
              {coreExpertise.map((e) => <li key={e}>{e}</li>)}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
