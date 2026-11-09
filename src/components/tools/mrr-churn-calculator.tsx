"use client";

import { ResultValue } from "./result-value";
import { Cur } from "@/components/site/currency";

import React, { useState, useMemo } from "react";
import { fmtUSD, fmtPct, fmtNum } from "@/lib/format";
import { TrendingUp, BarChart3, AlertTriangle, CheckCircle2 } from "lucide-react";

export function MrrChurnCalculator() {
  const [startMrr, setStartMrr] = useState(50000);
  const [newMrr, setNewMrr] = useState(6500);
  const [expansionMrr, setExpansionMrr] = useState(2500);
  const [contractionMrr, setContractionMrr] = useState(800);
  const [churnedMrr, setChurnedMrr] = useState(1500);

  const calc = useMemo(() => {
    const endMrr = Math.max(0, startMrr + newMrr + expansionMrr - contractionMrr - churnedMrr);
    const arr = endMrr * 12;
    const netNewMrr = newMrr + expansionMrr - contractionMrr - churnedMrr;

    const grossChurnRate = startMrr > 0 ? (churnedMrr / startMrr) * 100 : 0;
    const netChurnRate = startMrr > 0 ? ((churnedMrr + contractionMrr - expansionMrr) / startMrr) * 100 : 0;
    const nrr = startMrr > 0 ? ((startMrr + expansionMrr - contractionMrr - churnedMrr) / startMrr) * 100 : 100;

    const lostMrr = churnedMrr + contractionMrr;
    const gainedMrr = newMrr + expansionMrr;
    const quickRatio = lostMrr > 0 ? gainedMrr / lostMrr : gainedMrr > 0 ? 99 : 0;

    return {
      endMrr,
      arr,
      netNewMrr,
      grossChurnRate,
      netChurnRate,
      nrr,
      quickRatio,
    };
  }, [startMrr, newMrr, expansionMrr, contractionMrr, churnedMrr]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Inputs (7 cols) */}
        <div className="rounded-xl bg-card p-5 shadow-lark-sm space-y-4 lg:col-span-7">
          <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-deep-green" /> Monthly SaaS revenue components (<Cur />)
          </span>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label htmlFor="mrr-churn-calculator-1" className="text-xs font-medium text-foreground">Starting Monthly Recurring Revenue (MRR)</label>
              <input id="mrr-churn-calculator-1"
                type="number"
                value={startMrr}
                onChange={(e) => setStartMrr(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label htmlFor="mrr-churn-calculator-2" className="text-xs font-medium text-foreground">New MRR (New Customers)</label>
              <input id="mrr-churn-calculator-2"
                type="number"
                value={newMrr}
                onChange={(e) => setNewMrr(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold text-deep-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">+ New logos added</span>
            </div>

            <div>
              <label htmlFor="mrr-churn-calculator-3" className="text-xs font-medium text-foreground">Expansion MRR (Upgrades)</label>
              <input id="mrr-churn-calculator-3"
                type="number"
                value={expansionMrr}
                onChange={(e) => setExpansionMrr(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold text-deep-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">+ Cross-sells & tiers</span>
            </div>

            <div>
              <label htmlFor="mrr-churn-calculator-4" className="text-xs font-medium text-foreground">Contraction MRR (Downgrades)</label>
              <input id="mrr-churn-calculator-4"
                type="number"
                value={contractionMrr}
                onChange={(e) => setContractionMrr(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold text-deep-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">− Plan reductions</span>
            </div>

            <div>
              <label htmlFor="mrr-churn-calculator-5" className="text-xs font-medium text-foreground">Churned MRR (Cancellations)</label>
              <input id="mrr-churn-calculator-5"
                type="number"
                value={churnedMrr}
                onChange={(e) => setChurnedMrr(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold text-deep-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">− Lost accounts</span>
            </div>
          </div>
        </div>

        {/* Primary Metrics (5 cols) */}
        <div className="rounded-xl bg-card p-5 shadow-lark-sm flex flex-col justify-between lg:col-span-5">
          <span className="text-sm font-semibold text-muted-foreground">
            Ending recurring revenue
          </span>

          <div className="my-4 space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <span className="text-xs text-muted-foreground">Ending Monthly Recurring Revenue (MRR)</span>
              <ResultValue compact live className="mt-1">
                {fmtUSD(calc.endMrr, 0)}
              </ResultValue>
              <span className="text-xs text-muted-foreground mt-1 block">
                Net Change: <strong className={calc.netNewMrr >= 0 ? "text-deep-green" : "text-deep-coral"}>
                  {calc.netNewMrr >= 0 ? `+${fmtUSD(calc.netNewMrr, 0)}` : fmtUSD(calc.netNewMrr, 0)}
                </strong>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg bg-muted/50 p-3">
                <span className="text-[11px] text-muted-foreground block">Annual Run Rate (ARR)</span>
                <span className="tnum font-display text-display-sm text-foreground font-bold">
                  {fmtUSD(calc.arr, 0)}
                </span>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <span className="text-[11px] text-muted-foreground block">Net Retention (NRR)</span>
                <span className={`tnum font-display text-display-sm font-bold ${calc.nrr >= 100 ? "text-deep-green" : "text-deep-coral"}`}>
                  {fmtPct(calc.nrr, 1)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground flex justify-between">
            <span>SaaS Quick Ratio:</span>
            <strong className={calc.quickRatio >= 4 ? "text-deep-green" : "text-deep-orange"}>
              {calc.quickRatio.toFixed(2)}x ({calc.quickRatio >= 4 ? "Healthy > 4x" : "Growth constrained"})
            </strong>
          </div>
        </div>
      </div>

      {/* Retention & Churn Health Grid */}
      <div className="grid gap-4 sm:grid-cols-3 text-xs">
        <div className="rounded-xl bg-card p-4 shadow-lark-sm">
          <span className="text-muted-foreground block">Gross MRR Churn Rate</span>
          <span className="text-lg font-bold text-foreground mt-1 block">{fmtPct(calc.grossChurnRate, 2)}</span>
          <span className="text-[11px] text-muted-foreground mt-1 block">Monthly revenue cancelled</span>
        </div>

        <div className="rounded-xl bg-card p-4 shadow-lark-sm">
          <span className="text-muted-foreground block">Net MRR Churn Rate</span>
          <span className={`text-lg font-bold mt-1 block ${calc.netChurnRate <= 0 ? "text-deep-green" : "text-deep-coral"}`}>
            {calc.netChurnRate <= 0 ? `-${fmtPct(Math.abs(calc.netChurnRate), 2)}` : fmtPct(calc.netChurnRate, 2)}
          </span>
          <span className="text-[11px] text-muted-foreground mt-1 block">Negative churn indicates net expansion</span>
        </div>

        <div className="rounded-xl bg-card p-4 shadow-lark-sm">
          <span className="text-muted-foreground block">Net Revenue Retention (NRR)</span>
          <span className={`text-lg font-bold mt-1 block ${calc.nrr >= 100 ? "text-deep-green" : "text-deep-orange"}`}>
            {fmtPct(calc.nrr, 1)}
          </span>
          <span className="text-[11px] text-muted-foreground mt-1 block">Best-in-class SaaS benchmark is &gt; 110%</span>
        </div>
      </div>
    </div>
  );
}
