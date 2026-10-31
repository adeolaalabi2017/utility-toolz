"use client";

import React, { useMemo } from "react";
import { fmtUSD, fmtPct, fmtNum } from "@/lib/format";
import { Target, Megaphone, DollarSign, ShieldAlert } from "lucide-react";
import { useToolState } from "@/hooks/use-tool-state";
import { ToolShareBar } from "@/components/site/tool-share-bar";

export function TargetCpaCalculator() {
  const [params, setParams, resetParams] = useToolState({
    aov: 120,
    cogs: 38,
    shippingAndFees: 12,
    targetMarginPct: 25,
  });
  const { aov, cogs, shippingAndFees, targetMarginPct } = params;

  const calc = useMemo(() => {
    const grossProfitBeforeAd = Math.max(0, aov - cogs - shippingAndFees);
    const breakEvenCpa = grossProfitBeforeAd;

    const targetUnitProfit = aov * (targetMarginPct / 100);
    const targetCpa = Math.max(0, grossProfitBeforeAd - targetUnitProfit);

    const breakEvenRoas = breakEvenCpa > 0 ? aov / breakEvenCpa : 0;
    const targetRoas = targetCpa > 0 ? aov / targetCpa : 0;

    return {
      grossProfitBeforeAd,
      breakEvenCpa,
      targetUnitProfit,
      targetCpa,
      breakEvenRoas,
      targetRoas,
    };
  }, [aov, cogs, shippingAndFees, targetMarginPct]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Inputs (7 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Target className="h-4 w-4 text-[#a4502c]" /> Product Unit Economics ($)
            </span>
            <ToolShareBar onReset={resetParams} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-foreground">Average Order Value (AOV / Price)</label>
              <input
                type="number"
                value={aov}
                onChange={(e) => setParams({ aov: Number(e.target.value) || 0 })}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Customer cart value</span>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Product COGS ($)</label>
              <input
                type="number"
                value={cogs}
                onChange={(e) => setParams({ cogs: Number(e.target.value) || 0 })}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold text-[#cf4f43] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Direct manufacturing / product cost</span>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Shipping & Processing Fees ($)</label>
              <input
                type="number"
                value={shippingAndFees}
                onChange={(e) => setParams({ shippingAndFees: Number(e.target.value) || 0 })}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold text-[#cf4f43] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Payment gateway + delivery fee</span>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Desired Net Profit Margin (%)</label>
              <input
                type="number"
                min="0"
                max="90"
                value={targetMarginPct}
                onChange={(e) => setParams({ targetMarginPct: Number(e.target.value) || 0 })}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold text-[#1f5f45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Target profit margin after ad spend</span>
            </div>
          </div>
        </div>

        {/* Results Banner (5 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm flex flex-col justify-between lg:col-span-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Bidding Targets
          </span>

          <div className="my-4 space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <span className="text-xs text-muted-foreground">Target Cost Per Acquisition (CPA)</span>
              <p className="tnum font-display text-display-lg text-[#1f5f45] mt-1 font-bold">
                {fmtUSD(calc.targetCpa, 2)}
              </p>
              <span className="text-xs text-muted-foreground mt-1 block">
                Target ROAS needed: <strong className="text-foreground">{calc.targetRoas.toFixed(2)}x</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="text-[11px] text-muted-foreground block">Break-Even CPA</span>
                <span className="tnum font-display text-display-sm text-[#cf4f43] font-bold">
                  {fmtUSD(calc.breakEvenCpa, 2)}
                </span>
                <span className="text-[10px] text-muted-foreground block mt-0.5">0% profit ceiling</span>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="text-[11px] text-muted-foreground block">Break-Even ROAS</span>
                <span className="tnum font-display text-display-sm text-foreground font-bold">
                  {calc.breakEvenRoas.toFixed(2)}x
                </span>
                <span className="text-[10px] text-muted-foreground block mt-0.5">Floor multiplier</span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground flex justify-between">
            <span>Media buying ceiling:</span>
            <strong className="text-foreground">Never bid above {fmtUSD(calc.breakEvenCpa, 2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
