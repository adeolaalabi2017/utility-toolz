"use client";

import React, { useState, useMemo } from "react";
import { Copy, Check, Filter, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const SAMPLE_LIST = `apple
banana
orange
apple
grapes
banana
kiwi
Orange
pear
apple`;

export function DataDeduplicator() {
  const [input, setInput] = useState(SAMPLE_LIST);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const rawLines = input.split("\n");
    const seen = new Set<string>();
    const unique: string[] = [];
    const duplicates: string[] = [];

    for (const raw of rawLines) {
      let line = trimWhitespace ? raw.trim() : raw;
      if (!line) continue;

      const compareKey = caseSensitive ? line : line.toLowerCase();
      if (seen.has(compareKey)) {
        duplicates.push(line);
      } else {
        seen.add(compareKey);
        unique.push(line);
      }
    }

    return {
      originalCount: rawLines.length,
      uniqueCount: unique.length,
      duplicateCount: duplicates.length,
      output: unique.join("\n"),
      duplicatesList: duplicates.slice(0, 10),
    };
  }, [input, caseSensitive, trimWhitespace]);

  const copyOutput = () => {
    navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([result.output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "deduplicated-list.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Options Toolbar */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-lark-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer font-medium text-foreground">
            <input
              type="checkbox"
              checked={trimWhitespace}
              onChange={(e) => setTrimWhitespace(e.target.checked)}
              className="rounded border-input text-primary"
            />
            <span>Trim Whitespace</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer font-medium text-foreground">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded border-input text-primary"
            />
            <span>Case Sensitive</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={copyOutput} variant="outline" size="sm" className="h-7 text-xs gap-1">
            {copied ? <Check className="h-3 w-3 text-[#1f5f45]" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? "Copied" : "Copy Unique"}</span>
          </Button>
          <Button onClick={downloadFile} variant="outline" size="sm" className="h-7 text-xs gap-1">
            <Download className="h-3 w-3" />
            <span>Download</span>
          </Button>
        </div>
      </div>

      {/* Inputs & Outputs */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Input Lines ({result.originalCount})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInput(SAMPLE_LIST)}
              className="h-6 text-[11px]"
            >
              Load Sample
            </Button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={12}
            className="w-full flex-1 resize-y rounded-md border border-input bg-background p-3 font-mono text-xs leading-relaxed text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Paste list or rows here..."
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Deduplicated Unique Output ({result.uniqueCount})
            </span>
            <span className="text-xs font-bold text-[#1f5f45]">
              Removed {result.duplicateCount} duplicates
            </span>
          </div>
          <textarea
            readOnly
            value={result.output}
            rows={12}
            className="w-full flex-1 resize-y rounded-md border border-border bg-[#faf5ea] p-3 font-mono text-xs leading-relaxed text-foreground focus-visible:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
