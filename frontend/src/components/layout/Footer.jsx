import { Link } from 'react-router-dom';
import { footerNav } from '../../data/navigation.js';
import { company, currentYear } from '../../data/company.js';
import { ROUTES } from '../../constants/routes.js';
import { BrandMark } from '../nav/BrandMark.jsx';

/**
 * Footer as the site's second navigation axis, plus the institutional line.
 * The CIN appears on every page: externally checkable, one line, and exactly
 * what procurement and diligence readers look for.
 * The year is COMPUTED — the legacy site's hard-coded 2017 is the clearest
 * signal of abandonment on the whole site.
 */
export function Footer() {
  const office = company.offices[0];

  return (
    <footer className="vp-footer">
      <div className="vp-container">
        <div className="row g-4 g-lg-5 py-5 py-lg-6" style={{ paddingBlock: 'clamp(3rem,2rem+3vw,5rem)' }}>
          <div className="col-12 col-lg-3">
            <span className="vp-brand mb-4 d-inline-flex">
              <BrandMark className="vp-brand__mark" />
              <span>
                <span className="vp-brand__name d-block" style={{ color: '#fff' }}>VEDANJAY</span>
                <span className="vp-brand__sub" style={{ color: 'rgb(234 242 240 / .5)' }}>POWER</span>
              </span>
            </span>
            <p className="vp-sm mb-4" style={{ maxWidth: '28ch' }}>{company.tagline}</p>

            <address className="fst-normal mb-0">
              <p className="vp-label vp-footer__col-title mb-2">{office.role}</p>
              {office.lines.map((l) => <p key={l} className="vp-sm mb-0">{l}</p>)}
              <div className="d-flex flex-column mt-3">
                <a href={company.phones[0].href} className="vp-sm vp-footer__link">{company.phones[1].value}</a>
                <a href={`mailto:${company.emails[0].value}`} className="vp-sm vp-footer__link text-break">
                  {company.emails[0].value}
                </a>
              </div>
            </address>
          </div>

          {footerNav.map((col) => (
            <nav className="col-6 col-lg-3" aria-label={col.title} key={col.title}>
              <h2 className="vp-label vp-footer__col-title mb-3">{col.title}</h2>
              <ul>
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link to={l.href} className="vp-sm vp-footer__link">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="vp-footer__rule" />
        <p className="vp-label py-4 mb-0" style={{ color: 'rgb(234 242 240 / .45)' }}>
          {company.legalName} &middot; Incorporated {company.incorporated} &middot; CIN {company.cin}
        </p>

        <div className="vp-footer__rule" />
        <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 py-4">
          <p className="vp-sm mb-0" style={{ color: 'rgb(234 242 240 / .5)' }}>
            &copy; {currentYear()} {company.legalName}
          </p>
          <div className="d-flex flex-wrap align-items-center gap-4">
            <Link to={ROUTES.privacy} className="vp-sm vp-footer__link">Privacy</Link>
            <Link to={ROUTES.terms} className="vp-sm vp-footer__link">Terms</Link>
            {company.social.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="vp-sm vp-footer__link">
                {s.label}<span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
