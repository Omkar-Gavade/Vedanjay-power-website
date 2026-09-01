/**
 * TO VERIFY gate.
 *
 * docs/06-content/company-facts.md registers 20 unverified claims, 10 of them
 * launch-blocking. Nothing marked `verified: false` may be presented as fact.
 *
 * This module is the single enforcement point. Every accessor that returns
 * claim-bearing content filters through `onlyVerified`.
 *
 * To publish a claim: confirm it with the client, record the evidence in
 * docs/06-content/company-facts.md, then flip `verified` to true in the data file.
 */

/** Filters any array of records down to those cleared for publication. */
export const onlyVerified = (items) => items.filter((i) => i.verified !== false);

/** Records withheld from production — surfaced in the dev-only audit panel. */
export const withheld = (items) => items.filter((i) => i.verified === false);

export const isDev = import.meta.env.DEV;
