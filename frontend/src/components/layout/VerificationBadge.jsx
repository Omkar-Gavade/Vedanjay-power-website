import { useState } from 'react';
import { stats } from '../../data/stats.js';
import { credentials, partner } from '../../data/credentials.js';
import { withheld, isDev } from '../../data/verification.js';

/** Dev-only. Keeps withheld claims visible during the build rather than a
 *  silent omission somebody rediscovers at launch. */
export function VerificationBadge() {
  const [open, setOpen] = useState(false);
  if (!isDev) return null;

  const items = [...withheld(stats), ...withheld(credentials), ...withheld([partner])];
  if (!items.length) return null;

  return open ? (
    <div className="vp-verify-badge" style={{ maxWidth: '21rem', maxHeight: '60vh', overflowY: 'auto' }}>
      <div className="d-flex justify-content-between align-items-start gap-3">
        <strong>{items.length} claims withheld</strong>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close" style={{ color: 'inherit' }}>&times;</button>
      </div>
      <ul className="mt-2">
        {items.map((i) => (
          <li key={i.id ?? i.name} className="mb-2" style={{ borderLeft: '2px solid var(--vp-amber-600)', paddingLeft: '.6rem' }}>
            <div style={{ color: '#EAF2F0' }}>{i.label ?? i.name}</div>
            <div style={{ opacity: .7 }}>{i.blockedBy}</div>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <button type="button" className="vp-verify-badge" onClick={() => setOpen(true)}>
      {items.length} TO VERIFY
    </button>
  );
}
