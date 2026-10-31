"use client";

import React, { useMemo } from "react";
import { fmtUSD, fmtPct, fmtNum } from "@/lib/format";
import { DollarSign, Layers, ArrowDownRight, CheckCircle2 } from "lucide-react";
import { useToolState } from "@/hooks/use-tool-state";
import { ToolShareBar } from "@/components/site/tool-share-bar";

export function UnitEconomicsCalculator() {
  const [params, setParams, resetParams] = useToolState({
    price: 85,
    cogs: 24,
    shipping: 7.5,
    packaging: 2.5,
    gatewayPct: 2.9,
    gatewayFixed: 0.3,
    cac: 22,
    returnPct: 3,
  });
  const { price, cogs, shipping, packaging, gatewayPct, gatewayFixed, cac, returnPct } = params;

  const calc = useMemo(() => {
    const paymentFee = price * (gatewayPct / 100) + gatewayFixed;
    const returnReserve = price * (returnPct / 100);
    const variableCostsBeforeAd = cogs + shipping + packaging + paymentFee + returnReserve;

    const cm1 = price - variableCostsBeforeAd;
    const cm1Pct = price > 0 ? (cm1 / price) * 100 : 0;

    const netUnitProfit = cm1 - cac;
    const netMarginPct = price > 0 ? (netUnitProfit / price) * 100 : 0;

    return {
      paymentFee,
      returnReserve,
      variableCostsBeforeAd,
      cm1,
      cm1Pct,
      netUnitProfit,
      netMarginPct,
    };
  }, [price, cogs, shipping, packaging, gatewayPct, gatewayFixed, cac, returnPct]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Inputs (7 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-[#a4502c]" /> Per-Unit Cost Breakdown ($)
            </span>
            <ToolShareBar onReset={resetParams} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-foreground">Selling Price per Order ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setParams({ price: Number(e.target.value) || 0 })}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Direct Product COGS ($)</label>
              <input
                type="number"
                value={cogs}
                onChange={(e) => setParams({ cogs: Number(e.target.value) || 0 })}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold text-[#cf4f43] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Packaging & Inbound ($)</label>
              <input
                type="number"
                value={packaging}
                onChange={(e) => setParams({ packaging: Number(e.target.value) || 0 })}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold text-[#cf4f43] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Outbound Fulfillment / Shipping ($)</label>
              <input
                type="number"
                value={shipping}
                onChange={(e) => setParams({ shipping: Number(e.target.value) || 0 })}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold text-[#cf4f43] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Customer Acquisition Cost (CAC) ($)</label>
              <input
                type="number"
                value={cac}
                onChange={(e) => setParams({ cac: Number(e.target.value) || 0 })}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold text-[#6b5faf] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Return / Loss Rate (%)</label>
              <input
                type="number"
                value={returnPct}
                onChange={(e) => setParams({ returnPct: Number(e.target.value) || 0 })}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Results Banner (5 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm flex flex-col justify-between lg:col-span-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Contribution Margin
          </span>

          <div className="my-4 space-y-4">
            <div className="rounded-lg bg-[#faf5ea] p-4 text-center">
              <span className="text-xs text-muted-foreground">Net Unit Profit (After CAC)</span>
              <p className={`tnum font-display text-display-lg mt-1 font-bold ${
                calc.netUnitProfit >= 0 ? "text-[#1f5f45]" : "text-[#cf4f43]"
              }`}>
                {fmtUSD(calc.netUnitProfit, 2)}
              </p>
              <span className="text-xs text-muted-foreground mt-1 block">
                Net Margin: <strong className="text-foreground">{fmtPct(calc.netMarginPct, 1)}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="text-[11px] text-muted-foreground block">CM1 (Before Ads)</span>
                <span className="tnum font-display text-display-sm text-[#1f5f45] font-bold">
                  {fmtUSD(calc.cm1, 2)}
                </span>
                <span className="text-[10px] text-muted-foreground block mt-0.5">{fmtPct(calc.cm1Pct, 1)} margin</span>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="text-[11px] text-muted-foreground block">Payment Processing</span>
                <span className="tnum font-display text-display-sm text-foreground font-bold">
                  {fmtUSD(calc.paymentFee, 2)}
                </span>
                <span className="text-[10px] text-muted-foreground block mt-0.5">{gatewayPct}% + {fmtUSD(gatewayFixed, 2)}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground flex justify-between">
            <span>Unit viability check:</span>
            <strong className="text-foreground">
              {calc.netUnitProfit > 0 ? "Profitable first order" : "Acquisition cost exceeds gross margin"}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
