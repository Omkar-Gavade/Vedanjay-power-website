import { company } from '../data/company.js';
import { partners, partnerGroups } from '../data/partners.js';
import { achievements } from '../data/about.js';
import { capabilities } from '../data/capabilities.js';
import { getMedia, smallSrc } from '../data/media.js';
import { Button } from '../components/ui/Button.jsx';
import { Reveal, RevealLines } from '../components/ui/Reveal.jsx';
import { ROUTES } from '../constants/routes.js';
import '../styles/about.css';

/**
 * Partners.
 *
 * WHAT CHANGED, 5 Sep 2026.
 * This page used to set the names in type because the marks had not been
 * cleared for use, and later showed each logo on its own bordered white plate —
 * which turned the listing into a grid of cards. Both are gone.
 *
 * The marks are now keyed to transparency and laid on ONE sheet per group,
 * divided by hairlines rather than boxed individually: a contact sheet, not a
 * card grid. Nothing here carries a per-item border, radius or shadow.
 *
 * They are greyed at rest and take colour on hover. That is not decoration —
 * twenty-two marks of different vintage, weight and palette do not sit together
 * at full saturation, and greying them is what makes the wall read as one thing.
 *
 * The source is still a logo wall, so this page still states no scope, dates,
 * contract values or status for any relationship. The provenance and the limits
 * of that source are recorded in data/partners.js; they used to be printed at
 * the top of the page as a standing disclaimer, which made the first thing a
 * visitor read a list of what the page would not tell them.
 *
 * ENERCAST LEADS. It is the one technology partnership rather than a
 * counterparty, and the one entry with no mark — so it opens the page as a
 * statement instead of trailing the logo walls as an oddity.
 */

/** Zero-padded so the group numerals sit in a column of even width. */
const ordinal = (i) => String(i + 1).padStart(2, '0');

export default function Partners() {
  const hero = getMedia('cap-openaccess');
  const qca = capabilities.find((c) => c.id === 'qca');

  /* A group earns a sheet only if it has artwork to put on one. */
  const walls = partnerGroups.filter((g) => g.members.some((p) => p.logo));
  /* ENERCAST — named in the IRD, no mark supplied. Set as a statement below. */
  const unmarked = partners.filter((p) => !p.logo);
  const enercast = achievements.find((a) => a.body.includes('ENERCAST'));

  return (
    <>
      <title>Partners — Vedanjay Power Pvt. Ltd.</title>
      <meta
        name="description"
        content={`${partners.length} organisations named on Vedanjay Power's published partner listing — renewable developers, utilities and energy majors, and engineering institutions.`}
      />
      <link rel="canonical" href={`${company.website.replace(/\/$/, '')}/about/partners/`} />

      <section className="vp-phero vp-phero--photo" aria-labelledby="pt-h">
        <div className="vp-phero__media" aria-hidden="true">
          {hero && (
            <img src={hero.src} srcSet={`${smallSrc(hero.src)} 1000w, ${hero.src} 1800w`}
                 sizes="100vw" alt="" fetchPriority="high" decoding="async"
                 style={{ objectPosition: hero.focal }} />
          )}
        </div>
        <div className="vp-phero__inner vp-container">
          <Reveal><span className="vp-eyebrow vp-label mb-3">About us · Partners</span></Reveal>
          <h1 id="pt-h" className="vp-phero__title">
            <RevealLines lines={['The organisations', 'we work with.']} />
          </h1>
          <Reveal delay={140}>
            <p className="vp-lead vp-phero__lead mb-0">
              {partners.length} named on our published partner listing — developers and
              independent producers, utilities and energy majors, and engineering
              institutions.
            </p>
          </Reveal>
        </div>
      </section>

      {unmarked.length > 0 && (
        <section className="vp-section vp-section--tight-top" aria-labelledby="tp-h">
          <div className="vp-container">
            <Reveal>
              <div className="vp-tpartner">
                <div>
                  <span className="vp-tpartner__role">{unmarked[0].group}</span>
                  <h2 id="tp-h" className="vp-tpartner__name">{unmarked[0].name}</h2>
                </div>
                <p className="vp-tpartner__body">
                  {enercast?.body ?? 'Named on the company’s published record of achievements.'}
                  {' '}No mark was supplied for this listing, so the name is set in type.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {walls.map((g, gi) => (
        <section className="vp-section vp-section--flush-top" key={g.group} aria-label={g.group}>
          <div className="vp-container">
            <div className="vp-edcol">
              <Reveal className="vp-edcol__aside">
                <span className="vp-edcol__num">{ordinal(gi)}</span>
                <h2 className="vp-edcol__title">{g.group}</h2>
                <p className="vp-edcol__meta">
                  {g.members.length} {g.members.length === 1 ? 'organisation' : 'organisations'}
                </p>
              </Reveal>

              <div className="vp-pwall__plate">
                <ul className="vp-pwall__grid">
                  {g.members.map((p, i) => (
                    <li className="vp-pwall__cell" key={p.name} style={{ '--i': i }}>
                      {/* The mark carries the name for anyone who cannot see it,
                          so the caption beneath is decorative and hidden from
                          assistive tech rather than read out twice. */}
                      <img
                        className="vp-pwall__mark"
                        src={p.logo}
                        alt={p.name}
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="vp-pwall__name" aria-hidden="true">{p.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}


      <section className="vp-section vp-section--flush-top" aria-labelledby="wk-h">
        <div className="vp-container">
          <Reveal>
            <span className="vp-eyebrow vp-label mb-3">What we do for them</span>
            <h2 id="wk-h" className="vp-h2 vp-measure-tight mb-4">{qca.name}.</h2>
          </Reveal>
          <Reveal delay={60}>
            <ul className="vp-svc__services list-unstyled">
              {qca.services.map((sv, k) => (
                <li key={sv.name} style={{ '--i': k }}>
                  <p className="vp-svc__serviceName">{sv.name}</p>
                  <p className="vp-svc__serviceBody">{sv.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={90}>
            <div className="vp-band mt-5">
              <div>
                <h3 className="vp-band__title">Work with us</h3>
                <p className="vp-band__body">
                  Tell us about your portfolio and the right team will respond.
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
