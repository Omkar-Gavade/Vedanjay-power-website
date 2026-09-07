import { Link } from 'react-router-dom';
import { company } from '../data/company.js';
import { journey, strengths, technologies, capabilities } from '../data/capabilities.js';
import { proofPoints } from '../data/stats.js';
import { leadershipNames, leadershipRoles } from '../data/team.js';
import { vision, mission, values, milestones, achievements } from '../data/about.js';
import { PROJECT_TOTAL } from '../data/projects.js';
import { PORTFOLIO_COUNT, portfolioByState } from '../data/portfolio.js';
import { awards, awardYears } from '../data/awards.js';
import { getMedia, smallSrc } from '../data/media.js';
import { Figure } from '../components/ui/Figure.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Reveal, RevealLines } from '../components/ui/Reveal.jsx';
import { MilestoneStrip } from '../components/about/MilestoneStrip.jsx';
import { ROUTES } from '../constants/routes.js';
import '../styles/about.css';
import { Seo } from '../components/seo/Seo.jsx';

/**
 * Company Overview.
 *
 * Every fact traces to a verified source: company.js and capabilities.js are
 * IRD-derived, stats.js carries only published proof points, PROJECT_TOTAL is
 * asserted against the project register, and the award figures come from
 * certificate-verified entries. Nothing on this page is asserted here for the
 * first time.
 *
 * CONTENT CORRECTION. stats.js publishes six "proof points", but two of them —
 * "WRLDC" and "Solar · Wind · Hybrid" — are not quantities. Rendering them in a
 * figure grid was both a category error and a duplication: WRLDC registration
 * is already stated under coverage, and the three technologies already have
 * their own block. Only the genuinely numeric points appear as figures now.
 */
const NUMERIC = new Set(['established', 'experience', 'portfolio', 'sldc']);

export default function About() {
  const hero = getMedia('footprint');
  const story = getMedia('grid-transmission');
  const figures = proofPoints.filter((p) => NUMERIC.has(p.id));

  return (
    <>
      <Seo route={ROUTES.about} />

      <section className="vp-phero vp-phero--photo" aria-labelledby="ab-h">
        <div className="vp-phero__media" aria-hidden="true">
          {hero && (
            <img src={hero.src} srcSet={`${smallSrc(hero.src)} 1000w, ${hero.src} 1800w`}
                 sizes="100vw" alt="" fetchPriority="high" decoding="async"
                 style={{ objectPosition: hero.focal }} />
          )}
        </div>
        <div className="vp-phero__inner vp-container">
          <Reveal><span className="vp-eyebrow vp-label mb-3">About us · Company overview</span></Reveal>
          <h1 id="ab-h" className="vp-phero__title">
            <RevealLines lines={['Connecting to a more', 'sustainable future.']} />
          </h1>
          <Reveal delay={140}>
            <p className="vp-lead vp-phero__lead mb-0">{company.overview}</p>
          </Reveal>
        </div>
      </section>

      {/* ---- figures ---- */}
      <section className="vp-section vp-stats" aria-labelledby="pp-h">
        <div className="vp-container">
          <h2 id="pp-h" className="visually-hidden">Vedanjay Power at a glance</h2>
          <Reveal>
            <div className="vp-figures">
              {figures.map((p) => (
                <Figure key={p.id} value={p.value} unit={p.unit} label={p.label} />
              ))}
              <Figure
                value={String(PROJECT_TOTAL)}
                label="Works executed"
                note="Recorded in the project register"
              />
              {/* From the deck's own project table, whose rows are asserted
                  against the 5,509.18 MW total it prints — see data/portfolio.js.
                  It also squares the grid: five figures across two columns left
                  a hole, and this is a real sixth rather than a filler. */}
              <Figure
                value={String(PORTFOLIO_COUNT)}
                label="Renewable projects"
                note={`Forecast and scheduled across ${portfolioByState.length} states`}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- story ---- */}
      <section className="vp-section vp-section--flush-top" aria-labelledby="st-h">
        <div className="vp-container">
          <div className="vp-story">
            <div className="vp-story__aside">
              <Reveal>
                <span className="vp-eyebrow vp-label mb-3">Our story</span>
                <h2 id="st-h" className="vp-h2 vp-measure-tight mb-0">
                  <RevealLines lines={['From one objective', `to six service lines.`]} />
                </h2>
              </Reveal>
              <Reveal delay={110} className="vp-story__figure vp-img-reveal vp-zoom">
                {story && (
                  <img src={story.src} srcSet={`${smallSrc(story.src)} 1000w, ${story.src} 1800w`}
                       sizes="(max-width: 992px) 100vw, 38vw"
                       alt={story.alt} loading="lazy" decoding="async"
                       style={{ objectPosition: story.focal }} />
                )}
              </Reveal>
            </div>

            <div className="vp-story__body">
              {/* Verbatim from the company document. Each paragraph carries its
                  own index so they rise in sequence rather than as one block. */}
              {journey.map((para, i) => (
                <Reveal key={para.slice(0, 40)} delay={60 + i * 90}>
                  <p className="vp-story__p" style={{ '--i': i }}>{para}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- what we do ---- */}
      {/* ---- vision, mission, values ---- */}
      <section className="vp-section vp-section--flush-top vp-cover" aria-labelledby="vm-h">
        <div className="vp-container">
          <div className="vp-vm">
            <div>
              <Reveal>
                <span className="vp-eyebrow vp-label mb-3">Vision</span>
                <h2 id="vm-h" className="vp-vm__vision">{vision}</h2>
              </Reveal>
            </div>
            <div>
              <Reveal delay={80}>
                <span className="vp-eyebrow vp-label mb-3">Mission</span>
                <ol className="vp-mission list-unstyled mb-0">
                  {mission.map((m, i) => (
                    <li key={m} style={{ '--i': i }}>
                      <span className="vp-mission__n" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="vp-mission__t">{m}</span>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="vp-section vp-section--flush-top" aria-labelledby="cval-h">
        <div className="vp-container">
          <Reveal>
            <span className="vp-eyebrow vp-label mb-3">What we hold to</span>
            <h2 id="cval-h" className="vp-h2 vp-measure-tight mb-4">Core values.</h2>
          </Reveal>
          <Reveal delay={60}>
            <ul className="vp-values list-unstyled mb-0">
              {values.map((v, i) => (
                <li className="vp-value" key={v.name} style={{ '--i': i }}>
                  <span className="vp-value__rule" aria-hidden="true" />
                  <h3 className="vp-value__name">{v.name}</h3>
                  <p className="vp-value__body">{v.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="vp-section vp-section--flush-top" aria-labelledby="wd-h">
        <div className="vp-container">
          <Reveal>
            <span className="vp-eyebrow vp-label mb-3">What we do</span>
            <h2 id="wd-h" className="vp-h2 vp-measure-tight mb-4">Six service lines.</h2>
          </Reveal>

          <Reveal delay={70}>
            <ol className="vp-lines-list">
              {capabilities.map((c, i) => (
                <li key={c.id} style={{ '--i': i }}>
                  <span className="vp-lines-list__n">{c.index}</span>
                  <span className="vp-lines-list__t">{c.name}</span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={120}>
            <Button to={ROUTES.services} variant="link" size="sm" arrow>All services</Button>
          </Reveal>
        </div>
      </section>

      {/* ---- coverage + technologies ---- */}
      <section className="vp-section vp-section--flush-top vp-cover" aria-labelledby="cv-h">
        <div className="vp-container">
          <div className="row g-4 g-lg-5">
            <div className="col-12 col-lg-7">
              <Reveal>
                <span className="vp-eyebrow vp-label mb-3">Coverage</span>
                <h2 id="cv-h" className="vp-h2 vp-measure-tight mb-2">Registered where it counts.</h2>
                <p className="vp-sourcenote mt-0 mb-4">
                  Registrations, not marketing reach.
                </p>
              </Reveal>
              <Reveal delay={80}>
                <ul className="vp-areas list-unstyled mb-0">
                  {company.operatingAreas.map((a, i) => (
                    <li key={a.name} style={{ '--i': i }}>
                      <span className="vp-areas__name">{a.name}</span>
                      <span className="vp-areas__basis">{a.basis}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div className="col-12 col-lg-5">
              <Reveal delay={60}>
                <h2 className="vp-h2 vp-measure-tight mb-4">Technologies</h2>
                <div className="vp-techgrid">
                  {technologies.map((t, i) => (
                    <div className="vp-techgrid__item" key={t.name} style={{ '--i': i }}>
                      <h3 className="vp-techgrid__name">{t.name}</h3>
                      <p className="vp-techgrid__body">{t.body}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---- strengths ---- */}
      <section className="vp-section vp-section--flush-top" aria-labelledby="ks-h">
        <div className="vp-container">
          <Reveal>
            <span className="vp-eyebrow vp-label mb-3">Key strengths</span>
            <h2 id="ks-h" className="vp-h2 vp-measure-tight mb-4">
              What clients rely on us for.
            </h2>
          </Reveal>
          <Reveal delay={60}>
            <div className="vp-keystr">
              {strengths.map((s, i) => (
                <div className="vp-keystr__item" key={s.name} style={{ '--i': i }}>
                  <h3 className="vp-keystr__name">{s.name}</h3>
                  <p className="vp-keystr__body">{s.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- onward ---- */}
      {/* ---- milestones ---- */}
      <section className="vp-section vp-section--flush-top" aria-labelledby="ms-h">
        <div className="vp-container">
          <Reveal>
            <span className="vp-eyebrow vp-label mb-3">How we got here</span>
            <h2 id="ms-h" className="vp-h2 vp-measure-tight mb-2">Milestones.</h2>
            <p className="vp-sourcenote mt-0 mb-4">
              The company dates its founding and orders everything after it as a
              sequence of capability. Only the first carries a year in the record, so
              only the first carries one here. Drag the strip, or use the arrows.
            </p>
          </Reveal>
          <Reveal delay={60}>
            <MilestoneStrip />
          </Reveal>
        </div>
      </section>

      {/* ---- achievements ---- */}
      <section className="vp-section vp-section--flush-top vp-cover" aria-labelledby="ac-h">
        <div className="vp-container">
          <Reveal>
            <span className="vp-eyebrow vp-label mb-3">On the record</span>
            <h2 id="ac-h" className="vp-h2 vp-measure-tight mb-4">Achievements.</h2>
          </Reveal>
          <Reveal delay={60}>
            <ul className="vp-keystr list-unstyled mb-0">
              {achievements.map((a, i) => (
                <li className="vp-keystr__item" key={a.name} style={{ '--i': i }}>
                  <h3 className="vp-keystr__name">{a.name}</h3>
                  <p className="vp-keystr__body">{a.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="vp-section vp-section--flush-top" aria-labelledby="mo-h">
        <div className="vp-container">
          <Reveal>
            <h2 id="mo-h" className="vp-h2 vp-measure-tight mb-4">More about the company</h2>
          </Reveal>

          <div className="vp-onward">
            {[
              {
                title: 'Leadership',
                body: `${leadershipRoles} — ${leadershipNames}.`,
                to: ROUTES.team, cta: 'Meet our team',
              },
              {
                title: 'Recognition',
                body: `${awards.length} industry awards and listings between ${awardYears.at(-1)} and ${awardYears[0]}, each shown with its certificate.`,
                to: ROUTES.awards, cta: 'Awards',
              },
              {
                title: 'Project record',
                body: `${PROJECT_TOTAL} works executed for utilities, developers, producers and industrial consumers.`,
                to: ROUTES.projects, cta: 'Projects',
              },
            ].map((card, i) => (
              <Reveal key={card.title} delay={i * 70} className="h-100">
                <article className="vp-onward__card">
                  <h3 className="vp-onward__t">{card.title}</h3>
                  <p className="vp-onward__b">{card.body}</p>
                  <Button to={card.to} variant="link" size="sm" arrow>{card.cta}</Button>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={90}>
            <div className="vp-band mt-5">
              <div>
                <h3 className="vp-band__title">Work with us</h3>
                <p className="vp-band__body">
                  Tell us about your project and the right team will respond. If you are
                  looking to join us instead, we publish what the work involves in{' '}
                  <Link className="vp-link" to={ROUTES.careers}>careers</Link>.
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
