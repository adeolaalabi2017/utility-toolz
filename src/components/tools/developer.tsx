"use client";

import * as React from "react";
import { Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CalcLayout, CopyButton, OutputPanel, SelectField, StatRow, TextAreaField, Verdict } from "./ui";
import { cn } from "@/lib/utils";

/* ================================================================== */
/* 59. JSON formatter                                                  */
/* ================================================================== */

export function JsonFormatter() {
  const [input, setInput] = React.useState(
    '{"site":"Utility Toolz","domains":12,"tools":{"live":119,"roadmap":119},"tags":["seo","finance","developer"],"pricing":{"price":0,"currency":"USD"}}'
  );
  const [indent, setIndent] = React.useState("2");

  let parsed: unknown;
  let error: string | null = null;
  try {
    parsed = JSON.parse(input);
  } catch (e) {
    error = e instanceof Error ? e.message : "Invalid JSON";
  }

  const indentN = Number(indent);
  const pretty = error ? "" : JSON.stringify(parsed, null, indentN);
  const minified = error ? "" : JSON.stringify(parsed);
  const countKeys = (v: unknown): number => {
    if (Array.isArray(v)) return v.reduce((a: number, x) => a + countKeys(x), 0);
    if (v && typeof v === "object") {
      return Object.entries(v as Record<string, unknown>).reduce(
        (a, [, x]) => a + 1 + countKeys(x),
        0
      );
    }
    return 0;
  };

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <TextAreaField
            label="JSON input"
            value={input}
            onChange={setInput}
            rows={10}
            mono
            placeholder='{"paste": "your JSON here"}'
          />
          <SelectField
            label="Beautify indent"
            value={indent}
            onChange={setIndent}
            options={[
              { value: "2", label: "2 spaces" },
              { value: "4", label: "4 spaces" },
            ]}
          />
          <div className="flex items-center gap-2">
            {error ? (
              <span className="rounded-full bg-lf-coral/10 px-3 py-1 text-xs font-medium text-deep-coral">
                Invalid JSON
              </span>
            ) : (
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                Valid JSON ✓
              </span>
            )}
          </div>
        </div>
      }
      results={
        error ? (
          <Verdict tone="bad">
            <span className="font-semibold">Parse error:</span> {error}
          </Verdict>
        ) : (
          <div className="space-y-4">
            <OutputPanel
              value={pretty}
              filename="formatted.json"
              mime="application/json"
              ariaLabel="Formatted JSON"
            />
            <div>
              <StatRow label="Minified size" value={`${minified.length.toLocaleString()} chars`} emphasis />
              <StatRow label="Beautified size" value={`${pretty.length.toLocaleString()} chars`} />
              <StatRow label="Keys total" value={countKeys(parsed).toLocaleString()} />
            </div>
            <div className="flex gap-2">
              <CopyButton text={minified} label="Copy minified" />
            </div>
            <Verdict tone="neutral">
              Format before reviewing, minify before shipping — beautified JSON costs bandwidth and
              every byte reaches the client.
            </Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* 60. Regex tester                                                    */
/* ================================================================== */

const REGEX_PRESETS: { label: string; pattern: string; flags: string; sample: string }[] = [
  {
    label: "Email",
    pattern: "[\\w.+-]+@[\\w-]+\\.[\\w.]{2,}",
    flags: "g",
    sample: "Ping ana@brightlist.io and ops+alerts@tooldeck.example before Friday.",
  },
  {
    label: "URL",
    pattern: "https?://[^\\s)\"']+",
    flags: "g",
    sample: "Docs at https://tooldeck.example/tools and http://legacy.example/old path.",
  },
  {
    label: "Date (ISO)",
    pattern: "\\d{4}-\\d{2}-\\d{2}",
    flags: "g",
    sample: "Launch 2026-11-15, review 2026-12-01, retro 2027-01-09.",
  },
  {
    label: "Hex colour",
    pattern: "#[0-9a-fA-F]{6}\\b",
    flags: "g",
    sample: "Palette: #308f68 primary, #1f4a3f ink, #faf5ea surface.",
  },
];

export function RegexTester() {
  const [pattern, setPattern] = React.useState("[\\w.+-]+@[\\w-]+\\.[\\w.]{2,}");
  const [flags, setFlags] = React.useState("g");
  const [text, setText] = React.useState(
    "Ping ana@brightlist.io and ops+alerts@tooldeck.example before Friday, cc dev@tooldeck.example."
  );

  const toggleFlag = (f: string) =>
    setFlags((cur) => (cur.includes(f) ? cur.replace(f, "") : cur + f));

  const result = React.useMemo(() => {
    const src = pattern;
    let re: RegExp;
    try {
      re = new RegExp(src, flags.includes("g") ? flags : flags + "g");
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Invalid pattern", matches: [] as { text: string; index: number; groups: string[] }[], parts: [] as { t: string; hit: boolean }[] };
    }
    const matches: { text: string; index: number; groups: string[] }[] = [];
    const safeText = text.slice(0, 10_000);
    let m: RegExpExecArray | null;
    let guard = 0;
    while ((m = re.exec(safeText)) && guard < 500) {
      matches.push({
        text: m[0],
        index: m.index,
        groups: m.slice(1).map((g) => g ?? ""),
      });
      if (m.index === re.lastIndex) re.lastIndex++;
      guard++;
    }
    // build highlighted parts
    const parts: { t: string; hit: boolean }[] = [];
    let cursor = 0;
    for (const match of matches) {
      if (match.index > cursor) parts.push({ t: safeText.slice(cursor, match.index), hit: false });
      parts.push({ t: match.text, hit: true });
      cursor = match.index + match.text.length;
    }
    if (cursor < safeText.length) parts.push({ t: safeText.slice(cursor), hit: false });
    return { error: null, matches, parts };
  }, [pattern, flags, text]);

  const applyPreset = (p: (typeof REGEX_PRESETS)[number]) => {
    setPattern(p.pattern);
    setFlags(p.flags);
    setText(p.sample);
  };

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="developer-1" className="text-sm font-medium">Pattern</Label>
            <div className="flex items-center gap-2">
              <span className="font-mono text-muted-foreground">/</span>
              <Input id="developer-1" value={pattern} onChange={(e) => setPattern(e.target.value)} className="font-mono" />
              <span className="font-mono text-muted-foreground">/</span>
              <Input
                value={flags}
                onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ""))}
                className="w-20 font-mono"
                aria-label="Regex flags"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {["g", "i", "m", "s", "u"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => toggleFlag(f)}
                className={cn(
                  "h-8 w-9 rounded-md border font-mono text-sm font-semibold transition-colors",
                  flags.includes(f)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-card hover:bg-accent"
                )}
                aria-pressed={flags.includes(f)}
                aria-label={`Toggle flag ${f}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium">Presets</p>
            <div className="flex flex-wrap gap-2">
              {REGEX_PRESETS.map((p) => (
                <Button key={p.label} variant="outline" size="sm" className="h-10 sm:h-8" onClick={() => applyPreset(p)}>
                  <Wand2 className="h-3.5 w-3.5" /> {p.label}
                </Button>
              ))}
            </div>
          </div>
          <TextAreaField label="Test string" value={text} onChange={setText} rows={5} mono />
        </div>
      }
      results={
        <div className="space-y-4">
          {result.error ? (
            <Verdict tone="bad">
              <span className="font-semibold">Invalid pattern:</span> {result.error}
            </Verdict>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "tnum rounded-full px-3 py-1 text-xs font-medium",
                    result.matches.length
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {result.matches.length === 1 ? "1 match" : `${result.matches.length} matches`}
                </span>
              </div>
              <div
                role="region"
                aria-label="Highlighted matches"
                className="max-h-40 overflow-auto rounded-lg border bg-muted/40 p-3 font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words"
              >
                {result.parts.map((p, i) =>
                  p.hit ? (
                    <mark key={i} className="rounded bg-lf-green/20 px-0.5 text-foreground">
                      {p.t}
                    </mark>
                  ) : (
                    <span key={i}>{p.t}</span>
                  )
                )}
              </div>
              {result.matches.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Matches
                  </p>
                  <div className="max-h-56 space-y-1.5 overflow-auto">
                    {result.matches.map((m, i) => (
                      <div key={i} className="rounded-lg border bg-card p-2.5 text-sm">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="truncate font-mono text-[13px] font-semibold">{m.text}</span>
                          <span className="tnum shrink-0 text-xs text-muted-foreground">@ {m.index}</span>
                        </div>
                        {m.groups.length > 0 && (
                          <p className="tnum mt-1 font-mono text-xs text-muted-foreground">
                            groups: {m.groups.map((g, gi) => `$${gi + 1}="${g}"`).join("  ")}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <Verdict tone="neutral">
                Every match is evaluated locally with a 500-match guard. Use named groups
                (?&lt;name&gt;…) in production code — the numbered list above shows why names read
                better.
              </Verdict>
            </>
          )}
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 61. Base64 encoder/decoder                                          */
/* ================================================================== */

function encodeBase64(s: string, urlSafe: boolean): string {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  let b64 = btoa(bin);
  if (urlSafe) b64 = b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return b64;
}

function decodeBase64(s: string): { text: string; error: string | null } {
  try {
    let normalized = s.trim().replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
    while (normalized.length % 4 !== 0) normalized += "=";
    const bin = atob(normalized);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return { text: new TextDecoder("utf-8", { fatal: false }).decode(bytes), error: null };
  } catch (e) {
    return {
      text: "",
      error:
        e instanceof Error
          ? e.message
          : "Unable to decode Base64. Check for invalid characters or incomplete padding.",
    };
  }
}

export function Base64EncoderDecoder() {
  const [mode, setMode] = React.useState("encode");
  const [variant, setVariant] = React.useState("standard");
  const [input, setInput] = React.useState("Hello, Utility Toolz — café edition!");

  const urlSafe = variant === "urlsafe";
  const output = mode === "encode" ? encodeBase64(input, urlSafe) : "";
  const decoded = mode === "decode" ? decodeBase64(input) : null;

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <SelectField
            label="Mode"
            value={mode}
            onChange={setMode}
            options={[
              { value: "encode", label: "Encode text → Base64" },
              { value: "decode", label: "Decode Base64 → text" },
            ]}
          />
          {mode === "encode" && (
            <SelectField
              label="Alphabet"
              value={variant}
              onChange={setVariant}
              options={[
                { value: "standard", label: "Standard (RFC 4648)" },
                { value: "urlsafe", label: "URL-safe (+/ → -_ , no padding)" },
              ]}
            />
          )}
          <TextAreaField
            label={mode === "encode" ? "Plain text" : "Base64 input"}
            value={input}
            onChange={setInput}
            rows={6}
            mono
            placeholder={mode === "encode" ? "Type text to encode" : "Paste Base64 to decode"}
          />
        </div>
      }
      results={
        mode === "decode" && decoded?.error ? (
          <Verdict tone="bad">
            <span className="font-semibold">Not valid Base64:</span> {decoded.error}
          </Verdict>
        ) : (
          <div className="space-y-4">
            <OutputPanel
              value={mode === "encode" ? output : (decoded?.text ?? "")}
              ariaLabel={mode === "encode" ? "Base64 output" : "Decoded text"}
            />
            <div>
              <StatRow label="Input length" value={`${input.length.toLocaleString()} chars`} />
              <StatRow
                label="Output length"
                value={`${(mode === "encode" ? output : (decoded?.text ?? "")).length.toLocaleString()} chars`}
                emphasis
              />
              {mode === "encode" && input.length > 0 && (
                <StatRow label="Size growth" value={`${Math.round(((output.length - input.length) / input.length) * 100)}%`} />
              )}
            </div>
            <Verdict tone="neutral">
              {mode === "encode"
                ? "Base64 is encoding, not encryption — anyone can reverse it. Use URL-safe output in tokens and path segments where + and / break routing."
                : "Padding (=) and whitespace are repaired automatically, and URL-safe inputs (- and _) are accepted."}
            </Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* 62. URL encoder/decoder                                             */
/* ================================================================== */

const URL_SCOPES = [
  { value: "component", label: "Component — encodeURIComponent" },
  { value: "full", label: "Full URL — encodeURI" },
  { value: "rfc3986", label: "Strict RFC 3986 (also !'()* )" },
];

export function UrlEncoderDecoder() {
  const [mode, setMode] = React.useState("encode");
  const [scope, setScope] = React.useState("component");
  const [input, setInput] = React.useState("https://utilitytoolz.example/search?q=unit converter&lang=en");

  const output = React.useMemo(() => {
    if (mode === "decode") {
      try {
        return { text: decodeURIComponent(input), error: null as string | null };
      } catch (e) {
        return {
          text: "",
          error:
            e instanceof Error
              ? e.message
              : "Unable to decode URL. Check for incomplete percent-encoded sequences (e.g. '%' without two hex digits).",
        };
      }
    }
    let out: string;
    if (scope === "full") out = encodeURI(input);
    else if (scope === "rfc3986")
      out = encodeURIComponent(input).replace(/[!'()*]/g, (ch) => `%${ch.charCodeAt(0).toString(16).toUpperCase()}`);
    else out = encodeURIComponent(input);
    return { text: out, error: null as string | null };
  }, [mode, scope, input]);

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <SelectField
            label="Mode"
            value={mode}
            onChange={setMode}
            options={[
              { value: "encode", label: "Encode → percent-encoding" },
              { value: "decode", label: "Decode ← percent-encoding" },
            ]}
          />
          <SelectField
            label={mode === "encode" ? "Encoding scope" : "Scope hint"}
            value={scope}
            onChange={setScope}
            options={URL_SCOPES}
          />
          <TextAreaField
            label={mode === "encode" ? "Text / URL to encode" : "Encoded input"}
            value={input}
            onChange={setInput}
            rows={5}
            mono
          />
        </div>
      }
      results={
        output.error ? (
          <Verdict tone="bad">
            <span className="font-semibold">Decode failed:</span> {output.error}
          </Verdict>
        ) : (
          <div className="space-y-4">
            <OutputPanel value={output.text} ariaLabel={mode === "encode" ? "Encoded output" : "Decoded output"} />
            <div>
              <StatRow label="Input length" value={`${input.length.toLocaleString()} chars`} />
              <StatRow label="Output length" value={`${output.text.length.toLocaleString()} chars`} emphasis />
              <StatRow
                label="Spaces encoded as"
                value={scope === "full" ? "%20" : "%20 (+ means space in query strings)"}
              />
            </div>
            <Verdict tone="neutral">
              {mode === "encode"
                ? "Encode whole URLs with the Full URL scope so & and / stay structural; encode each parameter value with the Component scope so they are escaped."
                : "decodeURIComponent treats + as a literal plus. In query strings + historically means a space — replace them first if the source form encoded it that way."}
            </Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* 63. UUID generator                                                  */
/* ================================================================== */

function uuidV4(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10xx
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function UuidGenerator() {
  const [count, setCount] = React.useState("5");
  const [uppercase, setUppercase] = React.useState(false);
  const [noHyphens, setNoHyphens] = React.useState(false);
  const [ids, setIds] = React.useState<string[]>([]);

  const generate = React.useCallback(() => {
    const n = Math.min(50, Math.max(1, Math.round(Number(count) || 5)));
    const next = Array.from({ length: n }, () => {
      let id = uuidV4();
      if (noHyphens) id = id.replace(/-/g, "");
      if (uppercase) id = id.toUpperCase();
      return id;
    });
    setIds(next);
  }, [count, noHyphens, uppercase]);

  React.useEffect(() => {
    generate();
  }, []);

  const allText = ids.join("\n");

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <SelectField
            label="How many"
            value={count}
            onChange={setCount}
            options={["1", "5", "10", "25", "50"].map((n) => ({ value: n, label: n }))}
          />
          <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
            <div>
              <p className="text-sm font-medium">Uppercase</p>
              <p className="text-xs text-muted-foreground">A-F instead of a-f</p>
            </div>
            <Switch checked={uppercase} onCheckedChange={setUppercase} aria-label="Toggle uppercase" />
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
            <div>
              <p className="text-sm font-medium">Compact format</p>
              <p className="text-xs text-muted-foreground">Omit hyphens (32 hex characters)</p>
            </div>
            <Switch
              checked={noHyphens}
              onCheckedChange={setNoHyphens}
              aria-label="Compact format (omit hyphens)"
            />
          </div>
          <Button onClick={generate}>Generate new batch</Button>
          <Verdict tone="neutral">
            RFC 4122 version 4 UUIDs from crypto.getRandomValues: 122 random bits. You would need to
            generate about 2.7 quintillion v4 UUIDs to reach a 1-in-a-billion collision chance.
          </Verdict>
        </div>
      }
      results={
        <div className="space-y-4">
          <div className="max-h-80 space-y-1.5 overflow-auto">
            {ids.map((id, i) => (
              <div key={i} className="flex items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2">
                <code className="truncate font-mono text-[13px]">{id}</code>
                <CopyButton text={id} label="Copy" size="xs" />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <CopyButton text={allText} label={`Copy all ${ids.length}`} />
          </div>
          <StatRow label="Batch size" value={`${ids.length} UUIDs`} emphasis />
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 64. Hash generator                                                  */
/* ================================================================== */

const HASH_ALGOS = [
  { value: "SHA-256", label: "SHA-256 (recommended)" },
  { value: "SHA-512", label: "SHA-512" },
  { value: "SHA-384", label: "SHA-384" },
  { value: "SHA-1", label: "SHA-1 (legacy — avoid)" },
];

export function HashGenerator() {
  const [text, setText] = React.useState("abc");
  const [algo, setAlgo] = React.useState("SHA-256");
  const [hex, setHex] = React.useState("");
  const [b64, setB64] = React.useState("");
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        if (typeof crypto === "undefined" || !crypto.subtle) {
          throw new Error("Web Crypto is unavailable here — it requires HTTPS or localhost.");
        }
        const data = new TextEncoder().encode(text);
        const digest = await crypto.subtle.digest(algo, data);
        const bytes = new Uint8Array(digest);
        const hexStr = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
        let bin = "";
        for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
        const b64Str = btoa(bin);
        if (!cancelled) {
          setHex(hexStr);
          setB64(b64Str);
          setErr(null);
        }
      } catch (e) {
        if (!cancelled) {
          setErr(e instanceof Error ? e.message : "Hashing failed");
          setHex("");
          setB64("");
        }
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [text, algo]);

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <SelectField label="Algorithm" value={algo} onChange={setAlgo} options={HASH_ALGOS} />
          <TextAreaField
            label="Input text"
            value={text}
            onChange={setText}
            rows={5}
            mono
            hint="Hashing runs in your browser — the input never leaves the page"
          />
        </div>
      }
      results={
        err ? (
          <Verdict tone="bad">
            <span className="font-semibold">Error:</span> {err}
          </Verdict>
        ) : (
          <div className="space-y-4">
            <OutputPanel value={hex} ariaLabel="Hex digest" />
            <div>
              <StatRow label="Algorithm" value={algo} />
              <StatRow label="Digest size" value={`${hex.length * 4} bits`} />
              <StatRow label="Base64 digest" value={b64} />
            </div>
            <div className="flex gap-2">
              <CopyButton text={b64} label="Copy Base64" />
            </div>
            {algo === "SHA-1" ? (
              <Verdict tone="warn">
                SHA-1 is broken for collision resistance (practical attacks since 2017). Fine for
                checksums of trusted files — never for signatures or passwords.
              </Verdict>
            ) : (
              <Verdict tone="neutral">
                A tiny change in the input avalanche-shuffles every output bit. Hashes verify data —
                they do not hide it; for passwords use a slow KDF like Argon2 or bcrypt, not raw SHA.
              </Verdict>
            )}
          </div>
        )
      }
    />
  );
}
