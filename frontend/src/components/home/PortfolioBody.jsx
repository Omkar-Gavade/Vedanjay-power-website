import { ROUTES } from '../../constants/routes.js';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { company } from '../../data/company.js';
import {
  portfolioByState, maxStateMw, unallocated,
  PORTFOLIO_TOTAL_MW, PORTFOLIO_COUNT,
} from '../../data/portfolio.js';
import { SectionHead } from '../ui/SectionHead.jsx';
import { Reveal } from '../ui/Reveal.jsx';
import IndiaMap from './IndiaMap.jsx';
import '../../styles/map.css';

/**
 * Portfolio under QCA / Forecasting & Scheduling, as a map.
 *
 * The figures are the deck's own "Our Projects" table — see data/portfolio.js,
 * whose rows are asserted against the total the deck prints at the foot of it.
 *
 * NOTE THIS IS NOT THE PROJECT REGISTER. data/projects.js holds 52 rows of
 * execution work (feeder bays, O&M, civil) which record a client and no
 * location. The two are different bodies of work and are never summed.
 */

const mw = (n) => n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

/* Registrations are a separate fact from where capacity sits, and the two do
   not coincide — the portfolio includes states outside the three SLDC
   registrations. Stated side by side rather than merged. */
const sldc = company.operatingAreas.filter((a) => a.basis.includes('SLDC')).map((a) => a.name);

export default function PortfolioBody() {
  const [active, setActive] = useState(null);

  return (
    <div className="vp-container">
      <SectionHead
        id="map-h"
        eyebrow="Interactive portfolio map"
        title="Portfolio under QCA / Forecasting & Scheduling."
        lead={`${mw(PORTFOLIO_TOTAL_MW)} MW across ${PORTFOLIO_COUNT} renewable projects, forecast and scheduled from ${portfolioByState.length} states.`}
      />

      <div className="vp-mapwrap mt-4 mt-lg-5">
        <Reveal className="vp-mapwrap__figure">
          <IndiaMap
            byState={portfolioByState}
            maxMw={maxStateMw}
            active={active}
            onPick={setActive}
          />
        </Reveal>

        <Reveal delay={90} className="vp-mapwrap__aside">
          <p className="vp-maplede">
            <span className="vp-maplede__n">{mw(PORTFOLIO_TOTAL_MW)}</span>
            <span className="vp-maplede__u">MW</span>
            <span className="vp-maplede__l">
              under forecasting &amp; scheduling, across {PORTFOLIO_COUNT} projects
            </span>
          </p>

          <ul className="vp-mapbars">
            {portfolioByState.map((s, i) => (
              <li key={s.state}>
                <button
                  type="button"
                  className="vp-mapbar"
                  aria-pressed={active === s.state}
                  onMouseEnter={() => setActive(s.state)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(s.state)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive(active === s.state ? null : s.state)}
                >
                  <span className="vp-mapbar__rank" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="vp-mapbar__state">{s.state}</span>
                  <span className="vp-mapbar__mw">{mw(s.mw)}<span>MW</span></span>
                  <span className="vp-mapbar__track" aria-hidden="true">
                    <span
                      className="vp-mapbar__fill"
                      style={{ '--w': `${(s.mw / maxStateMw) * 100}%`, '--i': i }}
                    />
                  </span>
                  <span className="vp-mapbar__meta">
                    <span>{s.count} {s.count === 1 ? 'project' : 'projects'}</span>
                    {/* Share of the whole book, so a reader can size a state
                        against the total without doing the division. */}
                    <span className="vp-mapbar__share">
                      {((s.mw / PORTFOLIO_TOTAL_MW) * 100).toFixed(1)}%
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {unallocated && (
            <p className="vp-mapnote">
              A further <strong>{mw(unallocated.mw)} MW</strong> ({unallocated.name}) spans{' '}
              {unallocated.note}; the source does not break it down by state, so it is not
              shaded on the map.
            </p>
          )}

          <p className="vp-mapnote">
            QCA operations are registered with the state load despatch centres of{' '}
            {sldc.join(', ')}, and with WRLDC for the Western Region. The{' '}
            <Link className="vp-link" to={ROUTES.projects}>full project register</Link>{' '}
            lists every engagement with its scope.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
