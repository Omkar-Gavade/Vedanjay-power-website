import { coreExpertise } from '../../data/capabilities.js';
import { Reveal } from '../ui/Reveal.jsx';
import { SectionHead } from '../ui/SectionHead.jsx';
import { TechCarousel } from './TechCarousel.jsx';

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

        <Reveal className="mt-4 mt-lg-5">
          <TechCarousel />
        </Reveal>

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
