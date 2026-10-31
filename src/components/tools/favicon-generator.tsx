"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Upload, Download, Copy, Check, Sparkles, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

const SIZES = [
  { size: 16, name: "favicon-16x16.png", label: "16×16 px", desc: "Browser tab standard" },
  { size: 32, name: "favicon-32x32.png", label: "32×32 px", desc: "Retina browser tab" },
  { size: 180, name: "apple-touch-icon.png", label: "180×180 px", desc: "Apple Touch Icon" },
  { size: 192, name: "android-chrome-192x192.png", label: "192×192 px", desc: "Android Chrome" },
];

export function FaviconGenerator() {
  const [monogram, setMonogram] = useState("U");
  const [bgColor, setBgColor] = useState("#1f4a3f");
  const [textColor, setTextColor] = useState("#fff6e0");
  const [radius, setRadius] = useState(25);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawIcon = useCallback((ctx: CanvasRenderingContext2D, size: number) => {
    ctx.clearRect(0, 0, size, size);

    const cornerRadius = (radius / 100) * (size / 2);
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, cornerRadius);
    ctx.fillStyle = bgColor;
    ctx.fill();

    if (uploadedImage) {
      const img = new Image();
      img.src = uploadedImage;
      ctx.drawImage(img, 0, 0, size, size);
    } else {
      ctx.fillStyle = textColor;
      ctx.font = `bold ${Math.round(size * 0.58)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(monogram.slice(0, 2), size / 2, size / 2 + size * 0.04);
    }
  }, [bgColor, radius, uploadedImage, textColor, monogram]);

  const downloadSize = (size: number, filename: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawIcon(ctx, size);

    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const htmlSnippet = `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Icon Design & Generator
          </span>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-foreground">Letter / Monogram</label>
              <input
                type="text"
                maxLength={2}
                value={monogram}
                onChange={(e) => {
                  setMonogram(e.target.value.toUpperCase());
                  setUploadedImage(null);
                }}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 text-center text-lg font-bold text-foreground"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Corner Radius: {radius}%</label>
              <input
                type="range"
                min="0"
                max="50"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="mt-3 w-full"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Background Color</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => {
                    setBgColor(e.target.value);
                    setUploadedImage(null);
                  }}
                  className="h-8 w-12 cursor-pointer rounded border border-input p-0.5"
                />
                <span className="font-mono text-xs text-foreground">{bgColor}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Text Color</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => {
                    setTextColor(e.target.value);
                    setUploadedImage(null);
                  }}
                  className="h-8 w-12 cursor-pointer rounded border border-input p-0.5"
                />
                <span className="font-mono text-xs text-foreground">{textColor}</span>
              </div>
            </div>
          </div>

          {/* Or Upload Image */}
          <div className="border-t border-border/60 pt-3">
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Or upload custom image / logo:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => setUploadedImage(ev.target?.result as string);
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full text-xs text-muted-foreground file:mr-2 file:rounded-md file:border-0 file:bg-muted file:px-2.5 file:py-1 file:text-xs file:font-semibold"
            />
          </div>
        </div>

        {/* Browser Tab Simulator */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 pb-3">
              <Monitor className="h-4 w-4 text-[#308f68]" /> Browser Tab Mockup
            </span>

            {/* Simulated Chrome Browser Header */}
            <div className="rounded-lg border border-border bg-[#e8e4d8] p-2">
              <div className="flex items-center gap-2 max-w-xs rounded-t-md bg-card px-3 py-1.5 shadow-xs border-t border-x border-border">
                {/* 16px mini favicon */}
                <div
                  style={{
                    backgroundColor: bgColor,
                    color: textColor,
                    borderRadius: `${radius}%`,
                  }}
                  className="flex h-4 w-4 shrink-0 items-center justify-center text-[9px] font-bold"
                >
                  {monogram.slice(0, 1)}
                </div>
                <span className="truncate text-xs font-medium text-foreground">
                  Utility Toolz — Fast in-browser tools
                </span>
              </div>
              <div className="h-4 rounded-b-md bg-card border-x border-b border-border" />
            </div>
          </div>

          {/* 64px Icon Preview */}
          <div className="my-4 flex items-center justify-center p-4">
            <div
              style={{
                backgroundColor: bgColor,
                color: textColor,
                borderRadius: `${radius}%`,
              }}
              className="flex h-20 w-20 items-center justify-center font-display text-3xl font-bold shadow-lark"
            >
              {monogram.slice(0, 2)}
            </div>
          </div>

          <p className="text-center text-[11px] text-muted-foreground">
            Export generated assets below in crisp PNG format.
          </p>
        </div>
      </div>

      {/* Export Sizes Grid */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Download Platform Favicons (PNG)
        </span>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SIZES.map((s) => (
            <div key={s.name} className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3 text-xs">
              <div>
                <span className="font-semibold text-foreground block">{s.label}</span>
                <span className="text-[11px] text-muted-foreground">{s.desc}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadSize(s.size, s.name)}
                className="h-7 text-xs gap-1"
              >
                <Download className="h-3 w-3" />
                <span>PNG</span>
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* HTML Meta snippet */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-lark-sm">
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs font-semibold text-foreground">HTML Header Tags</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(htmlSnippet);
              setCopiedSnippet(true);
              setTimeout(() => setCopiedSnippet(false), 2000);
            }}
            className="h-7 text-xs gap-1"
          >
            {copiedSnippet ? <Check className="h-3 w-3 text-[#1f5f45]" /> : <Copy className="h-3 w-3" />}
            <span>{copiedSnippet ? "Copied" : "Copy Tags"}</span>
          </Button>
        </div>
        <pre className="overflow-x-auto rounded bg-muted/50 p-3 font-mono text-xs text-foreground">
          {htmlSnippet}
        </pre>
      </div>
    </div>
  );
}
