"use client";

import * as React from "react";
import { ArrowLeftRight, Check, X, Sparkles, Copy } from "lucide-react";
import { CalcLayout, FieldGrid, ResultHero, StatRow, Verdict } from "./ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace(/^#/, "").trim();
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b };
  }
  if (cleaned.length === 6) {
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b };
  }
  return null;
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const srgb = [r / 255, g / 255, b / 255].map((v) => {
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function contrastRatio(fgHex: string, bgHex: string): number {
  const fgRgb = hexToRgb(fgHex);
  const bgRgb = hexToRgb(bgHex);
  if (!fgRgb || !bgRgb) return 1;

  const l1 = relativeLuminance(fgRgb);
  const l2 = relativeLuminance(bgRgb);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const PRESETS = [
  { name: "Cream & Ink", fg: "#1f4a3f", bg: "#fff6e0" },
  { name: "Card & Muted Ink", fg: "#365a4f", bg: "#faf5ea" },
  { name: "Purple on Cream", fg: "#3f346f", bg: "#fff6e0" },
  { name: "Deep Coral on Cream", fg: "#a83a30", bg: "#fff6e0" },
  { name: "Classic Dark on Light", fg: "#111827", bg: "#ffffff" },
  { name: "Terminal Green", fg: "#10b981", bg: "#0f172a" },
];

export function ContrastChecker() {
  const { toast } = useToast();
  const [fg, setFg] = React.useState("#1f4a3f");
  const [bg, setBg] = React.useState("#fff6e0");

  const ratio = contrastRatio(fg, bg);
  const ratioStr = ratio.toFixed(2) + ":1";

  const passNormalAA = ratio >= 4.5;
  const passLargeAA = ratio >= 3.0;
  const passNormalAAA = ratio >= 7.0;
  const passLargeAAA = ratio >= 4.5;
  const passUI = ratio >= 3.0;

  const swapColors = () => {
    const temp = fg;
    setFg(bg);
    setBg(temp);
  };

  const copyResults = () => {
    const text = `Contrast: ${ratioStr} | FG: ${fg} BG: ${bg} | WCAG AA: ${passNormalAA ? "PASS" : "FAIL"}, WCAG AAA: ${passNormalAAA ? "PASS" : "FAIL"}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard", description: text });
  };

  return (
    <CalcLayout
      inputs={
        <div className="space-y-5">
          <FieldGrid>
            <div className="space-y-1.5">
              <Label htmlFor="contrast-checker-1" className="text-sm font-medium">Text Color (Foreground)</Label>
              <div className="flex gap-2 items-center">
                <input id="contrast-checker-1"
                  type="color"
                  value={fg}
                  onChange={(e) => setFg(e.target.value)}
                  className="h-9 w-10 cursor-pointer rounded-md border border-input p-0.5 bg-card"
                  aria-label="Foreground color picker"
                />
                <Input aria-label="Text colour hex code"
                  value={fg}
                  onChange={(e) => setFg(e.target.value)}
                  placeholder="#1f4a3f"
                  className="font-mono text-sm uppercase"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contrast-checker-2" className="text-sm font-medium">Background Color</Label>
              <div className="flex gap-2 items-center">
                <input id="contrast-checker-2"
                  type="color"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className="h-9 w-10 cursor-pointer rounded-md border border-input p-0.5 bg-card"
                  aria-label="Background color picker"
                />
                <Input aria-label="Background colour hex code"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  placeholder="#fff6e0"
                  className="font-mono text-sm uppercase"
                />
              </div>
            </div>
          </FieldGrid>

          <div className="flex items-center justify-between pt-1">
            <Button variant="outline" size="sm" onClick={swapColors} className="gap-1.5 text-xs">
              <ArrowLeftRight className="h-3.5 w-3.5" /> Swap Foreground & Background
            </Button>
          </div>

          {/* Quick Presets */}
          <div className="space-y-2 pt-2">
            <p className="text-sm font-semibold text-muted-foreground">
              Design system & tested presets
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button type="button"
                  key={p.name}
                  onClick={() => {
                    setFg(p.fg);
                    setBg(p.bg);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground/80 hover:border-input transition-colors"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full border border-black/10"
                    style={{ backgroundColor: p.fg }}
                  />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="space-y-2 pt-2">
            <p className="text-sm font-semibold text-muted-foreground">
              Rendered preview
            </p>
            <div
              className="rounded-xl p-5 border transition-colors shadow-inner"
              style={{ backgroundColor: bg, color: fg }}
            >
              <h3 className="text-lg font-bold tracking-tight">
                Headline Text Preview ({ratioStr})
              </h3>
              <p className="mt-2 text-sm leading-relaxed">
                This sample paragraph shows how regular body text renders at this contrast level.
                Clear typography ensures readability across varied screens and lighting conditions.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 items-center">
                <span
                  className="px-3 py-1.5 rounded-md text-xs font-semibold border"
                  style={{ borderColor: fg, color: fg }}
                >
                  Sample Button
                </span>
                <span className="text-xs underline font-medium">Sample link text</span>
              </div>
            </div>
          </div>
        </div>
      }
      results={
        <div className="space-y-5">
          <ResultHero
            label="Contrast Ratio"
            value={ratioStr}
            copyText={ratioStr}
            sub={`WCAG 2.2 standard requirement is 4.5:1 for body text and 3:1 for large text.`}
          />

          <Verdict tone={passNormalAA ? "good" : passLargeAA ? "warn" : "bad"}>
            {passNormalAA
              ? "Passes WCAG 2.2 AA for normal text. Great readability."
              : passLargeAA
              ? "Passes for large text (18pt+ / 14pt bold), but fails for body text."
              : "Fails WCAG AA requirements. Low contrast will cause eyestrain or readability issues."}
          </Verdict>

          <div className="space-y-2.5 rounded-lg bg-muted/50 p-3.5">
            <p className="text-sm font-semibold text-muted-foreground">
              WCAG 2.2 compliance breakdown
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span>Normal Text AA (≥ 4.5:1)</span>
                <span className={`inline-flex items-center gap-1 font-semibold ${passNormalAA ? "text-deep-green" : "text-deep-coral"}`}>
                  {passNormalAA ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  {passNormalAA ? "Pass" : "Fail"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span>Large Text AA (≥ 3.0:1)</span>
                <span className={`inline-flex items-center gap-1 font-semibold ${passLargeAA ? "text-deep-green" : "text-deep-coral"}`}>
                  {passLargeAA ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  {passLargeAA ? "Pass" : "Fail"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span>Normal Text AAA (≥ 7.0:1)</span>
                <span className={`inline-flex items-center gap-1 font-semibold ${passNormalAAA ? "text-deep-green" : "text-deep-coral"}`}>
                  {passNormalAAA ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  {passNormalAAA ? "Pass" : "Fail"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span>Large Text AAA (≥ 4.5:1)</span>
                <span className={`inline-flex items-center gap-1 font-semibold ${passLargeAAA ? "text-deep-green" : "text-deep-coral"}`}>
                  {passLargeAAA ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  {passLargeAAA ? "Pass" : "Fail"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>UI Components & Icons (≥ 3.0:1)</span>
                <span className={`inline-flex items-center gap-1 font-semibold ${passUI ? "text-deep-green" : "text-deep-coral"}`}>
                  {passUI ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  {passUI ? "Pass" : "Fail"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyResults} className="w-full gap-1.5 text-xs">
              <Copy className="h-3.5 w-3.5" /> Copy Full Audit Summary
            </Button>
          </div>
        </div>
      }
    />
  );
}
