import { company } from '../data/company.js';
import { leadershipNames, leadershipRoles } from '../data/team.js';
import { PROJECT_TOTAL, voltageClasses } from '../data/projects.js';
import { getMedia, smallSrc } from '../data/media.js';
import { Button } from '../components/ui/Button.jsx';
import { Reveal, RevealLines } from '../components/ui/Reveal.jsx';
import { ROUTES } from '../constants/routes.js';
import '../styles/about.css';

/**
 * Careers.
 *
 * NO ROLE LIST, ON THE COMPANY'S INSTRUCTION.
 *
 * The company information document (§20) does name two openings, and this page
 * briefly published them. The company then asked for them to come off, so they
 * are gone — along with data/careers.js, rather than left in the codebase to be
 * re-rendered by accident.
 *
 * The page makes no claim in either direction now: it does not advertise roles,
 * and it does not assert that nothing is open. It gives the route in and says
 * what to send. If a vacancy list is wanted later, the source for it is §20.
 *
 * Everything here is drawn from the same verified modules the rest of the site
 * renders. Nothing states a salary, a benefit, a team size or a hiring
 * timetable, because no source supports one.
 */

/* The disciplines are the register's own categories, with the counts it
   carries. A candidate can verify every one of them on /projects/. */

/* "4 SLDC and regional areas" is accurate and reads as jargon. The register
   distinguishes the three state SLDCs from the Western Region load despatch
   centre, so the page says so in words. Split by the published basis, not by
   a hardcoded list. */
const STATE_AREAS = company.operatingAreas.filter((a) => /SLDC/i.test(a.basis));
const REGIONAL_AREAS = company.operatingAreas.filter((a) => !/SLDC/i.test(a.basis));


function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M5.2 2.5H3.1c-.6 0-1.1.5-1.1 1.1 0 5.5 4.4 9.9 9.9 9.9.6 0 1.1-.5 1.1-1.1v-2.1c0-.5-.3-.9-.8-1l-2-.5c-.4-.1-.9.1-1.1.5l-.5.9a7.6 7.6 0 0 1-3.3-3.3l.9-.5c.4-.2.6-.7.5-1.1l-.5-2c-.1-.5-.5-.8-1-.8Z"
        stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2.5" y="4.5" width="15" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 5.5 10 11l7-5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Careers() {
  /*
    A substation yard, not the control room.
    `cap-forecasting` was the first choice and is thematically better for
    careers, but its control-room monitors are near-white exactly where the h1
    sits: measured at 1440px, 21.6% of the headline area fell below 3:1, and
    even after the scrim was strengthened site-wide it was still 4.6%. Fixing
    that in the gradient alone would have meant darkening every other hero to
    flatten one image. This one measures 0.9% hot pixels in the type column
    against that image's 2.9%, with a much lower peak.
  */
  const hero = getMedia('cap-infrastructure');
  const mailto = `mailto:${company.emails.general}?subject=${encodeURIComponent('Application — Vedanjay Power')}`;

  return (
    <>
      <title>Careers — Vedanjay Power Pvt. Ltd.</title>
      <meta
        name="description"
        content={`Working at Vedanjay Power Pvt. Ltd. — ${PROJECT_TOTAL} executed engagements across forecasting and scheduling, EHV infrastructure, metering, telemetry and grid consultancy. Applications are read as they arrive.`}
      />
      <link rel="canonical" href={`${company.website.replace(/\/$/, '')}/careers/`} />

      <section className="vp-phero vp-phero--photo" aria-labelledby="cr-h">
        <div className="vp-phero__media" aria-hidden="true">
          {hero && (
            <img src={hero.src} srcSet={`${smallSrc(hero.src)} 1000w, ${hero.src} 1800w`}
                 sizes="100vw" alt="" fetchPriority="high" decoding="async"
                 style={{ objectPosition: hero.focal }} />
          )}
        </div>
        <div className="vp-phero__inner vp-container">
          <Reveal><span className="vp-eyebrow vp-label mb-3">Careers</span></Reveal>
          <h1 id="cr-h" className="vp-phero__title">
            <RevealLines lines={['Work that has to', 'hold on the grid.']} />
          </h1>
          <Reveal delay={140}>
            <p className="vp-lead vp-phero__lead mb-0">
              {PROJECT_TOTAL} executed engagements, up to {voltageClasses[0]}, for utilities,
              developers and independent producers — that is the work, and it is all on
              the record.
            </p>
          </Reveal>
        </div>
      </section>

      {/*
        First question first. A candidate arriving here wants to know whether
        anything is open before they read a word about the company, and a page
        that buries the answer under a culture statement wastes their time.
      */}
      <section className="vp-section" aria-labelledby="op-h">
        <div className="vp-container">
          <Reveal>
            <span className="vp-eyebrow vp-label mb-3">Applications</span>
            <h2 id="op-h" className="vp-h2 vp-measure-tight mb-3">Send us your CV.</h2>
            <p className="vp-lead vp-measure-lead mb-0">
              Applications are read as they arrive and kept on file against the work that
              comes in. A person reads every one.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <div className="vp-apply mt-4 mt-lg-5">
              <div className="vp-apply__body">
                <h3 className="vp-apply__t">What to send</h3>
                <p className="vp-apply__b">
                  A CV and a short note saying which side of the work interests you —
                  forecasting and scheduling, open access, metering and telemetry, or
                  electrical infrastructure. If a specific project or voltage class in our{' '}
                  <a href={ROUTES.projects}>register</a> is the reason you are writing, say
                  so; it tells us more than a covering letter.
                </p>
              </div>
              <div className="vp-apply__ways">
                {/* The general address — there is no separate recruitment mailbox, so
                    the subject line is prefilled to route it. */}
                <a className="vp-apply__way" href={mailto}>
                  <MailIcon />
                  <span>
                    <span className="vp-apply__wayLabel">Email</span>
                    <span className="vp-apply__wayValue">{company.emails.general}</span>
                  </span>
                </a>
                <a className="vp-apply__way" href={company.phone.href}>
                  <PhoneIcon />
                  <span>
                    <span className="vp-apply__wayLabel">Phone</span>
                    <span className="vp-apply__wayValue">{company.phone.display}</span>
                  </span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- onward ---- */}
      <section className="vp-section vp-section--flush-top" aria-label="More about Vedanjay Power">
        <div className="vp-container">
          <Reveal>
            <div className="vp-onward">
              <div className="vp-onward__card">
                <h3 className="vp-onward__t">Who you’d work with</h3>
                <p className="vp-onward__b">
                  {leadershipRoles} — {leadershipNames}.
                </p>
                <Button to={ROUTES.team} variant="ghost" size="sm" arrow>Meet our team</Button>
              </div>
              <div className="vp-onward__card">
                <h3 className="vp-onward__t">Where we operate</h3>
                <p className="vp-onward__b">
                  {company.offices.map((o) => o.city).join(' and ')} offices, with registered
                  operations in {STATE_AREAS.length} states{REGIONAL_AREAS.length > 0
                    && ` and the ${REGIONAL_AREAS.map((a) => a.name).join(', ')}`}.
                </p>
                <Button to={ROUTES.about} variant="ghost" size="sm" arrow>Company overview</Button>
              </div>
              <div className="vp-onward__card">
                <h3 className="vp-onward__t">What we’ve built</h3>
                <p className="vp-onward__b">
                  The full register of {PROJECT_TOTAL} works, filterable by discipline and
                  searchable by client.
                </p>
                <Button to={ROUTES.projects} variant="ghost" size="sm" arrow>Project register</Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="vp-band mt-5">
              <div>
                <h3 className="vp-band__title">Send us something</h3>
                <p className="vp-band__body">
                  A CV, the service line that interests you, and why. There is no form and
                  no portal — it goes to the same address as every other enquiry, and a
                  person reads it.
                </p>
              </div>
              <Button href={mailto} variant="primary" size="sm" arrow>Email your CV</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
