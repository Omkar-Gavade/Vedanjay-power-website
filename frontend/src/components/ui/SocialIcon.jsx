/** Brand glyphs, drawn as paths so they render identically in both themes. */
const GLYPHS = {
  linkedin: 'M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9h4v12H3V9Zm6.5 0H13v1.7h.05c.5-.9 1.7-1.9 3.5-1.9 3.7 0 4.4 2.3 4.4 5.4V21h-4v-5.6c0-1.3 0-3.1-1.9-3.1s-2.2 1.5-2.2 3V21h-4V9Z',
  facebook: 'M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.79 8.44-4.93 8.44-9.94Z',
  x: 'M17.53 3h3.06l-6.69 7.64L21.75 21h-6.16l-4.83-6.3L5.24 21H2.18l7.15-8.17L2.25 3h6.32l4.36 5.77L17.53 3Zm-1.07 16.17h1.7L7.62 4.74H5.8l10.66 14.43Z',
};

export function SocialIcon({ id, className }) {
  const d = GLYPHS[id];
  if (!d) return null;
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"
         aria-hidden="true" focusable="false" className={className}>
      <path d={d} />
    </svg>
  );
}
