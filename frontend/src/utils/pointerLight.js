/**
 * Park a hover light under the pointer: writes `--mx` / `--my` onto the element
 * the handler is attached to, for a radial gradient in CSS to follow.
 *
 * Written straight onto the element rather than into React state, so moving the
 * mouse never re-renders anything. Touch and pen skip it — there is no hover to
 * light.
 */
export function trackPointer(e) {
  if (e.pointerType !== 'mouse') return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
}
