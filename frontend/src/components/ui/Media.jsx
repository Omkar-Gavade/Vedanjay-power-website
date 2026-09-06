import { getMedia, smallSrc } from '../../data/media.js';
import { cn } from '../../utils/cn.js';

/** Intrinsic dimensions per ratio, so the browser reserves space before CSS. */
const DIMS = {
  square: [1400, 1400], '4x3': [1600, 1200], '3x2': [1680, 1120],
  '16x9': [1760, 990], '21x9': [1800, 771],
  portrait: [1200, 1500], tall: [1200, 1600], fill: [1800, 1200],
};

const RATIOS = {
  square: 'vp-media--square', '4x3': 'vp-media--4x3', '3x2': 'vp-media--3x2',
  '16x9': 'vp-media--16x9', '21x9': 'vp-media--21x9',
  portrait: 'vp-media--portrait', tall: 'vp-media--tall', fill: 'vp-media--fill',
};

/**
 * Every photograph renders through here: registry lookup, responsive srcset,
 * focal-point cropping, lazy-loading below the fold, and a branded fallback
 * panel instead of a broken-image icon when an asset is missing.
 */
export function Media({
  slug, ratio = '3x2', scrim, className, priority = false,
  sizes = '100vw', children, ...rest
}) {
  const item = getMedia(slug);
  const [w, h] = DIMS[ratio] || DIMS['3x2'];
  const scrimClass =
    scrim === true ? 'vp-scrim' :
    scrim === 'side' ? 'vp-scrim vp-scrim--side' :
    scrim === 'even' ? 'vp-scrim vp-scrim--even' : null;

  return (
    <div className={cn('vp-media', RATIOS[ratio], scrimClass, className)} {...rest}>
      {item ? (
        <img
          src={item.src}
          srcSet={`${smallSrc(item.src)} 1000w, ${item.src} 1800w`}
          sizes={sizes}
          alt={item.alt}
          width={w}
          height={h}
          style={{ '--focal': item.focal || '50% 50%' }}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          draggable="false"
        />
      ) : (
        <div className="vp-media__placeholder" aria-hidden="true" />
      )}
      {children}
    </div>
  );
}
