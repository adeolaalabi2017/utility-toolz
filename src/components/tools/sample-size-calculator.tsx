"use client";

import React, { useState, useMemo } from "react";
import { fmtNum, fmtPct } from "@/lib/format";
import { BarChart3, Users, HelpCircle, CheckCircle2 } from "lucide-react";

export function SampleSizeCalculator() {
  const [population, setPopulation] = useState(100000);
  const [confidence, setConfidence] = useState<90 | 95 | 99>(95);
  const [marginOfError, setMarginOfError] = useState(5);
  const [proportion, setProportion] = useState(50);

  const calc = useMemo(() => {
    const zMap = { 90: 1.645, 95: 1.96, 99: 2.576 };
    const z = zMap[confidence] || 1.96;
    const p = Math.max(0.01, Math.min(0.99, proportion / 100));
    const e = Math.max(0.001, marginOfError / 100);

    const n0 = (Math.pow(z, 2) * p * (1 - p)) / Math.pow(e, 2);

    let required = n0;
    if (population > 0) {
      required = n0 / (1 + (n0 - 1) / population);
    }

    const roundedSize = Math.ceil(required);

    // Trade-off variations table at different margins of error
    const errors = [1, 2, 3, 5, 10];
    const comparisons = errors.map((err) => {
      const errRatio = err / 100;
      const base = (Math.pow(z, 2) * p * (1 - p)) / Math.pow(errRatio, 2);
      const adj = population > 0 ? base / (1 + (base - 1) / population) : base;
      return { err, size: Math.ceil(adj) };
    });

    return {
      roundedSize,
      comparisons,
      z,
    };
  }, [population, confidence, marginOfError, proportion]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Inputs (7 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4 lg:col-span-7">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4 text-deep-orange" /> Statistical Confidence Parameters
          </span>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="sample-size-calculator-1" className="text-xs font-medium text-foreground">Population Size (N)</label>
              <input id="sample-size-calculator-1"
                type="number"
                value={population}
                onChange={(e) => setPopulation(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Total population (0 = unlimited)</span>
            </div>

            <div>
              <label htmlFor="sample-size-calculator-2" className="text-xs font-medium text-foreground">Margin of Error (±%)</label>
              <input id="sample-size-calculator-2"
                type="number"
                min="0.1"
                max="20"
                step="0.5"
                value={marginOfError}
                onChange={(e) => setMarginOfError(Number(e.target.value) || 1)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Acceptable error tolerance (standard: 5%)</span>
            </div>

            <div>
              <label htmlFor="sample-size-calculator-3" className="text-xs font-medium text-foreground">Confidence Level</label>
              <select id="sample-size-calculator-3"
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value) as any)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value={90}>90% Confidence (Z = 1.645)</option>
                <option value={95}>95% Confidence (Z = 1.960 — Standard)</option>
                <option value={99}>99% Confidence (Z = 2.576 — Strict)</option>
              </select>
            </div>

            <div>
              <label htmlFor="sample-size-calculator-4" className="text-xs font-medium text-foreground">Expected Proportion (%): {proportion}%</label>
              <input id="sample-size-calculator-4"
                type="range"
                min="10"
                max="90"
                value={proportion}
                onChange={(e) => setProportion(Number(e.target.value))}
                className="mt-3 w-full"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">50% gives safest, maximum sample size</span>
            </div>
          </div>
        </div>

        {/* Results Banner (5 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm flex flex-col justify-between lg:col-span-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Recommended Sample
          </span>

          <div className="my-4 space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <span className="text-xs text-muted-foreground">Required Sample Size</span>
              <p className="tnum font-display text-display-lg text-deep-green mt-1 font-bold">
                {fmtNum(calc.roundedSize, 0)}
              </p>
              <span className="text-xs text-muted-foreground mt-1 block">
                respondents needed for ±{marginOfError}% precision
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="text-[11px] text-muted-foreground block">Confidence Level</span>
                <span className="tnum font-display text-display-sm text-deep-purple font-bold">
                  {confidence}%
                </span>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="text-[11px] text-muted-foreground block">Critical Value (Z)</span>
                <span className="tnum font-display text-display-sm text-foreground font-bold">
                  {calc.z.toFixed(3)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground flex justify-between">
            <span>Formula standard:</span>
            <strong className="text-foreground">Cochran's formula with finite correction</strong>
          </div>
        </div>
      </div>

      {/* Margin of error trade-off comparison */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Sample Size vs. Precision Trade-Off Table
        </h4>
        <div className="grid gap-3 sm:grid-cols-5 text-xs text-center">
          {calc.comparisons.map((c) => (
            <div
              key={c.err}
              className={`rounded-lg border p-3 ${
                c.err === marginOfError ? "border-deep-green bg-muted/50 font-bold" : "border-border bg-background"
              }`}
            >
              <span className="text-muted-foreground block">±{c.err}% Error</span>
              <span className="text-base font-bold text-foreground mt-1 block">{fmtNum(c.size, 0)}</span>
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                {c.err === marginOfError ? "Selected" : "Alternative"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
