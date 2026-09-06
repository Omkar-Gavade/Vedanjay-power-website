import { useEffect, useRef } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';

/**
 * Full-size image viewer, shared by the Awards archive and the project gallery.
 *
 * Reuses useFocusTrap, which already traps Tab, locks body scroll without a
 * layout shift, closes on Escape and restores focus to the opener.
 *
 * Stepping between images is OPTIONAL: pass `onPrev`/`onNext` and the controls
 * appear. Awards opens one certificate at a time and passes neither, so it is
 * unchanged. The gallery is a set, and a viewer that makes you close and
 * reopen for each of eight images is not a gallery.
 */
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function ChevronIcon({ back = false }) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true"
      style={back ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * @param {{src:string, alt:string, caption?:string, label:string,
 *          onClose:() => void, onPrev?:() => void, onNext?:() => void,
 *          index?:number, total?:number}} props
 */
export function Lightbox({ src, alt, caption, label, onClose, onPrev, onNext, index, total }) {
  const ref = useRef(null);
  useFocusTrap(ref, true, onClose);

  const steppable = Boolean(onPrev && onNext);

  /*
    Arrow keys, because that is what a viewer of a set is expected to answer to
    — and because the on-screen buttons are inside the focus trap, so a
    keyboard user reaching them must Tab past the close button every time.
    Escape is already handled by useFocusTrap.
  */
  useEffect(() => {
    if (!steppable) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); onPrev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); onNext(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [steppable, onPrev, onNext]);

  return (
    <div
      className="vp-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      ref={ref}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button type="button" className="vp-lightbox__close" onClick={onClose} aria-label="Close image">
        <CloseIcon />
      </button>

      {steppable && (
        <button type="button" className="vp-lightbox__nav" data-dir="prev"
          onClick={onPrev} aria-label="Previous image">
          <ChevronIcon back />
        </button>
      )}

      <figure className="vp-lightbox__fig">
        {/* Keyed on src so a step swaps the element rather than mutating it —
            otherwise the browser holds the previous frame until the next
            image decodes, and the caption changes before the picture does. */}
        <img key={src} src={src} alt={alt} />
        {(caption || total) && (
          <figcaption className="vp-lightbox__cap">
            {caption}
            {total > 1 && (
              <span className="vp-lightbox__count">{index + 1} / {total}</span>
            )}
          </figcaption>
        )}
      </figure>

      {steppable && (
        <button type="button" className="vp-lightbox__nav" data-dir="next"
          onClick={onNext} aria-label="Next image">
          <ChevronIcon />
        </button>
      )}
    </div>
  );
}
