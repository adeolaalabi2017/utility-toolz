"use client";

import { Cur } from "@/components/site/currency";
import React, { useState, useMemo } from "react";
import { fmtUSD, fmtPct, fmtNum } from "@/lib/format";
import { Video, Play, Award, BarChart3 } from "lucide-react";

export function VideoCompletionCalculator() {
  const [adSpend, setAdSpend] = useState(2500);
  const [videoStarts, setVideoStarts] = useState(50000);
  const [q25, setQ25] = useState(38000);
  const [q50, setQ50] = useState(26000);
  const [q75, setQ75] = useState(17000);
  const [completions, setCompletions] = useState(12000);

  const calc = useMemo(() => {
    const vcr = videoStarts > 0 ? (completions / videoStarts) * 100 : 0;
    const cpcv = completions > 0 ? adSpend / completions : 0;
    const cpv = videoStarts > 0 ? adSpend / videoStarts : 0;

    const r25 = videoStarts > 0 ? (q25 / videoStarts) * 100 : 0;
    const r50 = videoStarts > 0 ? (q50 / videoStarts) * 100 : 0;
    const r75 = videoStarts > 0 ? (q75 / videoStarts) * 100 : 0;
    const r100 = videoStarts > 0 ? (completions / videoStarts) * 100 : 0;

    return {
      vcr,
      cpcv,
      cpv,
      r25,
      r50,
      r75,
      r100,
    };
  }, [adSpend, videoStarts, q25, q50, q75, completions]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Inputs (7 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4 lg:col-span-7">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Video className="h-4 w-4 text-deep-orange" /> Campaign Spend & Quartile Metrics
          </span>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="video-completion-calculator-1" className="text-xs font-medium text-foreground">Total Campaign Ad Spend (<Cur />)</label>
              <input id="video-completion-calculator-1"
                type="number"
                value={adSpend}
                onChange={(e) => setAdSpend(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label htmlFor="video-completion-calculator-2" className="text-xs font-medium text-foreground">Total Video Starts / Impressions</label>
              <input id="video-completion-calculator-2"
                type="number"
                value={videoStarts}
                onChange={(e) => setVideoStarts(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label htmlFor="video-completion-calculator-3" className="text-xs font-medium text-foreground">25% Views (1st Quartile)</label>
              <input id="video-completion-calculator-3"
                type="number"
                value={q25}
                onChange={(e) => setQ25(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label htmlFor="video-completion-calculator-4" className="text-xs font-medium text-foreground">50% Views (Midpoint)</label>
              <input id="video-completion-calculator-4"
                type="number"
                value={q50}
                onChange={(e) => setQ50(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label htmlFor="video-completion-calculator-5" className="text-xs font-medium text-foreground">75% Views (3rd Quartile)</label>
              <input id="video-completion-calculator-5"
                type="number"
                value={q75}
                onChange={(e) => setQ75(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label htmlFor="video-completion-calculator-6" className="text-xs font-medium text-foreground">100% Full Video Completions</label>
              <input id="video-completion-calculator-6"
                type="number"
                value={completions}
                onChange={(e) => setCompletions(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold text-deep-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Results Banner (5 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm flex flex-col justify-between lg:col-span-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Video Performance
          </span>

          <div className="my-4 space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <span className="text-xs text-muted-foreground">Video Completion Rate (VCR)</span>
              <p className="tnum font-display text-display-lg text-deep-green mt-1 font-bold">
                {fmtPct(calc.vcr, 2)}
              </p>
              <span className="text-xs text-muted-foreground mt-1 block">
                Full 100% completion rate
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="text-[11px] text-muted-foreground block">Cost / Completed View (CPCV)</span>
                <span className="tnum font-display text-display-sm text-foreground font-bold">
                  {fmtUSD(calc.cpcv, 2)}
                </span>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="text-[11px] text-muted-foreground block">Cost / Start (CPV)</span>
                <span className="tnum font-display text-display-sm text-deep-purple font-bold">
                  {fmtUSD(calc.cpv, 3)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground flex justify-between">
            <span>Retention retention quality:</span>
            <strong className="text-foreground">
              {calc.vcr >= 25 ? "High retention (> 25%)" : "Standard commercial video (15% - 25%)"}
            </strong>
          </div>
        </div>
      </div>

      {/* Retention Drop-off Bars */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Audience Retention Waterfall
        </h4>

        <div className="space-y-3 pt-2">
          {[
            { label: "Video Start", count: videoStarts, pct: 100, color: "bg-primary" },
            { label: "25% Quartile", count: q25, pct: calc.r25, color: "bg-lf-green" },
            { label: "50% Midpoint", count: q50, pct: calc.r50, color: "bg-lf-purple" },
            { label: "75% Quartile", count: q75, pct: calc.r75, color: "bg-lf-orange" },
            { label: "100% Completion", count: completions, pct: calc.r100, color: "bg-lf-coral" },
          ].map((bar) => (
            <div key={bar.label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-foreground">{bar.label}</span>
                <span className="font-mono text-muted-foreground">
                  {fmtNum(bar.count, 0)} ({bar.pct.toFixed(1)}%)
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  style={{ width: `${Math.min(100, bar.pct)}%` }}
                  className={`h-full rounded-full ${bar.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
