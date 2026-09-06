import { useEffect, useRef, useState } from 'react';

/**
 * The portfolio map.
 *
 * WHY THE BOUNDARY IS GENERATED, NOT BORROWED
 * Geometry comes from scripts/build-india-map.mjs, which asserts that Ladakh
 * reaches past 37°N and 80°E and that Jammu and Kashmir still contains
 * Muzaffarabad and Mirpur. Every off-the-shelf india.json on a CDN draws the
 * line of control instead, which is not India's official map.
 *
 * WHAT CHANGED AT THE SECOND PASS
 * The first version stacked nine offset copies of the landmass to fake depth.
 * At any real size that reads as a stair-stepped edge, which is exactly the
 * "cheap" tell. Depth is now a single soft shadow, the shading carries actual
 * data rather than a flat highlight, and the geometry was regenerated at ~275 m
 * tolerance with two decimal places so it stays clean when magnified.
 *
 * THE SHADING IS THE DATA
 * States are filled on a scale of installed capacity under QCA — a choropleth —
 * with a proportional bubble on top so a small state carrying real capacity
 * (Gujarat, 70 MW) is still findable. Both come from data/portfolio.js, whose
 * rows sum to the deck's own stated total.
 */


export default function IndiaMap({ byState, maxMw, active, onPick }) {
  const [map, setMap] = useState(null);
  const [failed, setFailed] = useState(false);
  const [tip, setTip] = useState(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    let live = true;
    fetch('/maps/india-states.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => { if (live) setMap(d); })
      .catch(() => { if (live) setFailed(true); });
    return () => { live = false; };
  }, []);

  /* The list beside the map is the real control surface, so losing the
     illustration costs the picture and nothing else. */
  if (failed) return null;
  if (!map) return <div className="vp-map__pending" aria-hidden="true" />;

  const data = new Map(byState.map((s) => [s.state, s]));

  /* Pointer position for the tooltip, in the wrapper's own coordinates. */
  const track = (e, state) => {
    const box = wrapRef.current?.getBoundingClientRect();
    if (!box) return;
    setTip({ state, x: e.clientX - box.left, y: e.clientY - box.top });
  };

  return (
    <div className="vp-mapfig" ref={wrapRef}>
      <svg
        className="vp-map"
        viewBox={`0 0 ${map.width} ${map.height}`}
        role="img"
        aria-label={`Map of India. Installed capacity under QCA forecasting and scheduling in ${byState.map((s) => `${s.state}, ${s.mw} megawatts`).join('; ')}.`}
      >
        <defs>
          {/* One soft shadow for the whole landmass. Replaces nine stacked
              copies, which stair-stepped along every coastline. */}
          <filter id="vp-map-lift" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="7" stdDeviation="7"
                          floodColor="var(--vp-map-shadow)" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* The land on the other side of every border, held at a whisper —
            enough to stop the country floating in a void, not enough to compete
            with the data. India is painted opaquely on top, so Natural Earth's
            line of control is never visible: see the CONTEXT note in the
            generator. */}
        <g className="vp-map__ctx">
          {map.context.map((c) => <path key={c.name} d={c.path} />)}
        </g>
        <g filter="url(#vp-map-lift)">
          {map.states.map((s) => {
            const d = data.get(s.name);
            /* Five steps rather than a continuous ramp: a reader can tell two
               bands apart, but not 1,186 MW of green from 1,232 MW of green. */
            const band = d ? Math.min(4, Math.floor((d.mw / maxMw) * 5)) : null;
            return (
              <path
                key={s.name}
                d={s.fill}
                className="vp-map__state"
                data-band={band}
                data-on={active === s.name ? 'true' : undefined}
                onMouseMove={d ? (e) => track(e, s.name) : undefined}
                onMouseLeave={d ? () => setTip(null) : undefined}
                onClick={d ? () => onPick?.(active === s.name ? null : s.name) : undefined}
              />
            );
          })}
          {map.states.map((s) => (
            <path key={s.name} d={s.outline} className="vp-map__edge" />
          ))}
          {/* Heavier than the internal borders, as on any printed map. */}
          <path d={map.national} className="vp-map__coast" />
        </g>

      </svg>

      {/* Tooltip lives in the DOM, not the SVG: real text rendering, and it can
          overflow the map's own box without being clipped. */}
      {tip && data.get(tip.state) && (
        <div className="vp-maptip" style={{ left: `${tip.x}px`, top: `${tip.y}px` }} aria-hidden="true">
          <span className="vp-maptip__state">{tip.state}</span>
          <span className="vp-maptip__mw">
            {data.get(tip.state).mw.toLocaleString('en-IN')} MW
          </span>
          <span className="vp-maptip__n">
            {data.get(tip.state).count} {data.get(tip.state).count === 1 ? 'project' : 'projects'}
          </span>
        </div>
      )}
    </div>
  );
}
