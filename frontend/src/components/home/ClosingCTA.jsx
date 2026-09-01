import { getMedia } from '../../data/media.js';
import { company } from '../../data/company.js';
import { enquiryHref } from '../../constants/routes.js';
import { Button } from '../ui/Button.jsx';
import { Reveal } from '../ui/Reveal.jsx';

/**
 * Closing call to action. Two routes — a form for the considered enquiry, a
 * phone number for the urgent one. Nine of the legacy site's eleven pages offer
 * neither.
 */
export function ClosingCTA() {
  const bg = getMedia('cta-dusk');

  return (
    <section className="vp-cta vp-section vp-section--lg vp-on-dark-ground" aria-labelledby="cta-h">
      <div className="vp-cta__bg" aria-hidden="true">
        {bg && <img src={bg.src} srcSet={`${bg.src.replace('/images/', '/images/sm/')} 1000w, ${bg.src} 1800w`}
                    sizes="100vw" alt="" loading="lazy" decoding="async" style={{ objectPosition: bg.focal }} />}
      </div>

      <div className="vp-cta__inner vp-container">
        <div className="row g-4 g-lg-5 align-items-end">
          <div className="col-12 col-lg-7">
            <Reveal>
              <span className="vp-eyebrow vp-label mb-3" style={{ color: 'var(--vp-green-300)' }}>
                Start here
              </span>
              <h2 id="cta-h" className="vp-h1 vp-measure-tight mb-3" style={{ color: '#fff' }}>
                Tell us about your project.
              </h2>
              <p className="vp-lead vp-measure-lead mb-0" style={{ color: 'rgb(234 242 240 / .8)' }}>
                Send the capacity, the state and where you are in the approval process.
                An engineer will come back to you — not a sales team.
              </p>
            </Reveal>
          </div>

          <div className="col-12 col-lg-5 ps-lg-4">
            <Reveal delay={100}>
              <div className="d-flex flex-column flex-sm-row flex-lg-column gap-3">
                <Button to={enquiryHref('general')} variant="accent" size="lg" arrow>Start an enquiry</Button>
                <Button href={company.phones[0].href} variant="ghostLight" size="lg">
                  Call {company.phones[1].value}
                </Button>
              </div>
              <p className="vp-sm mt-4 mb-0" style={{ color: 'rgb(234 242 240 / .7)' }}>
                Or email{' '}
                <a href={`mailto:${company.emails[0].value}`} className="text-break"
                   style={{ color: 'var(--vp-amber-400)', textDecoration: 'underline', textUnderlineOffset: '4px' }}>
                  {company.emails[0].value}
                </a>
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
