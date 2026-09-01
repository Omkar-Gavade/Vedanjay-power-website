import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.js';
import { industries } from '../../data/industries.js';
import { Media } from '../ui/Media.jsx';

/** Services panel. Descriptors let the menu pre-qualify the click. */
export function ServicesMega({ item, onNavigate, registerItem }) {
  let idx = 0;
  const reg = (el) => registerItem(idx++, el);

  return (
    <div className="vp-container py-4 py-xl-5">
      <div className="row g-4 g-xl-5">
        <div className="col-lg-7">
          <p className="vp-label vp-text-muted mb-3">Services</p>
          <div className="row g-1">
            {item.children.map((c) => (
              <div className="col-sm-6" key={c.href}>
                <Link ref={reg} to={c.href} className="vp-menu-link" onClick={onNavigate}>
                  <span className="vp-menu-link__title">
                    <span className="vp-menu-link__idx">{c.index}</span>
                    {c.label}
                  </span>
                  <span className="vp-menu-link__desc">{c.descriptor}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-2 vp-mega__aside ps-lg-4">
          <p className="vp-label vp-text-muted mb-3">By industry</p>
          <ul>
            {industries.map((i) => (
              <li key={i.slug}>
                <Link
                  ref={reg}
                  to={`${ROUTES.industries}${i.slug}/`}
                  onClick={onNavigate}
                  className="vp-menu-link d-block py-2"
                >
                  <span className="vp-menu-link__title">{i.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-lg-3 vp-mega__aside ps-lg-4">
          <p className="vp-label vp-text-muted mb-3">Featured work</p>
          <Link ref={reg} to={ROUTES.projects} className="vp-mega__feature vp-zoom" onClick={onNavigate}>
            <Media slug="proj-solar-field" ratio="3x2" scrim />
            <span className="d-block mt-3 vp-h4">Telemetry &amp; SLDC synchronisation</span>
            <span className="d-block vp-sm vp-text-muted mt-1">
              29.4 MW wind · Suzlon Gujarat Wind Park
            </span>
            <span className="vp-label vp-text-accent mt-2 d-inline-block">All projects &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Simpler disclosure for Industries and About. */
export function SimpleDropdown({ item, onNavigate, registerItem }) {
  return (
    <ul>
      {item.children.map((c, i) => (
        <li key={c.href}>
          <Link
            ref={(el) => registerItem(i, el)}
            to={c.href}
            className="vp-menu-link"
            onClick={onNavigate}
          >
            <span className="vp-menu-link__title">{c.label}</span>
            {c.descriptor && <span className="vp-menu-link__desc">{c.descriptor}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
