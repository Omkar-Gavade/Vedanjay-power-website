/**
 * LEADERSHIP.
 *
 * SOURCE OF TRUTH, updated 5 Sep 2026: "Forecasting for Renewable Energies",
 * the company's own deck (PowerPoint export, created 19 Aug 2026, carrying the
 * current vedanjay-power.com domain and the current Pune address). Its "Our
 * Team" slide names three people, gives their titles, and supplies their
 * photographs.
 *
 * WHAT CHANGED, AND WHY
 * The previous source was the older company information document (IRD), which
 * named two Managing Directors. The deck supersedes it on three points:
 *
 *  - Titles. Founder / Co Founder / CEO, not two Managing Directors. The IRD's
 *    "Managing Director" is a statutory role and may still be held; the deck is
 *    how the company presents itself now, and the content rule is that current
 *    verified information wins.
 *  - A third person. Ankita Yadav, CEO, appears for the first time.
 *  - Spelling. The deck writes "Anjali", agreeing with the MCA registry and the
 *    SolarQuarter Women Leaders listing against the IRD's "Anjaly".
 *
 * PHOTOGRAPHS are the company's own, cropped from that slide. They are not
 * stock and not generated. This replaces the monogram placeholder that stood in
 * while no portrait existed.
 *
 * STILL DELIBERATELY ABSENT — and why:
 *
 * - B. N. S. Yadav (Vice President) and Atish Malviya (LTOA & Open Access
 *   Billing) appear on the LEGACY site only. The deck does not list them, so
 *   nothing confirms they are still with the company.
 * - Personal mobile numbers and individual email addresses. On a public page
 *   that is a spam-harvesting liability. Enquiries route through company.js.
 * - Biographies. The deck supplies titles and photographs, no professional
 *   history, so the profiles stay short rather than invented.
 *
 * WHAT THE PAGE NO LONGER SAYS
 * A standing note used to tell visitors that biographies and profile links
 * "will be published as the company supplies them", and each profile without a
 * LinkedIn URL carried a "to be published" line. That is build-status commentary
 * — useful while the page was being assembled, an advertisement of gaps once it
 * is public. A profile now shows what exists and is silent about what does not.
 */

/** @typedef {{id:string, name:string, role:string, photo:string|null, linkedin:string|null, focus:string|null}} Leader */

/** @type {Leader[]} */
export const leadership = [
  {
    id: 'gajanan-yadav',
    name: 'Gajanan Yadav',
    role: 'Founder',
    photo: '/team/gajanan-yadav.jpg',
    /* Supplied by the company. Stored without the trailing slash, which is
       where LinkedIn itself redirects. The other two have no profile URL, and
       the page says nothing about that rather than advertising the gap. */
    linkedin: 'https://www.linkedin.com/in/gajanan-yadav-645367154',
    focus: 'Recognised by SolarQuarter among India’s 40 Most Promising Young Business Leaders in the Solar Industry.',
  },
  {
    id: 'anjali-yadav',
    name: 'Anjali Yadav',
    role: 'Co Founder',
    photo: '/team/anjali-yadav.jpg',
    linkedin: null,
    focus: 'Recognised by SolarQuarter among Women Leaders in the Solar Sector.',
  },
  {
    id: 'ankita-yadav',
    name: 'Ankita Yadav',
    role: 'CEO',
    photo: '/team/ankita-yadav.jpg',
    linkedin: null,
    /* No award listing or other corroboration names her, so nothing is stated
       beyond the title and photograph the company published. */
    focus: null,
  },
];

/** Joins a list the way English does: "a, b and c". */
const list = (items) => (items.length < 2
  ? (items[0] ?? '')
  : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`);

/**
 * Derived so no page hardcodes the roster.
 *
 * Four pages said "two Managing Directors" in prose. When the company published
 * a third person and different titles, every one of them silently became wrong.
 */
export const leadershipNames = list(leadership.map((l) => l.name));
export const leadershipRoles = list(leadership.map((l) => l.role));
