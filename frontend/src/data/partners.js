/**
 * PARTNERS.
 *
 * SOURCE: the "Our Partners" slide of "Forecasting for Renewable Energies",
 * the company's own deck (created 19 Aug 2026). Every name below is read from
 * that logo wall — nothing is inferred, and no organisation appears here that
 * does not appear there.
 *
 * ON THE WORD "PARTNERS"
 * It is the company's own heading, and it is used here unchanged. Several of
 * these organisations also appear in the deck's project table as the
 * counterparty for a forecasting or QCA engagement, so the relationship is
 * commercial rather than a joint venture. The page says that plainly rather
 * than implying alliances the source does not describe.
 *
 * LOGOS are the artwork from that same slide, sliced out at native resolution
 * and keyed to transparency — the slide is white, so every mark arrived sitting
 * on an opaque white rectangle, and left alone each one renders as a white box
 * on the page. Un-multiplying against white removes the box and leaves the
 * mark, with anti-aliased edges surviving as partial alpha and interior white
 * becoming a real hole rather than paint. That is what lets the wall grey them
 * uniformly at rest without the boxes showing.
 *
 * They are third-party trade marks reproduced from a listing the company itself
 * publishes — presented plainly, at a uniform size, with no implication of
 * endorsement. If any owner objects, deleting the `logo` field drops that
 * partner back to a type-set name and it moves to the unmarked group on the
 * page, with no other change.
 *
 * NOT PUBLISHED, deliberately:
 * - Contract values, dates, scope or status for any relationship. The slide is
 *   a logo wall; it carries none of that.
 *
 * GROUPING is descriptive and derived only from what each organisation
 * publicly is — it adds no claim about the relationship itself.
 */

/** @typedef {{name:string, group:string}} Partner */

/** @type {Partner[]} */
export const partners = [
  { name: 'Adani Solar', group: 'Renewable developers & IPPs', logo: '/partners/adani-solar.png' },
  { name: 'Hero Future Energies', group: 'Renewable developers & IPPs', logo: '/partners/hero-future-energies.png' },
  { name: 'Juniper Green Energy', group: 'Renewable developers & IPPs', logo: '/partners/juniper-green-energy.png' },
  { name: 'Sembcorp', group: 'Renewable developers & IPPs', logo: '/partners/sembcorp.png' },
  { name: 'Sprng Energy', group: 'Renewable developers & IPPs', logo: '/partners/sprng-energy.png' },
  { name: 'UPC Renewables', group: 'Renewable developers & IPPs', logo: '/partners/upc-renewables.png' },
  { name: 'Virescent Infrastructure', group: 'Renewable developers & IPPs', logo: '/partners/virescent.png' },
  { name: 'Onward Solar', group: 'Renewable developers & IPPs', logo: '/partners/onward-solar.png' },
  { name: 'Mundra Energy', group: 'Renewable developers & IPPs', logo: '/partners/mundra-energy.png' },
  { name: 'Mundra Solar', group: 'Renewable developers & IPPs', logo: '/partners/mundra-solar.png' },
  { name: 'Enrich', group: 'Renewable developers & IPPs', logo: '/partners/enrich.png' },
  { name: 'PickRenew', group: 'Renewable developers & IPPs', logo: '/partners/pickrenew.png' },
  { name: 'SEIT', group: 'Renewable developers & IPPs', logo: '/partners/seit.png' },
  { name: 'ZTRIC', group: 'Renewable developers & IPPs', logo: '/partners/ztric.png' },
  { name: 'Globus Power Generation Limited', group: 'Renewable developers & IPPs', logo: '/partners/globus-power.png' },

  { name: 'Tata Power', group: 'Utilities & energy majors', logo: '/partners/tata-power.png' },
  { name: 'Torrent Power', group: 'Utilities & energy majors', logo: '/partners/torrent-power.png' },
  { name: 'GAIL (India) Limited', group: 'Utilities & energy majors', logo: '/partners/gail-india.png' },
  { name: 'Shell', group: 'Utilities & energy majors', logo: '/partners/shell.png' },
  { name: 'IndiGrid', group: 'Utilities & energy majors', logo: '/partners/indigrid.png' },

  { name: 'Fourth Dimension Group', group: 'Engineering & institutional', logo: '/partners/fourth-dimension-group.png' },
  { name: 'College of Military Engineering (CME), Pune', group: 'Engineering & institutional', logo: '/partners/cme-pune.png' },

  /* Not on the deck's logo wall — named in IRD §7 "Major Achievements":
     "AI/ML-enabled forecasting capabilities through partnership with ENERCAST
     GmbH, Germany". A technology partnership rather than a counterparty, so it
     gets its own group and no logo (none was supplied). This name was on the
     knowledge pack's FORBIDDEN list while it appeared only as unverified test
     data; the IRD is what made it publishable. */
  { name: 'ENERCAST GmbH, Germany', group: 'Technology partner', logo: null },
];

/** Groups in display order, each with the partners that belong to it. */
export const partnerGroups = [...new Set(partners.map((p) => p.group))]
  .map((group) => ({ group, members: partners.filter((p) => p.group === group) }));

/** Stated on the page so the limits of the source are visible, not implied. */
export const partnersNote =
  'Named on Vedanjay Power’s own “Our Partners” listing. Several are also '
  + 'counterparties for forecasting and QCA engagements. Scope, dates and '
  + 'commercial terms are not published. All marks belong to their respective '
  + 'owners and appear here without any claim of endorsement.';
