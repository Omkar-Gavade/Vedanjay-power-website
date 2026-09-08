import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * The portfolio atlas: Asia as a field of dots, India at the centre, a turbine
 * on every state that carries capacity.
 *
 * WHY DOTS, AND WHY THEY ARE GENERATED
 * scripts/build-asia-dots.mjs decides the grid against the real geometry, so
 * the coastline is described by which dots exist. A dot PATTERN clipped by a
 * coastline leaves half-dots all round the edge, which is the difference
 * between the effect looking designed and looking like a fill that went wrong.
 * The same script asserts the official Indian boundary — Ladakh past 37°N,
 * J&K still containing Muzaffarabad — so the dotted shape inherits it.
 *
 * WHY ASIA. India alone floats in a void, which is the clearest tell that a
 * thing is a diagram rather than a map.
 *
 * THE COLOUR IS THE DATA. A dot's colour is its state's band of installed
 * capacity under QCA, in five steps rather than a continuous ramp: a reader can
 * tell two bands apart, but not 1,186 MW of green from 1,232 MW of green.
 */

const MIN_K = 1;
const MAX_K = 9;

/** Blades turn at slightly different speeds — a row of turbines in lockstep
 *  reads as a loading spinner rather than as weather. */
const SPIN = [7.5, 8.6, 6.9, 9.4, 8.1, 7.2, 9.9];
const BLADE = 'M0 0 C 1.3 -4, 1.6 -11, 0.6 -17 L-0.5 -1.2 Z';

function Turbine({ scale, i }) {
  return (
    <g className="vp-wt" transform={`scale(${scale})`}>
      <path className="vp-wt__mast" d="M0 0 L-1.7 27 L1.7 27 Z" />
      <ellipse className="vp-wt__base" cx="0" cy="27.5" rx="4.6" ry="1.5" />
      <g className="vp-wt__rotor" style={{ '--spin': `${SPIN[i % SPIN.length]}s` }}>
        <path className="vp-wt__blade" d={BLADE} />
        <path className="vp-wt__blade" d={BLADE} transform="rotate(120)" />
        <path className="vp-wt__blade" d={BLADE} transform="rotate(240)" />
        <circle className="vp-wt__hub" cx="0" cy="0" r="1.6" />
      </g>
    </g>
  );
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export default function PortfolioAtlas({ byState, maxMw, total, count }) {
  const [grid, setGrid] = useState(null);
  const [failed, setFailed] = useState(false);
  const [sel, setSel] = useState(null);
  const [view, setView] = useState({ k: 1, x: 0, y: 0 });
  const svgRef = useRef(null);
  const pointers = useRef(new Map());
  const pinch = useRef(null);

  useEffect(() => {
    let live = true;
    fetch('/maps/asia-dots.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => { if (live) setGrid(d); })
      .catch(() => { if (live) setFailed(true); });
    return () => { live = false; };
  }, []);

  /* Panning is clamped so the map cannot be dragged off its own frame and
     leave the visitor staring at an empty panel. */
  const applyView = useCallback((next, w, h) => {
    const k = clamp(next.k, MIN_K, MAX_K);
    const maxX = 0; const minX = w - w * k;
    const maxY = 0; const minY = h - h * k;
    return { k, x: clamp(next.x, minX, maxX), y: clamp(next.y, minY, maxY) };
  }, []);

  /** Zoom about a point given in viewBox units. */
  const zoomAt = useCallback((factor, vbX, vbY) => {
    if (!grid) return;
    setView((v) => {
      const k = clamp(v.k * factor, MIN_K, MAX_K);
      const r = k / v.k;
      return applyView({ k, x: vbX - (vbX - v.x) * r, y: vbY - (vbY - v.y) * r },
        grid.width, grid.height);
    });
  }, [grid, applyView]);

  /* A MAP MUST NOT EAT THE PAGE SCROLL. A plain wheel over this used to zoom and
     preventDefault, which trapped the visitor: scrolling down the home page
     stopped dead here. Only an explicit zoom gesture is taken — ctrl/⌘ + wheel,
     which is also what a trackpad pinch sends — and everything else is left to
     the page. React's onWheel is passive and cannot preventDefault, so the
     listener is bound here instead. */
  useEffect(() => {
    const el = svgRef.current;
    if (!el || !grid) return undefined;
    const onWheel = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const box = el.getBoundingClientRect();
      const unit = grid.width / box.width;
      zoomAt(Math.exp(-e.deltaY * 0.0016),
        (e.clientX - box.left) * unit, (e.clientY - box.top) * unit);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [grid, zoomAt]);

  if (failed) return null;
  if (!grid) return <div className="vp-atlas__pending" aria-hidden="true" />;

  const data = new Map(byState.map((s) => [s.state, s]));
  const bandOf = (name) => {
    const d = data.get(name);
    return d ? Math.min(4, Math.floor((d.mw / maxMw) * 5)) : null;
  };

  const half = grid.cell / 2;
  const groups = new Map();
  for (let i = 0; i < grid.dots.length; i += 3) {
    const cx = grid.dots[i]; const cy = grid.dots[i + 1]; const s = grid.dots[i + 2];
    const key = s === -2 ? 'world' : (s === -1 ? 'india' : grid.states[s]);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push([cx * grid.cell + half, cy * grid.cell + half]);
  }

  const unitFor = () => {
    const box = svgRef.current?.getBoundingClientRect();
    return box ? grid.width / box.width : 1;
  };

  const onPointerDown = (e) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    /* Throws if the pointer is already gone by the time this runs — a stray
       event must not take the whole handler down with it. */
    try { e.currentTarget.setPointerCapture?.(e.pointerId); } catch { /* ignore */ }
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y) };
    }
  };
  const onPointerMove = (e) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const unit = unitFor();

    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const box = svgRef.current.getBoundingClientRect();
      zoomAt(d / pinch.current.d,
        ((a.x + b.x) / 2 - box.left) * unit, ((a.y + b.y) / 2 - box.top) * unit);
      pinch.current.d = d;
      return;
    }
    if (pointers.current.size !== 1) return;
    /* One finger scrolls the PAGE until the map is zoomed in; after that the
       gesture belongs to the map, because there is somewhere to pan to. A
       mouse drag always pans — it was never going to scroll the page. */
    if (e.pointerType === 'touch' && view.k === 1) return;
    const dx = (e.clientX - prev.x) * unit;
    const dy = (e.clientY - prev.y) * unit;
    setView((v) => applyView({ ...v, x: v.x + dx, y: v.y + dy }, grid.width, grid.height));
  };
  const onPointerUp = (e) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };

  const reset = () => setView({ k: 1, x: 0, y: 0 });
  const step = (f) => zoomAt(f, grid.width / 2, grid.height / 2);
  const selected = sel ? data.get(sel) : null;

  return (
    <div className="vp-atlas">
      <div className="vp-atlas__stage">
        <svg
          ref={svgRef}
          className="vp-atlas__svg"
          viewBox={`0 0 ${grid.width} ${grid.height}`}
          role="img"
          data-grabbing={pointers.current.size === 1 ? 'true' : undefined}
          /* pan-y at rest so a touch drag scrolls the page; none once zoomed,
             when the map has somewhere to pan to. */
          style={{ touchAction: view.k > 1 ? 'none' : 'pan-y' }}
          preserveAspectRatio="xMidYMid slice"
          aria-label={`Map of Asia centred on India. Capacity under QCA forecasting and scheduling in ${byState.map((s) => `${s.state}, ${s.mw} megawatts`).join('; ')}.`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
            {[...groups].map(([name, cells]) => (
              <g
                key={name}
                className="vp-atlas__dots"
                data-kind={name === 'world' || name === 'india' ? name : 'state'}
                data-band={bandOf(name)}
                data-on={sel === name ? 'true' : undefined}
              >
                {cells.map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.5" />)}
              </g>
            ))}

            {grid.states.map((name, i) => {
              const d = data.get(name);
              if (!d) return null;
              const [ax, ay] = grid.anchors[i];
              /* Sized on the same five bands as the colour, so a small state
                 carrying real capacity is still findable. */
              const scale = (1.5 + (bandOf(name) / 4) * 0.85) / view.k ** 0.55;
              return (
                <g
                  key={name}
                  className="vp-atlas__pin"
                  data-on={sel === name ? 'true' : undefined}
                  transform={`translate(${ax} ${ay})`}
                  onClick={() => setSel(sel === name ? null : name)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${name}: ${d.mw} MW under QCA`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(sel === name ? null : name); }
                  }}
                >
                  <circle className="vp-atlas__hit" cx="0" cy="0" r={30 / view.k} />
                  <g transform={`translate(0 ${-26 * scale})`}><Turbine scale={scale} i={i} /></g>
                </g>
              );
            })}
          </g>
        </svg>

        <div className="vp-atlas__zoom">
          <button type="button" onClick={() => step(1.5)} aria-label="Zoom in">+</button>
          <button type="button" onClick={() => step(1 / 1.5)} aria-label="Zoom out">−</button>
          <button type="button" onClick={reset} aria-label="Reset the view" className="vp-atlas__reset">
            Reset
          </button>
        </div>

        <p className="vp-atlas__hint" aria-hidden="true">
          ⌘/Ctrl + scroll or pinch to zoom · drag to pan · tap a turbine
        </p>

        {selected && (
          <div className="vp-atlas__card" role="status">
            <button type="button" className="vp-atlas__close" onClick={() => setSel(null)}
                    aria-label="Close">×</button>
            <p className="vp-atlas__cardEyebrow">Portfolio</p>
            <p className="vp-atlas__cardState">{sel}</p>
            <p className="vp-atlas__cardMw">
              {selected.mw.toLocaleString('en-IN', { maximumFractionDigits: 0 })}<span>MW</span>
            </p>
            <dl className="vp-atlas__cardMeta">
              <div>
                <dt>Projects</dt>
                <dd>{selected.count}</dd>
              </div>
              <div>
                <dt>Share of book</dt>
                <dd>{((selected.mw / total) * 100).toFixed(1)}%</dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      <div className="vp-atlas__legend">
        <span className="vp-atlas__legendLabel">Capacity under QCA</span>
        <span className="vp-atlas__ramp" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((b) => <i key={b} data-band={b} />)}
        </span>
        <span className="vp-atlas__legendEnds">
          <span>{Math.round(maxMw / 5).toLocaleString('en-IN')} MW</span>
          <span>{Math.round(maxMw).toLocaleString('en-IN')} MW</span>
        </span>
        <span className="vp-atlas__legendCount">
          {count} projects · {total.toLocaleString('en-IN', { maximumFractionDigits: 0 })} MW total
        </span>
      </div>
    </div>
  );
}
