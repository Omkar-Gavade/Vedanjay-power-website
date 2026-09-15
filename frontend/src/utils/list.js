/** Joins a list the way English does: "a", "a and b", "a, b and c". */
export const joinList = (items) => (items.length < 2
  ? (items[0] ?? '')
  : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`);
