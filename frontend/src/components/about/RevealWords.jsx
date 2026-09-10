import { Fragment } from 'react';
import { useReveal } from '../../hooks/useReveal.js';
import { cn } from '../../utils/cn.js';

/**
 * One long statement, rising word by word out of its own mask.
 *
 * RevealLines does this per line, which needs the break points chosen by hand.
 * A sentence the length of the vision statement wraps differently at every
 * width, so here each WORD is the unit: it rides the same `.vp-line-inner`
 * transform and `lines` reveal as the headings, staggered by `step`.
 *
 * The space sits OUTSIDE each mask. Inside an inline-block it would collapse,
 * and the words would run together.
 */
export function RevealWords({ text, as: Tag = 'p', step = 24, delay = 0, className }) {
  const ref = useReveal({ delay, type: 'lines' });
  const words = text.split(' ');

  return (
    <Tag ref={ref} className={cn('vp-ov-rise', className)}>
      {words.map((w, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={i}>
          <span className="vp-ov-rise__mask">
            <span className="vp-line-inner" style={{ '--line-d': `${i * step}ms` }}>{w}</span>
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </Tag>
  );
}
