/**
 * Page-range parsing for the PDF tools. Kept apart from the PDF libraries so
 * it can be unit-tested and loaded without them.
 */

/**
 * "1-3, 5, 8-" → zero-based page indexes [0, 1, 2, 4, 7, …]. Order and
 * repeats are kept, so "3-1" reverses and "2, 2" duplicates a page.
 */
export function parsePageRanges(input: string, pageCount: number): { pages?: number[]; error?: string } {
  const parts = input.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return { error: "Enter the pages to keep, such as 1-3, 5" };
  const pages: number[] = [];
  for (const part of parts) {
    const m = /^(\d+)?\s*(-)?\s*(\d+)?$/.exec(part);
    if (!m || (!m[1] && !m[3]) || (!m[2] && m[3] && !m[1])) return { error: `“${part}” isn't a page or a range like 2-5` };
    const from = m[1] ? Number(m[1]) : 1;
    const to = m[2] ? (m[3] ? Number(m[3]) : pageCount) : from;
    for (const p of [from, to]) {
      if (p < 1 || p > pageCount) {
        return { error: `Page ${p} doesn't exist: this PDF has ${pageCount} page${pageCount === 1 ? "" : "s"}` };
      }
    }
    const step = from <= to ? 1 : -1;
    for (let p = from; p !== to + step; p += step) pages.push(p - 1);
  }
  return { pages };
}
