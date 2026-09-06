import { useCallback, useRef, useState } from 'react';
import { company } from '../data/company.js';
import { resourceGroups, allResources, formatBytes } from '../data/downloads.js';
import { Button } from '../components/ui/Button.jsx';
import { PdfViewer } from '../components/ui/PdfViewer.jsx';
import { getMedia, smallSrc } from '../data/media.js';
import { Reveal, RevealLines } from '../components/ui/Reveal.jsx';
import { ROUTES } from '../constants/routes.js';
import '../styles/about.css';

/**
 * Downloads — a document archive.
 *
 * Twenty regulatory PDFs, all served from this site. data/downloads.js records
 * where each came from; downloads.test.js pins every entry to a real file with
 * its true byte count, so a listing can never outlive the file behind it.
 *
 * EVERY DOCUMENT CAN BE READ WITHOUT DOWNLOADING IT. "View" opens the PDF in
 * place; "Save" is the separate, explicit act. That ordering matters on a page
 * of regulations — most visitors want to check one clause, not collect a file.
 *
 * WHAT THIS PAGE NO LONGER CARRIES: a contents list that duplicated the four
 * headings a screen below it, a standing note about retrieval dates, and a
 * "Company resources — in preparation" box listing documents that do not exist.
 */
const ordinal = (i) => String(i + 1).padStart(2, '0');

function ViewIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M1 8s2.5-4.5 7-4.5S15 8 15 8s-2.5 4.5-7 4.5S1 8 1 8Z"
        stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="1.9" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
function SaveIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M6 1v7m0 0L3.2 5.2M6 8l2.8-2.8M1.5 10.5h9"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Downloads() {
  const hero = getMedia('cta-close');
  const [open, setOpen] = useState(null);
  const openerRef = useRef(null);

  const close = useCallback(() => {
    setOpen(null);
    requestAnimationFrame(() => openerRef.current?.focus());
  }, []);

  return (
    <>
      <title>Downloads — Vedanjay Power Pvt. Ltd.</title>
      <meta
        name="description"
        content={`${allResources.length} regulatory reference documents — forecasting and scheduling, open access, and rooftop solar and net metering — published by Vedanjay Power Pvt. Ltd.`}
      />
      <link rel="canonical" href={`${company.website.replace(/\/$/, '')}/about/downloads/`} />

      <section className="vp-phero vp-phero--photo" aria-labelledby="dl-h">
        <div className="vp-phero__media" aria-hidden="true">
          {hero && (
            <img src={hero.src} srcSet={`${smallSrc(hero.src)} 1000w, ${hero.src} 1800w`}
                 sizes="100vw" alt="" fetchPriority="high" decoding="async"
                 style={{ objectPosition: hero.focal }} />
          )}
        </div>
        <div className="vp-phero__inner vp-container">
          <Reveal><span className="vp-eyebrow vp-label mb-3">About us · Resources</span></Reveal>
          <h1 id="dl-h" className="vp-phero__title">
            <RevealLines lines={['The regulations', 'we work under.']} />
          </h1>
          <Reveal delay={140}>
            <p className="vp-lead vp-phero__lead mb-0">
              {allResources.length} documents — forecasting and scheduling, open access,
              and rooftop solar and net metering. Read any of them here, or take a copy.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="vp-section vp-section--tight-top vp-arch" aria-labelledby="rs-h">
        <div className="vp-container">
          <h2 id="rs-h" className="visually-hidden">Document archive</h2>

          {resourceGroups.map((g, gi) => (
            /* --tone is the group's accent, carried by the numeral, the rule
               beside the heading, the file chips and the row hover. Four groups,
               four tones, so a reader can tell at a glance which set a row
               belongs to when scrolling past the heading. */
            <div className="vp-archgroup" id={g.id} key={g.id} data-tone={gi % 4}>
              <div className="vp-edcol">
                <Reveal className="vp-edcol__aside">
                  <span className="vp-edcol__num">{ordinal(gi)}</span>
                  <h3 className="vp-edcol__title">{g.title}</h3>
                  <p className="vp-edcol__blurb">{g.blurb}</p>
                  <p className="vp-edcol__meta">
                    {g.items.length} {g.items.length === 1 ? 'document' : 'documents'}
                  </p>
                </Reveal>

                <ul className="vp-docs">
                  {g.items.map((r, i) => (
                    <li className="vp-doc" key={r.id} style={{ '--i': i }}>
                      <span className="vp-doc__chip" aria-hidden="true">PDF</span>

                      <div className="vp-doc__main">
                        <h4 className="vp-doc__title">{r.title}</h4>
                        <p className="vp-doc__desc">{r.description}</p>
                        <p className="vp-doc__meta">
                          <span>{r.issuer}</span>
                          <span aria-hidden="true">·</span>
                          <span>{r.date}</span>
                          <span aria-hidden="true">·</span>
                          <span>{formatBytes(r.bytes)}</span>
                        </p>
                      </div>

                      <div className="vp-doc__acts">
                        {/* Reading is the primary act on a page of regulations,
                            so it is the filled control and it comes first. */}
                        <button
                          type="button"
                          className="vp-doc__view"
                          onClick={(e) => { openerRef.current = e.currentTarget; setOpen(r); }}
                        >
                          <ViewIcon />
                          <span>View</span>
                          <span className="visually-hidden"> {r.title}</span>
                        </button>
                        <a className="vp-doc__save" href={r.href} download>
                          <SaveIcon />
                          <span>Save</span>
                          <span className="visually-hidden">
                            {' '}{r.title}, PDF, {formatBytes(r.bytes)}
                          </span>
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="vp-section vp-section--flush-top" aria-labelledby="dc-h">
        <div className="vp-container">
          <Reveal>
            <div className="vp-band">
              <div>
                <h2 id="dc-h" className="vp-band__title">Looking for something else?</h2>
                <p className="vp-band__body">
                  Tell us what you need and we will send the relevant documentation.
                </p>
              </div>
              <Button to={ROUTES.contact} variant="primary" size="sm" arrow>Contact us</Button>
            </div>
          </Reveal>
        </div>
      </section>

      {open && <PdfViewer doc={open} onClose={close} />}
    </>
  );
}
