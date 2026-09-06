import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.js';

/**
 * The supplied Vedanjay Power logo, used whole and unmodified.
 * Intrinsic size is 400×99; height is set in CSS and width derives from the
 * aspect ratio, so the lockup is never stretched or cropped. `width`/`height`
 * are declared to reserve space and avoid layout shift.
 */
export function Logo({ className = 'vp-brand__img', onClick }) {
  return (
    <Link to={ROUTES.home} className="vp-brand" onClick={onClick}>
      <img
        src="/brand/vedanjay-power-logo.png"
        srcSet="/brand/vedanjay-power-logo.png 400w, /brand/vedanjay-power-logo@2x.png 800w"
        sizes="(min-width: 1200px) 194px, 162px"
        width="400"
        height="99"
        alt="Vedanjay Power Pvt. Ltd."
        className={className}
        decoding="sync"
        fetchPriority="high"
      />
    </Link>
  );
}
