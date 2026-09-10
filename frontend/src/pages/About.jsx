import { Link } from 'react-router-dom';
import { company } from '../data/company.js';
import { journey, capabilities } from '../data/capabilities.js';
import { proofPoints } from '../data/stats.js';
import { leadership, leadershipNames, leadershipRoles } from '../data/team.js';
import { vision, mission, values } from '../data/about.js';
import { PROJECT_TOTAL } from '../data/projects.js';
import { awards, awardYears } from '../data/awards.js';
import { shots } from '../data/gallery.js';
import { getMedia, smallSrc } from '../data/media.js';
import { useCountUp } from '../hooks/useCountUp.js';
import { useScrollProgress } from '../hooks/useScrollProgress.js';
import { trackPointer } from '../utils/pointerLight.js';
import { Reveal, RevealLines } from '../components/ui/Reveal.jsx';
import { SectionHead } from '../components/ui/SectionHead.jsx';
import { ScrollWords } from '../components/about/ScrollWords.jsx';
import { RevealWords } from '../components/about/RevealWords.jsx';
import { Journey } from '../components/about/Journey.jsx';
import { ClosingCTA } from '../components/home/ClosingCTA.jsx';
import { ROUTES } from '../constants/routes.js';
import '../styles/about.css';
import { Seo } from '../components/seo/Seo.jsx';

/**
 * Company Overview — rebuilt 10 Sep 2026.
 *
 * WHAT THE PAGE IS FOR. The overview answers four questions — who the company
 * is, how it got here, what it stands for, and what it does — and then hands
 * the reader on. The previous page answered those and then kept going: a
 * service explorer and a QCA diagram that belong to Services, a technologies
 * grid that belongs to the homepage, eleven key strengths and eight
 * achievements that restated the figures and the coverage in list form. Those
 * are gone; the facts they carried are still here, once each.
 *
 * NOTHING IS ASSERTED HERE FOR THE FIRST TIME. Figures come from stats.js,
 * prose from capabilities.js and about.js (IRD wording), coverage from
 * company.js, and the onward cards derive their counts from the registers
 * they link to. The headings are editorial; the facts under them are not.
 */

const pad = (n) => String(n).padStart(2, '0');

/** The four figures that are genuinely quantities, in the order they read. */
const FACTS = ['established', 'experience', 'portfolio', 'sldc']
  .map((id) => proofPoints.find((p) => p.id === id))
  .filter(Boolean);

const intro = getMedia('grid-transmission');
const crewBay = shots.find((s) => s.id === 'crew-transformer-bay');
const crewAtHeight = shots.find((s) => s.id === 'linesmen-switching-structure');

/* Three certificates, centre card last so it paints on top. */
const FAN = [
  { award: awards[1], k: -1 },
  { award: awards[2], k: 1 },
  { award: awards[0], k: 0 },
].filter((f) => f.award?.image);

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * One hero figure. It counts up on first view — except the founding year,
 * which is a date and would be absurd counted from zero. The true value is in
 * the DOM for assistive technology whatever the animation is doing.
 */
function Fact({ value, unit, label, counts, k }) {
  const parts = /^([\d,]+)(.*)$/.exec(value);
  const animate = counts && parts;
  const [shown, ref] = useCountUp(animate ? Number(parts[1].replace(/,/g, '')) : 0, { duration: 1500 });
  const text = animate
    ? `${parts[1].includes(',') ? shown.toLocaleString('en-IN') : shown}${parts[2]}`
    : value;

  return (
    <div className="vp-ov-fact" ref={ref} style={{ '--k': k }}>
      <dt className="vp-ov-fact__label">{label}</dt>
      <dd className="vp-ov-fact__value">
        <span className="visually-hidden">{unit ? `${value} ${unit}` : value}</span>
        <span aria-hidden="true">{text}</span>
        {unit && <span className="vp-ov-fact__unit" aria-hidden="true">{unit}</span>}
      </dd>
    </div>
  );
}

/** The wide photograph drifts against the scroll; a site photo sits over it. */
function IntroArt() {
  const drift = useScrollProgress({ from: 1, to: 0 });

  return (
    <div className="vp-ov-intro__art">
      <Reveal className="vp-ov-intro__main vp-img-reveal">
        <div className="vp-ov-parallax" ref={drift}>
          {intro && (
            <img src={intro.src} srcSet={`${smallSrc(intro.src)} 1000w, ${intro.src} 1800w`}
                 sizes="(max-width: 992px) 100vw, 52vw" alt={intro.alt}
                 width="1800" height="1200" loading="lazy" decoding="async"
                 style={{ objectPosition: intro.focal }} />
          )}
        </div>
      </Reveal>
      {crewBay && (
        <Reveal as="figure" delay={260} className="vp-ov-intro__inset">
          <img src={crewBay.src} alt={crewBay.alt} width="800" height="600"
               loading="lazy" decoding="async" />
          <figcaption>{crewBay.caption}</figcaption>
        </Reveal>
      )}
    </div>
  );
}

const MORE = [
  {
    to: ROUTES.team, kind: 'team', kicker: 'Leadership', title: 'Meet our team',
    text: `${leadershipRoles} — ${leadershipNames}.`, cta: 'View the team',
  },
  {
    to: ROUTES.awards, kind: 'awards', kicker: 'Recognition', title: 'Awards',
    text: `${awards.length} industry awards and listings from ${awardYears.at(-1)} to ${awardYears[0]}, each shown with its certificate.`,
    cta: 'View the awards',
  },
  {
    to: ROUTES.projects, kind: 'projects', kicker: 'Track record', title: 'Projects',
    text: `${PROJECT_TOTAL} works executed for utilities, developers, producers and industrial consumers.`,
    cta: 'View the register',
  },
];

function CardMedia({ kind }) {
  if (kind === 'team') {
    return (
      <div className="vp-ov-card__media vp-ov-card__media--team" aria-hidden="true">
        {leadership.filter((l) => l.photo).map((l) => (
          <img key={l.id} src={l.photo} alt="" width="560" height="560" loading="lazy" decoding="async" />
        ))}
      </div>
    );
  }
  if (kind === 'awards') {
    return (
      <div className="vp-ov-card__media vp-ov-card__media--awards" aria-hidden="true">
        {FAN.map(({ award, k }) => (
          <img key={award.id} src={award.image} alt="" loading="lazy" decoding="async" style={{ '--k': k }} />
        ))}
      </div>
    );
  }
  return (
    <div className="vp-ov-card__media" aria-hidden="true">
      {crewAtHeight && (
        <img src={crewAtHeight.src} alt="" width="800" height="600" loading="lazy" decoding="async" />
      )}
    </div>
  );
}

export default function About() {
  const hero = getMedia('footprint');

  return (
    <div className="vp-ov-page">
      <Seo route={ROUTES.about} />

      {/* ---- hero: the promise, and the four figures behind it ---- */}
      <section className="vp-phero vp-phero--photo vp-ov-hero" aria-labelledby="ab-h">
        <div className="vp-phero__media" aria-hidden="true">
          {hero && (
            <img src={hero.src} srcSet={`${smallSrc(hero.src)} 1000w, ${hero.src} 1800w`}
                 sizes="100vw" alt="" fetchPriority="high" decoding="async"
                 style={{ objectPosition: hero.focal }} />
          )}
        </div>
        <div className="vp-phero__inner vp-container">
          <Reveal><span className="vp-eyebrow vp-label mb-3">Company overview</span></Reveal>
          <h1 id="ab-h" className="vp-phero__title">
            <RevealLines lines={['Connecting to a more', 'sustainable future.']} />
          </h1>
          <Reveal delay={160}>
            <p className="vp-lead vp-phero__lead mb-0">{company.overview}</p>
          </Reveal>
          <Reveal delay={280}>
            <dl className="vp-ov-facts">
              {FACTS.map((f, i) => (
                <Fact key={f.id} {...f} counts={f.id !== 'established'} k={i} />
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ---- who we are ---- */}
      <section className="vp-section vp-section--lg" aria-labelledby="who-h">
        <div className="vp-container">
          <h2 id="who-h" className="vp-eyebrow vp-label mb-4">Who we are</h2>
          <ScrollWords className="vp-ov-statement" text={journey[0]} />

          <div className="vp-ov-intro__grid">
            <IntroArt />
            <div className="vp-ov-intro__body">
              {journey.slice(1).map((para, i) => (
                <Reveal as="p" key={para.slice(0, 32)} delay={i * 120}>{para}</Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- how we got here ---- */}
      <section className="vp-section vp-bg-alt" aria-labelledby="jr-h">
        <div className="vp-container">
          <Journey id="jr-h" />
        </div>
      </section>

      {/* ---- vision & mission ---- */}
      <section className="vp-section vp-section--lg vp-bg-deep vp-on-dark-ground vp-ov-purpose"
               aria-labelledby="vi-h">
        <div className="vp-container">
          <h2 id="vi-h" className="vp-eyebrow vp-label mb-4">Our vision</h2>
          <RevealWords className="vp-ov-vision__text" text={vision} />

          <div className="vp-ov-mission">
            <h2 className="vp-eyebrow vp-label mb-0">Our mission</h2>
            <ol className="vp-ov-mission__list mt-4">
              {mission.map((m, i) => (
                <Reveal as="li" key={m} delay={i * 90} className="vp-ov-mission__item">
                  <span className="vp-ov-mission__n" aria-hidden="true">{pad(i + 1)}</span>
                  <p className="vp-ov-mission__t">{m}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---- core values ---- */}
      <section className="vp-section" aria-labelledby="val-h">
        <div className="vp-container">
          <div className="vp-ov-values">
            <Reveal className="vp-ov-values__head">
              <span className="vp-eyebrow vp-label mb-3">Core values</span>
              <h2 id="val-h" className="vp-h2 mb-3">What we hold to.</h2>
              <p className="vp-text-soft mb-0">Seven principles, in the company’s own words.</p>
            </Reveal>
            {values.map((v, i) => (
              <Reveal key={v.name} delay={((i + 1) % 4) * 90}>
                <article className="vp-ov-value" onPointerMove={trackPointer}>
                  <span className="vp-ov-value__n" aria-hidden="true">{pad(i + 1)}</span>
                  <span className="vp-ov-value__rule" aria-hidden="true" />
                  <h3 className="vp-ov-value__name">{v.name}</h3>
                  <p className="vp-ov-value__body">{v.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- what we do, and where ---- */}
      <section className="vp-section vp-bg-alt" aria-labelledby="wd-h">
        <div className="vp-container">
          <div className="vp-ov-work">
            <div>
              <Reveal>
                <span className="vp-eyebrow vp-label mb-3">What we do</span>
                <h2 id="wd-h" className="vp-h2 vp-measure-tight mb-3">
                  Six service lines across the power value chain.
                </h2>
                <p className="vp-lead vp-measure-lead mb-0">
                  Delivered individually or combined into a single engagement.
                </p>
              </Reveal>
              <ol className="vp-ov-lines">
                {capabilities.map((c, i) => (
                  <Reveal as="li" key={c.id} delay={i * 60}>
                    <Link className="vp-ov-line" to={ROUTES.services}>
                      <span className="vp-ov-line__n" aria-hidden="true">{c.index}</span>
                      <span className="vp-ov-line__name">{c.name}</span>
                      <span className="vp-ov-line__go" aria-hidden="true"><Arrow /></span>
                    </Link>
                  </Reveal>
                ))}
              </ol>
            </div>

            <Reveal delay={120}>
              <div className="vp-ov-reach vp-on-dark-ground">
                <span className="vp-eyebrow vp-label mb-3">Where we operate</span>
                <h3 className="vp-ov-reach__title">
                  Registered with three state load despatch centres, and with WRLDC.
                </h3>
                <ul className="vp-ov-reach__list">
                  {company.operatingAreas.map((a, i) => (
                    <li key={a.name}>
                      <span className="vp-ov-reach__dot" style={{ '--k': i }} aria-hidden="true" />
                      <span className="vp-ov-reach__name">{a.name}</span>
                      <span className="vp-ov-reach__basis">{a.basis}</span>
                    </li>
                  ))}
                </ul>
                <p className="vp-ov-reach__foot">
                  Forecasting and scheduling for solar, wind and hybrid generation.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- where to go next ---- */}
      <section className="vp-section" aria-labelledby="mo-h">
        <div className="vp-container">
          <SectionHead id="mo-h" eyebrow="Explore further"
                       titleClass="vp-ov-more-h"
                       title="The people, the recognition and the record." />
          <div className="vp-ov-more">
            {MORE.map((c, i) => (
              <Reveal key={c.to} delay={i * 110}>
                <Link to={c.to} className="vp-ov-card">
                  <CardMedia kind={c.kind} />
                  <div className="vp-ov-card__body">
                    <p className="vp-ov-card__kicker">{c.kicker}</p>
                    <h3 className="vp-ov-card__title">{c.title}</h3>
                    <p className="vp-ov-card__text">{c.text}</p>
                    <span className="vp-ov-card__go">{c.cta}<Arrow /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ClosingCTA />
    </div>
  );
}
