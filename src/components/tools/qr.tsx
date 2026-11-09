"use client";

import * as React from "react";
import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalcLayout, CopyButton, FieldGrid, MiniTable, ResultHero, SelectField, TextAreaField, TextField, Verdict, downloadBlob, downloadText } from "./ui";
import { FileDropZone } from "./file-drop";
import {
  describePayload,
  mailtoPayload,
  normalizeUrl,
  qrContrast,
  smsPayload,
  telPayload,
  vcardPayload,
  wifiPayload,
  type Contact,
  type DescribedPayload,
  type WifiSecurity,
} from "@/lib/qr";

/* ================================================================== */
/* QR code generator                                                   */
/* ================================================================== */

const KINDS = [
  { value: "url", label: "Website link" },
  { value: "text", label: "Plain text" },
  { value: "wifi", label: "Wi-Fi network" },
  { value: "contact", label: "Contact card" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone call" },
  { value: "sms", label: "Text message" },
];

const LEVELS = [
  { value: "L", label: "Low (7% can be damaged)" },
  { value: "M", label: "Medium (15%)" },
  { value: "Q", label: "Quartile (25%)" },
  { value: "H", label: "High (30%), for logos or print" },
];

const EMPTY_CONTACT: Contact = { first: "", last: "", org: "", title: "", phone: "", email: "", url: "", address: "" };

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = React.useId();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-10 shrink-0 cursor-pointer rounded-md border border-input bg-card p-0.5"
        />
        <Input aria-label={`${label} hex code`} value={value} onChange={(e) => onChange(e.target.value)} className="font-mono" spellCheck={false} />
      </div>
    </div>
  );
}

// Inputs stay in component state, never in the URL: a Wi-Fi code holds a password.
export function QrCodeGenerator() {
  const [kind, setKind] = React.useState("url");
  const [url, setUrl] = React.useState("https://utilitytoolz.com");
  const [text, setText] = React.useState("");
  const [wifi, setWifi] = React.useState({ ssid: "", password: "", security: "WPA" as WifiSecurity, hidden: false });
  const [contact, setContact] = React.useState<Contact>(EMPTY_CONTACT);
  const [email, setEmail] = React.useState({ to: "", subject: "", body: "" });
  const [phone, setPhone] = React.useState("");
  const [sms, setSms] = React.useState({ phone: "", message: "" });
  const [level, setLevel] = React.useState("M");
  const [size, setSize] = React.useState("1024");
  const [margin, setMargin] = React.useState("4");
  const [fg, setFg] = React.useState("#000000");
  const [bg, setBg] = React.useState("#ffffff");
  const [svg, setSvg] = React.useState("");
  const [modules, setModules] = React.useState(0);
  const [error, setError] = React.useState("");

  const payload = React.useMemo(() => {
    switch (kind) {
      case "url":
        return normalizeUrl(url);
      case "text":
        return text;
      case "wifi":
        return wifi.ssid.trim() ? wifiPayload(wifi) : "";
      case "contact":
        return Object.values(contact).some((v) => v.trim()) ? vcardPayload(contact) : "";
      case "email":
        return email.to.trim() ? mailtoPayload(email.to, email.subject, email.body) : "";
      case "phone":
        return phone.trim() ? telPayload(phone) : "";
      default:
        return sms.phone.trim() ? smsPayload(sms.phone, sms.message) : "";
    }
  }, [kind, url, text, wifi, contact, email, phone, sms]);

  const validColors = /^#[\da-f]{6}$/i.test(fg) && /^#[\da-f]{6}$/i.test(bg);
  const contrast = validColors ? qrContrast(fg, bg) : null;
  const options = React.useMemo(
    () => ({
      errorCorrectionLevel: level as "L" | "M" | "Q" | "H",
      margin: Number(margin),
      color: { dark: validColors ? fg : "#000000", light: validColors ? bg : "#ffffff" },
    }),
    [level, margin, fg, bg, validColors]
  );

  React.useEffect(() => {
    let live = true;
    if (!payload) return;
    import("qrcode").then(async (QRCode) => {
      try {
        const out = await QRCode.toString(payload, { ...options, type: "svg" });
        const created = QRCode.create(payload, { errorCorrectionLevel: options.errorCorrectionLevel });
        if (!live) return;
        setSvg(out);
        setModules(created.modules.size);
        setError("");
      } catch {
        if (!live) return;
        setSvg("");
        setError("That's more than a QR code can hold at this error-correction level. Shorten it or pick a lower level.");
      }
    });
    return () => {
      live = false;
    };
  }, [payload, options]);

  const savePng = async () => {
    const QRCode = await import("qrcode");
    const dataUrl = await QRCode.toDataURL(payload, { ...options, width: Number(size) });
    downloadBlob("qr-code.png", await (await fetch(dataUrl)).blob());
  };

  const field = <T extends object>(set: React.Dispatch<React.SetStateAction<T>>, key: keyof T) => (v: string) =>
    set((prev) => ({ ...prev, [key]: v }));

  return (
    <CalcLayout inputFirst
      inputs={
        <div className="space-y-4">
          <SelectField label="What should it open?" value={kind} onChange={setKind} options={KINDS} />
          {kind === "url" && <TextField label="Web address" value={url} onChange={setUrl} placeholder="example.com/menu" />}
          {kind === "text" && <TextAreaField label="Text" value={text} onChange={setText} rows={4} />}
          {kind === "wifi" && (
            <>
              <FieldGrid>
                <TextField label="Network name (SSID)" value={wifi.ssid} onChange={field(setWifi, "ssid")} />
                <TextField label="Password" value={wifi.password} onChange={field(setWifi, "password")} />
              </FieldGrid>
              <FieldGrid>
                <SelectField
                  label="Security"
                  value={wifi.security}
                  onChange={field(setWifi, "security")}
                  options={[
                    { value: "WPA", label: "WPA, WPA2 or WPA3" },
                    { value: "WEP", label: "WEP (old)" },
                    { value: "nopass", label: "None (open network)" },
                  ]}
                />
                <SelectField
                  label="Hidden network"
                  value={wifi.hidden ? "yes" : "no"}
                  onChange={(v) => setWifi((w) => ({ ...w, hidden: v === "yes" }))}
                  options={[
                    { value: "no", label: "No" },
                    { value: "yes", label: "Yes" },
                  ]}
                />
              </FieldGrid>
            </>
          )}
          {kind === "contact" && (
            <>
              <FieldGrid>
                <TextField label="First name" value={contact.first} onChange={field(setContact, "first")} />
                <TextField label="Last name" value={contact.last} onChange={field(setContact, "last")} />
                <TextField label="Phone" value={contact.phone} onChange={field(setContact, "phone")} />
                <TextField label="Email" value={contact.email} onChange={field(setContact, "email")} />
                <TextField label="Organisation" value={contact.org} onChange={field(setContact, "org")} />
                <TextField label="Job title" value={contact.title} onChange={field(setContact, "title")} />
              </FieldGrid>
              <TextField label="Website" value={contact.url} onChange={field(setContact, "url")} />
              <TextField label="Address" value={contact.address} onChange={field(setContact, "address")} />
            </>
          )}
          {kind === "email" && (
            <>
              <TextField label="Send to" value={email.to} onChange={field(setEmail, "to")} placeholder="hello@example.com" />
              <TextField label="Subject" value={email.subject} onChange={field(setEmail, "subject")} />
              <TextAreaField label="Message" value={email.body} onChange={field(setEmail, "body")} rows={3} />
            </>
          )}
          {kind === "phone" && <TextField label="Phone number" value={phone} onChange={setPhone} placeholder="+1 555 010 0199" />}
          {kind === "sms" && (
            <>
              <TextField label="Phone number" value={sms.phone} onChange={field(setSms, "phone")} />
              <TextAreaField label="Message" value={sms.message} onChange={field(setSms, "message")} rows={3} />
            </>
          )}
          <FieldGrid>
            <SelectField label="Error correction" value={level} onChange={setLevel} options={LEVELS} />
            <SelectField
              label="PNG size"
              value={size}
              onChange={setSize}
              options={["256", "512", "1024", "2048"].map((s) => ({ value: s, label: `${s} × ${s} px` }))}
            />
            <ColorField label="Code colour" value={fg} onChange={setFg} />
            <ColorField label="Background" value={bg} onChange={setBg} />
          </FieldGrid>
          <SelectField
            label="Quiet zone"
            value={margin}
            onChange={setMargin}
            options={[
              { value: "4", label: "4 modules (standard)" },
              { value: "2", label: "2 modules" },
              { value: "0", label: "None (add your own white space)" },
            ]}
          />
        </div>
      }
      results={
        !payload ? (
          <Verdict tone="neutral">Fill in the details and the QR code appears here, ready to download.</Verdict>
        ) : error ? (
          <Verdict tone="bad">{error}</Verdict>
        ) : !svg ? (
          <Verdict tone="neutral">Drawing the code…</Verdict>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border bg-white p-3">
              <img
                src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
                alt={`QR code for ${KINDS.find((k) => k.value === kind)?.label.toLowerCase()}`}
                className="mx-auto aspect-square w-full max-w-64"
              />
            </div>
            {contrast && contrast.inverted && (
              <Verdict tone="warn">Light codes on a dark background don&apos;t scan in many camera apps. Keep the code darker than the background.</Verdict>
            )}
            {contrast && !contrast.inverted && contrast.ratio < 4 && (
              <Verdict tone="bad">The colours are too close ({contrast.ratio.toFixed(1)}:1). Phones may fail to read it; aim for at least 4:1.</Verdict>
            )}
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" className="gap-2" onClick={savePng}>
                <Download className="h-4 w-4" aria-hidden /> PNG
              </Button>
              <Button type="button" variant="outline" className="gap-2" onClick={() => downloadText("qr-code.svg", svg, "image/svg+xml")}>
                <Download className="h-4 w-4" aria-hidden /> SVG
              </Button>
            </div>
            <MiniTable
              head={["Detail", ""]}
              rows={[
                ["Grid", `${modules} × ${modules} modules`],
                ["Characters encoded", payload.length.toLocaleString("en-US")],
              ]}
            />
            <details className="text-sm">
              <summary className="cursor-pointer text-muted-foreground">Encoded text</summary>
              <pre className="mt-2 whitespace-pre-wrap break-all rounded-lg bg-muted p-3 font-mono text-xs">{payload}</pre>
            </details>
            <Verdict tone="neutral">Test the code with your phone before printing. SVG stays sharp at any size for print.</Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* QR code reader                                                      */
/* ================================================================== */

interface ReadResult {
  text: string;
  info: DescribedPayload;
  /** The photo with the found code outlined. */
  preview: string;
}

/** Decode at a working size first (fast), then at full size if that fails. */
async function decodeImage(file: File): Promise<ReadResult | null> {
  const { default: jsQR } = await import("jsqr");
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const longest = Math.max(bitmap.width, bitmap.height);
  for (const target of [1600, 4000]) {
    if (target > 1600 && longest <= 1600) break;
    const scale = Math.min(1, target / longest);
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.drawImage(bitmap, 0, 0, w, h);
    const found = jsQR(ctx.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: "attemptBoth" });
    if (!found || !found.data) continue;
    const loc = found.location;
    ctx.lineWidth = Math.max(3, Math.round(Math.min(w, h) / 120));
    ctx.strokeStyle = "#cf4f43";
    ctx.beginPath();
    ctx.moveTo(loc.topLeftCorner.x, loc.topLeftCorner.y);
    ctx.lineTo(loc.topRightCorner.x, loc.topRightCorner.y);
    ctx.lineTo(loc.bottomRightCorner.x, loc.bottomRightCorner.y);
    ctx.lineTo(loc.bottomLeftCorner.x, loc.bottomLeftCorner.y);
    ctx.closePath();
    ctx.stroke();
    bitmap.close();
    return { text: found.data, info: describePayload(found.data), preview: canvas.toDataURL("image/jpeg", 0.8) };
  }
  bitmap.close();
  return null;
}

export function QrCodeReader() {
  const [result, setResult] = React.useState<ReadResult | null>(null);
  const [error, setError] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [name, setName] = React.useState("");

  const read = React.useCallback(async (files: File[]) => {
    const f = files.find((x) => x.type.startsWith("image/")) ?? files[0];
    if (!f) return;
    setResult(null);
    setError("");
    setName(f.name || "Pasted image");
    setBusy(true);
    try {
      const r = await decodeImage(f);
      if (r) setResult(r);
      else setError("No QR code found. Try a sharper, closer photo with the whole code in frame and a little space around it.");
    } catch {
      setError("That file couldn't be opened as an image.");
    } finally {
      setBusy(false);
    }
  }, []);

  // Paste a screenshot straight from the clipboard.
  React.useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const files = [...(e.clipboardData?.files ?? [])].filter((f) => f.type.startsWith("image/"));
      if (files.length) {
        e.preventDefault();
        read(files);
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [read]);

  const password = result?.info.kind === "wifi" ? result.info.fields.find(([k]) => k === "Password")?.[1] : undefined;

  return (
    <CalcLayout inputFirst
      inputs={
        <div className="space-y-4">
          <FileDropZone accept="image/*" onFiles={read} title={name || "Open a photo or screenshot of a QR code"} hint="You can also paste a screenshot with Ctrl+V or ⌘V. Nothing is uploaded." />
          {result && (
            <img src={result.preview} alt="Your image with the QR code outlined" className="mx-auto max-h-96 w-auto rounded-lg border" />
          )}
        </div>
      }
      results={
        busy ? (
          <Verdict tone="neutral">Looking for a QR code…</Verdict>
        ) : error ? (
          <Verdict tone="warn">{error}</Verdict>
        ) : !result ? (
          <Verdict tone="neutral">Open or paste an image to read the QR code in it, without scanning it with your phone first.</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero label="QR code contains" value={result.info.label} sub={`${result.text.length.toLocaleString("en-US")} characters`} />
            {result.info.fields.length > 0 && <MiniTable head={["Field", ""]} rows={result.info.fields} />}
            {result.info.href && (
              <>
                <Verdict tone="warn">
                  Check the address before you open it: this link goes to <strong>{result.info.fields[0][1]}</strong>. QR codes on
                  stickers and posters are sometimes swapped for scam links.
                </Verdict>
                <Button asChild variant="outline" className="w-full gap-2">
                  <a href={result.info.href} target="_blank" rel="noopener noreferrer nofollow">
                    <ExternalLink className="h-4 w-4" aria-hidden /> Open link
                  </a>
                </Button>
              </>
            )}
            <div className="space-y-2">
              <p className="text-sm font-medium">Raw text</p>
              <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-muted p-3 font-mono text-xs">{result.text}</pre>
              <div className="flex flex-wrap gap-2">
                <CopyButton text={result.text} label="Copy text" />
                {password && <CopyButton text={password} label="Copy Wi-Fi password" />}
              </div>
            </div>
          </div>
        )
      }
    />
  );
}
