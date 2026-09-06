import { useDeferredValue, useEffect, useId, useMemo, useRef, useState } from 'react';
import { company } from '../data/company.js';
import {
  projects, PROJECT_TOTAL, projectCategories, countFor, filterProjects,
  voltageClasses, repeatClients,
} from '../data/projects.js';
import { getMedia, smallSrc } from '../data/media.js';
import { Button } from '../components/ui/Button.jsx';
import { Figure } from '../components/ui/Figure.jsx';
import { Reveal, RevealLines } from '../components/ui/Reveal.jsx';
import { RegisterMix } from '../components/projects/RegisterMix.jsx';
import { ROUTES } from '../constants/routes.js';
import '../styles/about.css';

/**
 * Projects — the full 52-entry register, filterable and searchable.
 *
 * Presented as a register rather than as case studies, because that is what the
 * source supports: no entry states a date, duration or contract value, so none
 * is shown. Capacities are listed only where the record names them, and they
 * are deliberately NOT summed — adding up part of a register would manufacture
 * a statistic the source does not carry.
 */

/* The stagger is capped. At 45 ms a row, entry 52 would begin animating 2.3 s
   after the list appears — long past the point the visitor has scrolled to it,
   so it would read as a broken page rather than as motion. */
const STAGGER_MS = 38;
const STAGGER_CAP = 12;

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function ClearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function OrgIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 14h12M3.5 14V3.2c0-.4.3-.7.7-.7h4.1c.4 0 .7.3.7.7V14M9 14V6.6c0-.4.3-.7.7-.7h2.1c.4 0 .7.3.7.7V14"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.4 5.2h1.4M5.4 7.6h1.4M5.4 10h1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export default function Projects() {
  const hero = getMedia('cap-gridstudies');
  const [cat, setCat] = useState('all');
  const [query, setQuery] = useState('');
  const searchId = useId();
  const searchRef = useRef(null);

  /* Typing stays responsive on a 52-row list because the expensive re-render is
     driven by the deferred value, not the input's own state. */
  const deferred = useDeferredValue(query);
  const rows = useMemo(() => filterProjects(cat, deferred), [cat, deferred]);
  const label = projectCategories.find((c) => c.id === cat);
  const filtered = cat !== 'all' || deferred.trim() !== '';

  /* Re-key the list so the stagger replays when the result set changes — a
     silent swap of 52 rows gives no signal that the filter did anything. */
  const listKey = `${cat}:${deferred}`;

  /* A category count is the count of that category alone; with a search active
     it would be a lie about what is on screen. */
  const showCounts = deferred.trim() === '';

  useEffect(() => {
    if (query === '') return undefined;
    /* Escape clears the search from anywhere on the page, the convention for a
       filter that changes what is displayed below it. */
    const onKey = (e) => {
      if (e.key === 'Escape') { setQuery(''); searchRef.current?.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [query]);

  return (
    <>
      <title>Projects — Vedanjay Power Pvt. Ltd.</title>
      <meta
        name="description"
        content={`A register of ${PROJECT_TOTAL} works executed by Vedanjay Power Pvt. Ltd. across electrical infrastructure, liaisoning, operation and maintenance and civil works.`}
      />
      <link rel="canonical" href={`${company.website.replace(/\/$/, '')}/projects/`} />

      <section className="vp-phero vp-phero--photo" aria-labelledby="pj-h">
        <div className="vp-phero__media" aria-hidden="true">
          {hero && (
            <img src={hero.src} srcSet={`${smallSrc(hero.src)} 1000w, ${hero.src} 1800w`}
                 sizes="100vw" alt="" fetchPriority="high" decoding="async"
                 style={{ objectPosition: hero.focal }} />
          )}
        </div>
        <div className="vp-phero__inner vp-container">
          <Reveal><span className="vp-eyebrow vp-label mb-3">Projects</span></Reveal>
          <h1 id="pj-h" className="vp-phero__title">
            <RevealLines lines={['A register of', 'work executed.']} />
          </h1>
          <Reveal delay={140}>
            <p className="vp-lead vp-phero__lead mb-0">
              {PROJECT_TOTAL} engagements for transmission utilities, wind and solar
              developers, producers and industrial consumers.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- what the register evidences ---- */}
      <section className="vp-section vp-stats" aria-labelledby="pf-h">
        <div className="vp-container">
          <Reveal>
            <span className="vp-eyebrow vp-label mb-3">Evidence</span>
            <h2 id="pf-h" className="vp-h2 vp-measure-tight mb-4">What the record shows</h2>
          </Reveal>

          <Reveal delay={60}>
            <div className="vp-figures">
              <Figure value={String(PROJECT_TOTAL)} label="Works executed" note="Every entry below" />
              <Figure value="220" unit="kV" label="Highest class evidenced" note="Named in the record" />
              {repeatClients.slice(0, 3).map((c) => (
                <Figure key={c.name} value={String(c.orders)} label={`Orders — ${c.name}`} note="Repeat client" />
              ))}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <p className="vp-sourcenote">
              Voltage classes evidenced: {voltageClasses.join(' · ')}. Repeat orders are
              grouped by parent organisation across its named entities and circles.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- the register ---- */}
      <section className="vp-section vp-section--flush-top" aria-labelledby="pr-h">
        <div className="vp-container">
          <Reveal>
            <span className="vp-eyebrow vp-label mb-3">The record</span>
            <h2 id="pr-h" className="vp-h2 vp-measure-tight mb-4">The register</h2>
          </Reveal>

          {/*
            Sticky, because the controls are useless once the visitor is forty
            rows down and cannot see what is filtering the list.
          */}
          <Reveal delay={40}>
            <RegisterMix active={cat} onPick={setCat} />
          </Reveal>

          <div className="vp-regbar">
            <div className="vp-filters" role="group" aria-label="Filter the register by category">
              {projectCategories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="vp-filter"
                  data-cat={c.id}
                  aria-pressed={cat === c.id}
                  onClick={() => setCat(c.id)}
                >
                  {c.label}
                  {showCounts && <span className="vp-filter__n">{countFor(c.id)}</span>}
                </button>
              ))}
            </div>

            <div className="vp-search">
              <label htmlFor={searchId} className="visually-hidden">
                Search the register by work, scope or client
              </label>
              <span className="vp-search__icon" aria-hidden="true"><SearchIcon /></span>
              <input
                id={searchId}
                ref={searchRef}
                type="search"
                className="vp-search__input"
                placeholder="Search work or client…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
              />
              {query !== '' && (
                <button
                  type="button"
                  className="vp-search__clear"
                  onClick={() => { setQuery(''); searchRef.current?.focus(); }}
                  aria-label="Clear search"
                >
                  <ClearIcon />
                </button>
              )}
            </div>
          </div>

          {label?.blurb && !deferred.trim() && (
            <p className="vp-sourcenote mt-0 mb-3">{label.blurb}</p>
          )}

          {/*
            The count is visible, not only announced. It was previously in a
            `visually-hidden` status, so a sighted visitor filtering a 52-row
            list had no confirmation of how much they had narrowed it to.
            `role="status"` keeps the announcement for screen readers.
          */}
          <p className="vp-regcount" role="status">
            {rows.length === PROJECT_TOTAL
              ? `All ${PROJECT_TOTAL} entries`
              : `${rows.length} of ${PROJECT_TOTAL} entries`}
            {filtered && (
              <button type="button" className="vp-regcount__reset" onClick={() => { setCat('all'); setQuery(''); }}>
                Clear filters
              </button>
            )}
          </p>

          {rows.length === 0 ? (
            <div className="vp-reg__empty">
              <p className="mb-2"><strong>No entry matches “{deferred.trim()}”.</strong></p>
              <p className="mb-0">
                The register records the work as it was contracted, so try an organisation
                name or a term like “telemetry”, “bay” or “CEIG”.
              </p>
            </div>
          ) : (
            <ul className="vp-reg list-unstyled mb-0" key={listKey}>
              {rows.map((p, i) => (
                <li
                  key={p.id}
                  className="vp-rcard"
                  data-cat={p.category}
                  style={{ '--i': Math.min(i, STAGGER_CAP), '--stagger': `${STAGGER_MS}ms` }}
                >
                  {/* The register's own numbering, set large and ghosted. It is
                      the entry's identity in the source document, so it earns
                      the space — and it gives 52 otherwise-similar cards
                      something to be told apart by at a glance. */}
                  <span className="vp-rcard__n" aria-hidden="true">
                    {String(p.id).padStart(2, '0')}
                  </span>

                  <div className="vp-rcard__top">
                    {p.voltage && <span className="vp-rcard__kv">{p.voltage}</span>}
                  </div>

                  <h3 className="vp-rcard__what">{p.particulars}</h3>
                  {p.scope !== p.particulars && <p className="vp-rcard__scope">{p.scope}</p>}

                  <span className="vp-rcard__rule" aria-hidden="true" />

                  <p className="vp-rcard__client">
                    <OrgIcon />
                    <span>{p.client}</span>
                  </p>

                  <span className="vp-rcard__cat">
                    {projectCategories.find((c) => c.id === p.category)?.label}
                  </span>
                </li>
              ))}
            </ul>
          )}

        </div>
      </section>

      {/* ---- onward ---- */}
      <section className="vp-section vp-section--flush-top" aria-label="Image gallery">
        <div className="vp-container">
          <Reveal>
            <div className="vp-band mt-5">
              <div>
                <h3 className="vp-band__title">See the work</h3>
                <p className="vp-band__body">
                  Photography of the infrastructure types this register covers.
                </p>
              </div>
              <Button to={ROUTES.gallery} variant="primary" size="sm" arrow>Image gallery</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
