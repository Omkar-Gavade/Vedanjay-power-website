import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.js';
import { company } from '../../data/company.js';
import {
  portfolioByState, maxStateMw, unallocated,
  PORTFOLIO_TOTAL_MW, PORTFOLIO_COUNT,
} from '../../data/portfolio.js';
import { SectionHead } from '../ui/SectionHead.jsx';
import { Reveal } from '../ui/Reveal.jsx';
import PortfolioAtlas from './PortfolioAtlas.jsx';
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
 *
 * WHAT WENT: a ranked table of the seven states sat beside the map, saying in
 * numbers exactly what the map said in colour. The map now carries it — a
 * turbine opens its own state — so the duplicate is gone and the map has the
 * full width it needs to be worth zooming into.
 */

const mw = (n) => n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

/* Registrations are a separate fact from where capacity sits, and the two do
   not coincide — the portfolio includes states outside the three SLDC
   registrations. Stated side by side rather than merged. */
const sldc = company.operatingAreas.filter((a) => a.basis.includes('SLDC')).map((a) => a.name);

export default function PortfolioBody() {
  return (
    <div className="vp-container">
      <SectionHead
        id="map-h"
        eyebrow="Interactive portfolio map"
        title="Portfolio under QCA / Forecasting & Scheduling."
        lead={`${mw(PORTFOLIO_TOTAL_MW)} MW across ${PORTFOLIO_COUNT} renewable projects, forecast and scheduled from ${portfolioByState.length} states. Every turbine marks a state we coordinate — open one to see what it carries.`}
      />

      <Reveal className="vp-atlaswrap mt-4 mt-lg-5">
        <PortfolioAtlas
          byState={portfolioByState}
          maxMw={maxStateMw}
          total={PORTFOLIO_TOTAL_MW}
          count={PORTFOLIO_COUNT}
        />
      </Reveal>

      <div className="vp-atlasnotes">
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
      </div>
    </div>
  );
}
