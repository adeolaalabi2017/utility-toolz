"use client";

import React, { useState } from "react";
import { Copy, Check, Share2, Globe, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SocialSharePreview() {
  const [title, setTitle] = useState("Utility Toolz — 100+ Professional In-Browser Tools");
  const [description, setDescription] = useState(
    "A clean, domain-first suite of calculations, converters, and utilities for marketers, developers, accountants, and designers. 100% free and client-side."
  );
  const [url, setUrl] = useState("https://utilitytoolz.example");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop");
  const [platform, setPlatform] = useState<"twitter" | "linkedin" | "facebook">("twitter");
  const [copied, setCopied] = useState(false);

  const metaTags = `<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${imageUrl}">`;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Inputs (6 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4 lg:col-span-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Share2 className="h-4 w-4 text-deep-orange" /> Open Graph & Twitter Card Metadata
          </span>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium text-foreground">
                <label htmlFor="social-share-preview-1">Page Title (`og:title`)</label>
                <span className="text-muted-foreground">{title.length} chars (aim for 50-60)</span>
              </div>
              <input id="social-share-preview-1"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-foreground">
                <label htmlFor="social-share-preview-2">Description (`og:description`)</label>
                <span className="text-muted-foreground">{description.length} chars (aim for 120-155)</span>
              </div>
              <textarea id="social-share-preview-2"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label htmlFor="social-share-preview-3" className="text-xs font-medium text-foreground">Canonical URL (`og:url`)</label>
              <input id="social-share-preview-3"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label htmlFor="social-share-preview-4" className="text-xs font-medium text-foreground">Image URL (`og:image` 1200×630px recommended)</label>
              <input id="social-share-preview-4"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Live Card Preview (6 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm flex flex-col justify-between lg:col-span-6">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Social Platform Mockup
            </span>
            <div className="flex rounded-md bg-muted/60 p-0.5 text-xs font-medium">
              <button aria-pressed={platform === "twitter"} type="button"
                onClick={() => setPlatform("twitter")}
                className={`rounded px-2.5 py-1 ${platform === "twitter" ? "bg-card font-semibold shadow-xs" : "text-muted-foreground"}`}
              >
                X / Twitter
              </button>
              <button aria-pressed={platform === "linkedin"} type="button"
                onClick={() => setPlatform("linkedin")}
                className={`rounded px-2.5 py-1 ${platform === "linkedin" ? "bg-card font-semibold shadow-xs" : "text-muted-foreground"}`}
              >
                LinkedIn
              </button>
              <button aria-pressed={platform === "facebook"} type="button"
                onClick={() => setPlatform("facebook")}
                className={`rounded px-2.5 py-1 ${platform === "facebook" ? "bg-card font-semibold shadow-xs" : "text-muted-foreground"}`}
              >
                Facebook
              </button>
            </div>
          </div>

          {/* Simulated Card Frame */}
          <div className="my-auto overflow-hidden rounded-xl border border-border bg-background shadow-lark-sm">
            {imageUrl && (
              <div className="aspect-[1.91/1] w-full overflow-hidden bg-muted">
                <img
                  src={imageUrl}
                  alt="OG Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='630' fill='%23faf5ea'%3E%3Crect width='1200' height='630'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23a4502c' font-size='32' font-family='sans-serif'%3E1200 x 630 OG Image Preview%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            )}
            <div className="p-3.5 space-y-1">
              <span className="text-[11px] text-muted-foreground uppercase font-mono block">
                {url.replace(/^https?:\/\//, "").split("/")[0]}
              </span>
              <p className="font-semibold text-xs text-foreground line-clamp-1 leading-snug">
                {title}
              </p>
              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          <p className="text-center text-[11px] text-muted-foreground mt-3">
            Simulates appearance in feeds, cards, and unfurls.
          </p>
        </div>
      </div>

      {/* Generated Meta Snippet */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-lark-sm">
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs font-semibold text-foreground">Generated HTML &lt;head&gt; Meta Tags</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(metaTags);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="h-10 sm:h-7 text-xs gap-1"
          >
            {copied ? <Check className="h-3 w-3 text-deep-green" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? "Copied" : "Copy Meta Tags"}</span>
          </Button>
        </div>
        <pre className="overflow-x-auto rounded bg-muted/50 p-3 font-mono text-xs text-foreground">
          {metaTags}
        </pre>
      </div>
    </div>
  );
}
