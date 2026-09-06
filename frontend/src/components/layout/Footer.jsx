import { Link } from 'react-router-dom';
import { primaryNav, footerCapabilities } from '../../data/navigation.js';
import { company, currentYear } from '../../data/company.js';
import { ROUTES } from '../../constants/routes.js';
import { SocialIcon } from '../ui/SocialIcon.jsx';

/**
 * Corporate footer. Every address, number and address line comes from the
 * source document. Social links are LinkedIn only — the document states no
 * other account, and none is invented.
 */
export function Footer() {
  return (
    <footer className="vp-footer">
      <div className="vp-container">
        <div className="row g-4 g-lg-5 vp-footer__top">
          {/* Company */}
          <div className="col-12 col-lg-4">
            {/* The logo lockup carries dark text, so on the dark footer it sits on
                a white plate rather than being recoloured. */}
            <span className="vp-brand vp-brand--plated">
              <img src="/brand/vedanjay-power-logo.png"
                   srcSet="/brand/vedanjay-power-logo.png 400w, /brand/vedanjay-power-logo@2x.png 800w"
                   sizes="180px" width="400" height="99" loading="lazy" decoding="async"
                   alt="Vedanjay Power Pvt. Ltd." style={{ height: 42, width: 'auto', display: 'block' }} />
            </span>
            <p className="vp-footer__tagline mt-3 mb-3">{company.tagline}</p>
            <p className="vp-sm vp-footer__desc mb-0">{company.overview}</p>
          </div>

          {/* Navigation */}
          <nav className="col-6 col-lg-2" aria-label="Footer navigation">
            <h2 className="vp-footer__title">Navigation</h2>
            <ul>
              {primaryNav.map((i) => (
                <li key={i.id}><Link to={i.href} className="vp-footer__link">{i.label}</Link></li>
              ))}
            </ul>
          </nav>

          {/* Capabilities */}
          <nav className="col-6 col-lg-3" aria-label="Capabilities">
            <h2 className="vp-footer__title">Capabilities</h2>
            <ul>
              {footerCapabilities.map((c) => (
                <li key={c}><Link to={ROUTES.services} className="vp-footer__link">{c}</Link></li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="col-12 col-lg-3">
            <h2 className="vp-footer__title">Contact</h2>
            {company.offices.map((o) => (
              <address key={o.id} className="vp-footer__office">
                <span className="vp-footer__office-role">{o.role}</span>
                {o.lines.map((l) => <span key={l} className="d-block">{l}</span>)}
              </address>
            ))}
            <ul className="vp-footer__contacts">
              <li><a className="vp-footer__link" href={company.phone.href}>{company.phone.display}</a></li>
              <li><a className="vp-footer__link text-break" href={`mailto:${company.emails.general}`}>{company.emails.general}</a></li>
              <li>
                <a className="vp-footer__link text-break" href={`mailto:${company.emails.operations}`}>
                  {company.emails.operations}
                </a>
                <span className="vp-footer__hint d-block">Operations &amp; support</span>
              </li>
              <li>
                <a className="vp-footer__link" href={company.whatsapp.href} target="_blank" rel="noopener noreferrer">
                  WhatsApp {company.whatsapp.display}
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>

            {/* Only LinkedIn has a verified URL (IRD §22). Facebook and X render
                as disabled buttons rather than links to invented handles. */}
            <ul className="vp-footer__social">
              {company.social.map((s) =>
                s.href ? (
                  <li key={s.id}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer"
                       className="vp-footer__social-link"
                       aria-label={`${company.name} on ${s.label}`}>
                      <SocialIcon id={s.id} />
                      <span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                  </li>
                ) : (
                  <li key={s.id}>
                    <span
                      className="vp-footer__social-link is-pending"
                      role="img"
                      aria-label={`${s.label} — account not yet published`}
                      title={`${s.label} — coming soon`}
                    >
                      <SocialIcon id={s.id} />
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className="vp-footer__bar">
          <p className="vp-sm mb-0">
            &copy; {currentYear()} {company.legalName}. All rights reserved.
          </p>
          <div className="vp-footer__legal">
            <Link to={ROUTES.privacy} className="vp-footer__link">Privacy Policy</Link>
            <Link to={ROUTES.terms} className="vp-footer__link">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
