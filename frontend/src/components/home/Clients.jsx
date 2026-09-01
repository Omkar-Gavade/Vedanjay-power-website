import { clientSegments, repeatBusiness } from '../../data/clients.js';
import { Reveal } from '../ui/Reveal.jsx';
import { SectionHeading } from '../ui/SectionHeading.jsx';

/**
 * Clients and repeat business.
 *
 * Names, not logos: logo permission is unverified (TO VERIFY #8) and
 * republishing third-party marks without written consent is a legal exposure.
 * The repeat-order counts are the differentiator — verified by parsing all 52
 * rows of the register, and published by none of the sector's larger firms.
 */
export function Clients() {
  return (
    <section className="vp-section vp-bg-alt" aria-labelledby="cli-h">
      <div className="vp-container">
        <SectionHeading
          id="cli-h"
          eyebrow="Who trusts us"
          title="The companies that own India's renewable assets hire us to connect them."
        />

        <div className="row g-4 g-lg-5 mt-2">
          {clientSegments.map((seg, i) => (
            <div className="col-6 col-lg-3" key={seg.id}>
              <Reveal delay={i * 80} className="vp-client-col h-100">
                <h3 className="vp-label d-flex justify-content-between align-items-baseline gap-2 vp-text-muted mb-3">
                  <span>{seg.label}</span>
                  <span className="vp-text-accent">{seg.clients.length}</span>
                </h3>
                <ul>
                  {seg.clients.map((c) => (
                    <li key={c} className="vp-sm vp-text-soft mb-2">{c}</li>
                  ))}
                </ul>
              </Reveal>
            </div>
          ))}
        </div>

        <Reveal delay={100}>
          <div className="vp-repeat p-4 p-lg-5 mt-5">
            <h3 className="vp-h3 vp-measure mb-2">
              The strongest signal in professional services is a client who comes back.
            </h3>
            <p className="vp-body vp-text-soft vp-measure mb-4">
              Counted across our contract register, grouped by parent organisation.
            </p>
            <div className="row g-4">
              {repeatBusiness.map((r, i) => (
                <div className="col-6 col-sm-4 col-lg-2" key={r.client}>
                  <Reveal delay={i * 70}>
                    <p className="vp-repeat__n mb-2">
                      {r.orders}<span className="vp-text-muted">&times;</span>
                    </p>
                    <p className="vp-h4 mb-1">{r.client}</p>
                    <p className="vp-sm vp-text-muted mb-0">{r.note}</p>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
