import { useDeferredValue, useId, useMemo, useRef, useState } from 'react';
import {
  portfolio, PORTFOLIO_TOTAL_MW, PORTFOLIO_COUNT,
  portfolioByState, unallocated, maxStateMw,
} from '../data/portfolio.js';
import { Button } from '../components/ui/Button.jsx';
import { Reveal, RevealLines } from '../components/ui/Reveal.jsx';
import { useCountUp } from '../hooks/useCountUp.js';
import { ROUTES } from '../constants/routes.js';
/* about.css carries the shared page-hero shell (.vp-phero), the filter/search
   controls, the result count and the CTA band; projects.css adds the portfolio
   pieces on top. The old register page imported about.css the same way. */
import '../styles/about.css';
import '../styles/projects.css';
import { Seo } from '../components/seo/Seo.jsx';

/**
 * Projects — the QCA / Forecasting & Scheduling PORTFOLIO, presented as cards.
 *
 * Data comes straight from data/portfolio.js (the deck's "Our Projects" table),
 * reused rather than duplicated. That module owns the 5,509.18 MW integrity
 * check, the per-state rollup and the one unresolved multi-state row, so nothing
 * is re-summed or re-typed here.
 *
 * A project's technology (Solar / Wind) is shown ONLY when the deck's own
 * project name states it — "Mundra Solar", "Juniper (Wind)", "JSW (Solar)". Rows
 * that do not name a technology get no badge rather than a guessed one, so the
 * Solar/Wind filters never claim a project the source does not.
 */

/* Card stagger is capped: past a dozen, a per-card delay lands long after the
   card is on screen and reads as lag rather than motion. */
const STAGGER_MS = 34;
const STAGGER_CAP = 11;

/** Technology, read only from the name the deck wrote. Never inferred. */
const techOf = (name) => {
  if (/wind/i.test(name)) return 'wind';
  if (/solar/i.test(name)) return 'solar';
  return null;
};

/** en-IN grouping, up to two decimals: 1232 → "1,232", 100.08 → "100.08". */
const fmtMw = (n) => n.toLocaleString('en-IN', { maximumFractionDigits: 2 });

/* Portfolio rows enriched once: a stable id, the derived technology, and the
   location string to display (the single state, or the multi-state note). */
const ITEMS = portfolio.map((p, i) => ({
  ...p,
  id: i,
  tech: techOf(p.name),
  region: p.state ?? p.note,
}));

const SOLAR_COUNT = ITEMS.filter((p) => p.tech === 'solar').length;
const WIND_COUNT = ITEMS.filter((p) => p.tech === 'wind').length;

/* Location options are generated from the data, largest state first. The
   unresolved multi-state row is deliberately not a location option — it has no
   single state to filter to. */
const LOCATIONS = portfolioByState.map((s) => s.state);

/* Facts for the coverage panel — all read from the data, never asserted. */
const MW_VALUES = portfolio.map((p) => p.mw);
const MIN_MW = Math.min(...MW_VALUES);
const MAX_MW = Math.max(...MW_VALUES);
const TOP_STATE = portfolioByState[0];

const TECH_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'solar', label: 'Solar' },
  { id: 'wind', label: 'Wind' },
];

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
/** The headline capacity figure, counted up in hundredths so the decimals are
 *  exact and it lands on 5,509.18 rather than a rounded integer. */
function TotalCapacity() {
  const [v, ref] = useCountUp(Math.round(PORTFOLIO_TOTAL_MW * 100), { duration: 1400 });
  const shown = (v / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  });
  return (
    <p className="vp-pfcap__num" ref={ref}>
      {shown}<span className="vp-pfcap__unit">MW</span>
    </p>
  );
}

/** A small animated counter card for the statistics band. */
function StatCard({ target, label, note }) {
  const [v, ref] = useCountUp(target);
  return (
    <div className="vp-pstat">
      <span className="vp-pstat__num" ref={ref}>{v}</span>
      <span className="vp-pstat__label">{label}</span>
      {note && <span className="vp-pstat__note">{note}</span>}
    </div>
  );
}

export default function Projects() {
  const [tech, setTech] = useState('all');
  const [loc, setLoc] = useState('all');
  const [query, setQuery] = useState('');
  const searchId = useId();
  const locId = useId();
  const searchRef = useRef(null);

  /* The list re-renders on the deferred value, so typing stays responsive. */
  const deferred = useDeferredValue(query);

  const rows = useMemo(() => {
    const q = deferred.trim().toLowerCase();
    return ITEMS.filter((p) => (
      (tech === 'all' || p.tech === tech)
      && (loc === 'all' || p.state === loc)
      && (q === '' || p.name.toLowerCase().includes(q))
    ));
  }, [tech, loc, deferred]);

  const filtered = tech !== 'all' || loc !== 'all' || deferred.trim() !== '';
  const listKey = `${tech}:${loc}:${deferred}`;

  const reset = () => { setTech('all'); setLoc('all'); setQuery(''); };

  return (
    <>
      <Seo route={ROUTES.projects} />

      {/* ---------------------------------------------------------------- HERO
          Class stays `vp-phero` so the header's transparent-over-hero logic
          still finds it; the `--portfolio` modifier swaps the photograph for a
          gradient + energy-line treatment. */}
      <section className="vp-phero vp-phero--portfolio" aria-labelledby="pj-h">
        <div className="vp-pfhero__art" aria-hidden="true">
          {/* Existing site photograph, dimmed under the gradient so it reads as
              texture behind the type rather than a full-bleed stock hero. */}
          <img
            className="vp-pfhero__photo"
            src="/images/sm/proj-hero-solar.jpg"
            sizes="100vw" alt="" fetchPriority="high" decoding="async"
          />
          <svg className="vp-pfhero__grid" viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="pf-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#40A040" stopOpacity="0" />
                <stop offset=".5" stopColor="#40A040" stopOpacity=".9" />
                <stop offset="1" stopColor="#40A040" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Faint engineering grid */}
            <g className="vp-pfhero__mesh">
              {Array.from({ length: 13 }, (_, i) => (
                <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="500" />
              ))}
              {Array.from({ length: 6 }, (_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 100} x2="1200" y2={i * 100} />
              ))}
            </g>
            {/* Power-line pulses travelling left to right */}
            <g stroke="url(#pf-line)" strokeWidth="1.5" fill="none">
              <path className="vp-pfhero__pulse" style={{ '--d': '0s' }} d="M-200 140 H1400" />
              <path className="vp-pfhero__pulse" style={{ '--d': '1.1s' }} d="M-200 300 H1400" />
              <path className="vp-pfhero__pulse" style={{ '--d': '2.2s' }} d="M-200 380 H1400" />
            </g>
          </svg>
        </div>

        <div className="vp-phero__inner vp-container">
          <Reveal><span className="vp-eyebrow vp-label mb-3">Project Portfolio</span></Reveal>
          <h1 id="pj-h" className="vp-phero__title">
            <RevealLines lines={['Our Projects']} />
          </h1>
          <Reveal delay={140}>
            <p className="vp-lead vp-phero__lead mb-0">
              Vedanjay Power supports and manages renewable-energy projects across
              multiple Indian regions. This portfolio reflects our work in renewable
              energy, power scheduling and forecasting, QCA / F&amp;S and related
              power-sector services.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------- STATISTICS */}
      <section className="vp-section vp-pf-stats" aria-labelledby="pf-stats-h">
        <div className="vp-container">
          <Reveal>
            <span className="vp-eyebrow vp-label mb-3">Portfolio at a glance</span>
            <h2 id="pf-stats-h" className="vp-h2 vp-pf-h2 vp-measure-tight mb-4">
              What the portfolio covers
            </h2>
          </Reveal>
          <Reveal delay={60}>
            <div className="vp-pstats">
              <div className="vp-pstat vp-pstat--lead">
                <TotalCapacity />
                <span className="vp-pstat__label">Total project capacity</span>
                <span className="vp-pstat__note">Across a diverse renewable portfolio</span>
              </div>
              <StatCard target={PORTFOLIO_COUNT} label="Projects" note="In the portfolio" />
              <StatCard target={LOCATIONS.length} label="States" note="Single-state projects" />
              <StatCard target={SOLAR_COUNT} label="Solar projects" note="Named in the record" />
              <StatCard target={WIND_COUNT} label="Wind projects" note="Named in the record" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------- THE CARDS */}
      <section className="vp-section vp-section--flush-top" aria-labelledby="pf-list-h">
        <div className="vp-container">
          <Reveal>
            <span className="vp-eyebrow vp-label mb-3">The record</span>
            <h2 id="pf-list-h" className="vp-h2 vp-pf-h2 vp-measure-tight mb-4">
              Explore the portfolio
            </h2>
          </Reveal>

          <Reveal delay={40}>
            <div className="vp-pfbar">
              <div className="vp-filters" role="group" aria-label="Filter projects by technology">
                {TECH_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="vp-filter"
                    aria-pressed={tech === f.id}
                    onClick={() => setTech(f.id)}
                  >
                    {f.label}
                    {f.id !== 'all' && (
                      <span className="vp-filter__n">
                        {f.id === 'solar' ? SOLAR_COUNT : WIND_COUNT}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="vp-pfselect">
                <label htmlFor={locId} className="visually-hidden">Filter by location</label>
                <select
                  id={locId}
                  className="vp-pfselect__input"
                  value={loc}
                  onChange={(e) => setLoc(e.target.value)}
                >
                  <option value="all">All locations</option>
                  {LOCATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="vp-search">
                <label htmlFor={searchId} className="visually-hidden">Search projects by name</label>
                <span className="vp-search__icon" aria-hidden="true"><SearchIcon /></span>
                <input
                  id={searchId}
                  ref={searchRef}
                  type="search"
                  className="vp-search__input"
                  placeholder="Search projects…"
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
          </Reveal>

          <p className="vp-regcount" role="status">
            {rows.length === PORTFOLIO_COUNT
              ? `All ${PORTFOLIO_COUNT} projects`
              : `${rows.length} of ${PORTFOLIO_COUNT} projects`}
            {filtered && (
              <button type="button" className="vp-regcount__reset" onClick={reset}>
                Clear filters
              </button>
            )}
          </p>

          {rows.length === 0 ? (
            <div className="vp-reg__empty">
              <p className="mb-2"><strong>No project matches your filters.</strong></p>
              <p className="mb-0">Try a different technology, location or search term.</p>
            </div>
          ) : (
            <div className="vp-ptable-wrap">
              <table className="vp-ptable" key={listKey}>
                <caption className="visually-hidden">
                  Renewable-energy project portfolio, {rows.length} of {PORTFOLIO_COUNT} projects
                </caption>
                <thead>
                  <tr>
                    <th scope="col" className="vp-ptable__hname">Project</th>
                    <th scope="col">Technology</th>
                    <th scope="col" className="vp-ptable__hcap">Capacity</th>
                    <th scope="col">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p, i) => (
                    <tr
                      className="vp-ptr"
                      key={p.id}
                      data-tech={p.tech ?? undefined}
                      style={{ '--i': Math.min(i, STAGGER_CAP), '--stagger': `${STAGGER_MS}ms` }}
                    >
                      <th scope="row" className="vp-ptd-name">{p.name}</th>
                      <td>
                        {p.tech ? (
                          <span className="vp-pcard__badge" data-tech={p.tech}>
                            {p.tech === 'solar' ? 'Solar' : 'Wind'}
                          </span>
                        ) : (
                          <span className="vp-pcard__badge vp-pcard__badge--muted">Renewable</span>
                        )}
                      </td>
                      <td className="vp-ptd-cap">
                        <span className="vp-ptd-cap__num">{fmtMw(p.mw)}</span>
                        <span className="vp-ptd-cap__unit">MW</span>
                      </td>
                      <td className="vp-ptd-loc">{p.region}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* --------------------------------------------- GEOGRAPHIC PRESENCE */}
      <section className="vp-section vp-section--flush-top vp-pf-geo" aria-labelledby="pf-geo-h">
        <div className="vp-container">
          <Reveal>
            <span className="vp-eyebrow vp-label mb-3">Renewable-energy footprint</span>
            <h2 id="pf-geo-h" className="vp-h2 vp-pf-h2 vp-measure-tight mb-4">Project presence</h2>
          </Reveal>

          <Reveal delay={60}>
            <ul className="vp-geo list-unstyled mb-0">
              {portfolioByState.map((s, i) => (
                <li className="vp-geo__item" key={s.state} style={{ '--i': i }}>
                  <span className="vp-geo__rank" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <div className="vp-geo__top">
                    <span className="vp-geo__state">{s.state}</span>
                    <span className="vp-geo__count">{s.count} {s.count === 1 ? 'project' : 'projects'}</span>
                  </div>
                  <p className="vp-geo__mw">
                    <span className="vp-geo__mw-num">{fmtMw(s.mw)}</span>
                    <span className="vp-geo__mw-unit">MW</span>
                  </p>
                  <div className="vp-geo__track" aria-hidden="true">
                    <span className="vp-geo__bar" style={{ '--w': `${(s.mw / maxStateMw) * 100}%`, '--i': i }} />
                  </div>
                </li>
              ))}
              {unallocated && (
                <li className="vp-geo__item vp-geo__item--multi" style={{ '--i': portfolioByState.length }}>
                  <span className="vp-geo__rank" aria-hidden="true">★</span>
                  <div className="vp-geo__top">
                    <span className="vp-geo__state">{unallocated.name}</span>
                    <span className="vp-geo__count">Multi-state</span>
                  </div>
                  <p className="vp-geo__mw">
                    <span className="vp-geo__mw-num">{fmtMw(unallocated.mw)}</span>
                    <span className="vp-geo__mw-unit">MW</span>
                  </p>
                  <p className="vp-geo__note mb-0">{unallocated.note}</p>
                </li>
              )}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------- PORTFOLIO INSIGHT */}
      <section className="vp-section vp-section--flush-top" aria-labelledby="pf-insight-h">
        <div className="vp-container">
          <div className="vp-pf-insight">
            <div className="vp-pf-insight__text">
              <Reveal>
                <span className="vp-eyebrow vp-label mb-3">Portfolio coverage</span>
                <h2 id="pf-insight-h" className="vp-h2 vp-pf-h2 vp-measure-tight mb-3">
                  A diverse renewable-energy portfolio.
                </h2>
              </Reveal>
              <Reveal delay={80}>
                <p className="vp-lead mb-0">
                  The portfolio spans a wide range of project capacities and multiple Indian
                  power markets — solar and wind assets across {LOCATIONS.length} states.
                  Together it demonstrates Vedanjay Power's involvement across renewable-energy
                  projects and its experience coordinating forecasting, scheduling and QCA /
                  F&amp;S work at scale.
                </p>
              </Reveal>
            </div>

            {/* Right column — a compact panel of facts read straight from the
                data, so the section reads as two balanced columns. */}
            <Reveal delay={120} className="vp-pf-insight__panel">
              <dl className="vp-pf-facts">
                <div className="vp-pf-fact">
                  <dt>Capacity range</dt>
                  <dd>{fmtMw(MIN_MW)} – {fmtMw(MAX_MW)} <span className="vp-pf-fact__u">MW</span></dd>
                </div>
                <div className="vp-pf-fact">
                  <dt>Largest single state</dt>
                  <dd>{TOP_STATE.state} <span className="vp-pf-fact__u">{fmtMw(TOP_STATE.mw)} MW</span></dd>
                </div>
                <div className="vp-pf-fact">
                  <dt>Solar / Wind named</dt>
                  <dd>{SOLAR_COUNT} <span className="vp-pf-fact__u">solar</span> · {WIND_COUNT} <span className="vp-pf-fact__u">wind</span></dd>
                </div>
                <div className="vp-pf-fact">
                  <dt>States covered</dt>
                  <dd>{LOCATIONS.length} <span className="vp-pf-fact__u">+ 1 multi-state</span></dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------- TOTAL CAPACITY BANNER */}
      <section className="vp-section vp-section--flush-top" aria-labelledby="pf-cap-h">
        <div className="vp-container">
          <Reveal>
            <div className="vp-pfcap">
              <img
                className="vp-pfcap__photo" aria-hidden="true"
                src="/images/proj-solar-field.jpg"
                srcSet="/images/sm/proj-solar-field.jpg 1000w, /images/proj-solar-field.jpg 1800w"
                sizes="100vw" alt="" decoding="async"
              />
              <div className="vp-pfcap__pattern" aria-hidden="true" />
              <div className="vp-pfcap__inner">
                <span className="vp-eyebrow vp-label vp-pfcap__eyebrow mb-3">Portfolio capacity</span>
                <h2 id="pf-cap-h" className="visually-hidden">Total project capacity</h2>
                <TotalCapacity />
                <p className="vp-pfcap__sub mb-0">
                  Across a diverse renewable-energy project portfolio.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------- CTA */}
      <section className="vp-section vp-section--flush-top" aria-labelledby="pf-cta-h">
        <div className="vp-container">
          <Reveal>
            <div className="vp-band vp-pf-cta">
              <div>
                <h2 id="pf-cta-h" className="vp-band__title">
                  Planning your next renewable-energy project?
                </h2>
                <p className="vp-band__body">
                  Talk to us about renewable energy, forecasting, QCA / F&amp;S, open access,
                  grid and power-sector requirements.
                </p>
              </div>
              <Button to={ROUTES.contact} variant="primary" size="md" arrow>Talk to our team</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
