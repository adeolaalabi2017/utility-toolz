/**
 * Archive reading and writing for the Files tools: ZIP through fflate, plus
 * a small tar reader/writer (fflate has no tar support). Everything is
 * synchronous on purpose — fflate's async API spawns workers from blob:
 * URLs, which the site's Content-Security-Policy (worker-src 'self') blocks.
 */
import { gunzipSync, gzipSync, unzipSync, zipSync, type Zippable } from "fflate";

export interface ArchiveEntry {
  /** Path inside the archive, using "/" separators. */
  name: string;
  data: Uint8Array;
  /** Modification time, when the archive recorded one. */
  mtime?: Date;
}

export type ArchiveFormat = "zip" | "tar" | "tar.gz";

export class ArchiveError extends Error {}

/* ------------------------------------------------------------------ */
/* Tar                                                                 */
/* ------------------------------------------------------------------ */

const BLOCK = 512;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function readString(buf: Uint8Array, offset: number, length: number): string {
  const slice = buf.subarray(offset, offset + length);
  const end = slice.indexOf(0);
  return decoder.decode(end === -1 ? slice : slice.subarray(0, end));
}

function readOctal(buf: Uint8Array, offset: number, length: number): number {
  const s = readString(buf, offset, length).trim();
  return s ? parseInt(s, 8) : 0;
}

/** Key/value records of a pax extended header ("27 path=some/long/name\n"). */
function parsePax(data: Uint8Array): Record<string, string> {
  const out: Record<string, string> = {};
  const text = decoder.decode(data);
  let i = 0;
  while (i < text.length) {
    const space = text.indexOf(" ", i);
    if (space === -1) break;
    const len = parseInt(text.slice(i, space), 10);
    if (!len) break;
    const record = text.slice(space + 1, i + len - 1);
    const eq = record.indexOf("=");
    if (eq > 0) out[record.slice(0, eq)] = record.slice(eq + 1);
    i += len;
  }
  return out;
}

export function isTar(bytes: Uint8Array): boolean {
  return bytes.length >= BLOCK && readString(bytes, 257, 5) === "ustar";
}

/** Regular files from a ustar/GNU/pax tar. Directories, links and devices are skipped. */
export function parseTar(bytes: Uint8Array): ArchiveEntry[] {
  const entries: ArchiveEntry[] = [];
  let offset = 0;
  let longName: string | null = null;
  let pax: Record<string, string> = {};
  while (offset + BLOCK <= bytes.length) {
    const header = bytes.subarray(offset, offset + BLOCK);
    if (header.every((b) => b === 0)) break;
    const size = readOctal(header, 124, 12);
    const type = String.fromCharCode(header[156] || 48);
    const dataStart = offset + BLOCK;
    if (dataStart + size > bytes.length) throw new ArchiveError("The tar archive is cut short");
    const data = bytes.subarray(dataStart, dataStart + size);
    offset = dataStart + Math.ceil(size / BLOCK) * BLOCK;

    if (type === "L") {
      longName = readString(data, 0, data.length);
      continue;
    }
    if (type === "x") {
      pax = parsePax(data);
      continue;
    }
    if (type === "g") continue;
    if (type === "0" || type === "7") {
      const prefix = readString(header, 345, 155);
      const base = readString(header, 0, 100);
      const name = pax.path ?? longName ?? (prefix ? `${prefix}/${base}` : base);
      entries.push({ name, data: data.slice(), mtime: new Date(readOctal(header, 136, 12) * 1000) });
    }
    longName = null;
    pax = {};
  }
  // Missing padding, or a partial header left over, means the download was cut short.
  const leftover = bytes.subarray(Math.min(offset, bytes.length));
  if (offset > bytes.length || (leftover.length < BLOCK && leftover.some((b) => b !== 0))) {
    throw new ArchiveError("The tar archive is cut short");
  }
  return entries;
}

function writeString(buf: Uint8Array, offset: number, length: number, value: string) {
  buf.set(encoder.encode(value).subarray(0, length), offset);
}

function writeOctal(buf: Uint8Array, offset: number, length: number, value: number) {
  writeString(buf, offset, length, `${value.toString(8).padStart(length - 1, "0")}\0`);
}

function tarHeader(name: string, size: number, mtime: number, type: string, prefix = ""): Uint8Array {
  const h = new Uint8Array(BLOCK);
  writeString(h, 0, 100, name);
  writeOctal(h, 100, 8, 0o644);
  writeOctal(h, 108, 8, 0);
  writeOctal(h, 116, 8, 0);
  writeOctal(h, 124, 12, size);
  writeOctal(h, 136, 12, mtime);
  h.fill(32, 148, 156); // checksum field counts as spaces while summing
  h[156] = type.charCodeAt(0);
  writeString(h, 257, 6, "ustar\0");
  writeString(h, 263, 2, "00");
  writeString(h, 345, 155, prefix);
  const sum = h.reduce((acc, b) => acc + b, 0);
  writeString(h, 148, 8, `${sum.toString(8).padStart(6, "0")}\0 `);
  return h;
}

/** Split a long path into ustar's 155-byte prefix and 100-byte name, if it fits. */
function splitUstarPath(path: string): [string, string] | null {
  if (encoder.encode(path).length <= 100) return ["", path];
  for (let i = path.length - 1; i > 0; i--) {
    if (path[i] !== "/") continue;
    const prefix = path.slice(0, i);
    const name = path.slice(i + 1);
    if (encoder.encode(prefix).length <= 155 && encoder.encode(name).length <= 100) return [prefix, name];
  }
  return null;
}

function paxRecord(key: string, value: string): string {
  // The length prefix counts itself, so grow it until it is stable.
  const body = ` ${key}=${value}\n`;
  const base = encoder.encode(body).length;
  let digits = String(base).length;
  while (String(base + digits).length !== digits) digits++;
  return `${base + digits}${body}`;
}

export function createTar(entries: ArchiveEntry[]): Uint8Array {
  const chunks: Uint8Array[] = [];
  const pad = (size: number) => {
    const rem = size % BLOCK;
    if (rem) chunks.push(new Uint8Array(BLOCK - rem));
  };
  for (const e of entries) {
    const mtime = Math.floor((e.mtime?.getTime() ?? Date.now()) / 1000);
    let split = splitUstarPath(e.name);
    if (!split) {
      // Too long for ustar: a pax header carries the full path.
      const pax = encoder.encode(paxRecord("path", e.name));
      chunks.push(tarHeader("PaxHeader", pax.length, mtime, "x"), pax);
      pad(pax.length);
      split = ["", e.name.slice(-100)];
    }
    chunks.push(tarHeader(split[1], e.data.length, mtime, "0", split[0]), e.data);
    pad(e.data.length);
  }
  chunks.push(new Uint8Array(BLOCK * 2));
  const out = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0));
  let at = 0;
  for (const c of chunks) {
    out.set(c, at);
    at += c.length;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Detection, reading, writing                                         */
/* ------------------------------------------------------------------ */

const isZip = (b: Uint8Array) => b[0] === 0x50 && b[1] === 0x4b && (b[2] === 3 || b[2] === 5) && (b[3] === 4 || b[3] === 6);
const isGzip = (b: Uint8Array) => b[0] === 0x1f && b[1] === 0x8b;

export type DetectedFormat = "zip" | "tar" | "tar.gz" | "gz" | "unknown";

/** Format from the file's own bytes; the extension is only used to name a lone .gz file. */
export function detectFormat(bytes: Uint8Array): DetectedFormat {
  if (isZip(bytes)) return "zip";
  if (isGzip(bytes)) {
    try {
      return isTar(gunzipSync(bytes)) ? "tar.gz" : "gz";
    } catch {
      return "unknown";
    }
  }
  if (isTar(bytes)) return "tar";
  return "unknown";
}

export const FORMAT_LABELS: Record<DetectedFormat, string> = {
  zip: "ZIP",
  tar: "TAR",
  "tar.gz": "TAR.GZ",
  gz: "GZIP",
  unknown: "Unknown",
};

/** Every file in a ZIP, TAR, TAR.GZ/TGZ or single-file GZ archive. */
export function readArchive(fileName: string, bytes: Uint8Array): { format: DetectedFormat; entries: ArchiveEntry[] } {
  const format = detectFormat(bytes);
  switch (format) {
    case "zip": {
      let files: Record<string, Uint8Array>;
      try {
        files = unzipSync(bytes);
      } catch (e) {
        throw new ArchiveError(
          String(e).includes("encrypt") || String(e).includes("compression")
            ? "This ZIP uses encryption or a compression method browsers can't open"
            : "The ZIP file is damaged or incomplete"
        );
      }
      const entries = Object.entries(files)
        .filter(([name]) => !name.endsWith("/"))
        .map(([name, data]) => ({ name, data }));
      return { format, entries };
    }
    case "tar":
      return { format, entries: parseTar(bytes) };
    case "tar.gz":
      return { format, entries: parseTar(gunzipSync(bytes)) };
    case "gz":
      return { format, entries: [{ name: fileName.replace(/\.gz$/i, "") || "file", data: gunzipSync(bytes) }] };
    default:
      throw new ArchiveError("This isn't a ZIP, TAR, TAR.GZ or GZ file");
  }
}

/** Names must be unique inside an archive; repeats get " (2)", " (3)" … before the extension. */
export function uniqueNames(entries: ArchiveEntry[]): ArchiveEntry[] {
  const seen = new Set<string>();
  return entries.map((e) => {
    let name = e.name;
    for (let n = 2; seen.has(name); n++) {
      const dot = e.name.lastIndexOf(".");
      const slash = e.name.lastIndexOf("/");
      name = dot > slash + 1 ? `${e.name.slice(0, dot)} (${n})${e.name.slice(dot)}` : `${e.name} (${n})`;
    }
    seen.add(name);
    return name === e.name ? e : { ...e, name };
  });
}

export function writeArchive(entries: ArchiveEntry[], format: ArchiveFormat, level: 0 | 6 | 9 = 6): Uint8Array {
  const files = uniqueNames(entries);
  if (format === "zip") {
    const tree: Zippable = {};
    for (const e of files) tree[e.name] = [e.data, { level, mtime: e.mtime ?? new Date() }];
    return zipSync(tree);
  }
  const tar = createTar(files);
  return format === "tar" ? tar : gzipSync(tar, { level });
}

export const ARCHIVE_MIME: Record<ArchiveFormat, string> = {
  zip: "application/zip",
  tar: "application/x-tar",
  "tar.gz": "application/gzip",
};

/** "photos.tar.gz" → "photos" */
export const archiveBaseName = (fileName: string) =>
  fileName.replace(/\.(tar\.gz|tgz|tar|zip|gz)$/i, "") || "archive";

export function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 ** 3) return `${(n / 1024 / 1024).toFixed(2)} MB`;
  return `${(n / 1024 ** 3).toFixed(2)} GB`;
}

/** A Blob from bytes, copied so a view onto a larger buffer doesn't drag the rest along. */
export const bytesToBlob = (bytes: Uint8Array, type: string) => new Blob([bytes.slice()], { type });
