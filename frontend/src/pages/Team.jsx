import { Link } from 'react-router-dom';
import { getMedia, smallSrc } from '../data/media.js';
import { company } from '../data/company.js';
import { leadership, leadershipRoles } from '../data/team.js';
import { Button } from '../components/ui/Button.jsx';
import { Reveal, RevealLines } from '../components/ui/Reveal.jsx';
import '../styles/about.css';
import { Seo } from '../components/seo/Seo.jsx';
import { ROUTES } from '../constants/routes.js';

/**
 * Meet Our Team.
 *
 * Three cards: the photograph first, then the person.
 *
 * NOTHING HERE ADVERTISES WHAT IS MISSING. An earlier version carried a
 * standing note about biographies "to be published" and printed "LinkedIn
 * profile to be published" against each person without one. That is build-status
 * commentary: fine on a draft, and on a live site it just tells every visitor
 * what the company has not got round to. A card shows what exists.
 *
 * The company supplied all three LinkedIn profiles and two work addresses on
 * 8 Sep 2026, so the cards now carry them. The third address is absent, not
 * guessed: the two that exist follow different patterns (`gajanan.yadav@` and
 * `ankitayadav@`), and an invented address for a named person is a worse
 * failure than a missing one. That card simply shows one link instead of two.
 *
 * What is NOT here, and why, is documented in data/team.js: two legacy-only
 * staff whose current employment is unconfirmed, and personal mobile numbers
 * that should not sit on a public page.
 */
function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM2.4 9.5h5.16V21H2.4V9.5Zm7.2 0h4.95v1.57h.07c.69-1.24 2.38-2.05 4.1-2.05 4.38 0 5.19 2.68 5.19 6.17V21h-5.16v-5.13c0-1.22-.02-2.8-1.78-2.8-1.79 0-2.06 1.34-2.06 2.71V21H9.6V9.5Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5"
            stroke="currentColor" strokeWidth="1.8" />
      <path d="m3.5 7 8.5 6 8.5-6" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Team() {
  const hero = getMedia('grid-transmission');

  return (
    <>
      <Seo route={ROUTES.team} />

      <section className="vp-phero vp-phero--photo" aria-labelledby="tm-h">
        <div className="vp-phero__media" aria-hidden="true">
          {hero && (
            <img
              src={hero.src}
              srcSet={`${smallSrc(hero.src)} 1000w, ${hero.src} 1800w`}
              sizes="100vw" alt="" fetchPriority="high" decoding="async"
              style={{ objectPosition: hero.focal }}
            />
          )}
        </div>
        <div className="vp-phero__inner vp-container">
          <Reveal><span className="vp-eyebrow vp-label mb-3">About us · Leadership</span></Reveal>
          <h1 id="tm-h" className="vp-phero__title">
            <RevealLines lines={['The people behind', 'the operation.']} />
          </h1>
          <Reveal delay={140}>
            <p className="vp-lead vp-phero__lead mb-0">
              Vedanjay Power is led by its {leadershipRoles}, working across
              forecasting and scheduling, open access, electrical infrastructure and
              grid consultancy.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="vp-section" aria-labelledby="ld-h">
        <div className="vp-container">
          <h2 id="ld-h" className="vp-h2 vp-measure-tight mb-4">Leadership</h2>

          <div className="vp-team">
            {leadership.map((p, i) => (
              <article className="vp-tcard" key={p.id} style={{ '--i': i }}>
                <div className="vp-tcard__photo">
                  {/* `sizes` is the card's real width, so the browser stops
                      guessing 100vw and reserves the right box. The intrinsic
                      attributes stay 540x540 — the size the file actually is. */}
                  <img
                    src={p.photo}
                    alt={`${p.name}, ${p.role} of Vedanjay Power`}
                    sizes="(min-width: 1000px) 250px, (min-width: 640px) 42vw, 88vw"
                    width="560" height="560" loading="lazy" decoding="async"
                  />
                  <p className="vp-tcard__role">{p.role}</p>
                </div>

                <div className="vp-tcard__body">
                  <h3 className="vp-tcard__name">{p.name}</h3>
                  <span className="vp-tcard__rule" aria-hidden="true" />
                  {p.focus && <p className="vp-tcard__focus">{p.focus}</p>}

                  {/* Each rendered only when it exists. No placeholder, no
                      "to be published" — a card shows what there is. */}
                  {(p.linkedin || p.email) && (
                    <div className="vp-tcard__contact">
                      {p.linkedin && (
                        <a
                          className="vp-tcard__link"
                          href={p.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LinkedInIcon />
                          <span>LinkedIn</span>
                          <span className="visually-hidden">
                            {' '}profile for {p.name} (opens in a new tab)
                          </span>
                        </a>
                      )}
                      {p.email && (
                        <a className="vp-tcard__link" href={`mailto:${p.email}`}>
                          <MailIcon />
                          <span>Email</span>
                          <span className="visually-hidden">{' '}{p.name} at {p.email}</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      <section className="vp-section vp-section--flush-top" aria-labelledby="tc-h">
        <div className="vp-container">
          <Reveal>
            <div className="vp-band">
              <div>
                <h2 id="tc-h" className="vp-band__title">Speak to the team</h2>
                <p className="vp-band__body">
                  For anything outside a named contact above, our published company
                  channels reach the right desk. If you are looking to join the team,
                  see{' '}
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
