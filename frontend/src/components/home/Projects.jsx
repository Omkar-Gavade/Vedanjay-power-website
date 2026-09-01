import { featuredEngagement, registerBreakdown, voltageClasses, REGISTER_TOTAL } from '../../data/projects.js';
import { ROUTES } from '../../constants/routes.js';
import { Media } from '../ui/Media.jsx';
import { Reveal } from '../ui/Reveal.jsx';
import { SectionHeading } from '../ui/SectionHeading.jsx';
import { Button } from '../ui/Button.jsx';

/**
 * Work delivered. A single engagement told properly beats a wall of thumbnails —
 * and the register breakdown beside it shows the depth behind the one example.
 * Every figure here is countable from the contract register.
 */
export function Projects() {
  const total = REGISTER_TOTAL;
  const max = Math.max(...registerBreakdown.map((r) => r.count));

  return (
    <section className="vp-section vp-bg-deep vp-on-dark-ground" aria-labelledby="proj-h">
      <div className="vp-container">
        <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3 gap-md-4">
          <SectionHeading
            id="proj-h"
            eyebrow="Work delivered"
            title="Named contracts, named authorities."
            lead="Every entry in our register is a real work order for a named utility, IPP or industrial client."
          />
          <Reveal delay={80} className="flex-shrink-0">
            <Button to={ROUTES.projects} variant="outline" arrow className="vp-btn--ghost-light">
              All {total} projects
            </Button>
          </Reveal>
        </div>

        <div className="row g-4 g-lg-5 mt-3 mt-lg-4 align-items-start">
          {/* Featured engagement */}
          <div className="col-12 col-lg-7">
            <Reveal>
              <Media
                slug="proj-grid"
                ratio="16x9"
                scrim
                className="vp-img-reveal vp-zoom"
                sizes="(max-width: 992px) 100vw, 58vw"
              />
            </Reveal>

            <Reveal delay={90}>
              <p className="vp-label mt-4 mb-2" style={{ color: 'var(--vp-green-300)' }}>
                Featured engagement
              </p>
              <h3 className="vp-h3 mb-3" style={{ color: '#fff' }}>{featuredEngagement.title}</h3>

              <dl className="row g-3 vp-proj__meta pt-3 mb-0">
                {featuredEngagement.facts.map((f) => (
                  <div className="col-6 col-sm-3" key={f.label}>
                    <dt className="vp-label vp-on-dark-soft mb-1">{f.label}</dt>
                    <dd className="vp-h4 mb-0" style={{ color: '#fff' }}>{f.value}</dd>
                  </div>
                ))}
              </dl>

              <p className="vp-body vp-measure mt-4 vp-on-dark-soft">{featuredEngagement.brief}</p>

              <ul className="mt-3">
                {featuredEngagement.work.map((w) => (
                  <li key={w} className="d-flex gap-3 vp-sm vp-on-dark-soft mb-2">
                    <span aria-hidden="true" className="flex-none mt-2"
                          style={{ width: 14, height: 1, background: 'var(--vp-amber-500)', flex: 'none' }} />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Register breakdown */}
          <div className="col-12 col-lg-5">
            <Reveal delay={120}>
              <div className="p-4 p-lg-5" style={{
                border: '1px solid rgb(234 242 240 / .16)',
                borderRadius: 'var(--vp-radius)',
                background: 'rgb(234 242 240 / .03)',
              }}>
                <p className="vp-label mb-3 vp-on-dark-soft">Contract register</p>
                <p className="vp-stat mb-1" style={{ color: '#fff' }}>{total}</p>
                <p className="vp-sm vp-on-dark-soft mb-4">Named works, by category</p>

                <ul>
                  {registerBreakdown.map((r, i) => (
                    <li key={r.category} className="mb-3">
                      <div className="d-flex justify-content-between align-items-baseline gap-3 mb-2">
                        <span className="vp-sm vp-on-dark-soft">{r.category}</span>
                        <span className="vp-mono vp-sm" style={{ color: 'var(--vp-green-300)' }}>{r.count}</span>
                      </div>
                      <div className="vp-proj__bar">
                        <span style={{ '--w': r.count / max, '--bd': `${i * 90}ms` }} />
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="vp-hr my-4" />
                <p className="vp-label mb-2 vp-on-dark-soft">Voltage classes executed</p>
                <ul className="d-flex flex-wrap gap-2">
                  {voltageClasses.map((v) => (
                    <li key={v} className="vp-chip">{v}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
