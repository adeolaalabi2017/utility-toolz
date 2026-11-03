import { describe, expect, test } from "bun:test";
import { gzipSync, strToU8, zipSync } from "fflate";
import {
  ArchiveError,
  archiveBaseName,
  createTar,
  detectFormat,
  parseTar,
  readArchive,
  uniqueNames,
  writeArchive,
} from "@/lib/archive";
import { parsePageRanges } from "@/lib/pdf-pages";

const text = (b: Uint8Array) => new TextDecoder().decode(b);
const files = [
  { name: "readme.txt", data: strToU8("hello"), mtime: new Date("2026-01-02T03:04:05Z") },
  { name: "src/app/main.ts", data: strToU8("export const x = 1;\n") },
  { name: "empty.bin", data: new Uint8Array(0) },
];

describe("Tar", () => {
  test("round-trips names, contents and mtime", () => {
    const back = parseTar(createTar(files));
    expect(back.map((e) => e.name)).toEqual(files.map((f) => f.name));
    expect(text(back[1].data)).toBe("export const x = 1;\n");
    expect(back[2].data.length).toBe(0);
    expect(back[0].mtime?.toISOString()).toBe("2026-01-02T03:04:05.000Z");
  });

  test("keeps paths longer than 100 characters", () => {
    const deep = `${"folder/".repeat(30)}file.txt`;
    const flat = `${"x".repeat(180)}.txt`;
    const back = parseTar(createTar([{ name: deep, data: strToU8("a") }, { name: flat, data: strToU8("b") }]));
    expect(back.map((e) => e.name)).toEqual([deep, flat]);
  });

  test("writes a valid header checksum", () => {
    const tar = createTar([files[0]]);
    const stored = parseInt(text(tar.subarray(148, 154)), 8);
    const header = tar.slice(0, 512);
    header.fill(32, 148, 156);
    expect(stored).toBe(header.reduce((a, b) => a + b, 0));
    expect(tar.length % 512).toBe(0);
  });

  test("reports a truncated archive", () => {
    expect(() => parseTar(createTar(files).subarray(0, 600))).toThrow(ArchiveError);
    expect(() => parseTar(createTar(files).subarray(0, 1200))).toThrow(ArchiveError);
  });
});

describe("Format detection and reading", () => {
  test("detects each format from its bytes", () => {
    expect(detectFormat(writeArchive(files, "zip"))).toBe("zip");
    expect(detectFormat(writeArchive(files, "tar"))).toBe("tar");
    expect(detectFormat(writeArchive(files, "tar.gz"))).toBe("tar.gz");
    expect(detectFormat(gzipSync(strToU8("plain")))).toBe("gz");
    expect(detectFormat(strToU8("not an archive"))).toBe("unknown");
  });

  test("converts tar.gz to zip and back without loss", () => {
    for (const [from, to] of [["tar.gz", "zip"], ["zip", "tar"], ["tar", "tar.gz"]] as const) {
      const { entries } = readArchive(`a.${from}`, writeArchive(files, from));
      const again = readArchive(`b.${to}`, writeArchive(entries, to)).entries;
      expect(again.map((e) => [e.name, text(e.data)])).toEqual(files.map((f) => [f.name, text(f.data)]));
    }
  });

  test("skips zip directory entries", () => {
    const zip = zipSync({ "docs/": new Uint8Array(0), "docs/a.txt": strToU8("a") });
    expect(readArchive("d.zip", zip).entries.map((e) => e.name)).toEqual(["docs/a.txt"]);
  });

  test("a lone .gz unpacks to one file named without .gz", () => {
    const { format, entries } = readArchive("notes.txt.gz", gzipSync(strToU8("hi")));
    expect(format).toBe("gz");
    expect(entries.map((e) => [e.name, text(e.data)])).toEqual([["notes.txt", "hi"]]);
  });

  test("rejects files that are not archives", () => {
    expect(() => readArchive("x.zip", strToU8("PK nope"))).toThrow(ArchiveError);
  });
});

describe("Naming", () => {
  test("de-duplicates names before the extension", () => {
    const names = uniqueNames([
      { name: "a.txt", data: new Uint8Array() },
      { name: "a.txt", data: new Uint8Array() },
      { name: "a.txt", data: new Uint8Array() },
      { name: "Makefile", data: new Uint8Array() },
      { name: "Makefile", data: new Uint8Array() },
    ]).map((e) => e.name);
    expect(names).toEqual(["a.txt", "a (2).txt", "a (3).txt", "Makefile", "Makefile (2)"]);
  });

  test("strips archive extensions", () => {
    expect(archiveBaseName("photos.tar.gz")).toBe("photos");
    expect(archiveBaseName("site.TGZ")).toBe("site");
    expect(archiveBaseName("a.b.zip")).toBe("a.b");
  });
});

describe("PDF page ranges", () => {
  test("parses lists and ranges in order", () => {
    expect(parsePageRanges("1-3, 5", 10)).toEqual({ pages: [0, 1, 2, 4] });
    expect(parsePageRanges("8-", 10)).toEqual({ pages: [7, 8, 9] });
    expect(parsePageRanges("3-1", 10)).toEqual({ pages: [2, 1, 0] });
    expect(parsePageRanges(" 2 ,2", 10)).toEqual({ pages: [1, 1] });
  });

  test("explains bad input", () => {
    expect(parsePageRanges("", 10).error).toBeTruthy();
    expect(parsePageRanges("0", 10).error).toBeTruthy();
    expect(parsePageRanges("4-12", 10).error).toContain("10");
    expect(parsePageRanges("a-b", 10).error).toBeTruthy();
  });
});
