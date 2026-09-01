import { Media } from '../ui/Media.jsx';
import { Reveal } from '../ui/Reveal.jsx';
import { SectionHeading } from '../ui/SectionHeading.jsx';
import { company } from '../../data/company.js';

const PILLARS = [
  { idx: '01', title: 'Regulatory access',
    body: 'CEIG approvals, DISCOM connectivity, SLDC synchronisation under grid code, net metering and REC issuance.' },
  { idx: '02', title: 'Grid interface',
    body: 'Telemetry and RTU commissioning, ABT and AMR metering, and the compliance work load despatch centres require.' },
  { idx: '03', title: 'Electrical works',
    body: 'EHV feeder bays, substations, transmission lines and capacitor banks at 33, 132 and 220 kV.' },
  { idx: '04', title: 'Ongoing operation',
    body: 'Forecasting and scheduling to limit deviation exposure, plus preventive, corrective and predictive O&M.' },
];

/** What Vedanjay does — stated in concrete terms, against a real photograph. */
export function Intro() {
  return (
    <section className="vp-section" aria-labelledby="intro-h">
      <div className="vp-container">
        <div className="row g-4 g-lg-5 align-items-center">
          <div className="col-12 col-lg-6">
            <Reveal className="vp-intro__figure">
              <Media slug="svc-liaisoning" ratio="4x3" className="vp-img-reveal vp-zoom"
                     sizes="(max-width: 992px) 100vw, 50vw" />
              <div className="vp-intro__badge">
                <p className="vp-label mb-2" style={{ color: 'var(--vp-green-300)' }}>Established</p>
                <p className="vp-stat mb-0" style={{ color: '#fff', fontSize: 'clamp(1.75rem,1.4rem+1vw,2.25rem)' }}>
                  {company.incorporated}
                </p>
                <p className="vp-sm mb-0 mt-1" style={{ color: 'rgb(234 242 240 / .62)' }}>
                  Madhya Pradesh &amp; Maharashtra
                </p>
              </div>
            </Reveal>
          </div>

          <div className="col-12 col-lg-6 ps-lg-4">
            <SectionHeading
              id="intro-h"
              eyebrow="What we do"
              title="The gap between a built plant and an earning one."
            />
            <Reveal delay={90}>
              <p className="vp-body vp-measure mt-4 vp-text-soft">
                Vedanjay Power is a professional consultancy in renewable power, backed by
                engineers rather than generalists. We work where a project meets the regulator
                and the grid — securing approvals, building the electrical interface, and
                keeping the asset scheduled and maintained once it is running.
              </p>
            </Reveal>

            <div className="row g-4 mt-2">
              {PILLARS.map((p, i) => (
                <div className="col-sm-6" key={p.idx}>
                  <Reveal delay={120 + i * 70} className="vp-pillar h-100">
                    <span className="vp-pillar__idx">{p.idx}</span>
                    <h3 className="vp-h4 mt-2 mb-1">{p.title}</h3>
                    <p className="vp-sm vp-text-muted mb-0">{p.body}</p>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
