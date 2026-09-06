import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { primaryNav } from '../../data/navigation.js';
import { company } from '../../data/company.js';
import { ROUTES } from '../../constants/routes.js';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { Logo } from './Logo.jsx';
import { ThemeToggle } from './ThemeToggle.jsx';
import { Button } from '../ui/Button.jsx';

const Chevron = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

/** Full-height drawer with accordions, focus trap, scroll lock and Escape. */
export function MobileDrawer({ open, onClose, isActive }) {
  const panel = useRef(null);
  const [expanded, setExpanded] = useState(null);
  useFocusTrap(panel, open, onClose);
  useEffect(() => { if (!open) setExpanded(null); }, [open]);

  return (
    <>
      <div className="vp-drawer-backdrop d-xl-none" data-open={open ? 'true' : 'false'}
           onClick={onClose} aria-hidden="true" />
      {open && (
        <div ref={panel} className="vp-drawer d-xl-none" role="dialog" aria-modal="true"
             aria-label="Site menu" tabIndex={-1} style={{ outline: 'none' }}>
          <div className="vp-drawer__head">
            <Logo onClick={onClose} />
            <div className="d-flex align-items-center gap-1">
              <ThemeToggle />
              <button type="button" onClick={onClose} aria-label="Close menu" className="vp-theme-toggle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M5 5l14 14M19 5L5 19" />
                </svg>
              </button>
            </div>
          </div>

          <nav className="vp-drawer__body" aria-label="Mobile">
            <ul>
              {primaryNav.map((item) => {
                const kids = item.children?.filter((c) => !c.pending) ?? [];
                const pending = item.children?.filter((c) => c.pending) ?? [];
                const hasKids = kids.length > 0 || pending.length > 0;
                const isOpen = expanded === item.id;
                return (
                  <li key={item.id}>
                    <div className="vp-drawer__row">
                      <Link to={item.href} onClick={onClose} className="vp-drawer__link"
                            aria-current={isActive(item.href) ? 'page' : undefined}>
                        {item.label}
                      </Link>
                      {hasKids && (
                        <button type="button" className="vp-drawer__expand" aria-expanded={isOpen}
                                aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${item.label}`}
                                onClick={() => setExpanded(isOpen ? null : item.id)}>
                          <Chevron />
                        </button>
                      )}
                    </div>
                    {hasKids && isOpen && (
                      <ul className="vp-drawer__sub">
                        {kids.map((c) => (
                          <li key={c.href}>
                            <Link to={c.href} onClick={onClose} className="vp-drawer__sublink">{c.label}</Link>
                          </li>
                        ))}
                        {pending.length > 0 && (
                          <li className="vp-drawer__sublink vp-text-muted" style={{ borderColor: 'transparent' }}>
                            {pending.map((c) => c.label).join(' · ')} — coming soon
                          </li>
                        )}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="vp-drawer__foot">
            <Button to={ROUTES.contact} variant="primary" block onClick={onClose}>Contact Us</Button>
            <div className="d-flex flex-column mt-3">
              <a href={company.phone.href} className="d-flex align-items-center vp-sm vp-text-soft"
                 style={{ minHeight: 44 }}>{company.phone.display}</a>
              <a href={`mailto:${company.emails.general}`}
                 className="d-flex align-items-center vp-sm vp-text-soft text-break"
                 style={{ minHeight: 44 }}>{company.emails.general}</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
