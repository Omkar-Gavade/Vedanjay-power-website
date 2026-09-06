import { company } from '../data/company.js';
import { industries } from '../data/industries.js';
import { getMedia, smallSrc } from '../data/media.js';
import { Button } from '../components/ui/Button.jsx';
import { Reveal, RevealLines } from '../components/ui/Reveal.jsx';
import { ROUTES } from '../constants/routes.js';
import '../styles/about.css';

/**
 * Industries — derived entirely from the project register.
 *
 * The company document publishes no industries list, so rather than invent
 * sectors this page groups the 52 recorded engagements by who placed the order
 * and names those organisations. Every count is computed from the register, and
 * the groups partition it exactly — the six figures sum to 52.
 */
export default function Industries() {
  const hero = getMedia('cap-openaccess');
  const total = industries.reduce((n, i) => n + i.orders, 0);

  return (
    <>
      <title>Industries — Vedanjay Power Pvt. Ltd.</title>
      <meta
        name="description"
        content="Vedanjay Power works with transmission utilities and DISCOMs, wind and solar developers, independent power producers, industrial consumers and infrastructure projects across India."
      />
      <link rel="canonical" href={`${company.website.replace(/\/$/, '')}/industries/`} />

      <section className="vp-phero vp-phero--photo" aria-labelledby="in-h">
        <div className="vp-phero__media" aria-hidden="true">
          {hero && (
            <img src={hero.src} srcSet={`${smallSrc(hero.src)} 1000w, ${hero.src} 1800w`}
                 sizes="100vw" alt="" fetchPriority="high" decoding="async"
                 style={{ objectPosition: hero.focal }} />
          )}
        </div>
        <div className="vp-phero__inner vp-container">
          <Reveal><span className="vp-eyebrow vp-label mb-3">Industries</span></Reveal>
          <h1 id="in-h" className="vp-phero__title">
            <RevealLines lines={['Who we work for.']} />
          </h1>
          <Reveal delay={140}>
            <p className="vp-lead vp-phero__lead mb-0">
              Grouped from {total} recorded engagements by the organisation that placed
              the order — utilities, developers, producers and industrial consumers.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="vp-section" aria-labelledby="ig-h">
        <div className="vp-container">
          <h2 id="ig-h" className="visually-hidden">Sectors served</h2>

          <div className="vp-inds">
            {industries.map((ind, i) => {
              const m = getMedia(ind.media);
              return (
                <Reveal key={ind.id} delay={i * 60} className="h-100">
                  <article className="vp-ind">
                    <div className="vp-ind__media">
                      {m && (
                        <img src={m.src} srcSet={`${smallSrc(m.src)} 1000w, ${m.src} 1800w`}
                             sizes="(max-width: 768px) 100vw, 32vw"
                             alt={m.alt} loading="lazy" decoding="async"
                             style={{ objectPosition: m.focal }} />
                      )}
                      <p className="vp-ind__count">{ind.orders}<small>entries</small></p>
                    </div>
                    <div className="vp-ind__body">
                      <h3 className="vp-ind__name">{ind.name}</h3>
                      <p className="vp-ind__summary">{ind.summary}</p>
                      <p className="vp-ind__clients">
                        <b>Includes</b>
                        {ind.clients.join(' · ')}
                      </p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={80}>
            <div className="vp-band mt-4">
              <div>
                <h3 className="vp-band__title">Not sure which applies to you?</h3>
                <p className="vp-band__body">
                  Describe the asset and the connection point, and we will tell you what is involved.
                </p>
              </div>
              <Button to={ROUTES.projects} variant="outline" size="sm" arrow>See the work</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
