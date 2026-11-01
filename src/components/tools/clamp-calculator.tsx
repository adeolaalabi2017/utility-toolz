"use client";

import React, { useState, useMemo } from "react";
import { Copy, Check, Type, Sliders, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClampCalculator() {
  const [minVw, setMinVw] = useState(375);
  const [maxVw, setMaxVw] = useState(1440);
  const [minSize, setMinSize] = useState(16);
  const [maxSize, setMaxSize] = useState(32);
  const [rootSize] = useState(16);
  const [testViewport, setTestViewport] = useState(768);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const formula = useMemo(() => {
    if (maxVw <= minVw || maxSize <= 0 || minSize <= 0) {
      return null;
    }
    const slope = (maxSize - minSize) / (maxVw - minVw);
    const yAxisIntersection = -minVw * slope + minSize;

    const minRem = (minSize / rootSize).toFixed(4).replace(/\.?0+$/, "");
    const maxRem = (maxSize / rootSize).toFixed(4).replace(/\.?0+$/, "");
    const valRem = (yAxisIntersection / rootSize).toFixed(4).replace(/\.?0+$/, "");
    const slopeVw = (slope * 100).toFixed(4).replace(/\.?0+$/, "");

    const sign = yAxisIntersection >= 0 ? "+" : "-";
    const absValRem = Math.abs(Number(valRem)).toFixed(4).replace(/\.?0+$/, "");

    const cssClamp = `clamp(${minRem}rem, ${absValRem}rem ${sign} ${slopeVw}vw, ${maxRem}rem)`;
    const twText = `text-[clamp(${minRem}rem,${absValRem}rem_${sign}_${slopeVw}vw,${maxRem}rem)]`;

    return { cssClamp, twText, slope, yAxisIntersection };
  }, [minVw, maxVw, minSize, maxSize, rootSize]);

  // Current computed font size at slider position
  const currentCalculatedSize = useMemo(() => {
    if (!formula) return minSize;
    const clampedVw = Math.max(minVw, Math.min(maxVw, testViewport));
    const size = formula.slope * clampedVw + formula.yAxisIntersection;
    return Math.max(minSize, Math.min(maxSize, size));
  }, [formula, testViewport, minVw, maxVw, minSize, maxSize]);

  const copyVal = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopiedType(id);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Inputs */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Viewport & Size Thresholds (px)
          </span>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="clamp-calculator-1" className="text-xs font-medium text-foreground">Min Viewport Width (px)</label>
              <input id="clamp-calculator-1"
                type="number"
                value={minVw}
                onChange={(e) => setMinVw(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">e.g. 375px (Mobile)</span>
            </div>

            <div>
              <label htmlFor="clamp-calculator-2" className="text-xs font-medium text-foreground">Max Viewport Width (px)</label>
              <input id="clamp-calculator-2"
                type="number"
                value={maxVw}
                onChange={(e) => setMaxVw(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">e.g. 1440px (Desktop)</span>
            </div>

            <div>
              <label htmlFor="clamp-calculator-3" className="text-xs font-medium text-foreground">Min Size (px)</label>
              <input id="clamp-calculator-3"
                type="number"
                value={minSize}
                onChange={(e) => setMinSize(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Size at mobile</span>
            </div>

            <div>
              <label htmlFor="clamp-calculator-4" className="text-xs font-medium text-foreground">Max Size (px)</label>
              <input id="clamp-calculator-4"
                type="number"
                value={maxSize}
                onChange={(e) => setMaxSize(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Size at desktop</span>
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
            Root font size reference: <strong className="text-foreground">{rootSize}px (1rem)</strong>. Formula converts px to relative rem units for accessibility.
          </div>
        </div>

        {/* Live Interactive Fluid Preview */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Simulated Screen Width
              </span>
              <span className="font-mono text-xs font-bold text-deep-green">
                {testViewport}px width → {currentCalculatedSize.toFixed(1)}px font size
              </span>
            </div>

            <input
              aria-label="Preview viewport width in pixels"
              type="range"
              min={minVw}
              max={maxVw}
              value={testViewport}
              onChange={(e) => setTestViewport(Number(e.target.value))}
              className="w-full"
            />
            <div className="mt-1 flex justify-between text-[11px] text-muted-foreground font-mono">
              <span>{minVw}px</span>
              <span>{maxVw}px</span>
            </div>
          </div>

          {/* Sample Typography Box */}
          <div className="my-4 rounded-lg border border-border bg-muted/60 p-5 flex items-center justify-center min-h-[140px] overflow-hidden text-center">
            <span
              style={{ fontSize: `${currentCalculatedSize}px`, lineHeight: 1.2 }}
              className="font-display font-semibold text-foreground transition-all duration-75"
            >
              Fluid Typography
            </span>
          </div>

          <p className="text-center text-[11px] text-muted-foreground">
            Drag slider to verify smooth scaling between minimum and maximum viewports.
          </p>
        </div>
      </div>

      {/* Generated Code Snippets */}
      {formula && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-4 shadow-lark-sm">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                CSS `clamp()` Formula
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyVal(`font-size: ${formula.cssClamp};`, "css")}
                className="h-10 sm:h-7 text-xs gap-1"
              >
                {copiedType === "css" ? <Check className="h-3 w-3 text-deep-green" /> : <Copy className="h-3 w-3" />}
                <span>{copiedType === "css" ? "Copied" : "Copy CSS"}</span>
              </Button>
            </div>
            <pre className="mt-2 overflow-x-auto rounded bg-muted/50 p-3 font-mono text-xs text-foreground">
              font-size: {formula.cssClamp};
            </pre>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-lark-sm">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tailwind CSS Class
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyVal(formula.twText, "tw")}
                className="h-10 sm:h-7 text-xs gap-1"
              >
                {copiedType === "tw" ? <Check className="h-3 w-3 text-deep-green" /> : <Copy className="h-3 w-3" />}
                <span>{copiedType === "tw" ? "Copied" : "Copy Tailwind"}</span>
              </Button>
            </div>
            <pre className="mt-2 overflow-x-auto rounded bg-muted/50 p-3 font-mono text-xs text-foreground">
              {formula.twText}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
