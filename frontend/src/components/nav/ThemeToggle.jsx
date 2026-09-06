import { useTheme } from '../../hooks/useTheme.jsx';

/** Light/dark control, sized as a real 44px target and styled as a quiet
 *  product control rather than a novelty. */
export function ThemeToggle({ className }) {
  const { theme, toggle } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      className={`vp-theme-toggle ${className || ''}`}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      <svg className="vp-theme-toggle__icon vp-theme-toggle__icon--moon" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"
           strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
      <svg className="vp-theme-toggle__icon vp-theme-toggle__icon--sun" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"
           strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.6v2.2M12 19.2v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.6 12h2.2M19.2 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
      </svg>
    </button>
  );
}
