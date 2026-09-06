/**
 * QCA / FORECASTING & SCHEDULING PORTFOLIO.
 *
 * SOURCE: the "Our Projects" table in "Forecasting for Renewable Energies", the
 * company's own deck. Three columns — project name, capacity in MW, and
 * location — read straight off the table. Nothing is inferred.
 *
 * WHY THIS IS A DIFFERENT DATASET FROM data/projects.js
 * projects.js is the 52-row EXECUTION register: feeder bays, substation works,
 * O&M, civil. It records the ordering organisation and no location, which is
 * why nothing there can be mapped. This table is the QCA portfolio, and it
 * carries a state for every row. They are not the same work and must never be
 * added together.
 *
 * THE TOTAL IS THE INTEGRITY CHECK.
 * The deck states 5,509.18 MW at the foot of the table. The rows below sum to
 * exactly that, which is what establishes the transcription is complete — a
 * dropped or duplicated row moves the sum. portfolio.test.js re-checks it, so
 * the table cannot be edited without the arithmetic being redone.
 *
 * It is also the evidence behind the "5,000+ MW" proof point stated elsewhere
 * on the site.
 *
 * ON THE ONE MULTI-STATE ROW
 * Hero's 155 MW is listed as "MP/Telangana/RJ". The deck does not break it
 * down, so it is NOT split across those three states — it is held separately
 * and the map says so. Splitting it evenly would be inventing three numbers.
 *
 * SPELLINGS are normalised only where the deck differs from the map's own state
 * names ("Tamilnadu" → "Tamil Nadu"); project names are left exactly as written.
 */

/** @typedef {{name:string, mw:number, state:string|null, note:string|null}} PortfolioProject */

/** The deck's stated total, and the assertion every row is checked against. */
export const PORTFOLIO_TOTAL_MW = 5509.18;

/** @type {PortfolioProject[]} */
export const portfolio = [
  { name: 'Adani', mw: 1232, state: 'Rajasthan' },
  { name: 'Mundra Solar - Kasipet', mw: 15, state: 'Telangana' },
  { name: 'Mundra Solar - Mandamarri', mw: 28, state: 'Telangana' },
  { name: 'Mundra Solar - Bhupalpally', mw: 10, state: 'Telangana' },
  { name: 'Mundra Solar - Kothagudam', mw: 37, state: 'Telangana' },
  { name: 'OSEPL', mw: 20, state: 'Maharashtra' },
  { name: 'FDIPL', mw: 20, state: 'Maharashtra' },
  { name: 'Kilaj', mw: 20, state: 'Maharashtra' },
  { name: 'CME', mw: 7, state: 'Maharashtra' },
  { name: 'Virescent', mw: 20, state: 'Madhya Pradesh' },
  { name: 'Chandwasa PSS', mw: 10, state: 'Madhya Pradesh' },
  { name: 'GAIL India LTD', mw: 10, state: 'Madhya Pradesh' },
  { name: 'UPC Renewable', mw: 300, state: 'Madhya Pradesh' },
  { name: 'AWEMPL', mw: 325, state: 'Madhya Pradesh' },
  { name: 'ZTRIC', mw: 75, state: 'Maharashtra' },
  { name: 'SEIT', mw: 250, state: 'Madhya Pradesh' },
  { name: 'TATA Power', mw: 100.08, state: 'Maharashtra' },
  { name: 'Fourth Patner Energy', mw: 250, state: 'Karnataka' },
  { name: 'Pick Renew', mw: 19, state: 'Maharashtra' },
  /* The only row the deck does not resolve to a single state. */
  { name: 'Hero', mw: 155, state: null, note: 'Madhya Pradesh / Telangana / Rajasthan' },
  { name: 'Arinsun (Sprng)', mw: 250, state: 'Madhya Pradesh' },
  { name: 'Mulanur (Sprng)', mw: 300, state: 'Tamil Nadu' },
  { name: 'SEMBCORP', mw: 250, state: 'Telangana' },
  { name: 'Enrich', mw: 100, state: 'Maharashtra' },
  { name: 'Juniper (Solar)', mw: 70, state: 'Maharashtra' },
  { name: 'Juniper (Wind) - Gujarat', mw: 70, state: 'Gujarat' },
  { name: 'Illios Power (Solar)', mw: 50, state: 'Madhya Pradesh' },
  { name: 'Sprng', mw: 250, state: 'Madhya Pradesh' },
  { name: 'Athena', mw: 250, state: 'Madhya Pradesh' },
  { name: 'Juniper (Wind) - Maharashtra', mw: 50, state: 'Maharashtra' },
  { name: 'Sirmour', mw: 5.1, state: 'Madhya Pradesh' },
  { name: 'SVKM', mw: 25, state: 'Maharashtra' },
  { name: 'JSW (Wind)', mw: 600, state: 'Karnataka' },
  { name: 'JSW (Solar)', mw: 336, state: 'Karnataka' },
].map((p) => ({ note: null, ...p }));

/** Floating-point MW: sum in hundredths so 100.08 + 5.1 stays exact. */
const round2 = (n) => Math.round(n * 100) / 100;

/** Per-state rollup, largest first. Excludes the unresolved multi-state row. */
export const portfolioByState = Object.values(
  portfolio.filter((p) => p.state).reduce((acc, p) => {
    acc[p.state] ??= { state: p.state, mw: 0, count: 0, projects: [] };
    acc[p.state].mw += p.mw;
    acc[p.state].count += 1;
    acc[p.state].projects.push(p);
    return acc;
  }, {}),
).map((s) => ({ ...s, mw: round2(s.mw) })).sort((a, b) => b.mw - a.mw);

/** The one row that names three states and apportions none of them. */
export const unallocated = portfolio.find((p) => !p.state) ?? null;

/** Largest single-state figure — drives the choropleth and bubble scales. */
export const maxStateMw = Math.max(...portfolioByState.map((s) => s.mw));

export const PORTFOLIO_COUNT = portfolio.length;
