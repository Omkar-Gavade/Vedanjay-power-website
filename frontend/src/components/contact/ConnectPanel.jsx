import { useState } from 'react';
import { company, gmailCompose } from '../../data/company.js';
import { Reveal } from '../ui/Reveal.jsx';
import { PhoneIcon, WhatsAppIcon, MailIcon, ClockIcon } from './icons.jsx';

/**
 * "Ways to connect" — the left, compact column of the primary section.
 *
 * Editorial rows separated by hairlines, not a card grid: four bordered tiles
 * is the generic pattern this page exists to avoid, and cards would also force
 * this column wider than it needs to be. The column is deliberately narrow so
 * the enquiry form gets the space.
 *
 * Every value reads from data/company.js, so a contact change propagates here
 * with no edit and cannot drift from what the assistant tells people.
 */
const rows = [
  {
    id: 'call',
    icon: <PhoneIcon />,
    label: 'Call',
    value: `+91 ${company.phone.display}`,
    href: company.phone.href,
    action: 'Call us',
  },
  {
    id: 'whatsapp',
    icon: <WhatsAppIcon />,
    label: 'WhatsApp',
    value: `+91 ${company.whatsapp.display}`,
    href: company.whatsapp.href,
    action: 'Chat on WhatsApp',
    external: true,
  },
  {
    id: 'projects',
    icon: <MailIcon />,
    label: 'Business enquiries',
    value: company.emails.general,
    href: gmailCompose(company.emails.general),
    action: 'Email us',
    external: true,
    mail: true,
  },
  {
    id: 'operations',
    icon: <ClockIcon />,
    label: 'Operations & support',
    value: company.emails.operations,
    href: gmailCompose(company.emails.operations),
    action: 'Email operations',
    external: true,
    mail: true,
    /* The one verified availability claim. General office hours are marked
       "to be confirmed" in the source document, so they are absent. */
    note: '24×7 support for QCA Services (Forecasting and Scheduling).',
    flag: '24×7',
  },
];

export function ConnectPanel() {
  /* The email rows open Gmail web-compose in a new tab (see gmailCompose) — but
     also copy the address on click, so a visitor who composes elsewhere still
     has it to hand. The Gmail tab opens regardless. */
  const [copied, setCopied] = useState(null);
  const copyMail = (r) => {
    if (!r.mail) return;
    /* writeText rejects if the document is not focused; only call it when it can
       succeed, and swallow any residual rejection. The Gmail tab opens
       regardless via the href. */
    try {
      if (navigator.clipboard && document.hasFocus()) {
        navigator.clipboard.writeText(r.value).catch(() => {});
      }
    } catch { /* no clipboard */ }
    setCopied(r.id);
    setTimeout(() => setCopied((c) => (c === r.id ? null : c)), 1600);
  };

  return (
    <div className="vp-connect">
      <Reveal>
        <span className="vp-eyebrow vp-label mb-3">Ways to connect</span>
        <h2 id="cn-h" className="vp-h2 vp-measure-tight mb-3">
          Reach the right desk.
        </h2>
        <p className="vp-connect__intro mb-0">
          Speak to us directly, or send your requirement through the form.
        </p>
      </Reveal>

      <ul className="vp-connect__list list-unstyled mb-0">
        {rows.map((r, i) => (
          <li key={r.id}>
            <Reveal delay={60 + i * 55}>
              <div className="vp-connect__row">
                <span className="vp-connect__icon" aria-hidden="true">{r.icon}</span>

                <div className="vp-connect__body">
                  <p className="vp-connect__label">
                    {r.label}
                    {r.flag && <span className="vp-connect__flag">{r.flag}</span>}
                  </p>

                  <a
                    className="vp-connect__value"
                    href={r.href}
                    onClick={() => copyMail(r)}
                    {...(r.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {r.value}
                  </a>

                  {r.note && <p className="vp-connect__note">{r.note}</p>}

                  <a
                    className="vp-connect__action"
                    href={r.href}
                    onClick={() => copyMail(r)}
                    {...(r.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {copied === r.id ? 'Address copied' : r.action}
                    <span className="vp-arrow" aria-hidden="true">&rarr;</span>
                    <span className="visually-hidden">
                      {' '}— {r.label}{r.external ? ' (opens in a new tab)' : ''}
                    </span>
                  </a>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}
