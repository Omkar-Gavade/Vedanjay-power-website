import {
  portfolioByState, maxStateMw, PORTFOLIO_TOTAL_MW, PORTFOLIO_COUNT,
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

export default function PortfolioBody() {
  return (
    <div className="vp-container">
      <SectionHead
        id="map-h"
        eyebrow="Interactive portfolio map"
        title="Portfolio under QCA / Forecasting & Scheduling."
        titleClass="vp-atlas__title"
      />

      {/* Breaks the container so the atlas runs the full width of the page. */}
      <Reveal className="vp-atlaswrap mt-4 mt-lg-5">
        <PortfolioAtlas
          byState={portfolioByState}
          maxMw={maxStateMw}
          total={PORTFOLIO_TOTAL_MW}
          count={PORTFOLIO_COUNT}
        />
      </Reveal>

    </div>
  );
}
