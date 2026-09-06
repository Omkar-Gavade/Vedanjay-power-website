import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  projects, PROJECT_TOTAL, projectCategories, countFor, repeatClients,
  voltageClasses, filterProjects,
} from '../src/data/projects.js';
import { industries, industryAssignedTotal } from '../src/data/industries.js';

/**
 * The register is generated from docs/06-content/project-register.md. These
 * guard the invariants that matter if that file or the generator changes.
 */
describe('project register', () => {
  it('matches the row count published in the register', () => {
    const md = readFileSync(new URL('../../docs/06-content/project-register.md', import.meta.url), 'utf8');
    const stated = /\*\*(\d+) rows\.\*\*/.exec(md);
    expect(stated, 'register no longer states its row count').toBeTruthy();
    expect(PROJECT_TOTAL).toBe(Number(stated[1]));
    expect(projects).toHaveLength(PROJECT_TOTAL);
  });

  it('gives every entry a known category', () => {
    const ids = new Set(projectCategories.map((c) => c.id));
    for (const p of projects) expect(ids.has(p.category), `${p.id}: ${p.category}`).toBe(true);
  });

  it('category counts sum to the total', () => {
    const sum = projectCategories.filter((c) => c.id !== 'all')
      .reduce((n, c) => n + countFor(c.id), 0);
    expect(sum).toBe(PROJECT_TOTAL);
  });

  it('corrects the documented source typos', () => {
    const blob = JSON.stringify(projects);
    for (const typo of ['Liasoning', 'Maintanace', 'Maintanance', 'Tessting', 'Redisson', 'Hayderabad', 'Optaining']) {
      expect(blob, `"${typo}" should be corrected in the content layer`).not.toContain(typo);
    }
  });

  it('states no date or contract value — the source carries none', () => {
    const blob = JSON.stringify(projects);
    expect(blob).not.toMatch(/₹|\bINR\b|\bcrore\b|\blakh\b/i);
  });

  /**
   * The register carries its own repeat-client table, computed independently by
   * parsing the source. Asserting against it catches loose matchers — a bare
   * /Renew/ also matches "Siemens Gamesa RENEWable Power", which inflated ReNew
   * from 5 to 7 and shipped a wrong figure onto the page.
   */
  it.each([
    ['MPPTCL', 7],
    ['Suzlon', 7],
    ['ReNew', 5],
    ['Regen Powertech', 4],
    ['Vikram Solar', 4],
    ['Tata Power Solar', 4],
    ['Waaree Energies', 3],
  ])('repeat orders for %s match the register (%i)', (name, expected) => {
    expect(repeatClients.find((c) => c.name === name)?.orders).toBe(expected);
  });

  it('no repeat-client count exceeds the register total', () => {
    for (const c of repeatClients) expect(c.orders).toBeLessThanOrEqual(PROJECT_TOTAL);
  });
});

describe('industries', () => {
  it('partitions the register — every entry counted exactly once', () => {
    expect(industryAssignedTotal).toBe(PROJECT_TOTAL);
    const sum = industries.reduce((n, i) => n + i.orders, 0);
    expect(sum).toBe(PROJECT_TOTAL);
  });

  it('names real client organisations for every sector', () => {
    for (const i of industries) {
      expect(i.orders).toBeGreaterThan(0);
      expect(i.clients.length).toBeGreaterThan(0);
      for (const c of i.clients) expect(c.length).toBeGreaterThan(2);
    }
  });

  it('does not invent a sector with no recorded work', () => {
    const named = new Set(projects.map((p) => p.client.toLowerCase()));
    for (const i of industries) {
      const anyMatch = [...named].some((c) => i.match.test(c));
      expect(anyMatch, `${i.name} has no matching client`).toBe(true);
    }
  });
});

describe('derived voltage class', () => {
  it('never invents a class outside the published list', () => {
    for (const p of projects) {
      if (p.voltage) expect(voltageClasses, `row ${p.id}`).toContain(p.voltage);
    }
  });

  it('takes the WORK voltage, not the highest number in the row', () => {
    /* "132KV EHV Feeder Bay Erection Work at Existing 220KV S/s" — the bay is
       132 kV; the substation it sits in is 220 kV. Reporting 220 would
       overstate the work. */
    const row = projects.find((p) => /132KV EHV Feeder Bay.*220KV/i.test(p.particulars));
    expect(row).toBeDefined();
    expect(row.voltage).toBe('132 kV');
  });

  it('leaves rows that name no voltage unbadged rather than guessing', () => {
    const om = projects.find((p) => p.particulars === 'O&M Service Limavas 2');
    expect(om).toBeDefined();
    expect(om.voltage).toBeNull();
    expect(projects.filter((p) => p.voltage).length).toBe(25);
  });

  it('does not mistake a kWp capacity for a voltage', () => {
    const solar = projects.find((p) => /182kWp/i.test(p.particulars));
    expect(solar).toBeDefined();
    expect(solar.voltage).toBeNull();
  });
});

describe('filterProjects', () => {
  it('returns the whole register with no category and no query', () => {
    expect(filterProjects('all', '')).toHaveLength(PROJECT_TOTAL);
  });

  it('matches a client name across its named entities', () => {
    expect(filterProjects('all', 'suzlon')).toHaveLength(7);
  });

  it('matches scope text, not just the title', () => {
    expect(filterProjects('all', 'telemetry').length).toBeGreaterThan(0);
  });

  it('is case- and whitespace-insensitive', () => {
    expect(filterProjects('all', '  SUZLON ')).toHaveLength(filterProjects('all', 'suzlon').length);
  });

  it('applies category AND query together, not either', () => {
    const all = filterProjects('all', 'o&m').length;
    const om = filterProjects('om', 'o&m').length;
    expect(om).toBeLessThanOrEqual(all);
    for (const p of filterProjects('om', 'o&m')) expect(p.category).toBe('om');
  });

  it('returns nothing for a query that matches nothing', () => {
    expect(filterProjects('all', 'zzzz')).toHaveLength(0);
  });

  it('each category filter returns exactly its published count', () => {
    for (const c of projectCategories) {
      expect(filterProjects(c.id, ''), c.id).toHaveLength(countFor(c.id));
    }
  });
});
