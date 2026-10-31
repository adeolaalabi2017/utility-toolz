"use client";

import * as React from "react";
import { ArrowLeftRight, Copy, RotateCcw, FileText, Check, Plus, Minus } from "lucide-react";
import { CalcLayout, ResultHero, StatRow, Verdict } from "./ui";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type DiffLine = {
  type: "add" | "remove" | "same";
  text: string;
  originalLineNum?: number;
  modifiedLineNum?: number;
};

function computeDiff(original: string, modified: string, ignoreCase = false, ignoreWhitespace = false): DiffLine[] {
  const norm = (s: string) => {
    let res = s;
    if (ignoreWhitespace) res = res.trim();
    if (ignoreCase) res = res.toLowerCase();
    return res;
  };

  const origLines = original.split(/\r?\n/);
  const modLines = modified.split(/\r?\n/);

  // If one of them is empty
  if (original.trim() === "" && modified.trim() === "") return [];

  // Simple LCS matrix
  const m = origLines.length;
  const n = modLines.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (norm(origLines[i]) === norm(modLines[j])) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  // Backtrack LCS to generate line diff
  const result: DiffLine[] = [];
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && norm(origLines[i - 1]) === norm(modLines[j - 1])) {
      result.unshift({
        type: "same",
        text: origLines[i - 1],
        originalLineNum: i,
        modifiedLineNum: j,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({
        type: "add",
        text: modLines[j - 1],
        modifiedLineNum: j,
      });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      result.unshift({
        type: "remove",
        text: origLines[i - 1],
        originalLineNum: i,
      });
      i--;
    }
  }

  return result;
}

const SAMPLE_A = `ToolDeck utility suite
Version 1.0.0
Author: Core Engineering Team
Domains:
- Finance & Accounting
- Marketing & Growth
- Advertising & Media Buying
Features:
- Instant calculations
- 0 tracking or ads
- Export as CSV or JSON`;

const SAMPLE_B = `Utility Toolz Professional Platform
Version 1.2.0
Author: Core Engineering & Product
Domains:
- Finance & Accounting
- Marketing & Growth
- Advertising & Media Buying
- Design & Creative
- Developer Utilities
Features:
- Instant calculations
- 0 tracking or ads
- Export as CSV, JSON, or Clipboard
- Offline local storage support`;

export function DiffChecker() {
  const { toast } = useToast();
  const [original, setOriginal] = React.useState(SAMPLE_A);
  const [modified, setModified] = React.useState(SAMPLE_B);
  const [ignoreWhitespace, setIgnoreWhitespace] = React.useState(false);
  const [ignoreCase, setIgnoreCase] = React.useState(false);

  const diff = React.useMemo(
    () => computeDiff(original, modified, ignoreCase, ignoreWhitespace),
    [original, modified, ignoreCase, ignoreWhitespace]
  );

  const additions = diff.filter((d) => d.type === "add").length;
  const deletions = diff.filter((d) => d.type === "remove").length;
  const unchanged = diff.filter((d) => d.type === "same").length;

  const swap = () => {
    const temp = original;
    setOriginal(modified);
    setModified(temp);
  };

  const copyDiff = () => {
    const text = diff
      .map((d) => {
        const prefix = d.type === "add" ? "+ " : d.type === "remove" ? "- " : "  ";
        return prefix + d.text;
      })
      .join("\n");
    navigator.clipboard.writeText(text);
    toast({ title: "Diff copied to clipboard" });
  };

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ignoreWhitespace}
                  onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                  className="rounded border-input text-primary"
                />
                Ignore whitespace
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ignoreCase}
                  onChange={(e) => setIgnoreCase(e.target.checked)}
                  className="rounded border-input text-primary"
                />
                Ignore case
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={swap} className="h-7 text-xs gap-1">
                <ArrowLeftRight className="h-3 w-3" /> Swap
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setOriginal("");
                  setModified("");
                }}
                className="h-7 text-xs gap-1 text-muted-foreground"
              >
                <RotateCcw className="h-3 w-3" /> Clear
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Original Text
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  {original.split("\n").length} lines
                </span>
              </div>
              <Textarea
                rows={10}
                value={original}
                onChange={(e) => setOriginal(e.target.value)}
                placeholder="Paste original text here..."
                className="font-mono text-xs leading-relaxed resize-y"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Modified Text
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  {modified.split("\n").length} lines
                </span>
              </div>
              <Textarea
                rows={10}
                value={modified}
                onChange={(e) => setModified(e.target.value)}
                placeholder="Paste modified text here..."
                className="font-mono text-xs leading-relaxed resize-y"
              />
            </div>
          </div>

          {/* Visual Diff Output */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Unified Diff View
              </p>
              <Button variant="outline" size="sm" onClick={copyDiff} className="h-7 text-xs gap-1">
                <Copy className="h-3 w-3" /> Copy Diff
              </Button>
            </div>

            <div className="max-h-80 overflow-auto rounded-lg border border-border bg-[#faf5ea] p-2 font-mono text-xs leading-5">
              {diff.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="font-medium text-foreground">No text to compare yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Paste original and modified text in the fields above to see changes highlighted.
                  </p>
                </div>
              ) : additions === 0 && deletions === 0 ? (
                <p className="p-4 text-center text-[#308f68] font-medium">Texts are identical.</p>
              ) : (
                diff.map((line, idx) => {
                  if (line.type === "add") {
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-2 bg-[#308f68]/15 px-2 py-0.5 text-[#1f5f45] rounded"
                      >
                        <span className="w-4 select-none font-bold text-[#308f68]">+</span>
                        <span className="whitespace-pre-wrap break-all">{line.text || " "}</span>
                      </div>
                    );
                  }
                  if (line.type === "remove") {
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-2 bg-[#cf4f43]/15 px-2 py-0.5 text-[#a83a30] rounded"
                      >
                        <span className="w-4 select-none font-bold text-[#cf4f43]">-</span>
                        <span className="whitespace-pre-wrap break-all">{line.text || " "}</span>
                      </div>
                    );
                  }
                  return (
                    <div key={idx} className="flex items-start gap-2 px-2 py-0.5 text-foreground/70">
                      <span className="w-4 select-none text-muted-foreground/40">&nbsp;</span>
                      <span className="whitespace-pre-wrap break-all">{line.text || " "}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      }
      results={
        <div className="space-y-5">
          <ResultHero
            label="Delta Changes"
            value={`+${additions} / -${deletions}`}
            copyText={`+${additions} lines added, -${deletions} lines removed`}
            sub={`${diff.length} total lines analyzed`}
          />

          <Verdict
            tone={
              additions === 0 && deletions === 0
                ? "good"
                : additions > 0 && deletions > 0
                ? "neutral"
                : additions > 0
                ? "good"
                : "warn"
            }
          >
            {additions === 0 && deletions === 0
              ? "Both texts match exactly with no differences."
              : `Found ${additions === 1 ? "1 added line" : `${additions} added lines`} and ${
                  deletions === 1 ? "1 removed line" : `${deletions} removed lines`
                }.`}
          </Verdict>

          <div className="space-y-2 rounded-lg border border-border/70 p-3.5 bg-card/50">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Comparison Statistics
            </p>
            <div className="space-y-1.5 text-xs">
              <StatRow label="Lines added" value={`+${additions}`} />
              <StatRow label="Lines removed" value={`-${deletions}`} />
              <StatRow label="Lines unchanged" value={`${unchanged}`} />
              <StatRow label="Original word count" value={`${original.trim().split(/\s+/).filter(Boolean).length}`} />
              <StatRow label="Modified word count" value={`${modified.trim().split(/\s+/).filter(Boolean).length}`} />
            </div>
          </div>
        </div>
      }
    />
  );
}
