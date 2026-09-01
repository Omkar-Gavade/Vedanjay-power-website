import { credentials } from '../../data/credentials.js';
import { onlyVerified } from '../../data/verification.js';
import { company } from '../../data/company.js';
import { voltageClasses } from '../../data/projects.js';
import { ROUTES } from '../../constants/routes.js';
import { Reveal } from '../ui/Reveal.jsx';
import { SectionHeading } from '../ui/SectionHeading.jsx';
import { Button } from '../ui/Button.jsx';
import { Media } from '../ui/Media.jsx';

/** Why trust us — credentials with their evidence trail, plus where we work. */
export function WhyUs() {
  const verified = onlyVerified(credentials);

  return (
    <section className="vp-section vp-section--lg" aria-labelledby="why-h">
      <div className="vp-container">
        <div className="row g-4 g-lg-5">
          <div className="col-12 col-lg-7">
            <SectionHeading
              id="why-h"
              eyebrow="Why Vedanjay"
              title="Specialists, where generalists cost you months."
              lead="Grid connection is a regulatory problem before it is an engineering one. We have been doing this since 2011, for the companies that own the assets."
            />

            <div className="row g-4 mt-2">
              {verified.map((c, i) => (
                <div className="col-sm-6" key={c.id}>
                  <Reveal delay={i * 80} className="vp-cred h-100">
                    <h3 className="vp-h4 mb-1">{c.label}</h3>
                    <p className="vp-sm vp-text-soft mb-2">{c.detail}</p>
                    {c.source && <p className="vp-label vp-text-muted mb-0">Source &middot; {c.source}</p>}
                  </Reveal>
                </div>
              ))}
            </div>

            <Reveal delay={200} className="mt-4 mt-lg-5">
              <Button to={ROUTES.credentials} variant="outline" arrow>Our credentials</Button>
            </Reveal>
          </div>

          <div className="col-12 col-lg-5 ps-lg-4">
            <Reveal delay={120}>
              <Media slug="ind-generators" ratio="4x3" className="vp-img-reveal vp-zoom"
                     sizes="(max-width: 992px) 100vw, 42vw" />
            </Reveal>

            <Reveal delay={170} className="vp-coverage p-4 mt-4">
              <p className="vp-label vp-text-muted mb-3">Where we work</p>
              <ul className="mb-4">
                {company.coreMarkets.map((m) => (
                  <li key={m} className="d-flex align-items-center gap-3 mb-2">
                    <span aria-hidden="true" style={{
                      width: 7, height: 7, background: 'var(--vp-accent)', flex: 'none',
                      borderRadius: '50%',
                    }} />
                    <span className="vp-body">{m}</span>
                    <span className="vp-label vp-text-muted ms-auto">Core market</span>
                  </li>
                ))}
              </ul>
              <p className="vp-sm vp-text-muted mb-4">
                With works executed for clients based across India.
              </p>

              <div className="vp-hr mb-3" />
              <p className="vp-label vp-text-muted mb-2">Voltage classes executed</p>
              <ul className="d-flex flex-wrap gap-2">
                {voltageClasses.map((v) => <li key={v} className="vp-chip">{v}</li>)}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
