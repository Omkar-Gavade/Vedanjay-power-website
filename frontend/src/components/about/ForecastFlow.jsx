import { useState } from 'react';
import { capabilities, technologies } from '../../data/capabilities.js';
import { company } from '../../data/company.js';
import { Reveal } from '../ui/Reveal.jsx';

/**
 * WHAT QCA ACTUALLY IS, drawn rather than described.
 *
 * Forecasting & Scheduling is the company's core line and the one a visitor is
 * least likely to already understand — the About page named it in a list and
 * left it there. This is the same service as a sequence, because a sequence is
 * what it is.
 *
 * EVERY LABEL IS DERIVED, NOT WRITTEN. The four stages are the four points
 * capabilities.js already publishes under `qca`, in the order it publishes
 * them; the technologies are technologies[]; the load despatch centres are the
 * registered operating areas from company.js. Nothing here asserts a step the
 * service description does not already state, and the caption says where it
 * comes from.
 *
 * The stages are buttons rather than decoration: each one carries the full
 * published wording, which is more than fits on the diagram itself.
 */

const qca = capabilities.find((c) => c.id === 'qca');
const sldc = company.operatingAreas.filter((a) => a.basis.includes('SLDC')).map((a) => a.name);
const rldc = company.operatingAreas.find((a) => a.basis.includes('RLDC'));

/**
 * @typedef {{id:string, label:string, caption:string, detail:string}} Stage
 */

/** @type {Stage[]} */
const STAGES = [
  {
    id: 'assets',
    label: 'Generation',
    caption: technologies.map((t) => t.name).join(' · '),
    detail: `Solar, wind and hybrid plants under our coordination. `
      + `${qca.summary.split('—')[0].trim()}.`,
  },
  {
    id: 'forecast',
    label: 'Forecast',
    caption: 'Day-ahead & intraday',
    detail: qca.points[0],
  },
  {
    id: 'schedule',
    label: 'Schedule',
    caption: `${sldc.length} SLDCs · ${rldc ? 'WRLDC' : 'RLDC'}`,
    detail: `${qca.points[1]}. Registered with the state load despatch centres of `
      + `${sldc.join(', ')}, and with WRLDC for the ${rldc ? rldc.name : 'region'}.`,
  },
  {
    id: 'settle',
    label: 'Settle',
    caption: 'Deviation & DSM',
    detail: qca.points[2],
  },
];

export function ForecastFlow() {
  /* Nothing is selected until the visitor picks — the diagram has to be
     readable before it is interacted with. */
  const [open, setOpen] = useState(null);
  const active = STAGES.find((s) => s.id === open) ?? null;

  return (
    <div className="vp-qca">
      <Reveal>
        <ol className="vp-qca__flow">
          {STAGES.map((s, i) => (
            <li className="vp-qca__step" key={s.id} style={{ '--i': i }}>
              <button
                type="button"
                className="vp-qca__node"
                aria-expanded={open === s.id}
                aria-controls="vp-qca-detail"
                onClick={() => setOpen(open === s.id ? null : s.id)}
              >
                <span className="vp-qca__n" aria-hidden="true">{`0${i + 1}`}</span>
                <span className="vp-qca__label">{s.label}</span>
                <span className="vp-qca__caption">{s.caption}</span>
              </button>
            </li>
          ))}
        </ol>
      </Reveal>

      {/* One live region rather than four expanding cards: the stages keep a
          single height, so opening one never reflows the diagram. */}
      <div className="vp-qca__detail" id="vp-qca-detail" data-open={active ? 'true' : 'false'}>
        <p className="vp-qca__detailText">
          {active
            ? <><strong>{active.label}.</strong> {active.detail}</>
            : <>Select a stage to see what it covers. {qca.points[3]} runs across all four.</>}
        </p>
      </div>

      <p className="vp-qca__note">
        The {qca.name} line, as published under our services — continuous, not a one-off study.
      </p>
    </div>
  );
}
