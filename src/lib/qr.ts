/**
 * QR code payloads: building the text formats phone cameras understand
 * (Wi-Fi, vCard, mailto, SMS …) and reading them back for the QR reader.
 * Pure string work, so it is unit-tested without a QR library.
 */

/* ------------------------------------------------------------------ */
/* Building                                                            */
/* ------------------------------------------------------------------ */

/** Wi-Fi config escaping (ZXing's de facto spec): \ ; , : and " get a backslash. */
const wifiEscape = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");

export type WifiSecurity = "WPA" | "WEP" | "nopass";

export function wifiPayload(o: { ssid: string; password: string; security: WifiSecurity; hidden: boolean }): string {
  const parts = [`T:${o.security}`, `S:${wifiEscape(o.ssid)}`];
  if (o.security !== "nopass") parts.push(`P:${wifiEscape(o.password)}`);
  if (o.hidden) parts.push("H:true");
  return `WIFI:${parts.join(";")};;`;
}

/** vCard 3.0 text escaping: backslash, comma, semicolon and line breaks. */
const vEscape = (s: string) => s.replace(/([\\,;])/g, "\\$1").replace(/\r?\n/g, "\\n");

export interface Contact {
  first: string;
  last: string;
  org: string;
  title: string;
  phone: string;
  email: string;
  url: string;
  address: string;
}

export function vcardPayload(c: Contact): string {
  const t = (s: string) => s.trim();
  const full = [t(c.first), t(c.last)].filter(Boolean).join(" ");
  const lines = ["BEGIN:VCARD", "VERSION:3.0", `N:${vEscape(t(c.last))};${vEscape(t(c.first))};;;`, `FN:${vEscape(full || t(c.org))}`];
  if (t(c.org)) lines.push(`ORG:${vEscape(t(c.org))}`);
  if (t(c.title)) lines.push(`TITLE:${vEscape(t(c.title))}`);
  if (t(c.phone)) lines.push(`TEL;TYPE=CELL:${t(c.phone)}`);
  if (t(c.email)) lines.push(`EMAIL:${t(c.email)}`);
  if (t(c.url)) lines.push(`URL:${normalizeUrl(c.url)}`);
  if (t(c.address)) lines.push(`ADR:;;${vEscape(t(c.address))};;;;`);
  lines.push("END:VCARD");
  return lines.join("\r\n");
}

export function mailtoPayload(to: string, subject: string, body: string): string {
  const q = [subject && `subject=${encodeURIComponent(subject)}`, body && `body=${encodeURIComponent(body)}`].filter(Boolean);
  return `mailto:${to.trim()}${q.length ? `?${q.join("&")}` : ""}`;
}

/** Phone numbers keep digits, a leading +, and nothing else. */
export const cleanPhone = (s: string) => s.trim().replace(/(?!^\+)[^\d]/g, "");

export const telPayload = (phone: string) => `tel:${cleanPhone(phone)}`;

export const smsPayload = (phone: string, message: string) =>
  `SMSTO:${cleanPhone(phone)}${message ? `:${message}` : ""}`;

/** "example.com/x" → "https://example.com/x"; anything with a scheme is left alone. */
export function normalizeUrl(s: string): string {
  const t = s.trim();
  if (!t) return "";
  return /^[a-z][a-z\d+.-]*:/i.test(t) ? t : `https://${t}`;
}

/* ------------------------------------------------------------------ */
/* Reading                                                             */
/* ------------------------------------------------------------------ */

export type PayloadKind = "url" | "wifi" | "contact" | "email" | "phone" | "sms" | "geo" | "text";

export interface DescribedPayload {
  kind: PayloadKind;
  label: string;
  fields: [string, string][];
  /** A web address, for URL payloads only. */
  href?: string;
}

/** Split on a separator that isn't escaped with a backslash. */
function splitEscaped(s: string, sep: string): string[] {
  const out: string[] = [];
  let cur = "";
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "\\" && i + 1 < s.length) {
      cur += s[i + 1];
      i++;
    } else if (s[i] === sep) {
      out.push(cur);
      cur = "";
    } else cur += s[i];
  }
  out.push(cur);
  return out;
}

const SECURITY: Record<string, string> = { WPA: "WPA/WPA2/WPA3", WEP: "WEP", nopass: "None (open network)", "": "None (open network)" };

function describeWifi(text: string): DescribedPayload {
  const map: Record<string, string> = {};
  for (const part of splitEscaped(text.slice(5), ";")) {
    const colon = part.indexOf(":");
    if (colon > 0) map[part.slice(0, colon).toUpperCase()] = part.slice(colon + 1);
  }
  const fields: [string, string][] = [["Network name", map.S ?? ""], ["Security", SECURITY[map.T ?? ""] ?? map.T ?? ""]];
  if (map.P) fields.push(["Password", map.P]);
  if (map.H === "true") fields.push(["Hidden network", "Yes"]);
  return { kind: "wifi", label: "Wi-Fi network", fields };
}

const vUnescape = (s: string) => s.replace(/\\n/gi, "\n").replace(/\\([\\,;])/g, "$1");

function describeVcard(text: string): DescribedPayload {
  // Unfold continuation lines (a line break followed by a space or tab).
  const lines = text.replace(/\r?\n[ \t]/g, "").split(/\r?\n/);
  const fields: [string, string][] = [];
  const names: Record<string, string> = { FN: "Name", ORG: "Organisation", TITLE: "Job title", TEL: "Phone", EMAIL: "Email", URL: "Website", ADR: "Address", NOTE: "Note" };
  for (const line of lines) {
    const colon = line.indexOf(":");
    if (colon < 0) continue;
    const key = line.slice(0, colon).split(";")[0].toUpperCase();
    const label = names[key];
    if (!label) continue;
    // ADR parts are separated by unescaped semicolons.
    const value =
      key === "ADR"
        ? line.slice(colon + 1).split(/(?<!\\);/).filter(Boolean).map(vUnescape).join(", ")
        : vUnescape(line.slice(colon + 1));
    if (value.trim()) fields.push([label, value]);
  }
  return { kind: "contact", label: "Contact card", fields };
}

export function describePayload(raw: string): DescribedPayload {
  const text = raw.trim();
  const lower = text.toLowerCase();
  if (lower.startsWith("wifi:")) return describeWifi(text);
  if (lower.startsWith("begin:vcard")) return describeVcard(text);
  if (lower.startsWith("mailto:")) {
    const [addr, query = ""] = text.slice(7).split("?");
    const params = new URLSearchParams(query);
    const fields: [string, string][] = [["To", decodeURIComponent(addr)]];
    if (params.get("subject")) fields.push(["Subject", params.get("subject")!]);
    if (params.get("body")) fields.push(["Message", params.get("body")!]);
    return { kind: "email", label: "Email", fields };
  }
  if (lower.startsWith("tel:")) return { kind: "phone", label: "Phone number", fields: [["Number", text.slice(4)]] };
  if (lower.startsWith("smsto:") || lower.startsWith("sms:")) {
    const rest = text.slice(text.indexOf(":") + 1);
    const colon = rest.indexOf(":");
    const fields: [string, string][] = [["Number", colon < 0 ? rest : rest.slice(0, colon)]];
    if (colon >= 0 && rest.slice(colon + 1)) fields.push(["Message", rest.slice(colon + 1)]);
    return { kind: "sms", label: "Text message", fields };
  }
  if (lower.startsWith("geo:")) {
    const [lat, lng] = text.slice(4).split(/[,;?]/);
    return { kind: "geo", label: "Map location", fields: [["Latitude", lat], ["Longitude", lng]] };
  }
  if (/^https?:\/\/\S+$/i.test(text)) {
    let host = "";
    try {
      host = new URL(text).hostname;
    } catch {
      /* not a parseable URL; shown as text */
    }
    if (host) return { kind: "url", label: "Web link", fields: [["Site", host]], href: text };
  }
  return { kind: "text", label: "Plain text", fields: [] };
}

/* ------------------------------------------------------------------ */
/* Colour contrast                                                     */
/* ------------------------------------------------------------------ */

function luminance(hex: string): number {
  const m = /^#?([\da-f]{6})$/i.exec(hex);
  if (!m) return 0;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(m[1].slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio, plus whether the code is inverted (light modules on dark). */
export function qrContrast(fg: string, bg: string): { ratio: number; inverted: boolean } {
  const a = luminance(fg);
  const b = luminance(bg);
  return { ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05), inverted: a > b };
}
