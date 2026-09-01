import { getMedia } from '../../data/media.js';
import { cn } from '../../utils/cn.js';

const RATIOS = {
  square: 'vp-media--square', '4x3': 'vp-media--4x3', '3x2': 'vp-media--3x2',
  '16x9': 'vp-media--16x9', '21x9': 'vp-media--21x9',
  portrait: 'vp-media--portrait', tall: 'vp-media--tall', fill: 'vp-media--fill',
};

/**
 * Every photograph on the site renders through here.
 *
 * - Resolves a SLUG from the media registry, so swapping in real Vedanjay
 *   photography is a one-file change (see src/data/media.js).
 * - Missing assets degrade to a branded gradient panel rather than a broken
 *   image icon — the legacy site renders broken-image placeholders in its hero.
 * - `alt` comes from the registry; decorative usages pass alt="".
 */
export function Media({
  slug, ratio = '3x2', scrim, className, imgClassName,
  priority = false, sizes = '100vw', children, ...rest
}) {
  const item = getMedia(slug);

  const scrimClass =
    scrim === true ? 'vp-scrim' :
    scrim === 'side' ? 'vp-scrim vp-scrim--side' :
    scrim === 'even' ? 'vp-scrim vp-scrim--even' : null;

  return (
    <div className={cn('vp-media', RATIOS[ratio], scrimClass, className)} {...rest}>
      {item ? (
        <img
          src={item.src}
          srcSet={`${item.src.replace('/images/', '/images/sm/')} 1000w, ${item.src} 1800w`}
          alt={item.alt}
          style={{ '--focal': item.focal || '50% 50%' }}
          className={imgClassName}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          sizes={sizes}
          draggable="false"
        />
      ) : (
        <div className="vp-media__placeholder" aria-hidden="true" />
      )}
      {children}
    </div>
  );
}
