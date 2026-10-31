"use client";

import * as React from "react";
import { Check, Copy, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

export function CalcLayout({
  inputs,
  results,
  actions,
}: {
  inputs: React.ReactNode;
  results: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      {actions && <div className="no-print flex items-center justify-end gap-2">{actions}</div>}
      <div className="grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="rounded-xl border bg-card p-4 shadow-lark-sm sm:p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Inputs
            </p>
            {inputs}
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="rounded-xl border bg-card p-4 shadow-lark-sm h-full sm:p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Results
            </p>
            {results}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Inputs                                                              */
/* ------------------------------------------------------------------ */

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
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          type="text"
          inputMode="decimal"
          min={min}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn("tnum", prefix && "pl-7", suffix && "pr-12")}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
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
    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pt-1">
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
    <div className="rounded-lg bg-ink px-4 py-5 text-[#fef5de] mb-4">
      <p className="text-xs font-medium uppercase tracking-wider text-[#fef5de]/60">{label}</p>
      <p className="tnum mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{value}</p>
      {sub && <p className="mt-1.5 text-sm text-[#fef5de]/70">{sub}</p>}
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
    good: "bg-[#308f68]/10 text-[#1f5f45] border-[#308f68]/30",
    warn: "bg-[#e07a3c]/10 text-[#a4502c] border-[#e07a3c]/30",
    bad: "bg-[#cf4f43]/10 text-[#a83a30] border-[#cf4f43]/30",
    neutral: "bg-muted text-foreground border-border",
  } as const;
  return (
    <div className={cn("rounded-lg border px-3.5 py-3 text-sm leading-relaxed", styles[tone])}>
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
          {actualLabel} <span className="text-muted-foreground/70">vs target {targetLabel}</span>
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
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <Textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className={cn("resize-y", mono && "font-mono text-[13px]")}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
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
      className={cn("h-8 gap-1.5", size === "xs" && "h-7 px-2 text-xs", className)}
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
          "overflow-auto rounded-lg border bg-ink p-4 font-mono text-[12.5px] leading-relaxed text-white/90",
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
            className="h-8 gap-1.5"
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
        ? "bg-[#cf4f43]/10 text-[#a83a30] border border-[#cf4f43]/30"
        : value < min
          ? "bg-[#e07a3c]/10 text-[#a4502c] border border-[#e07a3c]/30"
          : "bg-[#308f68]/10 text-[#1f5f45] border border-[#308f68]/30";
  return (
    <span className={cn("tnum rounded-full px-2 py-0.5 text-xs font-medium", tone)}>
      {value} chars
    </span>
  );
}
