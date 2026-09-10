import { useScrollProgress } from '../../hooks/useScrollProgress.js';
import { cn } from '../../utils/cn.js';

/**
 * A statement that lights word by word as it is scrolled through.
 *
 * It is ordinary text: the words are spans separated by real spaces, so it
 * reads, selects, wraps and translates like any paragraph. Only each word's
 * opacity is scroll-driven — from `--p` on the paragraph against the word's
 * own `--i` — and with no JS, or reduced motion, every word is simply lit.
 */
export function ScrollWords({ text, as: Tag = 'p', className }) {
  /* Fully lit by the time its last line has risen to 62% of the viewport —
     still well below the eye, so nobody reads ahead of the light. */
  const ref = useScrollProgress({ from: 0.9, to: 0.62 });
  const words = text.split(' ');

  return (
    <Tag ref={ref} className={cn('vp-ov-words', className)} style={{ '--n': words.length }}>
      {words.map((w, i) => (
        // Static text split once; the index is the identity.
        // eslint-disable-next-line react/no-array-index-key
        <span key={i} style={{ '--i': i }}>{i < words.length - 1 ? `${w} ` : w}</span>
      ))}
    </Tag>
  );
}
