import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { primaryNav } from '../../data/navigation.js';
import { company } from '../../data/company.js';
import { enquiryHref } from '../../constants/routes.js';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { Brand } from './Brand.jsx';
import { ThemeToggle } from './ThemeToggle.jsx';
import { Button } from '../ui/Button.jsx';

const Chevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

/**
 * Full-height drawer. Accordions rather than nested drill-down screens: with
 * 4–6 children per section, going a level deep and back is slower and more
 * disorienting than expanding in place.
 */
export function MobileDrawer({ open, onClose, isActive }) {
  const panel = useRef(null);
  const [expanded, setExpanded] = useState(null);
  useFocusTrap(panel, open, onClose);

  useEffect(() => { if (!open) setExpanded(null); }, [open]);

  return (
    <>
      <div
        className="vp-drawer-backdrop d-lg-none"
        data-open={open ? 'true' : 'false'}
        onClick={onClose}
        aria-hidden="true"
      />
      {open && (
        <div
          ref={panel}
          className="vp-drawer d-lg-none"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className="vp-drawer__head">
            <Brand onClick={onClose} />
            <div className="d-flex align-items-center gap-1">
              <ThemeToggle />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="vp-theme-toggle"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M5 5l14 14M19 5L5 19" />
                </svg>
              </button>
            </div>
          </div>

          <nav className="vp-drawer__body" aria-label="Mobile">
            <ul>
              {primaryNav.map((item, i) => {
                const hasKids = Boolean(item.children);
                const isOpen = expanded === item.id;
                return (
                  <li
                    key={item.id}
                    className="vp-drawer-item"
                    style={{ animationDelay: `${80 + i * 45}ms` }}
                  >
                    <div className="vp-drawer__row">
                      <Link
                        to={item.href}
                        onClick={onClose}
                        className="vp-drawer__link"
                        aria-current={isActive(item.href) ? 'page' : undefined}
                      >
                        {item.label}
                      </Link>
                      {hasKids && (
                        <button
                          type="button"
                          className="vp-drawer__expand"
                          aria-expanded={isOpen}
                          aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${item.label}`}
                          onClick={() => setExpanded(isOpen ? null : item.id)}
                        >
                          <Chevron />
                        </button>
                      )}
                    </div>

                    {hasKids && isOpen && (
                      <ul className="vp-drawer__sub">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link to={c.href} onClick={onClose} className="vp-drawer__sublink">
                              {c.label}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link to={item.href} onClick={onClose} className="vp-drawer__sublink vp-text-accent">
                            All {item.label} &rarr;
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="vp-drawer__foot">
            <Button to={enquiryHref('general')} variant="accent" block arrow onClick={onClose}>
              Enquire
            </Button>
            {/* On a phone, calling beats filling in a form. */}
            <div className="d-flex flex-column mt-3">
              <a href={company.phones[0].href} className="d-flex align-items-center gap-2 vp-sm vp-text-soft" style={{ minHeight: 44 }}>
                <span aria-hidden="true" className="vp-text-accent">&#9742;</span>
                {company.phones[1].value}
              </a>
              <a href={`mailto:${company.emails[0].value}`} className="d-flex align-items-center gap-2 vp-sm vp-text-soft text-break" style={{ minHeight: 44 }}>
                <span aria-hidden="true" className="vp-text-accent">&#9993;</span>
                {company.emails[0].value}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
