import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react';
import { Reveal } from '../ui/Reveal.jsx';
import { ExternalIcon } from './icons.jsx';

/**
 * "Send an enquiry" — the right, dominant column of the primary section.
 *
 * THE FORM STARTS CLOSED. It used to sit open on the page, which meant roughly
 * two thousand pixels of third-party iframe between the reader and everything
 * below it, on every visit, whether or not they intended to write to anyone.
 * Now it opens on a deliberate click.
 *
 * That also fixes the loading strategy. The old version mounted the iframe when
 * the section neared the viewport — better than mounting it immediately, but
 * still paid for by every visitor who scrolled past. It now mounts on the FIRST
 * OPEN and stays mounted, so a visitor who never opens it never loads Google's
 * form at all.
 *
 * The form is embedded rather than linked: `?embedded=true` is Google's own
 * parameter and strips the Forms chrome so the questions sit on our surface.
 * Google owns everything inside the frame; the integration work is all
 * container.
 */
const FORM_ID = '1FAIpQLSeycRMNxEh-6kv8LKNPCqOWxMnd77lWBVGF8f6D7aqUEMKaXQ';
const FORM_EMBED = `https://docs.google.com/forms/d/e/${FORM_ID}/viewform?embedded=true`;
const FORM_DIRECT = `https://docs.google.com/forms/d/e/${FORM_ID}/viewform`;

function FormIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4.5 2.5h7.6L16 6.4v11.1H4.5V2.5Z" stroke="currentColor" strokeWidth="1.3"
            strokeLinejoin="round" />
      <path d="M11.8 2.6v4h4M7.4 10.2h5.2M7.4 13.2h5.2" stroke="currentColor"
            strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="m3 6 5 5 5-5" stroke="currentColor" strokeWidth="1.7"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EnquiryPanel() {
  const [open, setOpen] = useState(false);
  /* Separate from `open`: once mounted the iframe stays mounted, so closing and
     reopening does not reload the form and lose whatever has been typed. */
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const panelId = useId();
  const frameRef = useRef(null);
  const revealRef = useRef(null);

  /*
    THE PANEL OPENS WHETHER OR NOT IT CAN ANIMATE.

    Two earlier attempts both failed, and for the same underlying reason. First
    `grid-template-rows: 0fr -> 1fr`, which does not interpolate here. Then a
    pixel height set across a requestAnimationFrame — and rAF does not run at
    all in a backgrounded tab, so the target height was never applied and the
    form could not be opened.

    So the final state is applied SYNCHRONOUSLY and the movement is a separate,
    optional layer on top: the Web Animations API interpolates from the old
    height to the new one. If animations are unavailable, disabled, or the tab
    is not being painted, the panel still opens — it simply opens instantly.
  */
  useLayoutEffect(() => {
    const el = revealRef.current;
    if (!el) return undefined;

    const from = el.getBoundingClientRect().height;
    const to = open ? el.scrollHeight : 0;

    /* Correctness first. `auto` rather than a pixel value so a taller form is
       never clipped by a stale measurement. */
    el.style.height = open ? 'auto' : '0px';

    const still = typeof matchMedia === 'function'
      && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still || typeof el.animate !== 'function' || from === to) return undefined;

    const anim = el.animate(
      [{ height: `${from}px` }, { height: `${to}px` }],
      { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)' },
    );
    return () => anim.cancel();
  }, [open, mounted]);

  const toggle = useCallback(() => {
    setOpen((wasOpen) => {
      const next = !wasOpen;
      if (next) setMounted(true);
      /* Opening pushes ~2000px into the page. Without this the button the
         visitor just pressed is left somewhere off-screen. */
      if (next) {
        requestAnimationFrame(() => {
          frameRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
        });
      }
      return next;
    });
  }, []);

  return (
    <div className="vp-enquiry">
      <Reveal>
        <span className="vp-eyebrow vp-label mb-3">Send an enquiry</span>
        <h2 id="enq-h" className="vp-h2 vp-measure-tight mb-3">
          Tell us about your requirement.
        </h2>
        <p className="vp-enquiry__intro mb-0">
          Share the details below and our team will get back to you.
        </p>
      </Reveal>

      <Reveal delay={90}>
        <div className="vp-enquiry__frame" ref={frameRef} data-open={open ? 'true' : undefined}>
          <button
            type="button"
            className="vp-enquiry__toggle"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={toggle}
          >
            <span className="vp-enquiry__toggleIcon" aria-hidden="true"><FormIcon /></span>
            <span className="vp-enquiry__toggleText">
              <span className="vp-enquiry__toggleTitle">
                {open ? 'Hide the enquiry form' : 'Open the enquiry form'}
              </span>
              <span className="vp-enquiry__toggleHint">
                {open ? 'Your answers are kept if you close it' : 'Service details · takes a couple of minutes'}
              </span>
            </span>
            <span className="vp-enquiry__chev" aria-hidden="true"><ChevronIcon /></span>
          </button>

          {/* 0fr → 1fr animates to the natural height without anyone having to
              know what that height is — and the form is about 2000px, so a
              hard-coded max-height would either clip it or lie about it. */}
          {/* `inert`, not `hidden`. `hidden` is display:none, which cancels the
              transition outright — the panel would snap rather than open. inert
              takes the collapsed content out of the tab order and the
              accessibility tree while leaving it laid out and animatable. */}
          <div className="vp-enquiry__reveal" id={panelId} ref={revealRef} inert={!open}>
            <div className="vp-enquiry__revealInner">
              <div className="vp-enquiry__bar">
                <span>Service details form</span>
                {/* The URL is never shown — an escape hatch for anyone whose
                    browser blocks third-party frames. */}
                <a href={FORM_DIRECT} target="_blank" rel="noopener noreferrer">
                  Open in a new tab
                  <ExternalIcon />
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </div>

              {mounted && (
                <div className="vp-enquiry__stage">
                  {/*
                    The iframe keeps its layout box while loading. Hiding it with
                    `display:none` until onLoad deadlocks — a display:none iframe
                    has no layout and never loads — so the skeleton is overlaid.
                  */}
                  <iframe
                    className="vp-enquiry__embed"
                    src={FORM_EMBED}
                    title="Vedanjay Power service details enquiry form"
                    referrerPolicy="no-referrer-when-downgrade"
                    onLoad={() => setLoaded(true)}
                  >
                    Your browser cannot display embedded content.
                  </iframe>
                  {!loaded && (
                    <div className="vp-enquiry__loading" role="status">
                      <span className="vp-enquiry__spinner" aria-hidden="true" />
                      <span>Loading the enquiry form…</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
