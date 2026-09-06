import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { company } from '../data/company.js';
import { capabilities, coreExpertise } from '../data/capabilities.js';
import { projectCategories, countFor } from '../data/projects.js';
import { getMedia, smallSrc } from '../data/media.js';
import { useCountUp } from '../hooks/useCountUp.js';
import { Button } from '../components/ui/Button.jsx';
import { Reveal, RevealLines } from '../components/ui/Reveal.jsx';
import { ROUTES } from '../constants/routes.js';
import '../styles/about.css';
import { Seo } from '../components/seo/Seo.jsx';

/**
 * Services.
 *
 * Alternating editorial rows rather than a list: each capability gets its own
 * photograph, and the eye is pulled down the page by the side swapping. The
 * motion is entirely the site's existing vocabulary — the clip-path image wipe
 * (.vp-img-reveal), the hover zoom (.vp-zoom), the staggered rise ([data-anim])
 * and useCountUp — so nothing new had to be invented and reduced-motion is
 * honoured for free.
 */

/**
 * Which register category evidences each service.
 *
 * Two services legitimately map to the same category, so the figure is labelled
 * as the CATEGORY total rather than a per-service count. The earlier version
 * printed a bare "15 entries" under both QCA and Open Access, which read as 30
 * entries of separate evidence.
 */
const EVIDENCE = {
  qca: 'regulatory',
  'open-access': 'regulatory',
  metering: 'electrical-regulatory',
  infrastructure: 'electrical',
  'grid-studies': 'electrical-regulatory',
  'project-support': 'om',
};

/** Highlights the rail entry for whichever service is crossing the middle. */
function useActiveService(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const nodes = ids.map((id) => document.getElementById(`svc-${id}`)).filter(Boolean);
    if (!nodes.length) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (seen) setActive(seen.target.id.replace('svc-', ''));
      },
      /* A band across the middle of the viewport, so the rail tracks what the
         reader is actually looking at rather than what has merely appeared. */
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function Evidence({ categoryId }) {
  const total = countFor(categoryId);
  const [shown, ref] = useCountUp(total);
  const label = projectCategories.find((c) => c.id === categoryId)?.label;

  return (
    <div className="vp-svc__evidence" ref={ref}>
      <p className="vp-svc__evidenceLabel">In the project register</p>
      <p className="vp-svc__count">
        {shown}<small>entries</small>
      </p>
      <p className="vp-svc__evidenceNote">under {label}</p>
    </div>
  );
}

export default function Services() {
  const hero = getMedia('cap-infrastructure');
  const ids = useRef(capabilities.map((c) => c.id)).current;
  const active = useActiveService(ids);

  return (
    <>
      <Seo route={ROUTES.services} />

      <section className="vp-phero vp-phero--photo" aria-labelledby="sv-h">
        <div className="vp-phero__media" aria-hidden="true">
          {hero && (
            <img src={hero.src} srcSet={`${smallSrc(hero.src)} 1000w, ${hero.src} 1800w`}
                 sizes="100vw" alt="" fetchPriority="high" decoding="async"
                 style={{ objectPosition: hero.focal }} />
          )}
        </div>
        <div className="vp-phero__inner vp-container">
          <Reveal><span className="vp-eyebrow vp-label mb-3">Services</span></Reveal>
          <h1 id="sv-h" className="vp-phero__title">
            <RevealLines lines={['Six lines of technical', 'and commercial work.']} />
          </h1>
          <Reveal delay={140}>
            <p className="vp-lead vp-phero__lead mb-0">
              Delivered individually or combined into a single engagement across the
              power value chain, under the{' '}
              <Link className="vp-link" to={ROUTES.downloads}>regulations we publish</Link>.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="vp-section vp-svcs" aria-labelledby="sl-h">
        <div className="vp-container">
          <h2 id="sl-h" className="visually-hidden">Our services</h2>

          <div className="vp-svcs__grid">
            {/* Sticky index. Decorative — every entry is a heading below. */}
            <nav className="vp-rail" aria-hidden="true">
              {capabilities.map((c) => (
                <span key={c.id} className="vp-rail__item" data-active={active === c.id}>
                  <span className="vp-rail__n">{c.index}</span>
                  <span className="vp-rail__line" />
                </span>
              ))}
            </nav>

            <div className="vp-svcs__list">
              {capabilities.map((c, i) => {
                const m = getMedia(c.media);
                return (
                  <article className="vp-svc" id={`svc-${c.id}`} key={c.id} data-flip={i % 2 === 1}>
                    <Reveal className="vp-svc__figure vp-img-reveal vp-zoom">
                      {m && (
                        <img
                          src={m.src}
                          srcSet={`${smallSrc(m.src)} 1000w, ${m.src} 1800w`}
                          sizes="(max-width: 900px) 100vw, 42vw"
                          alt={m.alt} loading="lazy" decoding="async"
                          style={{ objectPosition: m.focal }}
                        />
                      )}
                      <span className="vp-svc__badge" aria-hidden="true">{c.index}</span>
                    </Reveal>

                    <div className="vp-svc__content">
                      <Reveal delay={60}>
                        <h3 className="vp-svc__name">{c.name}</h3>
                        <p className="vp-svc__summary">{c.summary}</p>
                      </Reveal>

                      <Reveal delay={110}>
                        <ul className="vp-svc__points">
                          {/* Each point carries its own delay, so the list
                              assembles rather than appearing as a block. */}
                          {c.points.map((pt, k) => (
                            <li key={pt} style={{ '--i': k }}>{pt}</li>
                          ))}
                        </ul>
                      </Reveal>

                      {/* The named service breakdown, where the company
                          publishes one. Only capability 01 has one today, so
                          this renders for that capability and is silent for
                          the rest rather than inventing parity. */}
                      {c.services && (
                        <Reveal delay={140}>
                          <ul className="vp-svc__services">
                            {c.services.map((sv, k) => (
                              <li key={sv.name} style={{ '--i': k }}>
                                <p className="vp-svc__serviceName">{sv.name}</p>
                                <p className="vp-svc__serviceBody">{sv.body}</p>
                              </li>
                            ))}
                          </ul>
                        </Reveal>
                      )}

                      <Reveal delay={160}>
                        <Evidence categoryId={EVIDENCE[c.id]} />
                      </Reveal>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="vp-section vp-section--flush-top" aria-labelledby="ce-h">
        <div className="vp-container">
          <Reveal>
            <h2 id="ce-h" className="vp-h2 vp-measure-tight mb-3">Core expertise</h2>
          </Reveal>
          <Reveal delay={70}>
            <ul className="vp-expertise list-unstyled mb-0">
              {coreExpertise.map((e, i) => (
                <li key={e} style={{ '--i': i }}>{e}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={110}>
            <div className="vp-band mt-5">
              <div>
                <h3 className="vp-band__title">Need one of these on a live project?</h3>
                <p className="vp-band__body">
                  Tell us the scope and the state, and we will confirm what we can take on.
                  You can also see{' '}
                  <Link className="vp-link" to={ROUTES.industries}>the kinds of organisation
                  we work with</Link> and{' '}
                  <Link className="vp-link" to={ROUTES.projects}>the register of work
                  executed</Link>.
                </p>
              </div>
              <Button to={ROUTES.contact} variant="primary" size="sm" arrow>Contact us</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
