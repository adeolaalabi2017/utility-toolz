"use client";

import React, { useState, useMemo } from "react";
import { fmtNum, fmtPct } from "@/lib/format";
import { TrendingUp, BarChart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const SAMPLE_X = "10, 15, 20, 25, 30, 35, 40, 50";
const SAMPLE_Y = "25, 32, 44, 51, 62, 70, 78, 98";

export function CorrelationCalculator() {
  const [xInput, setXInput] = useState(SAMPLE_X);
  const [yInput, setYInput] = useState(SAMPLE_Y);

  const stats = useMemo(() => {
    const parse = (s: string) =>
      s
        .split(/[,\s\n]+/)
        .map((v) => Number(v.trim()))
        .filter((v) => !isNaN(v) && isFinite(v));

    const xVals = parse(xInput);
    const yVals = parse(yInput);

    const n = Math.min(xVals.length, yVals.length);
    if (n < 2) return null;

    const xs = xVals.slice(0, n);
    const ys = yVals.slice(0, n);

    const meanX = xs.reduce((a, b) => a + b, 0) / n;
    const meanY = ys.reduce((a, b) => a + b, 0) / n;

    let num = 0;
    let denX = 0;
    let denY = 0;

    for (let i = 0; i < n; i++) {
      const dx = xs[i] - meanX;
      const dy = ys[i] - meanY;
      num += dx * dy;
      denX += dx * dx;
      denY += dy * dy;
    }

    const denom = Math.sqrt(denX * denY);
    const r = denom > 0 ? num / denom : 0;
    const r2 = Math.pow(r, 2);

    const slope = denX > 0 ? num / denX : 0;
    const intercept = meanY - slope * meanX;

    let strength = "No linear correlation";
    if (r >= 0.8) strength = "Strong Positive Correlation";
    else if (r >= 0.5) strength = "Moderate Positive Correlation";
    else if (r >= 0.2) strength = "Weak Positive Correlation";
    else if (r <= -0.8) strength = "Strong Negative Correlation";
    else if (r <= -0.5) strength = "Moderate Negative Correlation";
    else if (r <= -0.2) strength = "Weak Negative Correlation";

    return {
      n,
      meanX,
      meanY,
      r,
      r2,
      slope,
      intercept,
      strength,
    };
  }, [xInput, yInput]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Inputs (7 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-deep-orange" /> Paired Data Series (X and Y)
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setXInput(SAMPLE_X);
                setYInput(SAMPLE_Y);
              }}
              className="h-10 sm:h-7 text-xs"
            >
              Load Sample
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="correlation-calculator-1" className="text-xs font-medium text-foreground">Variable X (Independent)</label>
              <textarea id="correlation-calculator-1"
                rows={5}
                value={xInput}
                onChange={(e) => setXInput(e.target.value)}
                placeholder="10, 20, 30, 40..."
                className="mt-1 w-full rounded-md border border-input bg-background p-2.5 font-mono text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Comma or space separated</span>
            </div>

            <div>
              <label htmlFor="correlation-calculator-2" className="text-xs font-medium text-foreground">Variable Y (Dependent)</label>
              <textarea id="correlation-calculator-2"
                rows={5}
                value={yInput}
                onChange={(e) => setYInput(e.target.value)}
                placeholder="25, 45, 60, 85..."
                className="mt-1 w-full rounded-md border border-input bg-background p-2.5 font-mono text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Equal number of values as X</span>
            </div>
          </div>
        </div>

        {/* Results Banner (5 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm flex flex-col justify-between lg:col-span-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pearson Correlation
          </span>

          {stats ? (
            <div className="my-4 space-y-4">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <span className="text-xs text-muted-foreground">Correlation Coefficient (r)</span>
                <p className="tnum font-display text-display-lg text-deep-green mt-1 font-bold">
                  {stats.r >= 0 ? `+${stats.r.toFixed(3)}` : stats.r.toFixed(3)}
                </p>
                <span className="text-xs font-semibold text-foreground mt-1 block">
                  {stats.strength}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-lg border border-border bg-background p-3">
                  <span className="text-[11px] text-muted-foreground block">Variance Explained (R²)</span>
                  <span className="tnum font-display text-display-sm text-deep-purple font-bold">
                    {(stats.r2 * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="rounded-lg border border-border bg-background p-3">
                  <span className="text-[11px] text-muted-foreground block">Paired Points</span>
                  <span className="tnum font-display text-display-sm text-foreground font-bold">
                    n = {stats.n}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="my-auto text-center text-xs text-muted-foreground py-8">
              Enter at least 2 paired numbers for X and Y.
            </div>
          )}

          {stats && (
            <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground flex justify-between">
              <span>Linear Fit Equation:</span>
              <strong className="font-mono text-foreground">
                y = {stats.slope.toFixed(2)}x {stats.intercept >= 0 ? `+ ${stats.intercept.toFixed(2)}` : `- ${Math.abs(stats.intercept).toFixed(2)}`}
              </strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
