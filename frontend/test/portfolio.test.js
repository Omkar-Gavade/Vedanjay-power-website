import { describe, it, expect } from 'vitest';
import {
  portfolio, portfolioByState, unallocated, maxStateMw,
  PORTFOLIO_TOTAL_MW, PORTFOLIO_COUNT,
} from '../src/data/portfolio.js';
import { proofPoints } from '../src/data/stats.js';

/**
 * The portfolio table is transcribed from a PDF, which is the least reliable
 * way data ever enters a codebase. The deck prints its own total at the foot of
 * the table, so that total is the checksum: drop a row, duplicate one, or fat-
 * finger a capacity, and the sum stops matching.
 */

const round2 = (n) => Math.round(n * 100) / 100;

describe('QCA portfolio', () => {
  it('sums to the total the source states', () => {
    const sum = round2(portfolio.reduce((a, p) => a + p.mw, 0));
    expect(sum).toBe(PORTFOLIO_TOTAL_MW);
  });

  it('has 34 rows, every one with a name and a positive capacity', () => {
    expect(portfolio).toHaveLength(PORTFOLIO_COUNT);
    expect(PORTFOLIO_COUNT).toBe(34);
    const bad = portfolio.filter((p) => !p.name?.trim() || !(p.mw > 0));
    expect(bad.map((p) => p.name)).toEqual([]);
  });

  it('rolls up per state without losing or inventing capacity', () => {
    const stated = round2(portfolioByState.reduce((a, s) => a + s.mw, 0));
    const expected = round2(PORTFOLIO_TOTAL_MW - (unallocated?.mw ?? 0));
    expect(stated).toBe(expected);

    const counted = portfolioByState.reduce((a, s) => a + s.count, 0);
    expect(counted).toBe(PORTFOLIO_COUNT - (unallocated ? 1 : 0));
  });

  it('keeps the one multi-state row out of the per-state shading', () => {
    /* Hero is listed as "MP/Telangana/RJ" with no split. Apportioning it would
       be three invented numbers, so it must stay unallocated. */
    expect(unallocated).not.toBeNull();
    expect(unallocated.mw).toBe(155);
    expect(unallocated.state).toBeNull();
    expect(portfolioByState.some((s) => s.projects.some((p) => !p.state))).toBe(false);
  });

  it('uses state names the map can actually match', () => {
    /* "Tamilnadu" in the deck is "Tamil Nadu" in the map data; a mismatch here
       silently drops a state from the choropleth rather than erroring. */
    const map = JSON.parse(
      require('node:fs').readFileSync(
        new URL('../public/maps/india-states.json', import.meta.url), 'utf8',
      ),
    );
    const known = new Set(map.states.map((s) => s.name));
    const unknown = portfolioByState.map((s) => s.state).filter((s) => !known.has(s));
    expect(unknown).toEqual([]);
  });

  it('is ordered largest first, and maxStateMw is that leader', () => {
    const mws = portfolioByState.map((s) => s.mw);
    expect([...mws].sort((a, b) => b - a)).toEqual(mws);
    expect(maxStateMw).toBe(mws[0]);
  });

  it('supports the 5,000+ MW proof point stated elsewhere on the site', () => {
    const claim = proofPoints.find((p) => p.id === 'portfolio');
    expect(claim.unit).toBe('MW');
    const floor = Number(claim.value.replace(/[^\d]/g, ''));
    expect(PORTFOLIO_TOTAL_MW).toBeGreaterThanOrEqual(floor);
  });
});
