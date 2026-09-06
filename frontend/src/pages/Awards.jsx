import { useCallback, useRef, useState } from 'react';
import { company } from '../data/company.js';
import { awards } from '../data/awards.js';
import { getMedia, smallSrc } from '../data/media.js';
import { Lightbox } from '../components/ui/Lightbox.jsx';
import { Reveal, RevealLines } from '../components/ui/Reveal.jsx';
import '../styles/about.css';

/**
 * Awards & Recognition — a dated archive, not a live claim.
 *
 * Every recognition published here was verified by reading its certificate or
 * plaque — see data/awards.js for what was excluded and why.
 *
 * The certificate image is the point of the page, so each is a real button that
 * opens the full-size scan.
 *
 * THE YEAR IS STILL SHOWN, just not as furniture. An earlier version grouped
 * the awards under year headings and opened with a "2016 — 2019, nothing later
 * is published" summary, which made the page's first statement a disclaimer
 * about its own age. Every certificate now carries its year as a badge instead:
 * the fact survives, the apology does not.
 */
export default function Awards() {
  const hero = getMedia('tech-solar');
  const [open, setOpen] = useState(null);
  const openerRef = useRef(null);

  const close = useCallback(() => {
    setOpen(null);
    requestAnimationFrame(() => openerRef.current?.focus());
  }, []);


  return (
    <>
      <title>Awards &amp; Recognition — Vedanjay Power Pvt. Ltd.</title>
      <meta
        name="description"
        content="Industry recognition received by Vedanjay Power Pvt. Ltd. between 2016 and 2019, including RE Assets Excellence Awards, SolarRoofs Series Excellence Awards and listings by The CEO Magazine and Consultants Review."
      />
      <link rel="canonical" href={`${company.website.replace(/\/$/, '')}/about/awards/`} />

      <section className="vp-phero vp-phero--photo" aria-labelledby="aw-h">
        {/* Was a flat colour plate. The awards are for rooftop and O&M work, so
            the hero is now the asset class they were won on. */}
        <div className="vp-phero__media" aria-hidden="true">
          {hero && (
            <img src={hero.src} srcSet={`${smallSrc(hero.src)} 1000w, ${hero.src} 1800w`}
                 sizes="100vw" alt="" fetchPriority="high" decoding="async"
                 style={{ objectPosition: hero.focal }} />
          )}
        </div>
        <div className="vp-phero__inner vp-container">
          <Reveal><span className="vp-eyebrow vp-label mb-3">About us · Recognition</span></Reveal>
          <h1 id="aw-h" className="vp-phero__title">
            <RevealLines lines={['Recognised across', 'the solar sector.']} />
          </h1>
          <Reveal delay={140}>
            <p className="vp-lead vp-phero__lead mb-0">
              Industry awards and listings received by Vedanjay Power and its
              directors, each shown with the certificate or plaque awarded.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="vp-section vp-section--tight-top" aria-labelledby="ar-h">
        <div className="vp-container">
          <h2 id="ar-h" className="visually-hidden">Awards by year</h2>

          <div className="vp-awards">
            {awards.map((a, i) => (
              <Reveal key={a.id} delay={i * 55} className="h-100">
                <article className="vp-award" style={{ '--i': i }}>
                  <button
                    type="button"
                    className="vp-award__shot"
                    onClick={(e) => { openerRef.current = e.currentTarget; setOpen(a); }}
                    aria-label={`View the ${a.title} certificate at full size`}
                  >
                    <img src={a.image} alt={a.alt} loading="lazy" decoding="async" />
                    {/* Always in the DOM, so the year reaches assistive tech and
                        touch users whatever the pointer can do; the stylesheet
                        is what holds it back until hover on a mouse. */}
                    <span className="vp-award__year">{a.year}</span>
                  </button>
                  <div className="vp-award__body">
                    <span className="vp-award__result">{a.result}</span>
                    <h3 className="vp-award__title">{a.title}</h3>
                    {a.category && <p className="vp-award__cat">{a.category}</p>}
                    <p className="vp-award__meta">
                      {a.organisation}
                      {a.date && <> · {a.date}</>}
                      {a.venue && <> · {a.venue}</>}
                      {a.individual && <span className="vp-award__who">{a.individual}</span>}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {open && (
        <Lightbox
          src={open.image}
          alt={open.alt}
          label={`${open.title} — full size`}
          caption={`${open.title} · ${open.organisation}${open.date ? ` · ${open.date}` : ''}`}
          onClose={close}
        />
      )}
    </>
  );
}
