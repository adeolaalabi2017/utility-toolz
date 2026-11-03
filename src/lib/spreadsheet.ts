/**
 * Pure helpers for the spreadsheet tools: CSV parsing and writing, cell type
 * inference, and the table layout behind Excel to PDF. SheetJS itself is
 * loaded by the components on demand; nothing here depends on it.
 */

export type Cell = string | number | boolean | Date | null;

/* ------------------------------------------------------------------ */
/* CSV                                                                 */
/* ------------------------------------------------------------------ */

export const DELIMITERS: { value: string; label: string }[] = [
  { value: ",", label: "Comma (,)" },
  { value: ";", label: "Semicolon (;)" },
  { value: "\t", label: "Tab" },
  { value: "|", label: "Pipe (|)" },
];

/**
 * The delimiter that splits the first few lines into the most consistent
 * number of fields. Characters inside quotes don't count.
 */
export function sniffDelimiter(text: string): string {
  const sample = text.slice(0, 20000);
  let best = ",";
  let bestScore = -1;
  for (const { value: d } of DELIMITERS) {
    const counts = parseCsv(sample, d)
      .slice(0, 10)
      .map((r) => r.length);
    if (counts.length === 0) continue;
    const first = counts[0];
    if (first < 2) continue;
    // Prefer the delimiter giving every sampled line the same field count.
    const consistent = counts.filter((c) => c === first).length;
    const score = consistent * 1000 + first;
    if (score > bestScore) {
      bestScore = score;
      best = d;
    }
  }
  return best;
}

/**
 * RFC 4180 CSV: quoted fields may hold the delimiter, doubled quotes and line
 * breaks. A leading byte-order mark is dropped and fully empty lines skipped.
 */
export function parseCsv(text: string, delimiter: string): string[][] {
  const src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let fieldStarted = false;
  const endRow = () => {
    row.push(field);
    if (row.length > 1 || row[0] !== "") rows.push(row);
    row = [];
    field = "";
    fieldStarted = false;
  };
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += ch;
    } else if (ch === '"' && !fieldStarted) {
      inQuotes = true;
      fieldStarted = true;
    } else if (ch === delimiter) {
      row.push(field);
      field = "";
      fieldStarted = false;
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      endRow();
    } else {
      field += ch;
      fieldStarted = true;
    }
  }
  if (field !== "" || row.length > 0) endRow();
  return rows;
}

function csvField(v: Cell, delimiter: string): string {
  if (v === null) return "";
  const s = v instanceof Date ? v.toISOString() : String(v);
  return s.includes('"') || s.includes(delimiter) || /[\r\n]/.test(s) || /^\s|\s$/.test(s)
    ? `"${s.replace(/"/g, '""')}"`
    : s;
}

/** CRLF line endings, as RFC 4180 and Excel expect. */
export function toCsv(rows: Cell[][], delimiter: string): string {
  return rows.map((r) => r.map((c) => csvField(c, delimiter)).join(delimiter)).join("\r\n");
}

/** Excel reads a CSV as UTF-8 only when it starts with a byte-order mark. */
export const withBom = (csv: string) => `﻿${csv}`;

/* ------------------------------------------------------------------ */
/* Cell types                                                          */
/* ------------------------------------------------------------------ */

const NUMBER = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/;

/**
 * A CSV field as the spreadsheet should store it. Plain numbers become
 * numbers, except ones a spreadsheet would mangle: leading zeros (ZIP codes,
 * phone numbers) and integers past 15 digits (card and account numbers).
 */
export function inferCell(value: string, keepAllText: boolean): string | number {
  if (keepAllText) return value;
  const t = value.trim();
  if (!NUMBER.test(t)) return value;
  const digits = t.replace(/^-/, "").replace(/\..*$/, "").replace(/[eE].*$/, "");
  if (digits.length > 15) return value;
  return Number(t);
}

/* ------------------------------------------------------------------ */
/* PDF output with the standard Helvetica font                         */
/* ------------------------------------------------------------------ */

/** Characters outside Latin-1 that WinAnsi encoding (and so Helvetica) still covers. */
const WIN_ANSI_EXTRA = new Set("€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ");

/** Replace characters the built-in PDF fonts can't draw, and count them. */
export function toWinAnsi(text: string): { text: string; replaced: number } {
  let replaced = 0;
  let out = "";
  for (const ch of text.replace(/[\t\r\n]+/g, " ")) {
    const code = ch.codePointAt(0)!;
    if ((code >= 0x20 && code <= 0x7e) || (code >= 0xa0 && code <= 0xff) || WIN_ANSI_EXTRA.has(ch)) out += ch;
    else {
      out += "?";
      replaced++;
    }
  }
  return { text: out, replaced };
}

export interface TableLayout {
  colWidths: number[];
  /** Row indexes on each page, header row excluded. */
  pages: number[][];
  rowHeight: number;
}

/**
 * Column widths that fill the page and rows split into pages. Columns start
 * at their widest cell (within limits) and are scaled in proportion to span
 * the page width exactly: narrow tables stretch, wide ones shrink, and text
 * that still doesn't fit is truncated.
 */
export function layoutTable(
  rows: string[][],
  opts: {
    measure: (text: string) => number;
    /** Measures header cells, which are usually bold and so wider. */
    measureHeader?: (text: string) => number;
    width: number;
    height: number;
    fontSize: number;
    padding?: number;
    maxCol?: number;
    minCol?: number;
    header?: boolean;
  }
): TableLayout {
  const padding = opts.padding ?? 4;
  const maxCol = opts.maxCol ?? 220;
  const minCol = opts.minCol ?? 24;
  const cols = Math.max(0, ...rows.map((r) => r.length));
  const headerRows = opts.header === false ? 0 : 1;
  const natural = Array.from({ length: cols }, (_, c) => {
    let w = 0;
    rows.slice(0, 2000).forEach((r, i) => {
      const m = i < headerRows && opts.measureHeader ? opts.measureHeader : opts.measure;
      w = Math.max(w, m(r[c] ?? ""));
    });
    return Math.min(maxCol, Math.max(minCol, w + padding * 2));
  });
  const total = natural.reduce((a, b) => a + b, 0);
  const colWidths = total > 0 ? natural.map((w) => (w / total) * opts.width) : natural;

  const rowHeight = opts.fontSize * 1.7;
  const perPage = Math.max(1, Math.floor(opts.height / rowHeight) - headerRows);
  const pages: number[][] = [];
  for (let i = headerRows; i < rows.length; i += perPage) {
    pages.push(Array.from({ length: Math.min(perPage, rows.length - i) }, (_, k) => i + k));
  }
  if (pages.length === 0) pages.push([]);
  return { colWidths, pages, rowHeight };
}

/** Cut text to fit a width, ending with an ellipsis when anything was removed. */
export function fitText(text: string, width: number, measure: (t: string) => number): string {
  if (measure(text) <= width) return text;
  let lo = 0;
  let hi = text.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (measure(`${text.slice(0, mid)}…`) <= width) lo = mid;
    else hi = mid - 1;
  }
  return lo === 0 ? "" : `${text.slice(0, lo)}…`;
}

/** "Sales Q3" → "Sales Q3", "a/b:c" → "a-b-c": a sheet name made safe for a file name. */
export const sheetFileName = (name: string) => name.replace(/[\\/:*?"<>|]+/g, "-").trim() || "sheet";
