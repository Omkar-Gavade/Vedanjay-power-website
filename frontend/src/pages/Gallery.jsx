import { useCallback, useRef, useState } from 'react';
import { company } from '../data/company.js';
import { getMedia, smallSrc } from '../data/media.js';
import { shots } from '../data/gallery.js';
import { voltageClasses } from '../data/projects.js';
import { Lightbox } from '../components/ui/Lightbox.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Reveal, RevealLines } from '../components/ui/Reveal.jsx';
import { ROUTES } from '../constants/routes.js';
import '../styles/about.css';

/**
 * Image gallery — Vedanjay Power's own site photography.
 *
 * WHAT CHANGED, 5 Sep 2026.
 * This page used to show licensed stock framed as "the classes of
 * infrastructure our work covers", with a standing notice saying so, because no
 * photography of Vedanjay's own sites had been supplied. Twelve real site
 * photographs have since been recovered from the company's own legacy gallery,
 * so the stock frames and the notice are both gone.
 *
 * The captions describe only what is visible. The source carries no project
 * name, client, location or date for any of the twelve — see data/gallery.js.
 */

function ExpandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 2H2v4M10 14h4v-4M14 6V2h-4M2 10v4h4"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Gallery() {
  const hero = getMedia('cap-projects');
  /* The INDEX, not the frame — stepping needs to know where it is in the set. */
  const [openAt, setOpenAt] = useState(-1);
  const openerRef = useRef(null);


  const close = useCallback(() => {
    setOpenAt(-1);
    requestAnimationFrame(() => openerRef.current?.focus());
  }, []);

  /* Wraps in both directions: reaching the end of eight images and finding the
     control dead is a worse answer than starting again. */
  const step = useCallback((by) => {
    setOpenAt((i) => (i + by + shots.length) % shots.length);
  }, [shots.length]);

  const open = openAt > -1 ? shots[openAt] : null;

  return (
    <>
      <title>Image Gallery — Vedanjay Power Pvt. Ltd.</title>
      <meta
        name="description"
        content={`${shots.length} photographs from Vedanjay Power's own sites — switchyard structures, metering and telemetry work, foundations, and solar and wind installations.`}
      />
      <link rel="canonical" href={`${company.website.replace(/\/$/, '')}/projects/gallery/`} />

      <section className="vp-phero vp-phero--photo" aria-labelledby="gl-h">
        <div className="vp-phero__media" aria-hidden="true">
          {hero && (
            <img src={hero.src} srcSet={`${smallSrc(hero.src)} 1000w, ${hero.src} 1800w`}
                 sizes="100vw" alt="" fetchPriority="high" decoding="async"
                 style={{ objectPosition: hero.focal }} />
          )}
        </div>
        <div className="vp-phero__inner vp-container">
          <Reveal><span className="vp-eyebrow vp-label mb-3">Projects · Gallery</span></Reveal>
          <h1 id="gl-h" className="vp-phero__title">
            <RevealLines lines={['From our own', 'sites.']} />
          </h1>
          <Reveal delay={140}>
            <p className="vp-lead vp-phero__lead mb-0">
              {shots.length} photographs taken on site — switchyard structures and
              {' '}{voltageClasses[0]} equipment, metering and telemetry work, foundations,
              and generation under construction.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="vp-section" aria-labelledby="gg-h">
        <div className="vp-container">
          <h2 id="gg-h" className="visually-hidden">Gallery</h2>


          <ul className="vp-gal list-unstyled mb-0">
            {shots.map((f, i) => (
              /* `span` drives the mosaic — see data/gallery.js. The three
                 portraits are the three `tall` cells, because a portrait in a
                 wide cell is cropped to a strip. */
              <li key={f.id} className="vp-gal__cell" data-span={f.span} style={{ '--i': i }}>
                <button
                  type="button"
                  className="vp-gal__item"
                  onClick={(e) => { openerRef.current = e.currentTarget; setOpenAt(i); }}
                  aria-label={`View: ${f.caption}`}
                >
                  <span className="vp-gal__frame">
                    <img
                      src={f.src}
                      srcSet={`${f.small} 480w, ${f.src} 800w`}
                      /* A big or wide cell is about half the container, a unit
                         cell about a quarter — telling the browser so is what
                         stops it loading the 480px file into a 590px frame. */
                      sizes={f.span === 'big' || f.span === 'wide'
                        ? '(max-width: 640px) 100vw, (max-width: 1100px) 60vw, 48vw'
                        : '(max-width: 640px) 50vw, (max-width: 1100px) 32vw, 24vw'}
                      alt={f.alt}
                      loading={i < 4 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                    <span className="vp-gal__zoom" aria-hidden="true"><ExpandIcon /></span>
                  </span>
                  <span className="vp-gal__cap">
                    <span className="vp-gal__title d-block">{f.caption}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <Reveal>
            <div className="vp-band mt-5">
              <div>
                <h3 className="vp-band__title">The full record</h3>
                <p className="vp-band__body">
                  Every engagement, with the order-placing organisation and scope of work.
                </p>
              </div>
              <Button to={ROUTES.projects} variant="outline" size="sm" arrow>Project register</Button>
            </div>
          </Reveal>
        </div>
      </section>

      {open && (
        <Lightbox
          src={open.src}
          alt={open.alt}
          label={`${open.caption} — full size`}
          caption={open.caption}
          index={openAt}
          total={shots.length}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          onClose={close}
        />
      )}
    </>
  );
}
