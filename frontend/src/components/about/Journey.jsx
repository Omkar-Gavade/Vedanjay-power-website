import { useEffect, useRef, useState } from 'react';
import { milestones } from '../../data/about.js';
import { useScrollProgress } from '../../hooks/useScrollProgress.js';
import { Reveal } from '../ui/Reveal.jsx';

const pad = (n) => String(n).padStart(2, '0');

/**
 * The milestones as a rail that fills as you read down it.
 *
 * The sequence IS the content — founding to a 5,000+ MW portfolio, in the
 * order the company records it — so the one animation here follows the
 * sequence: the rail draws down with the scroll, each stop lights as the line
 * reaches its dot, and the counter beside the heading keeps your place.
 *
 * All of it is CSS off one `--p` from useScrollProgress. Where each dot sits
 * on the rail is measured into `--at` (and again on resize), so a stop lights
 * exactly when the tip of the line passes it — at 62% of the viewport, where
 * the eye already is. Only the first milestone is dated in the source, so only
 * the first shows a year; the rest are numbered steps.
 */
export function Journey({ id }) {
  const total = milestones.length;
  const stops = useRef([]);
  const [reached, setReached] = useState(1);

  const track = useScrollProgress({
    from: 0.62,
    to: 0.62,
    onChange: (p) => {
      const passed = stops.current.filter((at) => at <= p + 0.001).length;
      setReached(p >= 1 ? total : Math.max(1, passed));
    },
  });

  useEffect(() => {
    const list = track.current;
    if (!list) return undefined;
    const measure = () => {
      const h = list.offsetHeight || 1;
      stops.current = [...list.children].map((li) => {
        const dot = li.querySelector('.vp-ov-stop__dot');
        const y = li.offsetTop + (dot ? dot.offsetTop + dot.offsetHeight / 2 : 0);
        const at = y / h;
        li.style.setProperty('--at', at.toFixed(4));
        return at;
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [track]);

  return (
    <div className="vp-ov-journey">
      <div className="vp-ov-journey__aside">
        <Reveal className="vp-ov-journey__sticky">
          <span className="vp-eyebrow vp-label mb-3">How we got here</span>
          <h2 id={id} className="vp-h2 vp-measure-tight mb-3">
            From 2011 to a 5,000+&nbsp;MW portfolio.
          </h2>
          <p className="vp-lead mb-0">
            Built one capability at a time, in the order the company records them.
          </p>
          <p className="vp-ov-journey__count" aria-hidden="true">
            {/* Keyed, so each new count replays its small rise. */}
            <span className="vp-ov-journey__now" key={reached}>{pad(reached)}</span>
            <span className="vp-ov-journey__of">/ {pad(total)}</span>
          </p>
        </Reveal>
      </div>

      <ol className="vp-ov-journey__track" ref={track}>
        {milestones.map((m, i) => (
          <li className="vp-ov-stop" key={m.name}>
            <span className="vp-ov-stop__dot" aria-hidden="true" />
            <p className="vp-ov-stop__when">{m.year ?? `Step ${pad(i + 1)}`}</p>
            <h3 className="vp-ov-stop__name">{m.name}</h3>
            <p className="vp-ov-stop__body">{m.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
