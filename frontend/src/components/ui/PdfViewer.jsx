import { useRef } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';

/**
 * Reads a PDF in place, without downloading it first.
 *
 * WHY AN IFRAME AND NOT A PDF LIBRARY
 * Every browser this site targets already has a PDF reader with text
 * selection, search, zoom and printing. Shipping pdf.js to reproduce that would
 * add hundreds of kilobytes to a page whose whole point is not making people
 * download things.
 *
 * THE FALLBACK IS NOT DECORATION. `navigator.pdfViewerEnabled` is false on most
 * mobile browsers and wherever a user has turned the built-in reader off — and
 * an iframe there renders a blank white rectangle, not an error. So the check
 * runs FIRST and those visitors get a real choice instead of a broken frame.
 * Where the property is missing entirely (older engines) the frame is attempted,
 * because a working viewer is the more likely case.
 */
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function PdfViewer({ doc, onClose }) {
  const ref = useRef(null);
  useFocusTrap(ref, true, onClose);

  const canEmbed = navigator.pdfViewerEnabled !== false;

  return (
    <div className="vp-pdf" role="dialog" aria-modal="true" aria-label={`${doc.title} — document viewer`} ref={ref}>
      {/* Backdrop is a button so a pointer user can dismiss by clicking away,
          and it is hidden from assistive tech because Escape already closes. */}
      <button type="button" className="vp-pdf__scrim" onClick={onClose} aria-hidden="true" tabIndex={-1} />

      <div className="vp-pdf__panel">
        <header className="vp-pdf__head">
          <div className="vp-pdf__id">
            <p className="vp-pdf__title">{doc.title}</p>
            <p className="vp-pdf__meta">{doc.issuer} · {doc.date}</p>
          </div>
          <div className="vp-pdf__acts">
            <a className="vp-pdf__act" href={doc.href} target="_blank" rel="noopener noreferrer">
              Open in new tab
            </a>
            <a className="vp-pdf__act" href={doc.href} download>Download</a>
            <button type="button" className="vp-pdf__close" onClick={onClose} aria-label="Close the document viewer">
              <CloseIcon />
            </button>
          </div>
        </header>

        {canEmbed ? (
          <iframe className="vp-pdf__frame" src={`${doc.href}#view=FitH`} title={doc.title} />
        ) : (
          <div className="vp-pdf__noembed">
            <p className="vp-pdf__noembedTitle">This browser cannot display PDFs in a page.</p>
            <p className="vp-pdf__noembedBody">
              Open the document in a new tab, or save it and read it in your usual viewer.
            </p>
            <a className="vp-btn vp-btn--primary vp-btn--sm" href={doc.href} target="_blank" rel="noopener noreferrer">
              <span>Open {doc.title}</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
