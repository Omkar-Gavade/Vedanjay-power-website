/** Joins class names, dropping falsy values. */
export const cn = (...parts) => parts.filter(Boolean).join(' ');
