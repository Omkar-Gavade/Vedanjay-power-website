import { partners } from '../../data/partners.js';
import { ROUTES } from '../../constants/routes.js';
import { SectionHead } from '../ui/SectionHead.jsx';
import { Button } from '../ui/Button.jsx';
import '../../styles/clients.css';

/**
 * The published partner marks, running as two counter-moving rows.
 *
 * ONLY WHAT THE COMPANY ITSELF LISTS. Every mark here comes from data/
 * partners.js — the "Our Partners" slide of the company's own deck — and the
 * one partner with no artwork (ENERCAST) is not given a placeholder, it simply
 * does not appear on a wall of marks. The wording under the heading repeats the
 * limit the partners page states: a listing, not a claim of endorsement.
 *
 * Each row renders its list TWICE. The animation travels exactly -50%, which is
 * the width of one copy, so the seam never arrives.
 */
const MARKED = partners.filter((p) => p.logo);
const SPLIT = Math.ceil(MARKED.length / 2);
const ROWS = [MARKED.slice(0, SPLIT), MARKED.slice(SPLIT)];

export default function ClientStripBody() {
  return (
    <>
      <div className="vp-container">
        <SectionHead
          id="cl-h"
          eyebrow="Clients and partners"
          title="Organisations we work with."
          lead="Named on Vedanjay Power’s own partner listing. Several are also counterparties for forecasting and QCA engagements."
        >
          <Button to={ROUTES.partners} variant="link" size="sm" arrow>All partners</Button>
        </SectionHead>
      </div>

      <div className="vp-cmark mt-4 mt-lg-5">
        {ROWS.map((row, r) => (
          <div
            key={row[0].name}
            className="vp-cmark__row"
            data-dir={r === 0 ? 'left' : 'right'}
            /* Speed follows length, so both rows travel at the same pace
               whatever they carry. */
            style={{ '--speed': `${row.length * 5.2}s` }}
          >
            <ul className="vp-cmark__track">
              {[...row, ...row].map((p, i) => {
                const copy = i >= row.length;
                return (
                  <li className="vp-cmark__item" key={`${p.name}-${i}`} aria-hidden={copy || undefined}>
                    {/* The mark carries the name, so the caption under it is
                        decorative — and the second copy is announced to nobody. */}
                    <img className="vp-cmark__logo" src={p.logo} alt={copy ? '' : p.name}
                         loading="lazy" decoding="async" />
                    <span className="vp-cmark__name" aria-hidden="true">{p.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
