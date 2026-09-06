import { getMedia, smallSrc } from '../../data/media.js';
import { company } from '../../data/company.js';
import { ROUTES } from '../../constants/routes.js';
import { Button } from '../ui/Button.jsx';
import { Reveal } from '../ui/Reveal.jsx';

/** Closing call to action — enquiry route plus the published direct contacts. */
export function ClosingCTA() {
  const bg = getMedia('cta-close');

  return (
    <section className="vp-cta vp-on-dark" aria-labelledby="cta-h">
      <div className="vp-cta__bg" aria-hidden="true">
        {bg && <img src={bg.src} srcSet={`${smallSrc(bg.src)} 1000w, ${bg.src} 1800w`}
                    sizes="100vw" alt="" loading="lazy" decoding="async"
                    style={{ objectPosition: bg.focal }} />}
      </div>

      <div className="vp-cta__inner vp-container">
        <div className="row g-4 g-lg-5 align-items-end">
          <div className="col-12 col-lg-7">
            <Reveal>
              <span className="vp-eyebrow vp-label mb-3">Get in touch</span>
              <h2 id="cta-h" className="vp-h2 vp-measure-tight mb-3">
                Discuss your project with our team.
              </h2>
              <p className="vp-lead vp-measure-lead mb-0">
                Forecasting and scheduling, open access, metering, electrical infrastructure
                or grid studies — tell us what you need and we will respond.
              </p>
            </Reveal>
          </div>

          <div className="col-12 col-lg-5 ps-lg-4">
            <Reveal delay={90}>
              <div className="d-flex flex-column flex-sm-row flex-lg-column gap-3">
                <Button to={ROUTES.contact} variant="primary" size="lg">Contact Us</Button>
                <Button href={company.phone.href} variant="ghostLight" size="lg">
                  Call {company.phone.display}
                </Button>
              </div>
              <p className="vp-sm mt-4 mb-0 vp-cta__mail">
                <a href={`mailto:${company.emails.general}`}>{company.emails.general}</a>
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
