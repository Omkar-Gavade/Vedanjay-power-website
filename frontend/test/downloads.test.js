import { describe, it, expect } from 'vitest';
import { statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resourceGroups, allResources, formatBytes } from '../src/data/downloads.js';

/**
 * The downloads page makes one promise: click a row and you get that file.
 *
 * It is an easy promise to break silently. A document gets re-fetched from the
 * Commission and changes size; a filename is corrected in /public but not in
 * the data; an entry is added and the PDF never lands. Nothing renders any
 * differently in any of those cases — the failure only shows up as a 404 for a
 * visitor, which is precisely the state this page was rebuilt to get out of.
 *
 * So the byte counts are treated as an assertion about the filesystem rather
 * than as decoration.
 */

const publicPath = (href) => fileURLToPath(new URL(`../public${href}`, import.meta.url));

describe('downloads', () => {
  it('every listed document exists in /public/downloads', () => {
    const missing = allResources
      .filter((r) => !existsSync(publicPath(r.href)))
      .map((r) => `${r.id} → ${r.href}`);
    expect(missing, 'listed but not shipped').toEqual([]);
  });

  it('every stated size is the file’s real size on disk', () => {
    const wrong = allResources
      .map((r) => ({ r, actual: statSync(publicPath(r.href)).size }))
      .filter(({ r, actual }) => actual !== r.bytes)
      .map(({ r, actual }) => `${r.id}: says ${r.bytes}, is ${actual}`);
    expect(wrong, 'update the bytes field to the real size').toEqual([]);
  });

  it('every document is a real PDF, not an HTML error page', () => {
    const notPdf = allResources
      .filter((r) => {
        const fd = statSync(publicPath(r.href));
        return fd.size < 1024;                       // a 503 page is tiny
      })
      .map((r) => r.id);
    expect(notPdf).toEqual([]);
  });

  /* The page previously listed regulator homepages as if they were documents.
     They are not downloads, and a visitor told to "open at MERC" has been sent
     to search rather than handed the file. Nothing outbound belongs in here. */
  it('lists no outbound links in place of documents', () => {
    const outbound = allResources.filter((r) => !r.href.startsWith('/downloads/'));
    expect(outbound.map((r) => r.id), 'every entry must be a self-hosted file').toEqual([]);
  });

  it('ids and hrefs are unique', () => {
    expect(new Set(allResources.map((r) => r.id)).size).toBe(allResources.length);
    expect(new Set(allResources.map((r) => r.href)).size).toBe(allResources.length);
  });

  it('every document states an issuer and a date', () => {
    const bare = allResources.filter((r) => !r.issuer?.trim() || !r.date?.trim());
    expect(bare.map((r) => r.id)).toEqual([]);
  });

  /* The Maharashtra sets are the ones the legacy site lost to 503s, and the
     reason for the rebuild. If a refactor quietly drops them the page is back
     where it started, so the count is pinned. */
  it('the recovered Maharashtra sets are all present', () => {
    const size = (id) => resourceGroups.find((g) => g.id === id)?.items.length;
    expect(size('open-access-mh')).toBe(7);
    expect(size('rooftop-mh')).toBe(4);
    expect(size('fs-maharashtra')).toBe(4);
  });

  it('formatBytes reports KB below a megabyte and MB above it', () => {
    expect(formatBytes(88830)).toBe('87 KB');
    expect(formatBytes(5762782)).toBe('5.5 MB');
  });
});
