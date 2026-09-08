import { Reveal } from './Reveal.jsx';
import { cn } from '../../utils/cn.js';

/**
 * Eyebrow rule + label, heading, optional lead. Sentence case throughout.
 *
 * WHEN THERE IS A LEAD, THE HEAD SPLITS INTO TWO COLUMNS on wide screens.
 * Stacked, a heading held to a tight measure and a lead held to a readable one
 * leave the right half of the row empty, which looks like a mistake rather than
 * like space. Setting them side by side fills the row without stretching either
 * one past the measure it should keep.
 */
export function SectionHead({
  eyebrow, title, lead, id, as: Tag = 'h2', className, titleClass, children,
}) {
  return (
    <Reveal className={cn('vp-shead', lead && 'vp-shead--split', className)}>
      {eyebrow && <span className="vp-eyebrow vp-label vp-shead__eyebrow mb-3">{eyebrow}</span>}
      <Tag id={id} className={cn('vp-h2 vp-measure-tight mb-0 vp-shead__title', titleClass)}>
        {title}
      </Tag>
      {lead && <p className="vp-lead vp-measure-lead mt-3 mb-0 vp-shead__lead">{lead}</p>}
      {children && <div className="vp-shead__more">{children}</div>}
    </Reveal>
  );
}
