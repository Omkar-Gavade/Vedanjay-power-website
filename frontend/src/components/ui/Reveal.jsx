import { useReveal } from '../../hooks/useReveal.js';
import { cn } from '../../utils/cn.js';

/** Wraps content in the standard scroll reveal. */
export function Reveal({ as: Tag = 'div', delay = 0, type = 'rise', className, children, ...rest }) {
  const ref = useReveal({ delay, type });
  return <Tag ref={ref} className={className} {...rest}>{children}</Tag>;
}

/**
 * Line-by-line text reveal: each line rises out of its own mask.
 * Pass an array of strings — one per visual line — so the break points are a
 * deliberate typographic choice rather than whatever the browser does.
 */
export function RevealLines({ lines, as: Tag = 'span', delay = 0, step = 90, className }) {
  const ref = useReveal({ delay, type: 'lines' });
  return (
    <Tag ref={ref} className={cn('vp-lines', className)}>
      {lines.map((line, i) => (
        <span className="vp-line-mask" key={line + i}>
          <span className="vp-line-inner" style={{ '--line-d': `${i * step}ms` }}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
