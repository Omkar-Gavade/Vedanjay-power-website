import { useState } from 'react';
import { Link } from 'react-router-dom';
import { capabilities } from '../../data/capabilities.js';
import { getMedia, smallSrc } from '../../data/media.js';
import { ROUTES } from '../../constants/routes.js';
import { Reveal } from '../ui/Reveal.jsx';

/**
 * The six service lines, explorable.
 *
 * This section used to be an ordered list of six names and nothing else — the
 * six things the company sells, on its second most important page, with no way
 * to find out what any of them meant without leaving for the services page.
 *
 * Everything shown comes from capabilities.js, the same module the services
 * page renders: the name, the summary, the four points, and the photograph
 * already registered against that line. No copy is written here.
 */
export function ServiceExplorer() {
  const [activeId, setActiveId] = useState(capabilities[0].id);
  const active = capabilities.find((c) => c.id === activeId) ?? capabilities[0];
  const img = getMedia(active.media);

  return (
    <div className="vp-svcx">
      {/* The selector. A tablist would promise arrow-key semantics this does not
          implement, so these are ordinary buttons in the published order. */}
      <Reveal className="vp-svcx__list">
        <ol className="vp-svcx__ol">
          {capabilities.map((c, i) => (
            <li key={c.id} style={{ '--i': i }}>
              <button
                type="button"
                className="vp-svcx__item"
                aria-pressed={c.id === activeId}
                onClick={() => setActiveId(c.id)}
                onMouseEnter={() => setActiveId(c.id)}
                onFocus={() => setActiveId(c.id)}
              >
                <span className="vp-svcx__n" aria-hidden="true">{c.index}</span>
                <span className="vp-svcx__name">{c.name}</span>
              </button>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal delay={90} className="vp-svcx__panel">
        {/* `key` restarts the fade whenever the selection changes. */}
        <div className="vp-svcx__card" key={active.id}>
          {img && (
            <div className="vp-svcx__figure">
              <img
                src={img.src}
                srcSet={`${smallSrc(img.src)} 1000w, ${img.src} 1800w`}
                sizes="(min-width: 900px) 44vw, 92vw"
                alt={img.alt}
                width="1680" height="1120"
                loading="lazy" decoding="async"
                style={{ objectPosition: img.focal }}
              />
            </div>
          )}
          <div className="vp-svcx__body">
            <h3 className="vp-svcx__title">{active.name}</h3>
            <p className="vp-svcx__summary">{active.summary}</p>
            <ul className="vp-svcx__points list-unstyled">
              {active.points.map((p) => (
                <li key={p}><span aria-hidden="true" />{p}</li>
              ))}
            </ul>
            <Link className="vp-svcx__more" to={ROUTES.services}>
              See this on the services page
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
