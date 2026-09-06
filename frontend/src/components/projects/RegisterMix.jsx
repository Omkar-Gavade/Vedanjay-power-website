import { projectCategories, projectCounts, PROJECT_TOTAL } from '../../data/projects.js';

/**
 * The shape of the register, as one bar.
 *
 * A 52-row list tells you what the company has done but not what KIND of
 * company it is — you have to read all 52 and keep a tally. The bar does that
 * tally: five segments, sized by share, so the balance between electrical work,
 * liaisoning, O&M and civil is legible before a single row is read.
 *
 * IT IS ALSO THE FILTER. Every segment and every legend row sets the register's
 * category, so the picture and the list are the same control rather than a chart
 * sitting decoratively above a table.
 *
 * Counts come from projectCounts, which the register generator derives and
 * asserts against the 52 rows — nothing here is counted by hand.
 */
export function RegisterMix({ active, onPick }) {
  const cats = projectCategories.filter((c) => c.id !== 'all');
  const pct = (n) => (n / PROJECT_TOTAL) * 100;

  return (
    <div className="vp-mix">
      {/* `data-filtered` rather than a :has() selector — the dimming is driven
          by the same state that drives the register, so it cannot disagree with
          it, and it does not depend on selector support. */}
      <div className="vp-mix__bar" data-filtered={active !== 'all' ? 'true' : undefined} role="img"
           aria-label={cats.map((c) => `${c.label}, ${projectCounts[c.id]} of ${PROJECT_TOTAL}`).join('; ')}>
        {cats.map((c, i) => (
          <button
            key={c.id}
            type="button"
            className="vp-mix__seg"
            data-cat={c.id}
            data-on={active === c.id ? 'true' : undefined}
            style={{ '--w': `${pct(projectCounts[c.id])}%`, '--i': i }}
            /* Clicking the active segment clears it, so the bar can undo
               itself rather than trapping the reader in one category. */
            onClick={() => onPick(active === c.id ? 'all' : c.id)}
            aria-label={`Show ${c.label} — ${projectCounts[c.id]} entries`}
            title={`${c.label} · ${projectCounts[c.id]}`}
          />
        ))}
      </div>

      <ul className="vp-mix__key">
        {cats.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              className="vp-mix__keyBtn"
              data-cat={c.id}
              aria-pressed={active === c.id}
              onClick={() => onPick(active === c.id ? 'all' : c.id)}
            >
              <span className="vp-mix__dot" aria-hidden="true" />
              <span className="vp-mix__label">{c.label}</span>
              <span className="vp-mix__n">{projectCounts[c.id]}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
