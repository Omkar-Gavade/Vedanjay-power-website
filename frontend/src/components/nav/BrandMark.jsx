/**
 * Brand mark — two conductors converging into a V, reading as both the initial
 * and a busbar junction. Colours are the sampled logo values: brand green with
 * the petrol-blue core and an amber spark.
 * Replace with the client's official vector when supplied (TO VERIFY #18).
 */
export function BrandMark({ className }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" strokeOpacity=".22" strokeWidth="1" />
      <path d="M8 11 L20 31 L32 11" fill="none" stroke="var(--vp-green-500)"
            strokeWidth="3.2" strokeLinecap="square" strokeLinejoin="miter" />
      <path d="M14.5 11 L20 20 L25.5 11" fill="none" stroke="var(--vp-blue-400)"
            strokeWidth="2.4" strokeLinecap="square" strokeLinejoin="miter" />
      <circle cx="20" cy="24.5" r="2" fill="var(--vp-amber-500)" />
    </svg>
  );
}
