import { stats } from '../../data/stats.js';
import { onlyVerified } from '../../data/verification.js';
import { getMedia } from '../../data/media.js';
import { useCountUp } from '../../hooks/useCountUp.js';
import { Reveal } from '../ui/Reveal.jsx';
import { SectionHeading } from '../ui/SectionHeading.jsx';

function Stat({ stat }) {
  const [value, ref] = useCountUp(stat.value);
  return (
    <div className="vp-stat-block h-100">
      <p ref={ref} className="vp-stat mb-0" style={{ color: '#fff' }}>
        {value.toLocaleString('en-IN')}
        <span className="vp-stat-unit">{stat.suffix}</span>
      </p>
      <p className="vp-h4 mt-3 mb-1" style={{ color: '#fff' }}>{stat.label}</p>
      <p className="vp-sm vp-on-dark-soft mb-2">{stat.detail}</p>
      <p className="vp-label mb-0" style={{ color: 'rgb(234 242 240 / .45)' }}>{stat.asOf}</p>
    </div>
  );
}

/**
 * Counted, not claimed.
 *
 * The legacy site publishes contradictory figures (100 vs 110 MW open access,
 * 700 MW commissioned vs +30 MW O&M) that cannot be sourced. Those are withheld
 * by the verification gate; every figure here is recountable from the register
 * or the public company record. The section renders however many are verified —
 * it never ships a number nobody can stand behind.
 */
export function Numbers() {
  const verified = onlyVerified(stats);
  if (verified.length === 0) return null;
  const bg = getMedia('hero-substation');

  return (
    <section className="vp-section vp-section--lg vp-numbers vp-on-dark-ground" aria-labelledby="num-h">
      <div className="vp-numbers__bg" aria-hidden="true">
        {bg && <img src={bg.src} srcSet={`${bg.src.replace('/images/', '/images/sm/')} 1000w, ${bg.src} 1800w`}
                    sizes="100vw" alt="" loading="lazy" decoding="async" style={{ objectPosition: bg.focal }} />}
      </div>

      <div className="vp-numbers__inner vp-container">
        <SectionHeading
          id="num-h"
          eyebrow="Vedanjay in numbers"
          title="Counted, not claimed."
          lead="Every figure below is drawn from our own contract register and the public company record."
        />

        <div className="row g-4 g-lg-5 mt-2 mt-lg-3">
          {verified.map((s, i) => (
            <div className="col-6 col-lg-3" key={s.id}>
              <Reveal delay={i * 90} className="h-100"><Stat stat={s} /></Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
