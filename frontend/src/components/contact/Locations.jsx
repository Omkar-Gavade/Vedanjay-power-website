import { useState } from 'react';
import { company } from '../../data/company.js';
import { Reveal } from '../ui/Reveal.jsx';
import { PinIcon, ExternalIcon } from './icons.jsx';

/**
 * Offices + map — moved ahead of the enquiry form and given a dark ground.
 *
 * Two reasons. Structurally, the form is ~2,000px tall, so anything after it is
 * effectively unseen; two real offices are a trust asset and were being buried.
 * Visually, this is the page's tonal contrast — without it the whole route is
 * bordered rectangles on one flat surface.
 *
 * Addresses come from data/company.js. No coordinates are invented: the map is
 * queried by the published address so Google's own geocoder resolves it and
 * drops its marker on the result.
 */

/**
 * Each office carries a verified `mapQuery` — the geocodable subset of its
 * published address (see data/company.js).
 *
 * The full address string does NOT work: passing "4/F/S3, Nai Sadak, Scheme
 * No. 78, …" makes Google fall back to an unmarked area view, which is exactly
 * the "map centred vaguely near the city" outcome to avoid. The trimmed query
 * returns a real marker for both offices. No coordinates are invented —
 * geocoding both addresses via Nominatim returned nothing usable for Indore and
 * a postcode-mismatched result for Pune, so asserting a lat/long would have
 * been a guess.
 */
const toQuery = (office) => office.mapQuery ?? office.lines.join(', ');

const embedUrl = (office) =>
  `https://www.google.com/maps?q=${encodeURIComponent(toQuery(office))}&hl=en&z=15&output=embed`;

const directionsUrl = (office) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(toQuery(office))}`;

export function Locations() {
  const [activeId, setActiveId] = useState(company.offices[0].id);
  const active = company.offices.find((o) => o.id === activeId) ?? company.offices[0];

  return (
    <section className="vp-section vp-locations vp-on-dark" aria-labelledby="loc-h">
      <div className="vp-container">
        <div className="row g-4 g-xl-5">
          <div className="col-12 col-lg-5">
            <Reveal>
              <span className="vp-eyebrow vp-label mb-3">Our locations</span>
              <h2 id="loc-h" className="vp-h2 vp-measure-tight mb-0">
                Two offices, one team.
              </h2>
              <p className="vp-lead vp-measure-lead mt-3 mb-0">
                Corporate office in Indore, branch office in Pune.
              </p>
            </Reveal>

            <Reveal delay={80}>
              {/* A radiogroup, not a list of toggles: exactly one office is
                  selected at a time, and arrow keys should move between them. */}
              <div className="vp-offices mt-4" role="radiogroup" aria-label="Select an office">
                {company.offices.map((office, i) => {
                  const selected = office.id === activeId;
                  return (
                    <button
                      key={office.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      tabIndex={selected ? 0 : -1}
                      className="vp-office"
                      onClick={() => setActiveId(office.id)}
                      onKeyDown={(e) => {
                        if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) return;
                        e.preventDefault();
                        const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
                        const next = company.offices[(i + dir + company.offices.length) % company.offices.length];
                        setActiveId(next.id);
                        e.currentTarget.parentElement
                          ?.querySelectorAll('.vp-office')[company.offices.indexOf(next)]?.focus();
                      }}
                    >
                      <span className="vp-office__head">
                        <span className="vp-office__pin" aria-hidden="true"><PinIcon /></span>
                        <span>
                          <span className="vp-office__city">{office.city}</span>
                          <span className="vp-office__role">{office.role}</span>
                        </span>
                      </span>
                      <address className="vp-office__addr">
                        {office.lines.map((line, li) => (
                          <span key={line}>{line}{li < office.lines.length - 1 && <br />}</span>
                        ))}
                      </address>
                    </button>
                  );
                })}
              </div>
            </Reveal>

            <Reveal delay={130}>
              <a
                className="vp-btn vp-btn--primary vp-btn--sm mt-3"
                href={directionsUrl(active)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Get directions</span>
                <ExternalIcon />
                <span className="visually-hidden">
                  {' '}to the {active.role} in {active.city} (opens in a new tab)
                </span>
              </a>
            </Reveal>
          </div>

          <div className="col-12 col-lg-7">
            <Reveal delay={110}>
              <figure className="vp-map mb-0">
                {/* `key` forces a fresh mount per office: mutating a cross-origin
                    iframe's src pushes history entries, so Back would otherwise
                    step through map states instead of leaving the page. */}
                <iframe
                  key={active.id}
                  src={embedUrl(active)}
                  title={`Map showing the Vedanjay Power ${active.role} at ${active.lines.join(', ')}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <figcaption className="vp-map__cap">
                  <span className="vp-map__dot" aria-hidden="true" />
                  {/* aria-live so switching office is announced, not silent. */}
                  <span aria-live="polite">
                    {active.city} — {active.role}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
