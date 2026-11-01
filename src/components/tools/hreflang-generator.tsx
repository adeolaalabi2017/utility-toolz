"use client";

import React, { useState } from "react";
import { Copy, Check, Globe, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HreflangRow {
  id: string;
  lang: string;
  region: string;
  url: string;
  isDefault: boolean;
}

export function HreflangGenerator() {
  const [rows, setRows] = useState<HreflangRow[]>([
    { id: "1", lang: "en", region: "US", url: "https://example.com/en-us", isDefault: false },
    { id: "2", lang: "en", region: "GB", url: "https://example.com/en-gb", isDefault: false },
    { id: "3", lang: "es", region: "ES", url: "https://example.com/es", isDefault: false },
    { id: "4", lang: "x-default", region: "", url: "https://example.com/", isDefault: true },
  ]);
  const [copied, setCopied] = useState(false);

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        lang: "fr",
        region: "",
        url: "https://example.com/fr",
        isDefault: false,
      },
    ]);
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRow = (id: string, patch: Partial<HreflangRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const generatedTags = rows
    .map((r) => {
      const tag = r.isDefault ? "x-default" : r.region ? `${r.lang.toLowerCase()}-${r.region.toUpperCase()}` : r.lang.toLowerCase();
      return `<link rel="alternate" hreflang="${tag}" href="${r.url}" />`;
    })
    .join("\n");

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-deep-green" /> Regional URL Variants
          </span>
          <Button onClick={addRow} variant="outline" size="sm" className="h-10 sm:h-7 text-xs gap-1">
            <Plus className="h-3.5 w-3.5" />
            <span>Add Locale</span>
          </Button>
        </div>

        <div className="space-y-3">
          {rows.map((r, idx) => (
            <div key={r.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 rounded-lg border border-border bg-background p-2.5 text-xs">
              <div className="w-28 shrink-0">
                <input
                  type="text"
                  value={r.lang}
                  disabled={r.isDefault}
                  onChange={(e) => updateRow(r.id, { lang: e.target.value })}
                  placeholder="Language (en)"
                  aria-label={`Locale ${idx + 1} language code`}
                  className="w-full rounded border border-input p-1.5 text-center font-mono uppercase"
                />
              </div>

              <div className="w-24 shrink-0">
                <input
                  type="text"
                  value={r.region}
                  disabled={r.isDefault}
                  onChange={(e) => updateRow(r.id, { region: e.target.value })}
                  placeholder="Region (US)"
                  aria-label={`Locale ${idx + 1} region code`}
                  className="w-full rounded border border-input p-1.5 text-center font-mono uppercase"
                />
              </div>

              <div className="flex-1 w-full">
                <input
                  type="text"
                  value={r.url}
                  onChange={(e) => updateRow(r.id, { url: e.target.value })}
                  placeholder="https://example.com/path"
                  aria-label={`Locale ${idx + 1} URL`}
                  className="w-full rounded border border-input p-1.5 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <label className="flex items-center gap-1 cursor-pointer text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={r.isDefault}
                    onChange={(e) => updateRow(r.id, { isDefault: e.target.checked, lang: e.target.checked ? "x-default" : "en", region: "" })}
                    className="rounded text-primary"
                  />
                  <span>x-default</span>
                </label>

                <button type="button" onClick={() => removeRow(r.id)} aria-label={`Remove locale ${idx + 1}`} className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-destructive sm:h-7 sm:w-7">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generated Code Output */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-lark-sm">
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs font-semibold text-foreground">Generated Hreflang Tags</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(generatedTags);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="h-10 sm:h-7 text-xs gap-1"
          >
            {copied ? <Check className="h-3 w-3 text-deep-green" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? "Copied" : "Copy Tags"}</span>
          </Button>
        </div>
        <pre className="overflow-x-auto rounded bg-muted/50 p-3 font-mono text-xs text-foreground leading-relaxed">
          {generatedTags}
        </pre>
      </div>
    </div>
  );
}
