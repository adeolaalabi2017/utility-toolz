"use client";

import React, { useState, useMemo } from "react";
import { fmtUSD, fmtNum } from "@/lib/format";
import { Package, RefreshCw, Clock, AlertCircle } from "lucide-react";

export function InventoryTurnoverCalculator() {
  const [cogs, setCogs] = useState(360000);
  const [startInventory, setStartInventory] = useState(65000);
  const [endInventory, setEndInventory] = useState(55000);
  const [carryingCostPct, setCarryingCostPct] = useState(20);

  const calc = useMemo(() => {
    const avgInventory = (startInventory + endInventory) / 2;
    const turnover = avgInventory > 0 ? cogs / avgInventory : 0;
    const dsi = turnover > 0 ? 365 / turnover : 0;
    const annualHoldingCost = avgInventory * (carryingCostPct / 100);

    return {
      avgInventory,
      turnover,
      dsi,
      annualHoldingCost,
    };
  }, [cogs, startInventory, endInventory, carryingCostPct]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Inputs (7 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4 lg:col-span-7">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Package className="h-4 w-4 text-[#a4502c]" /> Annual Inventory Data
          </span>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-medium text-foreground">Annual Cost of Goods Sold (COGS) ($)</label>
              <input
                type="number"
                value={cogs}
                onChange={(e) => setCogs(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Total wholesale cost of goods sold over the year</span>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Beginning Inventory ($)</label>
              <input
                type="number"
                value={startInventory}
                onChange={(e) => setStartInventory(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Stock value at period start</span>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Ending Inventory ($)</label>
              <input
                type="number"
                value={endInventory}
                onChange={(e) => setEndInventory(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Stock value at period end</span>
            </div>

            <div className="col-span-2">
              <label className="text-xs font-medium text-foreground">Estimated Annual Carrying Cost Rate (%): {carryingCostPct}%</label>
              <input
                type="range"
                min="10"
                max="35"
                value={carryingCostPct}
                onChange={(e) => setCarryingCostPct(Number(e.target.value))}
                className="mt-2 w-full"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Warehouse, storage, insurance, spoilage, and capital interest</span>
            </div>
          </div>
        </div>

        {/* Results Banner (5 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm flex flex-col justify-between lg:col-span-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Inventory Velocity
          </span>

          <div className="my-4 space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <span className="text-xs text-muted-foreground">Inventory Turnover Ratio</span>
              <p className="tnum font-display text-display-lg text-[#1f5f45] mt-1 font-bold">
                {calc.turnover.toFixed(2)}x
              </p>
              <span className="text-xs text-muted-foreground mt-1 block">
                Inventory sells & replaces {calc.turnover.toFixed(1)} times per year
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="text-[11px] text-muted-foreground block">Days to Sell (DSI)</span>
                <span className="tnum font-display text-display-sm text-[#3f346f] font-bold">
                  {Math.round(calc.dsi)} days
                </span>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="text-[11px] text-muted-foreground block">Holding Cost / Year</span>
                <span className="tnum font-display text-display-sm text-[#cf4f43] font-bold">
                  {fmtUSD(calc.annualHoldingCost, 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground flex justify-between">
            <span>Average inventory held:</span>
            <strong className="text-foreground">{fmtUSD(calc.avgInventory, 0)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
