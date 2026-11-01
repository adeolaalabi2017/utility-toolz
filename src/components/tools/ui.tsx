"use client";

import * as React from "react";
import { Check, Copy, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { num } from "@/lib/format";
import { useCurrencySymbol } from "@/components/site/currency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ------------------------------------------------------------------ */
/* Layout: inputs + results side by side (stacked on mobile)           */
/* ------------------------------------------------------------------ */

/** Lets fields inside a CalcLayout report invalid input so results can be held back. */
const CalcValidityContext = React.createContext<((id: string, invalid: boolean) => void) | null>(null);

export function CalcLayout({
  inputs,
  results,
  actions,
}: {
  inputs: React.ReactNode;
  results: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const [invalid, setInvalid] = React.useState<Record<string, boolean>>({});
  const report = React.useCallback((id: string, bad: boolean) => {
    setInvalid((prev) => (Boolean(prev[id]) === bad ? prev : { ...prev, [id]: bad }));
  }, []);
  const hasInvalid = Object.values(invalid).some(Boolean);

  return (
    <CalcValidityContext.Provider value={report}>
      <div className="space-y-4">
        {actions && <div className="no-print flex flex-wrap items-center justify-end gap-2">{actions}</div>}
        <div className="grid gap-5 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <section
              aria-label="Inputs"
              className="rounded-xl border bg-card p-4 shadow-lark-sm sm:p-5"
            >
              <p className="mb-4 text-sm font-semibold text-muted-foreground">
                Inputs
              </p>
              {inputs}
            </section>
          </div>
          <div className="lg:col-span-2">
            <section
              aria-label="Results"
              className="relative rounded-xl border bg-card p-4 shadow-lark-sm h-full sm:p-5"
            >
              <p className="mb-4 text-sm font-semibold text-muted-foreground">
                Results
              </p>
              {hasInvalid ? (
                <div
                  role="status"
                  className="rounded-lg bg-lf-coral/10 px-4 py-6 text-sm leading-relaxed text-deep-coral"
                >
                  Results are paused until every highlighted field holds a valid number.
                </div>
              ) : (
                results
              )}
            </section>
          </div>
        </div>
      </div>
    </CalcValidityContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Inputs                                                              */
/* ------------------------------------------------------------------ */

const NUMERIC_CHARS = /[^0-9.,\-\s]/g;
const VALID_NUMBER = /^-?(\d{1,3}(,\d{3})+|\d+)?(\.\d+)?$/;

/** True when the text is empty, mid-typing ("-", "."), or a well-formed number. */
export function isValidNumberText(v: string): boolean {
  const t = v.replace(/\s/g, "");
  if (t === "" || t === "-" || t === "." || t === "-.") return true;
  if (/\d\.$/.test(t)) return VALID_NUMBER.test(t.slice(0, -1));
  return VALID_NUMBER.test(t) && /\d/.test(t);
}

export function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  placeholder,
  hint,
  min,
  step,
  className,
  ariaLabel,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  hint?: string;
  min?: number;
  step?: number;
  className?: string;
  /** Accessible name when there is no visible label (e.g. table-style rows). */
  ariaLabel?: string;
}) {
  const id = React.useId();
  const report = React.useContext(CalcValidityContext);
  const currency = useCurrencySymbol();
  const shownPrefix = prefix === "$" ? currency : prefix;
  const [rejected, setRejected] = React.useState(false);
  const formatInvalid = !isValidNumberText(String(value ?? ""));
  const belowMin = !formatInvalid && min !== undefined && String(value).trim() !== "" && num(value) < min;
  const invalid = formatInvalid || belowMin;

  React.useEffect(() => {
    report?.(id, invalid);
    return () => report?.(id, false);
  }, [report, id, invalid]);

  const errorText = formatInvalid
    ? "Enter a number, like 1,250 or 12.5"
    : belowMin
      ? `Must be at least ${min}`
      : rejected
        ? "Only numbers can go in this field"
        : null;
  const describedBy = [hint ? `${id}-hint` : null, errorText ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <div className="relative">
        {shownPrefix && (
          <span
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
          >
            {shownPrefix}
          </span>
        )}
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          step={step}
          aria-label={label ? undefined : ariaLabel}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy || undefined}
          onChange={(e) => {
            const raw = e.target.value;
            const clean = raw.replace(NUMERIC_CHARS, "");
            setRejected(clean !== raw);
            onChange(clean);
          }}
          onBlur={() => setRejected(false)}
          className={cn(
            "tnum",
            shownPrefix && (shownPrefix.length > 1 ? "pl-11" : "pl-7"),
            suffix && "pr-12",
            invalid && "border-lf-coral focus-visible:outline-lf-coral"
          )}
        />
        {suffix && (
          <span
            aria-hidden
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
          >
            {suffix}
          </span>
        )}
      </div>
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {errorText && (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-deep-coral">
          {errorText}
        </p>
      )}
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  className,
  ariaLabel,
}: {
  ariaLabel?: string;
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  const id = React.useId();
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} aria-label={label ? undefined : ariaLabel} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function FieldGrid({ children, cols = 2 }: { children: React.ReactNode; cols?: 1 | 2 | 3 }) {
  return (
    <div
      className={cn(
        "grid gap-4",
        cols === 1 && "grid-cols-1",
        cols === 2 && "grid-cols-1 sm:grid-cols-2",
        cols === 3 && "grid-cols-1 sm:grid-cols-3"
      )}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold text-muted-foreground pt-1">
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Results                                                             */
/* ------------------------------------------------------------------ */

export function ResultHero({
  label,
  value,
  sub,
  copyText,
}: {
  label: string;
  value: string;
  sub?: string;
  copyText?: string;
}) {
  return (
    <div
      className="rounded-lg bg-ink px-4 py-5 text-[#fef5de] mb-4"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <p className="text-sm font-medium text-[#fef5de]/75">{label}</p>
      <p className="tnum mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{value}</p>
      {sub && <p className="mt-1.5 text-sm text-[#fef5de]/80">{sub}</p>}
    </div>
  );
}

export function StatRow({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2 border-b border-border/70 last:border-0">
      <span className={cn("text-sm", emphasis ? "font-medium text-foreground" : "text-muted-foreground")}>
        {label}
      </span>
      <span className={cn("tnum text-sm shrink-0", emphasis ? "font-semibold text-foreground" : "font-medium text-foreground")}>
        {value}
      </span>
    </div>
  );
}

export function Verdict({
  tone,
  children,
}: {
  tone: "good" | "warn" | "bad" | "neutral";
  children: React.ReactNode;
}) {
  const styles = {
    good: "bg-lf-green/10 text-deep-green",
    warn: "bg-lf-orange/10 text-deep-orange",
    bad: "bg-lf-coral/10 text-deep-coral",
    neutral: "bg-muted text-foreground",
  } as const;
  return (
    <div className={cn("rounded-lg px-3.5 py-3 text-sm leading-relaxed", styles[tone])}>
      {children}
    </div>
  );
}

/** Horizontal benchmark bar: actual vs target share of income/budget. */
export function ShareBar({
  label,
  actual,
  target,
  actualLabel,
  targetLabel,
}: {
  label: string;
  /** percent 0-100 */
  actual: number;
  target: number;
  actualLabel: string;
  targetLabel: string;
}) {
  const a = Math.max(0, Math.min(100, actual));
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="tnum text-muted-foreground">
          {actualLabel} <span className="text-muted-foreground">vs target {targetLabel}</span>
        </span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${a}%` }}
        />
        <div
          className="absolute top-0 h-full w-0.5 bg-ink/70"
          style={{ left: `${Math.max(0, Math.min(100, target))}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
}

export function MiniTable({
  head,
  rows,
}: {
  head: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            {head.map((h, i) => (
              <th
                key={i}
                className={cn(
                  "py-2 pr-3 font-medium text-muted-foreground",
                  i > 0 && "tnum text-right"
                )}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-b border-border/60 last:border-0">
              {r.map((c, ci) => (
                <td
                  key={ci}
                  className={cn(
                    "py-2 pr-3",
                    ci > 0 ? "tnum text-right font-medium" : "text-muted-foreground"
                  )}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Text input + output helpers (Phase 3 utility tools)                 */
/* ------------------------------------------------------------------ */

export function TextAreaField({
  ariaLabel,
  label,
  value,
  onChange,
  placeholder,
  rows = 6,
  hint,
  mono,
  className,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  hint?: string;
  mono?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const id = React.useId();
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <Textarea
        id={id}
        aria-label={label ? undefined : ariaLabel}
        aria-describedby={hint ? `${id}-hint` : undefined}
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className={cn("resize-y", mono && "font-mono text-[13px]")}
      />
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

export function CopyButton({
  text,
  label = "Copy",
  className,
  size = "sm",
}: {
  text: string;
  label?: string;
  className?: string;
  size?: "sm" | "xs";
}) {
  const [copied, setCopied] = React.useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      size={size === "xs" ? "sm" : "sm"}
      className={cn("h-10 gap-1.5 sm:h-8", size === "xs" && "px-2 text-xs sm:h-7", className)}
      onClick={async () => {
        if (await copyToClipboard(text)) {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1400);
        }
      }}
      aria-label={copied ? "Copied" : label}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : label}
    </Button>
  );
}

export function downloadText(filename: string, text: string, mime = "text/plain") {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  triggerDownload(filename, blob);
}

export function downloadBlob(filename: string, blob: Blob) {
  triggerDownload(filename, blob);
}

function triggerDownload(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** Monospace output panel with copy + optional download. */
export function OutputPanel({
  value,
  filename,
  mime,
  downloadLabel = "Download",
  ariaLabel,
  maxHeight = "max-h-80",
}: {
  value: string;
  filename?: string;
  mime?: string;
  downloadLabel?: string;
  ariaLabel?: string;
  maxHeight?: string;
}) {
  return (
    <div className="space-y-2">
      <div
        role="region"
        aria-label={ariaLabel ?? "Generated output"}
        className={cn(
          "overflow-auto rounded-lg bg-ink p-4 font-mono text-[12.5px] leading-relaxed text-white/90",
          maxHeight
        )}
      >
        <pre className="whitespace-pre-wrap break-words">{value}</pre>
      </div>
      <div className="flex gap-2">
        <CopyButton text={value} />
        {filename && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 sm:h-8 gap-1.5"
            onClick={() => downloadText(filename, value, mime)}
          >
            <Download className="h-3.5 w-3.5" /> {downloadLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

/** Length pill coloured by SEO limits (green inside, amber near, red over). */
export function LengthPill({ value, min, max }: { value: number; min: number; max: number }) {
  const tone =
    value === 0
      ? "bg-muted text-muted-foreground"
      : value > max
        ? "bg-lf-coral/10 text-deep-coral border border-lf-coral/30"
        : value < min
          ? "bg-lf-orange/10 text-deep-orange border border-lf-orange/30"
          : "bg-lf-green/10 text-deep-green border border-lf-green/30";
  return (
    <span className={cn("tnum rounded-full px-2 py-0.5 text-xs font-medium", tone)}>
      {value} chars
    </span>
  );
}
