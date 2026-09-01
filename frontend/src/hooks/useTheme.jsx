import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'vp-theme';
const ThemeContext = createContext(null);

/** Reads the theme the inline boot script already resolved and applied. */
function readAppliedTheme() {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'dark' : 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readAppliedTheme);
  const [explicit, setExplicit] = useState(
    () => typeof localStorage !== 'undefined' && !!localStorage.getItem(STORAGE_KEY),
  );

  const apply = useCallback((next) => {
    const root = document.documentElement;
    // Suppress per-element transitions for one frame so the switch reads as a
    // single deliberate change rather than hundreds of independent fades.
    root.classList.add('vp-theme-booting');
    root.setAttribute('data-bs-theme', next);
    root.style.colorScheme = next;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => root.classList.remove('vp-theme-booting'));
    });
  }, []);

  const setThemeAndPersist = useCallback((next) => {
    setTheme(next);
    setExplicit(true);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* private mode */ }
    apply(next);
  }, [apply]);

  const toggle = useCallback(() => {
    setThemeAndPersist(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setThemeAndPersist]);

  /* Follow the OS only until the user makes an explicit choice. */
  useEffect(() => {
    if (explicit) return undefined;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => {
      const next = e.matches ? 'dark' : 'light';
      setTheme(next);
      apply(next);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [explicit, apply]);

  const value = useMemo(() => ({ theme, toggle, setTheme: setThemeAndPersist }), [theme, toggle, setThemeAndPersist]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
