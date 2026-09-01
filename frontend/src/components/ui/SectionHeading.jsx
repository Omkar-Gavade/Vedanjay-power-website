import { Reveal } from './Reveal.jsx';
import { cn } from '../../utils/cn.js';

/** Eyebrow rule + mono label + heading + optional lead. Used by every section. */
export function SectionHeading({
  eyebrow, title, lead, id, as: Tag = 'h2',
  size = 'vp-h2', align = 'start', className, children,
}) {
  return (
    <Reveal className={cn('d-flex flex-column', align === 'center' && 'align-items-center text-center', className)}>
      {eyebrow && <span className="vp-eyebrow vp-label mb-3">{eyebrow}</span>}
      <Tag id={id} className={cn(size, 'vp-measure-tight mb-0')}>{title}</Tag>
      {lead && <p className={cn('vp-lead vp-measure-lead mt-3 mb-0', align === 'center' && 'mx-auto')}>{lead}</p>}
      {children}
    </Reveal>
  );
}
