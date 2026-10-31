"use client";

import React, { useState, useMemo } from "react";
import { Copy, Check, Sliders, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShadowLayer {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

const PRESETS: Record<string, ShadowLayer[]> = {
  "Larkfield Soft": [
    { x: 0, y: 1, blur: 2, spread: 0, color: "#1f4a3f", opacity: 0.06, inset: false },
    { x: 0, y: 2, blur: 4, spread: -1, color: "#1f4a3f", opacity: 0.08, inset: false },
  ],
  "Card Elevation": [
    { x: 0, y: 4, blur: 6, spread: -1, color: "#000000", opacity: 0.1, inset: false },
    { x: 0, y: 2, blur: 4, spread: -2, color: "#000000", opacity: 0.1, inset: false },
  ],
  "Floating Modal": [
    { x: 0, y: 10, blur: 15, spread: -3, color: "#000000", opacity: 0.1, inset: false },
    { x: 0, y: 4, blur: 6, spread: -4, color: "#000000", opacity: 0.1, inset: false },
  ],
  "Subtle Inset": [
    { x: 0, y: 2, blur: 4, spread: 0, color: "#000000", opacity: 0.08, inset: true },
  ],
  "Warm Glow": [
    { x: 0, y: 0, blur: 20, spread: 2, color: "#e07a3c", opacity: 0.35, inset: false },
  ],
};

function hexToRgba(hex: string, alpha: number): string {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
}

export function BoxShadowGenerator() {
  const [layers, setLayers] = useState<ShadowLayer[]>(PRESETS["Larkfield Soft"]);
  const [activeLayer, setActiveLayer] = useState(0);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [previewBg, setPreviewBg] = useState<"cream" | "white" | "dark">("cream");

  const cssValue = useMemo(() => {
    return layers
      .map((l) => {
        const inset = l.inset ? "inset " : "";
        const col = hexToRgba(l.color, l.opacity);
        return `${inset}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${col}`;
      })
      .join(", ");
  }, [layers]);

  const tailwindValue = useMemo(() => {
    const clean = cssValue.replace(/\s+/g, "_");
    return `shadow-[${clean}]`;
  }, [cssValue]);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedType(id);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const updateCurrent = (patch: Partial<ShadowLayer>) => {
    setLayers((prev) =>
      prev.map((l, i) => (i === activeLayer ? { ...l, ...patch } : l))
    );
  };

  const current = layers[activeLayer] || layers[0];

  return (
    <div className="space-y-6">
      {/* Controls & Preview Split */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Controls (7 cols) */}
        <div className="space-y-5 lg:col-span-7">
          {/* Presets */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-lark-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#a4502c]" /> Presets
            </span>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {Object.keys(PRESETS).map((pName) => (
                <button
                  key={pName}
                  onClick={() => {
                    setLayers(PRESETS[pName]);
                    setActiveLayer(0);
                  }}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-[#6b5faf] hover:text-[#3f346f]"
                >
                  {pName}
                </button>
              ))}
            </div>
          </div>

          {/* Layer Selector & Adjusters */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#6b5faf]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Shadow Layers ({layers.length})
                </span>
              </div>
              <div className="flex gap-1.5">
                {layers.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveLayer(i)}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                      activeLayer === i
                        ? "bg-[#6b5faf] text-white"
                        : "border border-border bg-background text-muted-foreground"
                    }`}
                  >
                    Layer {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-medium text-foreground">
                  <span>Horizontal Offset (X)</span>
                  <span className="font-mono text-muted-foreground">{current.x}px</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={current.x}
                  onChange={(e) => updateCurrent({ x: Number(e.target.value) })}
                  className="mt-1 w-full"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-foreground">
                  <span>Vertical Offset (Y)</span>
                  <span className="font-mono text-muted-foreground">{current.y}px</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={current.y}
                  onChange={(e) => updateCurrent({ y: Number(e.target.value) })}
                  className="mt-1 w-full"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-foreground">
                  <span>Blur Radius</span>
                  <span className="font-mono text-muted-foreground">{current.blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={current.blur}
                  onChange={(e) => updateCurrent({ blur: Number(e.target.value) })}
                  className="mt-1 w-full"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-foreground">
                  <span>Spread Radius</span>
                  <span className="font-mono text-muted-foreground">{current.spread}px</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="40"
                  value={current.spread}
                  onChange={(e) => updateCurrent({ spread: Number(e.target.value) })}
                  className="mt-1 w-full"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-foreground">
                  <span>Opacity</span>
                  <span className="font-mono text-muted-foreground">
                    {Math.round(current.opacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={current.opacity}
                  onChange={(e) => updateCurrent({ opacity: Number(e.target.value) })}
                  className="mt-1 w-full"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-foreground">Shadow Color:</label>
                  <input
                    type="color"
                    value={current.color}
                    onChange={(e) => updateCurrent({ color: e.target.value })}
                    className="h-7 w-12 cursor-pointer rounded border border-input p-0.5"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={current.inset}
                    onChange={(e) => updateCurrent({ inset: e.target.checked })}
                    className="rounded border-input text-primary focus:ring-ring"
                  />
                  <span>Inset Shadow</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Canvas (5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm flex flex-col h-full">
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Live Preview
              </span>
              <div className="flex rounded-md bg-muted/60 p-0.5 text-[11px] font-medium">
                <button
                  onClick={() => setPreviewBg("cream")}
                  className={`rounded px-2 py-0.5 ${previewBg === "cream" ? "bg-card shadow-xs font-bold" : "text-muted-foreground"}`}
                >
                  Cream
                </button>
                <button
                  onClick={() => setPreviewBg("white")}
                  className={`rounded px-2 py-0.5 ${previewBg === "white" ? "bg-card shadow-xs font-bold" : "text-muted-foreground"}`}
                >
                  White
                </button>
                <button
                  onClick={() => setPreviewBg("dark")}
                  className={`rounded px-2 py-0.5 ${previewBg === "dark" ? "bg-card shadow-xs font-bold" : "text-muted-foreground"}`}
                >
                  Dark
                </button>
              </div>
            </div>

            {/* Preview Box Container */}
            <div
              className={`flex-1 min-h-[260px] rounded-lg border border-border/80 flex items-center justify-center p-8 transition-colors ${
                previewBg === "cream"
                  ? "bg-muted/60"
                  : previewBg === "white"
                  ? "bg-white"
                  : "bg-ink text-[#fef5de]"
              }`}
            >
              <div
                style={{ boxShadow: cssValue }}
                className="h-32 w-48 rounded-xl bg-card border border-border/40 flex flex-col items-center justify-center p-3 text-center transition-all"
              >
                <span className="font-display text-sm font-semibold text-foreground">
                  Elevated Surface
                </span>
                <span className="text-[11px] text-muted-foreground mt-0.5">
                  {layers.length} {layers.length === 1 ? "layer" : "layers"} applied
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Code Blocks */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4 shadow-lark-sm">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              CSS `box-shadow`
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyCode(`box-shadow: ${cssValue};`, "css")}
              className="h-7 text-xs gap-1"
            >
              {copiedType === "css" ? <Check className="h-3 w-3 text-[#1f5f45]" /> : <Copy className="h-3 w-3" />}
              <span>{copiedType === "css" ? "Copied" : "Copy CSS"}</span>
            </Button>
          </div>
          <pre className="mt-2 overflow-x-auto rounded bg-muted/60 p-3 font-mono text-xs text-foreground">
            box-shadow: {cssValue};
          </pre>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-lark-sm">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tailwind Arbitrary Class
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyCode(tailwindValue, "tw")}
              className="h-7 text-xs gap-1"
            >
              {copiedType === "tw" ? <Check className="h-3 w-3 text-[#1f5f45]" /> : <Copy className="h-3 w-3" />}
              <span>{copiedType === "tw" ? "Copied" : "Copy Tailwind"}</span>
            </Button>
          </div>
          <pre className="mt-2 overflow-x-auto rounded bg-muted/60 p-3 font-mono text-xs text-foreground">
            {tailwindValue}
          </pre>
        </div>
      </div>
    </div>
  );
}
