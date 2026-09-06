import { useCountUp } from '../../hooks/useCountUp.js';

/**
 * A statistic that counts up on first view.
 *
 * Splits a published value like "5,000+" into the number it can animate and the
 * characters around it, so the figure on screen is always exactly the value in
 * the data — the animation never invents or rounds anything. Values with no
 * digits are rendered as-is.
 */
const parse = (value) => {
  const m = /^(\D*)([\d,]+)(.*)$/.exec(String(value));
  if (!m) return null;
  return { prefix: m[1], digits: Number(m[2].replace(/,/g, '')), suffix: m[3], grouped: m[2].includes(',') };
};

export function Figure({ value, unit, label, note }) {
  const parsed = parse(value);
  const [shown, ref] = useCountUp(parsed ? parsed.digits : 0);
  const rendered = parsed
    ? `${parsed.prefix}${parsed.grouped ? shown.toLocaleString('en-IN') : shown}${parsed.suffix}`
    : value;

  return (
    <div className="vp-figure" ref={ref}>
      {/* The true value is in the DOM for assistive tech regardless of the
          animation, which only ever affects the visible digits. */}
      <p className="vp-figure__value" aria-label={`${value}${unit ? ` ${unit}` : ''}`}>
        <span aria-hidden="true">{rendered}</span>
        {unit && <span className="vp-figure__unit" aria-hidden="true">{unit}</span>}
      </p>
      <p className="vp-figure__label">{label}</p>
      {note && <p className="vp-figure__note">{note}</p>}
    </div>
  );
}
