"use client";

import * as React from "react";
import { Download, ImageUp, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  CalcLayout,
  CopyButton,
  FieldGrid,
  NumberField,
  SelectField,
  StatRow,
  Verdict,
  downloadBlob,
} from "./ui";
import { cn } from "@/lib/utils";
import { clamp, num } from "@/lib/format";

/* ------------------------------------------------------------------ */
/* Shared image-loading hook (canvas tools)                            */
/* ------------------------------------------------------------------ */

function useLoadedImage(file: File | null) {
  const [image, setImage] = React.useState<HTMLImageElement | null>(null);

  React.useEffect(() => {
    if (!file) {
      setImage(null);
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => setImage(img);
    img.onerror = () => setImage(null);
    img.src = url;
    // Keep the blob URL alive for as long as the image is displayed;
    // revoked automatically when the file changes or the tool unmounts.
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return image;
}

function FilePicker({
  file,
  onFile,
  accept = "image/*",
}: {
  file: File | null;
  onFile: (f: File | null) => void;
  accept?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Choose an image"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-card p-6 text-center transition-colors hover:border-primary/50 hover:bg-accent/40"
      >
        <ImageUp className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm font-medium">{file ? file.name : "Select an image from your device"}</p>
        <p className="text-xs text-muted-foreground">
          {file
            ? `${(file.size / 1024).toFixed(0)} KB · ${file.type || "unknown type"}`
            : "Everything runs locally in your browser — nothing is uploaded."}
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}

function fmtKB(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

/* ================================================================== */
/* 47. Image compressor                                                */
/* ================================================================== */

export function ImageCompressor() {
  const [file, setFile] = React.useState<File | null>(null);
  const image = useLoadedImage(file);
  const [quality, setQuality] = React.useState(70);
  const [format, setFormat] = React.useState("image/jpeg");
  const [maxWidth, setMaxWidth] = React.useState("0");
  const [outputUrl, setOutputUrl] = React.useState<string | null>(null);
  const [outputSize, setOutputSize] = React.useState(0);

  React.useEffect(() => {
    if (!image) {
      setOutputUrl(null);
      setOutputSize(0);
      return;
    }
    let revoke: string | null = null;
    const t = window.setTimeout(() => {
      const cap = num(maxWidth);
      const scale = cap > 0 && image.naturalWidth > cap ? cap / image.naturalWidth : 1;
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = format === "image/jpeg" ? "#ffffff" : "rgba(0,0,0,0)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          revoke = URL.createObjectURL(blob);
          setOutputUrl(revoke);
          setOutputSize(blob.size);
        },
        format,
        quality / 100
      );
    }, 60);
    return () => {
      window.clearTimeout(t);
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, [image, quality, format, maxWidth]);

  const ext = format === "image/webp" ? "webp" : "jpg";
  const base = (file?.name ?? "image").replace(/\.[^.]+$/, "");
  const saved = file ? Math.max(0, ((file.size - outputSize) / file.size) * 100) : 0;

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <FilePicker file={file} onFile={setFile} />
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <Label htmlFor="design-1" className="text-sm font-medium">Quality</Label>
              <span className="tnum text-sm font-semibold">{quality}%</span>
            </div>
            <Slider id="design-1"
              value={[quality]}
              min={10}
              max={100}
              step={5}
              onValueChange={(v) => setQuality(v[0] ?? quality)}
              aria-label="Compression quality"
            />
          </div>
          <FieldGrid>
            <SelectField
              label="Output format"
              value={format}
              onChange={setFormat}
              options={[
                { value: "image/jpeg", label: "JPEG — photos, universal" },
                { value: "image/webp", label: "WebP — smaller, modern" },
              ]}
            />
            <NumberField
              label="Max width (px, 0 = keep)"
              value={maxWidth}
              onChange={setMaxWidth}
              hint="Downscaling is the biggest single saving."
            />
          </FieldGrid>
        </div>
      }
      results={
        <div className="space-y-4">
          {outputUrl && image ? (
            <>
              <div className="rounded-lg border bg-muted/40 p-3">
                <img src={outputUrl} alt="Compressed preview" className="mx-auto max-h-44 w-auto rounded" />
              </div>
              <div>
                <StatRow label="Original" value={file ? fmtKB(file.size) : "—"} />
                <StatRow label="Compressed" value={fmtKB(outputSize)} emphasis />
                <StatRow
                  label="Saved"
                  value={
                    saved > 0.5
                      ? `${saved.toFixed(0)}%`
                      : "0% — reduce quality or reduce maximum width"
                  }
                />
                <StatRow label="Dimensions" value={`${canvasSize(image, maxWidth)} px`} />
              </div>
              <Button
                className="w-full gap-2"
                onClick={async () => downloadBlob(`${base}-compressed.${ext}`, await fetchBlob(outputUrl))}
              >
                <Download className="h-4 w-4" /> Download compressed image
              </Button>
              <Verdict tone="good">
                WebP at ~70 quality is typically 30–50% smaller than the source JPEG with no visible
                difference. Serve that instead and every page using the image gets faster.
              </Verdict>
            </>
          ) : (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="font-medium text-foreground">No image selected</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Select a JPEG or PNG file to preview compression savings and download the optimized
                image.
              </p>
            </div>
          )}
        </div>
      }
    />
  );
}

function canvasSize(img: HTMLImageElement, maxWidth: string): string {
  const cap = num(maxWidth);
  const w = cap > 0 && img.naturalWidth > cap ? cap : img.naturalWidth;
  const h = Math.round((img.naturalHeight * w) / img.naturalWidth);
  return `${Math.round(w)} × ${h}`;
}

async function fetchBlob(url: string): Promise<Blob> {
  const res = await fetch(url);
  return res.blob();
}

/* ================================================================== */
/* 48. Image resizer                                                   */
/* ================================================================== */

export function ImageResizer() {
  const [file, setFile] = React.useState<File | null>(null);
  const image = useLoadedImage(file);
  const [width, setWidth] = React.useState("1200");
  const [height, setHeight] = React.useState("800");
  const [lock, setLock] = React.useState(true);

  React.useEffect(() => {
    if (image) {
      setWidth(String(image.naturalWidth));
      setHeight(String(image.naturalHeight));
    }
  }, [image]);

  const ratio = image ? image.naturalWidth / image.naturalHeight : 3 / 2;
  const w = Math.max(1, Math.round(num(width) || 1));
  const h = lock ? Math.max(1, Math.round(w / ratio)) : Math.max(1, Math.round(num(height) || 1));

  const resize = (targetW: number, targetH: number) => {
    if (!image) return;
    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, 0, 0, targetW, targetH);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const base = (file?.name ?? "image").replace(/\.[^.]+$/, "");
        downloadBlob(`${base}-${targetW}x${targetH}.png`, blob);
      },
      "image/png"
    );
  };

  const presets = [1920, 1200, 800, 400];

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <FilePicker file={file} onFile={setFile} />
          <FieldGrid>
            <NumberField
              label="Width (px)"
              value={String(w)}
              onChange={(v) => {
                setWidth(v);
                if (lock && image) setHeight(String(Math.max(1, Math.round((num(v) || 1) / ratio))));
              }}
            />
            <div className="relative">
              <NumberField
                label="Height (px)"
                value={String(h)}
                onChange={(v) => {
                  setHeight(v);
                  if (lock && image) setWidth(String(Math.max(1, Math.round((num(v) || 1) * ratio))));
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute -right-1 top-7 h-7 w-7"
                aria-pressed={lock}
                onClick={() => setLock((l) => !l)}
                aria-label={lock ? "Unlock aspect ratio" : "Lock aspect ratio"}
              >
                {lock ? <Lock className="h-3.5 w-3.5 text-primary" /> : <Unlock className="h-3.5 w-3.5 text-muted-foreground" />}
              </Button>
            </div>
          </FieldGrid>
          <div>
            <p id="design-presets-label" className="mb-1.5 block text-sm font-medium">Quick presets</p>
            <div role="group" aria-labelledby="design-presets-label" className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <Button
                  key={p}
                  variant="outline"
                  size="sm"
                  className="tnum h-10 sm:h-8"
                  onClick={() => {
                    setWidth(String(p));
                    setHeight(String(Math.max(1, Math.round(p / ratio))));
                  }}
                >
                  {p}px wide
                </Button>
              ))}
            </div>
          </div>
        </div>
      }
      results={
        <div className="space-y-4">
          {image ? (
            <>
              <div className="rounded-lg border bg-muted/40 p-3">
                <img src={image.src} alt="Original" className="mx-auto max-h-44 w-auto rounded" />
              </div>
              <div>
                <StatRow label="Original size" value={`${image.naturalWidth} × ${image.naturalHeight}`} />
                <StatRow label="New size" value={`${w} × ${h}`} emphasis />
                <StatRow label="Aspect ratio locked" value={lock ? "Yes" : "No — may distort"} />
                <StatRow
                  label="Scale"
                  value={`${Math.round((w / image.naturalWidth) * 100)}% of original`}
                />
              </div>
              <Button className="w-full gap-2" onClick={() => resize(w, h)}>
                <Download className="h-4 w-4" /> Download resized PNG
              </Button>
              <Verdict tone="neutral">
                Downscale freely — high-quality resampling keeps detail. Avoid upscaling beyond the
                original size: pixels get invented and the result looks soft. Icons and logos should
                stay vector instead.
              </Verdict>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Choose an image to set the new dimensions.</p>
          )}
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 49. Image cropper                                                   */
/* ================================================================== */

export function ImageCropper() {
  const [file, setFile] = React.useState<File | null>(null);
  const image = useLoadedImage(file);
  const [x, setX] = React.useState("0");
  const [y, setY] = React.useState("0");
  const [cw, setCw] = React.useState("400");
  const [ch, setCh] = React.useState("300");

  React.useEffect(() => {
    if (image) {
      setX("0");
      setY("0");
      setCw(String(Math.round(image.naturalWidth * 0.6)));
      setCh(String(Math.round(image.naturalHeight * 0.6)));
    }
  }, [image]);

  const iw = image?.naturalWidth ?? 1;
  const ih = image?.naturalHeight ?? 1;
  const cx = clamp(Math.round(num(x)), 0, iw - 1);
  const cy = clamp(Math.round(num(y)), 0, ih - 1);
  const w = clamp(Math.round(num(cw)), 1, iw - cx);
  const h = clamp(Math.round(num(ch)), 1, ih - cy);

  const crop = () => {
    if (!image) return;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(image, cx, cy, w, h, 0, 0, w, h);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const base = (file?.name ?? "image").replace(/\.[^.]+$/, "");
      downloadBlob(`${base}-cropped.png`, blob);
    }, "image/png");
  };

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <FilePicker file={file} onFile={setFile} />
          <FieldGrid>
            <NumberField label="X (left offset)" value={String(cx)} onChange={setX} />
            <NumberField label="Y (top offset)" value={String(cy)} onChange={setY} />
            <NumberField label="Crop width" value={String(w)} onChange={setCw} />
            <NumberField label="Crop height" value={String(h)} onChange={setCh} />
          </FieldGrid>
          <p className="text-xs text-muted-foreground">
            The dashed box on the preview shows exactly what will be kept. Values clamp to the image.
          </p>
        </div>
      }
      results={
        <div className="space-y-4">
          {image ? (
            <>
              <div className="relative mx-auto max-w-full overflow-hidden rounded-lg border bg-muted/40 p-2">
                <div className="relative mx-auto w-fit">
                  <img src={image.src} alt="Crop source" className="max-h-52 w-auto rounded" />
                  <div
                    className="pointer-events-none absolute border-2 border-dashed border-white shadow-[0_0_0_9999px_rgba(11,28,44,0.45)]"
                    style={{
                      left: `${(cx / iw) * 100}%`,
                      top: `${(cy / ih) * 100}%`,
                      width: `${(w / iw) * 100}%`,
                      height: `${(h / ih) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <StatRow label="Source size" value={`${iw} × ${ih}`} />
                <StatRow label="Crop size" value={`${w} × ${h}`} emphasis />
                <StatRow label="Kept" value={`${Math.round(((w * h) / (iw * ih)) * 100)}% of image`} />
              </div>
              <Button className="w-full gap-2" onClick={crop}>
                <Download className="h-4 w-4" /> Download cropped PNG
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Choose an image, then set the crop box.</p>
          )}
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 50. Colour palette generator                                        */
/* ================================================================== */

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16) / 255;
  const g = parseInt(m.slice(2, 4), 16) / 255;
  const b = parseInt(m.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const to = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

const isValidHex = (s: string) => /^#?[0-9a-fA-F]{6}$/.test(s.trim());
const normHex = (s: string) => {
  const v = s.trim().replace("#", "");
  return `#${v.toUpperCase()}`;
};

export function ColourPaletteGenerator() {
  const [raw, setRaw] = React.useState("#308f68");
  const valid = isValidHex(raw);
  const base = valid ? normHex(raw) : "#308f68";
  const { h, s, l } = hexToHsl(base);

  const groups: { name: string; colors: string[]; note: string }[] = [
    {
      name: "Complementary",
      colors: [hslToHex(h, s, l), hslToHex(h + 180, s, l)],
      note: "Base + its opposite — maximum contrast for CTAs.",
    },
    {
      name: "Analogous",
      colors: [hslToHex(h - 30, s, l), base, hslToHex(h + 30, s, l)],
      note: "Neighbouring hues — calm, cohesive schemes.",
    },
    {
      name: "Triadic",
      colors: [hslToHex(h, s, l), hslToHex(h + 120, s, l), hslToHex(h + 240, s, l)],
      note: "Three evenly spaced hues — vibrant but balanced.",
    },
    {
      name: "Monochromatic",
      colors: [hslToHex(h, s, Math.max(8, l - 28)), hslToHex(h, s, Math.max(16, l - 14)), base, hslToHex(h, s, Math.min(90, l + 14)), hslToHex(h, s, Math.min(96, l + 28))],
      note: "One hue, five lightness steps — the safest palette system.",
    },
  ];

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="design-2" className="text-sm font-medium">Base colour (hex)</Label>
            <div className="flex items-center gap-2">
              <input id="design-2"
                type="color"
                value={base}
                onChange={(e) => setRaw(e.target.value.toUpperCase())}
                aria-label="Pick base colour"
                className="h-10 w-14 cursor-pointer rounded-md border bg-card p-1"
              />
              <Input aria-label="Base colour hex code" value={raw} onChange={(e) => setRaw(e.target.value)} className="font-mono" />
            </div>
            {!valid && <p className="text-xs text-deep-coral">Using #308f68 until the hex is valid.</p>}
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
            <span className="h-12 w-12 rounded-md border" style={{ background: base }} aria-hidden />
            <div>
              <p className="font-mono text-sm font-semibold">{base}</p>
              <p className="tnum text-xs text-muted-foreground">
                HSL {Math.round(h)}°, {Math.round(s)}%, {Math.round(l)}%
              </p>
            </div>
          </div>
        </div>
      }
      results={
        <div className="space-y-5">
          {groups.map((g) => (
            <div key={g.name}>
              <div className="mb-1.5 flex items-baseline justify-between">
                <p className="text-sm font-semibold">{g.name}</p>
                <p className="text-xs text-muted-foreground">{g.note}</p>
              </div>
              <div className="flex overflow-hidden rounded-lg border">
                {g.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    title={`Copy ${c}`}
                    onClick={() => navigator.clipboard?.writeText(c).catch(() => {})}
                    className="group relative flex h-14 flex-1 items-end justify-center transition-transform hover:scale-[1.04]"
                    style={{ background: c }}
                  >
                    <span
                      className={cn(
                        "mb-1 rounded bg-black/45 px-1.5 py-0.5 font-mono text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100"
                      )}
                    >
                      {c}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            Hover a swatch to see its hex — click to copy it.
          </p>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 51. HEX to RGB converter                                            */
/* ================================================================== */

export function HexRgbConverter() {
  const [raw, setRaw] = React.useState("#1f4a3f");
  const valid = isValidHex(raw);
  const hex = valid ? normHex(raw) : "#1f4a3f";
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  const { h, s, l } = hexToHsl(hex);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const textOn = lum > 0.6 ? "#1f4a3f" : "#FFFFFF";

  const setFromRgb = (rr: number, gg: number, bb: number) => {
    const to = (v: number) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0");
    setRaw(`#${to(rr)}${to(gg)}${to(bb)}`.toUpperCase());
  };

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="design-3" className="text-sm font-medium">HEX</Label>
            <div className="flex items-center gap-2">
              <input id="design-3"
                type="color"
                value={hex}
                onChange={(e) => setRaw(e.target.value.toUpperCase())}
                aria-label="Pick colour"
                className="h-10 w-14 cursor-pointer rounded-md border bg-card p-1"
              />
              <Input aria-label="Hex colour code" value={raw} onChange={(e) => setRaw(e.target.value)} className="font-mono" />
            </div>
            {!valid && <p className="text-xs text-deep-coral">Enter a 6-digit hex like #1A2B3C.</p>}
          </div>
          <FieldGrid>
            {(
              [
                ["R", r],
                ["G", g],
                ["B", b],
              ] as const
            ).map(([ch, val]) => (
              <NumberField
                key={ch}
                label={ch === "R" ? "Red (0–255)" : ch === "G" ? "Green (0–255)" : "Blue (0–255)"}
                value={String(val)}
                onChange={(v) => {
                  const n = clamp(Math.round(num(v)), 0, 255);
                  setFromRgb(ch === "R" ? n : r, ch === "G" ? n : g, ch === "B" ? n : b);
                }}
              />
            ))}
          </FieldGrid>
        </div>
      }
      results={
        <div className="space-y-4">
          <div className="flex h-28 items-end justify-between rounded-lg border p-3" style={{ background: hex, color: textOn }}>
            <span className="font-mono text-sm font-semibold">{hex}</span>
            <span className="text-xs opacity-75">best text on top: {textOn}</span>
          </div>
          <div>
            <StatRow label="RGB" value={`rgb(${r}, ${g}, ${b})`} emphasis />
            <StatRow label="HSL" value={`hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`} />
            <StatRow label="Relative luminance" value={lum.toFixed(3)} />
            <StatRow label="CSS shorthand" value={`#${m.toLowerCase()}`} />
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton text={`rgb(${r}, ${g}, ${b})`} label="Copy RGB" />
            <CopyButton text={`hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`} label="Copy HSL" />
            <CopyButton text={hex} label="Copy HEX" />
          </div>
          <Verdict tone="neutral">
            Luminance above ~0.6 needs dark text for WCAG-friendly contrast; below that, use white.
            HSL is the easiest space for building hover states — keep H, nudge L.
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 52. Aspect ratio calculator                                         */
/* ================================================================== */

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function AspectRatioCalculator() {
  const [w, setW] = React.useState("1920");
  const [h, setH] = React.useState("1080");
  const [targetW, setTargetW] = React.useState("1280");

  const W = Math.max(1, Math.round(num(w)));
  const H = Math.max(1, Math.round(num(h)));
  const g = gcd(W, H);
  const rw = Math.round(W / g);
  const rh = Math.round(H / g);

  const known: { label: string; ratio: number }[] = [
    { label: "1:1 — square", ratio: 1 },
    { label: "4:3 — classic", ratio: 4 / 3 },
    { label: "3:2 — photo", ratio: 3 / 2 },
    { label: "16:9 — widescreen", ratio: 16 / 9 },
    { label: "21:9 — ultrawide", ratio: 21 / 9 },
    { label: "9:16 — vertical video", ratio: 9 / 16 },
  ];
  const actual = W / H;
  const closest = known.reduce((best, k) =>
    Math.abs(k.ratio - actual) < Math.abs(best.ratio - actual) ? k : best
  );

  const tw = Math.max(1, Math.round(num(targetW)));
  const th = Math.round(tw / actual);

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <FieldGrid>
            <NumberField label="Width (px)" value={w} onChange={setW} />
            <NumberField label="Height (px)" value={h} onChange={setH} />
          </FieldGrid>
          <NumberField
            label="New width — get the matching height"
            value={targetW}
            onChange={setTargetW}
            hint="Scales proportionally: height fills in automatically."
          />
        </div>
      }
      results={
        <div className="space-y-4">
          <div className="rounded-lg bg-ink px-4 py-5 text-white">
            <p className="text-sm font-medium text-white/60">Aspect ratio</p>
            <p className="tnum mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              {rw}:{rh}
            </p>
            <p className="mt-1.5 text-sm text-white/70">
              ≈ {actual.toFixed(3)} — closest standard: {closest.label}
            </p>
          </div>
          <div>
            <StatRow label={`At ${tw}px wide`} value={`${th}px tall`} emphasis />
            <StatRow label="Decimal ratio" value={actual.toFixed(4)} />
            <StatRow label="Simplified by" value={`GCD ${g}`} />
          </div>
          <Verdict tone="neutral">
            For responsive embeds use CSS aspect-ratio {rw} / {rh} — the layout reserves the right
            height before the media loads, killing layout shift.
          </Verdict>
        </div>
      }
    />
  );
}
