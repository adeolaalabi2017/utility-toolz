"use client";

import React, { useState, useMemo } from "react";
import { Copy, Check, Link2, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const CHANNEL_PRESETS = [
  { name: "Google Search Ads", source: "google", medium: "cpc" },
  { name: "Meta / Instagram", source: "facebook", medium: "paid_social" },
  { name: "Weekly Newsletter", source: "newsletter", medium: "email" },
  { name: "LinkedIn Post", source: "linkedin", medium: "social" },
  { name: "YouTube Video", source: "youtube", medium: "video" },
];

export function UtmBuilder() {
  const [baseUrl, setBaseUrl] = useState("https://utilitytoolz.example/signup");
  const [source, setSource] = useState("google");
  const [medium, setMedium] = useState("cpc");
  const [campaign, setCampaign] = useState("q4_growth");
  const [term, setTerm] = useState("calculator tools");
  const [content, setContent] = useState("hero_cta_blue");
  const [copied, setCopied] = useState(false);

  const fullUrl = useMemo(() => {
    let clean = baseUrl.trim();
    if (!clean) return "";
    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      clean = `https://${clean}`;
    }

    try {
      const url = new URL(clean);
      if (source.trim()) url.searchParams.set("utm_source", source.trim());
      if (medium.trim()) url.searchParams.set("utm_medium", medium.trim());
      if (campaign.trim()) url.searchParams.set("utm_campaign", campaign.trim());
      if (term.trim()) url.searchParams.set("utm_term", term.trim());
      if (content.trim()) url.searchParams.set("utm_content", content.trim());
      return url.toString();
    } catch {
      return "";
    }
  }, [baseUrl, source, medium, campaign, term, content]);

  const copyUrl = () => {
    if (!fullUrl) return;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Generated URL Banner */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Link2 className="h-4 w-4 text-[#a4502c]" /> Generated Campaign Tracking URL
          </span>
          <Button
            onClick={copyUrl}
            disabled={!fullUrl}
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs font-semibold"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-[#1f5f45]" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied" : "Copy Campaign URL"}</span>
          </Button>
        </div>

        <div className="rounded-lg bg-[#faf5ea] p-3.5 font-mono text-xs text-foreground break-all leading-relaxed">
          {fullUrl || "Enter a valid website URL below to generate UTM tracking link."}
        </div>

        {/* Active parameter chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
          <span className="text-muted-foreground font-medium">Tracking tags:</span>
          {source && <span className="rounded bg-[#308f68]/15 px-2 py-0.5 font-semibold text-[#1f5f45]">source: {source}</span>}
          {medium && <span className="rounded bg-[#6b5faf]/15 px-2 py-0.5 font-semibold text-[#3f346f]">medium: {medium}</span>}
          {campaign && <span className="rounded bg-[#e07a3c]/15 px-2 py-0.5 font-semibold text-[#a4502c]">campaign: {campaign}</span>}
        </div>
      </div>

      {/* Input parameters & Presets */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4 lg:col-span-8">
          <div>
            <label className="text-xs font-medium text-foreground">Target Destination URL</label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://yourdomain.com/landing-page"
              className="mt-1 w-full rounded-md border border-input bg-background p-2.5 font-mono text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-foreground">Campaign Source (`utm_source`)*</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="google, newsletter, linkedin"
                className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Where traffic originates</span>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Campaign Medium (`utm_medium`)*</label>
              <input
                type="text"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                placeholder="cpc, email, banner, social"
                className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Marketing or ad medium</span>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Campaign Name (`utm_campaign`)*</label>
              <input
                type="text"
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                placeholder="spring_sale, product_launch"
                className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Product, promo, or slogan</span>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Campaign Term (`utm_term`)</label>
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="running+shoes (optional)"
                className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Paid search keywords</span>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-foreground">Campaign Content (`utm_content`)</label>
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="sidebar_cta_btn, logo_link (optional)"
                className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Differentiates ad creatives or A/B variants</span>
            </div>
          </div>
        </div>

        {/* Quick Channel Presets (4 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-3 lg:col-span-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-[#a4502c]" /> Channel Presets
          </span>
          <p className="text-xs text-muted-foreground">
            Apply standardized naming conventions to avoid analytics fragmentation.
          </p>

          <div className="space-y-2 pt-2">
            {CHANNEL_PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => {
                  setSource(p.source);
                  setMedium(p.medium);
                }}
                className="w-full text-left rounded-lg border border-border bg-background p-2.5 text-xs transition-colors hover:border-[#6b5faf] hover:bg-[#faf5ea]"
              >
                <span className="font-semibold text-foreground block">{p.name}</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  source: {p.source} · medium: {p.medium}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
