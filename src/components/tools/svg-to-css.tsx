"use client";

import React, { useState, useMemo } from "react";
import { Copy, Check, Sparkles, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1f4a3f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"/>
  <path d="m9 12 2 2 4-4"/>
</svg>`;

function encodeSvgForCss(rawSvg: string): string {
  return rawSvg
    .replace(/"/g, "'")
    .replace(/%/g, "%25")
    .replace(/#/g, "%23")
    .replace(/{/g, "%7B")
    .replace(/}/g, "%7D")
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E")
    .replace(/\s+/g, " ")
    .trim();
}

export function SvgToCss() {
  const [svgInput, setSvgInput] = useState(SAMPLE_SVG);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const cleanSvg = useMemo(() => {
    return svgInput.replace(/<!--[\s\S]*?-->/g, "").replace(/\n/g, " ").replace(/\s+/g, " ").trim();
  }, [svgInput]);

  const cssUrl = useMemo(() => {
    const encoded = encodeSvgForCss(cleanSvg);
    return `background-image: url("data:image/svg+xml,${encoded}");`;
  }, [cleanSvg]);

  const base64Uri = useMemo(() => {
    try {
      const b64 = btoa(unescape(encodeURIComponent(cleanSvg)));
      return `data:image/svg+xml;base64,${b64}`;
    } catch {
      return "";
    }
  }, [cleanSvg]);

  // An SVG loaded as an image needs its namespace, which inline-HTML snippets often omit.
  const previewUri = useMemo(() => {
    const svg = /<svg[^>]*\sxmlns=/i.test(cleanSvg)
      ? cleanSvg
      : cleanSvg.replace(/<svg/i, '<svg xmlns="http://www.w3.org/2000/svg"');
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }, [cleanSvg]);

  const stats = useMemo(() => {
    const origLen = new Blob([svgInput]).size;
    const optLen = new Blob([cleanSvg]).size;
    const b64Len = base64Uri ? new Blob([base64Uri]).size : 0;
    return { origLen, optLen, b64Len };
  }, [svgInput, cleanSvg, base64Uri]);

  const copyVal = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopiedType(id);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <div className="rounded-xl bg-card p-5 shadow-lark-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-deep-orange" /> Paste SVG code
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSvgInput(SAMPLE_SVG)}
              className="h-10 sm:h-7 text-xs"
            >
              Load Sample
            </Button>
          </div>
          <textarea
            aria-label="SVG markup"
            value={svgInput}
            onChange={(e) => setSvgInput(e.target.value)}
            rows={10}
            className="w-full resize-y rounded-md border border-input bg-background p-3 font-mono text-xs leading-relaxed text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="<svg ...>...</svg>"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Original size: <strong className="text-foreground">{stats.origLen} B</strong></span>
            <span>Cleaned size: <strong className="text-foreground">{stats.optLen} B</strong></span>
          </div>
        </div>

        {/* Live Preview */}
        <div className="rounded-xl bg-card p-5 shadow-lark-sm flex flex-col">
          <span className="text-sm font-semibold text-muted-foreground pb-3">
            Rendered preview
          </span>
          <div className="flex-1 rounded-lg bg-muted/60 p-6 flex flex-col items-center justify-center min-h-[200px]">
            {cleanSvg.includes("<svg") ? (
              // Rendered as an <img> so scripts and event handlers in pasted SVG never run.
              <div className="h-24 w-24 flex items-center justify-center p-2 rounded-lg bg-card">
                <img src={previewUri} alt="SVG preview" className="max-h-full max-w-full" />
              </div>
            ) : (
              <div className="text-center text-xs text-muted-foreground">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <span>Enter valid SVG markup to view render</span>
              </div>
            )}
            <span className="mt-4 text-[11px] text-muted-foreground">100% vector SVG rendered in-browser</span>
          </div>
        </div>
      </div>

      {/* Generated Outputs */}
      <div className="space-y-4">
        {/* CSS background-image */}
        <div className="rounded-xl bg-card p-4 shadow-lark-sm">
          <div className="flex items-center justify-between pb-2">
            <div>
              <span className="text-xs font-semibold text-foreground">CSS `background-image` (URL Encoded)</span>
              <p className="text-[11px] text-muted-foreground">Lightest weight format for stylesheets and inline CSS.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyVal(cssUrl, "css")}
              className="h-10 sm:h-7 text-xs gap-1"
            >
              {copiedType === "css" ? <Check className="h-3 w-3 text-deep-green" /> : <Copy className="h-3 w-3" />}
              <span>{copiedType === "css" ? "Copied" : "Copy CSS"}</span>
            </Button>
          </div>
          <pre className="mt-2 overflow-x-auto rounded bg-muted/50 p-3 font-mono text-xs text-foreground">
            {cssUrl}
          </pre>
        </div>

        {/* Base64 Data URI */}
        <div className="rounded-xl bg-card p-4 shadow-lark-sm">
          <div className="flex items-center justify-between pb-2">
            <div>
              <span className="text-xs font-semibold text-foreground">Base64 Data URI</span>
              <p className="text-[11px] text-muted-foreground">Safe for image `src` attributes and JSON payloads.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyVal(base64Uri, "b64")}
              className="h-10 sm:h-7 text-xs gap-1"
            >
              {copiedType === "b64" ? <Check className="h-3 w-3 text-deep-green" /> : <Copy className="h-3 w-3" />}
              <span>{copiedType === "b64" ? "Copied" : "Copy Data URI"}</span>
            </Button>
          </div>
          <pre className="mt-2 overflow-x-auto rounded bg-muted/50 p-3 font-mono text-xs text-foreground">
            {base64Uri || "—"}
          </pre>
        </div>
      </div>
    </div>
  );
}
