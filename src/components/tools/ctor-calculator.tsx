"use client";

import { ResultValue } from "./result-value";
import React, { useState, useMemo } from "react";
import { fmtPct, fmtNum } from "@/lib/format";
import { Mail, MousePointerClick, Eye, CheckCircle2 } from "lucide-react";

export function CtorCalculator() {
  const [delivered, setDelivered] = useState(10000);
  const [uniqueOpens, setUniqueOpens] = useState(2800);
  const [uniqueClicks, setUniqueClicks] = useState(420);

  const calc = useMemo(() => {
    const openRate = delivered > 0 ? (uniqueOpens / delivered) * 100 : 0;
    const ctr = delivered > 0 ? (uniqueClicks / delivered) * 100 : 0;
    const ctor = uniqueOpens > 0 ? (uniqueClicks / uniqueOpens) * 100 : 0;

    return { openRate, ctr, ctor };
  }, [delivered, uniqueOpens, uniqueClicks]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Inputs (7 cols) */}
        <div className="rounded-xl bg-card p-5 shadow-lark-sm space-y-4 lg:col-span-7">
          <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
            <Mail className="h-4 w-4 text-deep-orange" /> Email campaign volume
          </span>

          <div className="space-y-3">
            <div>
              <label htmlFor="ctor-calculator-1" className="text-xs font-medium text-foreground">Total Emails Delivered</label>
              <input id="ctor-calculator-1"
                type="number"
                value={delivered}
                onChange={(e) => setDelivered(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Total successful deliveries (excluding bounces)</span>
            </div>

            <div>
              <label htmlFor="ctor-calculator-2" className="text-xs font-medium text-foreground">Unique Opens</label>
              <input id="ctor-calculator-2"
                type="number"
                value={uniqueOpens}
                onChange={(e) => setUniqueOpens(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Unique subscribers who opened the email</span>
            </div>

            <div>
              <label htmlFor="ctor-calculator-3" className="text-xs font-medium text-foreground">Unique Clicks</label>
              <input id="ctor-calculator-3"
                type="number"
                value={uniqueClicks}
                onChange={(e) => setUniqueClicks(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold text-deep-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Unique subscribers who clicked a link</span>
            </div>
          </div>
        </div>

        {/* Results Banner (5 cols) */}
        <div className="rounded-xl bg-card p-5 shadow-lark-sm flex flex-col justify-between lg:col-span-5">
          <span className="text-sm font-semibold text-muted-foreground">
            Email quality metrics
          </span>

          <div className="my-4 space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <span className="text-xs text-muted-foreground">Click-to-Open Rate (CTOR)</span>
              <ResultValue compact live className="mt-1">
                {fmtPct(calc.ctor, 2)}
              </ResultValue>
              <span className="text-xs text-muted-foreground mt-1 block">
                Measures content relevance & CTA effectiveness
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg bg-muted/50 p-3">
                <span className="text-[11px] text-muted-foreground block">Open Rate</span>
                <span className="tnum font-display text-display-sm text-foreground font-bold">
                  {fmtPct(calc.openRate, 2)}
                </span>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <span className="text-[11px] text-muted-foreground block">Overall CTR</span>
                <span className="tnum font-display text-display-sm text-foreground font-bold">
                  {fmtPct(calc.ctr, 2)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground flex justify-between">
            <span>CTOR Benchmark:</span>
            <strong className="text-foreground">
              {calc.ctor >= 20 ? "Outstanding (> 20%)" : calc.ctor >= 12 ? "Healthy (12% - 20%)" : "Needs copy/offer optimization (< 12%)"}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
