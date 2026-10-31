import { describe, expect, test } from "bun:test";
import { generateCsvString, generateMarkdownTable, sanitizeCsvCell } from "@/lib/export";

describe("Universal Export Suite", () => {
  const testColumns = [
    { header: "Month", key: "month" as const },
    { header: "Payment", key: "payment" as const },
    { header: "Principal", key: "principal" as const },
    { header: "Balance", key: "balance" as const },
  ];

  const testRows = [
    { month: 1, payment: 1200, principal: 800, balance: 199200 },
    { month: 2, payment: 1200, principal: 805, balance: 198395 },
  ];

  test("sanitizes CSV cells with quotes and escapes internal double quotes", () => {
    expect(sanitizeCsvCell("Normal")).toBe('"Normal"');
    expect(sanitizeCsvCell('Text with "quotes"')).toBe('"Text with ""quotes"""');
    expect(sanitizeCsvCell(null)).toBe('""');
    expect(sanitizeCsvCell(1234)).toBe('"1234"');
  });

  test("generates RFC 4180 compliant CSV string with CRLF line breaks", () => {
    const csv = generateCsvString(testColumns, testRows);
    expect(csv).toBe(
      '"Month","Payment","Principal","Balance"\r\n"1","1200","800","199200"\r\n"2","1200","805","198395"'
    );
  });

  test("generates clean GitHub Flavored Markdown table string", () => {
    const md = generateMarkdownTable(testColumns, testRows);
    expect(md).toContain("| Month | Payment | Principal | Balance |");
    expect(md).toContain("| --- | --- | --- | --- |");
    expect(md).toContain("| 1 | 1200 | 800 | 199200 |");
    expect(md).toContain("| 2 | 1200 | 805 | 198395 |");
  });

  test("escapes pipe characters inside markdown table cells", () => {
    const cols = [{ header: "Task | Role", key: "name" as const }];
    const rows = [{ name: "Design | UX" }];
    const md = generateMarkdownTable(cols, rows);
    expect(md).toContain("Design \\| UX");
  });
});
