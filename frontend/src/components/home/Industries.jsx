import { Link } from 'react-router-dom';
import { industries } from '../../data/industries.js';
import { ROUTES } from '../../constants/routes.js';
import { Media } from '../ui/Media.jsx';
import { Reveal } from '../ui/Reveal.jsx';
import { SectionHeading } from '../ui/SectionHeading.jsx';

const IMAGE_FOR = {
  industrial: 'ind-industrial',
  commercial: 'svc-rooftop',
  utilities: 'ind-utilities',
  'renewable-generators': 'ind-generators',
};

/**
 * Who we serve. Each tile opens on the READER'S problem, not a service name —
 * the gap none of the sector sites fill. A deliberately uneven mosaic (7/5,
 * then 5/7) rather than four identical tiles.
 */
export function Industries() {
  const spans = ['col-12 col-md-7', 'col-12 col-md-5', 'col-12 col-md-5', 'col-12 col-md-7'];

  return (
    <section className="vp-section" aria-labelledby="ind-h">
      <div className="vp-container">
        <SectionHeading
          id="ind-h"
          eyebrow="Who we work for"
          title="Four kinds of client. Four different problems."
          lead="Most energy consultancies describe their services. It is more useful to start with your situation."
        />

        <div className="row g-3 g-md-4 mt-3 mt-lg-4">
          {industries.map((ind, i) => (
            <div className={spans[i]} key={ind.slug}>
              <Reveal delay={i * 80} className="h-100">
                <Link
                  to={`${ROUTES.industries}${ind.slug}/`}
                  className="vp-ind vp-zoom d-block"
                  aria-label={`${ind.name} — ${ind.problem}`}
                >
                  <Media
                    slug={IMAGE_FOR[ind.slug]}
                    ratio={i === 0 || i === 3 ? '16x9' : '4x3'}
                    scrim
                    className="border-0"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="vp-ind__body">
                    <p className="vp-label mb-1" style={{ color: 'var(--vp-green-300)' }}>
                      0{i + 1}
                    </p>
                    <h3 className="vp-h3 mb-0">{ind.name}</h3>
                    <p className="vp-sm vp-ind__problem mb-0">{ind.problem}</p>
                  </div>
                </Link>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
