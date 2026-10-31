/**
 * Universal Export Utilities for Utility Toolz
 * Pure formatting + Client-side triggers.
 */

export interface ExportColumn<T> {
  header: string;
  key: keyof T | ((row: T) => string | number);
}

/** Sanitize CSV cell */
export function sanitizeCsvCell(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/** Generate CSV string */
export function generateCsvString<T>(columns: ExportColumn<T>[], rows: T[]): string {
  const headerLine = columns.map((c) => sanitizeCsvCell(c.header)).join(",");
  const dataLines = rows.map((row) =>
    columns
      .map((c) => {
        const val = typeof c.key === "function" ? c.key(row) : row[c.key];
        return sanitizeCsvCell(val);
      })
      .join(",")
  );
  return [headerLine, ...dataLines].join("\r\n");
}

/** Generate Markdown table string */
export function generateMarkdownTable<T>(columns: ExportColumn<T>[], rows: T[]): string {
  const header = `| ${columns.map((c) => c.header).join(" | ")} |`;
  const separator = `| ${columns.map(() => "---").join(" | ")} |`;
  const data = rows.map(
    (row) =>
      `| ${columns
        .map((c) => {
          const val = typeof c.key === "function" ? c.key(row) : row[c.key];
          return String(val ?? "").replace(/\|/g, "\\|");
        })
        .join(" | ")} |`
  );
  return [header, separator, ...data].join("\n");
}

/** 1. Download data as a clean CSV file using client-side Blob URL */
export function exportToCsv<T>(
  filename: string,
  columns: ExportColumn<T>[],
  rows: T[]
): boolean {
  if (typeof window === "undefined" || !rows.length) return false;

  const csvContent = generateCsvString(columns, rows);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  const cleanName = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  link.setAttribute("download", cleanName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

/** 2. Copy data as a GitHub Flavored Markdown (GFM) table to clipboard */
export async function copyAsMarkdownTable<T>(
  columns: ExportColumn<T>[],
  rows: T[]
): Promise<boolean> {
  if (typeof window === "undefined" || !rows.length) return false;

  const markdown = generateMarkdownTable(columns, rows);
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(markdown);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/** 3. Trigger native browser print dialog for PDF generation or printing */
export function printCurrentReport(): void {
  if (typeof window !== "undefined") {
    window.print();
  }
}
