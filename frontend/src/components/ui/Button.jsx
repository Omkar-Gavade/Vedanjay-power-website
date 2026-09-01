import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn.js';

const VARIANTS = {
  primary: 'vp-btn--primary',
  accent: 'vp-btn--accent',
  outline: 'vp-btn--outline',
  ghostLight: 'vp-btn--ghost-light',
  link: 'vp-btn--link',
};
const SIZES = { sm: 'vp-btn--sm', md: '', lg: 'vp-btn--lg' };

/**
 * @param {'primary'|'accent'|'outline'|'ghostLight'|'link'} [variant]
 * @param {'sm'|'md'|'lg'} [size]
 * @param {string} [to]   internal route
 * @param {string} [href] external / protocol URL
 */
export function Button({
  variant = 'primary', size = 'md', to, href, arrow = false,
  block = false, className, children, ...rest
}) {
  const cls = cn(
    'vp-btn vp-arrow-parent',
    VARIANTS[variant], SIZES[size],
    block && 'vp-btn--block',
    className,
  );
  const body = (
    <>
      <span>{children}</span>
      {arrow && <span className="vp-arrow" aria-hidden="true">&rarr;</span>}
    </>
  );

  if (to) return <Link to={to} className={cls} {...rest}>{body}</Link>;
  if (href) {
    const ext = /^https?:/i.test(href);
    return (
      <a href={href} className={cls} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {body}
        {ext && <span className="visually-hidden"> (opens in a new tab)</span>}
      </a>
    );
  }
  return <button type="button" className={cls} {...rest}>{body}</button>;
}
