import { describe, expect, test } from "bun:test";
import { gzipSync, strToU8, zipSync } from "fflate";
import { ArchiveError, createTar, parseTar, readArchive } from "@/lib/archive";
import { dateSpan, daysBetween, diffYMD } from "@/lib/datetime";
import { describePayload, normalizeUrl } from "@/lib/qr";
import { htmlToMd, mdToHtml } from "@/components/tools/markdown-converter";

const day = (y: number, m: number, d: number) => new Date(y, m - 1, d);

describe("diffYMD", () => {
  test("never returns negative days across a short month", () => {
    expect(diffYMD(day(2025, 1, 31), day(2025, 3, 1))).toEqual({ y: 0, m: 1, d: 1 });
    expect(diffYMD(day(2024, 1, 31), day(2024, 3, 1))).toEqual({ y: 0, m: 1, d: 1 });
  });
  test("counts plain spans", () => {
    expect(diffYMD(day(2000, 5, 15), day(2025, 5, 15))).toEqual({ y: 25, m: 0, d: 0 });
    expect(diffYMD(day(2000, 5, 15), day(2025, 7, 20))).toEqual({ y: 25, m: 2, d: 5 });
    expect(diffYMD(day(2024, 12, 20), day(2025, 1, 10))).toEqual({ y: 0, m: 0, d: 21 });
  });
});

describe("dateSpan", () => {
  test("gives the exact span and its totals", () => {
    expect(dateSpan(day(2024, 1, 31), day(2026, 3, 1))).toEqual({ y: 2, m: 1, d: 1, totalMonths: 25, totalDays: 760, swapped: false });
  });
  test("counts either order the same and says so", () => {
    expect(dateSpan(day(2026, 3, 1), day(2024, 1, 31))).toEqual({ y: 2, m: 1, d: 1, totalMonths: 25, totalDays: 760, swapped: true });
  });
  test("same day is zero, or one when the end date counts", () => {
    expect(dateSpan(day(2025, 5, 5), day(2025, 5, 5)).totalDays).toBe(0);
    expect(dateSpan(day(2025, 5, 5), day(2025, 5, 5), true)).toMatchObject({ y: 0, m: 0, d: 1, totalDays: 1 });
  });
  test("counting the end date can roll into the next month", () => {
    expect(dateSpan(day(2025, 1, 1), day(2025, 1, 31), true)).toMatchObject({ y: 0, m: 1, d: 0, totalDays: 31 });
  });
  test("daylight saving doesn't lose a day", () => {
    expect(daysBetween(day(2025, 1, 15), day(2025, 7, 15))).toBe(181);
  });
});

describe("tar pax headers", () => {
  test("reads a non-ASCII path followed by another record", () => {
    const encoder = new TextEncoder();
    const record = (k: string, v: string) => {
      const body = ` ${k}=${v}\n`;
      const base = encoder.encode(body).length;
      let digits = String(base).length;
      while (String(base + digits).length !== digits) digits++;
      return `${base + digits}${body}`;
    };
    const tar = createTar([{ name: "x.txt", data: new Uint8Array(1) }]);
    const pax = encoder.encode(record("path", "日本語.txt") + record("mtime", "123"));
    const header = tar.slice(0, 512);
    header[156] = "x".charCodeAt(0);
    header.set(encoder.encode(`${pax.length.toString(8).padStart(11, "0")}\0`), 124);
    const body = new Uint8Array(Math.ceil(pax.length / 512) * 512);
    body.set(pax);
    const out = new Uint8Array(512 + body.length + tar.length);
    out.set(header, 0);
    out.set(body, 512);
    out.set(tar, 512 + body.length);
    expect(parseTar(out).map((e) => e.name)).toEqual(["日本語.txt"]);
  });
});

describe("archive size limit", () => {
  const big = new Uint8Array(4096);
  test("refuses a zip that unpacks past the limit", () => {
    expect(() => readArchive("a.zip", zipSync({ a: big }), 1024)).toThrow(ArchiveError);
    expect(() => readArchive("a.zip", zipSync({ a: big }), 1024)).toThrow(/unpacks to more than/);
  });
  test("refuses a gzip that unpacks past the limit", () => {
    expect(() => readArchive("a.gz", gzipSync(big), 1024)).toThrow(/unpacks to more than/);
  });
  test("opens archives under the limit", () => {
    expect(readArchive("a.zip", zipSync({ a: strToU8("hi") }), 1024).entries).toHaveLength(1);
  });
});

describe("QR payloads", () => {
  test("a stray percent sign in a mailto doesn't throw", () => {
    expect(describePayload("mailto:100%@x.com").fields[0]).toEqual(["To", "100%@x.com"]);
  });
  test("host:port is not a scheme", () => {
    expect(normalizeUrl("example.com:8080/x")).toBe("https://example.com:8080/x");
    expect(normalizeUrl("localhost:3000")).toBe("https://localhost:3000");
    expect(normalizeUrl("tel:5551234")).toBe("tel:5551234");
    expect(normalizeUrl("http://example.com:8080")).toBe("http://example.com:8080");
  });
});

describe("markdown converter", () => {
  test("a list becomes one ul", () => {
    expect(mdToHtml("- a\n- b\n\ntext")).toBe("<ul><li>a</li>\n<li>b</li></ul>\n\n<p>text</p>");
  });
  test("short tag names don't match longer tags", () => {
    expect(htmlToMd("one<br>two <b>bold</b>")).toBe("one\ntwo **bold**");
    expect(htmlToMd('<img src="a.png"> <i>it</i>')).toBe('<img src="a.png"> *it*');
  });
});
