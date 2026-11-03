import { describe, expect, test } from "bun:test";
import QRCode from "qrcode";
import jsQR from "jsqr";
import {
  cleanPhone,
  describePayload,
  mailtoPayload,
  normalizeUrl,
  qrContrast,
  smsPayload,
  telPayload,
  vcardPayload,
  wifiPayload,
} from "@/lib/qr";

const contact = {
  first: "Ada",
  last: "Lovelace",
  org: "Analytical Engines, Ltd",
  title: "Engineer",
  phone: "+44 20 7946 0958",
  email: "ada@example.com",
  url: "example.com",
  address: "12 St James's Square; London",
};

describe("Payload building", () => {
  test("Wi-Fi escapes special characters", () => {
    expect(wifiPayload({ ssid: 'Cafe;"Guest"', password: "p:a\\ss,1", security: "WPA", hidden: false })).toBe(
      'WIFI:T:WPA;S:Cafe\\;\\"Guest\\";P:p\\:a\\\\ss\\,1;;'
    );
    expect(wifiPayload({ ssid: "Open", password: "ignored", security: "nopass", hidden: true })).toBe("WIFI:T:nopass;S:Open;H:true;;");
  });

  test("vCard escapes and omits empty fields", () => {
    const v = vcardPayload(contact);
    expect(v.startsWith("BEGIN:VCARD\r\nVERSION:3.0\r\nN:Lovelace;Ada;;;\r\nFN:Ada Lovelace")).toBe(true);
    expect(v).toContain("ORG:Analytical Engines\\, Ltd");
    expect(v).toContain("ADR:;;12 St James's Square\\; London;;;;");
    expect(v).toContain("URL:https://example.com");
    expect(vcardPayload({ ...contact, title: "", url: "" })).not.toContain("TITLE");
  });

  test("email, phone and SMS", () => {
    expect(mailtoPayload("a@b.co", "Hi & bye", "")).toBe("mailto:a@b.co?subject=Hi%20%26%20bye");
    expect(mailtoPayload("a@b.co", "", "")).toBe("mailto:a@b.co");
    expect(cleanPhone("+1 (555) 010-9999")).toBe("+15550109999");
    expect(telPayload("020 7946 0958")).toBe("tel:02079460958");
    expect(smsPayload("+1 555 0100", "On my way")).toBe("SMSTO:+15550100:On my way");
  });

  test("adds https:// only when there is no scheme", () => {
    expect(normalizeUrl(" example.com/a ")).toBe("https://example.com/a");
    expect(normalizeUrl("http://x.test")).toBe("http://x.test");
    expect(normalizeUrl("")).toBe("");
  });
});

describe("Payload reading", () => {
  test("round-trips Wi-Fi with escapes", () => {
    const d = describePayload(wifiPayload({ ssid: 'Cafe;"Guest"', password: "p:a\\ss,1", security: "WPA", hidden: true }));
    expect(d.kind).toBe("wifi");
    expect(d.fields).toEqual([
      ["Network name", 'Cafe;"Guest"'],
      ["Security", "WPA/WPA2/WPA3"],
      ["Password", "p:a\\ss,1"],
      ["Hidden network", "Yes"],
    ]);
  });

  test("round-trips a vCard", () => {
    const d = describePayload(vcardPayload(contact));
    expect(d.kind).toBe("contact");
    expect(Object.fromEntries(d.fields)).toMatchObject({
      Name: "Ada Lovelace",
      Organisation: "Analytical Engines, Ltd",
      Address: "12 St James's Square; London",
      Phone: "+44 20 7946 0958",
    });
  });

  test("recognises links, email, SMS and text", () => {
    expect(describePayload("https://example.com/menu?t=4")).toMatchObject({ kind: "url", href: "https://example.com/menu?t=4", fields: [["Site", "example.com"]] });
    expect(describePayload(mailtoPayload("a@b.co", "Hi", "There")).fields).toEqual([["To", "a@b.co"], ["Subject", "Hi"], ["Message", "There"]]);
    expect(describePayload("SMSTO:+1555:Hello: world").fields).toEqual([["Number", "+1555"], ["Message", "Hello: world"]]);
    expect(describePayload("javascript:alert(1)").kind).toBe("text");
    expect(describePayload("just some words").kind).toBe("text");
  });
});

describe("Colours", () => {
  test("measures contrast and inversion", () => {
    expect(qrContrast("#000000", "#ffffff")).toEqual({ ratio: 21, inverted: false });
    expect(qrContrast("#ffffff", "#000000").inverted).toBe(true);
    expect(qrContrast("#777777", "#888888").ratio).toBeLessThan(1.5);
  });
});

describe("Generate then read", () => {
  test("a generated Wi-Fi code decodes back to the same payload", () => {
    const payload = wifiPayload({ ssid: "Home", password: "correct horse", security: "WPA", hidden: false });
    const qr = QRCode.create(payload, { errorCorrectionLevel: "M" });
    const size = qr.modules.size;
    const scale = 4;
    const margin = 4;
    const px = (size + margin * 2) * scale;
    const rgba = new Uint8ClampedArray(px * px * 4).fill(255);
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++)
        if (qr.modules.get(y, x))
          for (let dy = 0; dy < scale; dy++)
            for (let dx = 0; dx < scale; dx++) {
              const i = (((y + margin) * scale + dy) * px + (x + margin) * scale + dx) * 4;
              rgba[i] = rgba[i + 1] = rgba[i + 2] = 0;
            }
    expect(jsQR(rgba, px, px)?.data).toBe(payload);
  });
});
