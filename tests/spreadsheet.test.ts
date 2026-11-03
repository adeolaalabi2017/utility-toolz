import { describe, expect, test } from "bun:test";
import { fitText, inferCell, layoutTable, parseCsv, sniffDelimiter, toCsv, toWinAnsi, withBom } from "@/lib/spreadsheet";

describe("CSV parsing", () => {
  test("handles quotes, doubled quotes and line breaks inside fields", () => {
    const text = 'name,note\r\n"Smith, Ann","said ""hi""\nthen left"\nBob,\n';
    expect(parseCsv(text, ",")).toEqual([
      ["name", "note"],
      ["Smith, Ann", 'said "hi"\nthen left'],
      ["Bob", ""],
    ]);
  });

  test("drops a byte-order mark and blank lines", () => {
    expect(parseCsv("﻿a;b\n\n1;2\n\n", ";")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });

  test("keeps a trailing empty field", () => {
    expect(parseCsv("a,b,\n", ",")).toEqual([["a", "b", ""]]);
  });

  test("round-trips through toCsv", () => {
    const rows = [["a", 'He said "x"', "line1\nline2", " padded", ""]];
    expect(parseCsv(toCsv(rows, ","), ",")).toEqual(rows);
  });
});

describe("Delimiter sniffing", () => {
  test("picks the delimiter that splits lines consistently", () => {
    expect(sniffDelimiter("a,b,c\n1,2,3")).toBe(",");
    expect(sniffDelimiter("Name;Price\nTea;2,50\nCake;3,10")).toBe(";");
    expect(sniffDelimiter("a\tb\n1\t2")).toBe("\t");
    expect(sniffDelimiter('"x;y",z\n"1;2",3')).toBe(",");
  });
});

describe("Cell inference", () => {
  test("turns plain numbers into numbers", () => {
    expect(inferCell("42", false)).toBe(42);
    expect(inferCell("-3.5", false)).toBe(-3.5);
    expect(inferCell("1e3", false)).toBe(1000);
  });

  test("keeps values a spreadsheet would mangle as text", () => {
    expect(inferCell("02134", false)).toBe("02134");
    expect(inferCell("4111111111111111", false)).toBe("4111111111111111");
    expect(inferCell("12 kg", false)).toBe("12 kg");
    expect(inferCell("1,000", false)).toBe("1,000");
    expect(inferCell("=SUM(A1)", false)).toBe("=SUM(A1)");
    expect(inferCell("42", true)).toBe("42");
  });
});

describe("CSV output", () => {
  test("adds a BOM for Excel and quotes risky fields", () => {
    expect(withBom("a").charCodeAt(0)).toBe(0xfeff);
    expect(toCsv([["a;b", 1, null, true]], ";")).toBe('"a;b";1;;true');
  });
});

describe("PDF table helpers", () => {
  const measure = (t: string) => t.length * 5;

  test("replaces characters Helvetica can't draw", () => {
    expect(toWinAnsi("Café €5 — ok")).toEqual({ text: "Café €5 — ok", replaced: 0 });
    expect(toWinAnsi("Zürich → 東京")).toEqual({ text: "Zürich ? ??", replaced: 3 });
    expect(toWinAnsi("a\tb\nc").text).toBe("a b c");
  });

  test("shrinks columns to fit and paginates with a repeated header", () => {
    const rows = [["Name", "Description"], ...Array.from({ length: 45 }, (_, i) => [`Item ${i}`, "x".repeat(100)])];
    const layout = layoutTable(rows, { measure, width: 300, height: 340, fontSize: 10 });
    expect(layout.colWidths.reduce((a, b) => a + b, 0)).toBeLessThanOrEqual(300.0001);
    // 340 / 17 = 20 rows a page, one of them the header.
    expect(layout.pages.map((p) => p.length)).toEqual([19, 19, 7]);
    expect(layout.pages[0][0]).toBe(1);
  });

  test("stretches a narrow table to the page width and sizes headers with their own font", () => {
    const rows = [["Stock", "Qty"], ["1", "2"]];
    const wide = (t: string) => t.length * 9;
    const layout = layoutTable(rows, { measure, measureHeader: wide, width: 400, height: 500, fontSize: 10 });
    expect(layout.colWidths.reduce((a, b) => a + b, 0)).toBeCloseTo(400);
    // "Stock" in the wide header font (45 + 8 padding) outweighs "Qty" (27 + 8).
    expect(layout.colWidths[0] / layout.colWidths[1]).toBeCloseTo(53 / 35);
  });

  test("fits text with an ellipsis", () => {
    expect(fitText("short", 100, measure)).toBe("short");
    expect(fitText("abcdefghij", 30, measure)).toBe("abcde…");
    expect(fitText("abc", 2, measure)).toBe("");
  });
});
