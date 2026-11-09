"use client";

import { ResultValue } from "./result-value";
import { Cur } from "@/components/site/currency";
import React, { useState, useMemo } from "react";
import { fmtUSD, fmtPct, fmtNum } from "@/lib/format";
import { Calculator, Calendar, FileSpreadsheet } from "lucide-react";

export function DepreciationCalculator() {
  const [cost, setCost] = useState(25000);
  const [salvage, setSalvage] = useState(2500);
  const [usefulLife, setUsefulLife] = useState(5);
  const [method, setMethod] = useState<"straight" | "ddb" | "150db">("straight");

  const calc = useMemo(() => {
    const depreciableBase = Math.max(0, cost - salvage);
    const life = Math.max(1, usefulLife);

    interface YearRow {
      year: number;
      startValue: number;
      expense: number;
      accumulated: number;
      endValue: number;
    }

    const schedule: YearRow[] = [];
    let currentBookValue = cost;
    let accumulatedDepr = 0;

    if (method === "straight") {
      const annualExp = depreciableBase / life;
      for (let y = 1; y <= life; y++) {
        const startVal = currentBookValue;
        const exp = Math.min(annualExp, Math.max(0, currentBookValue - salvage));
        accumulatedDepr += exp;
        currentBookValue -= exp;
        schedule.push({
          year: y,
          startValue: startVal,
          expense: exp,
          accumulated: accumulatedDepr,
          endValue: currentBookValue,
        });
      }
    } else {
      const multiplier = method === "ddb" ? 2.0 : 1.5;
      const rate = multiplier / life;

      for (let y = 1; y <= life; y++) {
        const startVal = currentBookValue;
        let exp = startVal * rate;

        // Ensure does not dip below salvage
        if (currentBookValue - exp < salvage) {
          exp = Math.max(0, currentBookValue - salvage);
        }

        accumulatedDepr += exp;
        currentBookValue -= exp;
        schedule.push({
          year: y,
          startValue: startVal,
          expense: exp,
          accumulated: accumulatedDepr,
          endValue: currentBookValue,
        });
      }
    }

    const year1Expense = schedule[0]?.expense || 0;

    return {
      depreciableBase,
      year1Expense,
      totalAccumulated: accumulatedDepr,
      endingBookValue: currentBookValue,
      schedule,
    };
  }, [cost, salvage, usefulLife, method]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Inputs (7 cols) */}
        <div className="rounded-xl bg-card p-5 shadow-lark-sm space-y-4 lg:col-span-7">
          <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
            <Calculator className="h-4 w-4 text-deep-orange" /> Asset cost & depreciation method
          </span>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="depreciation-calculator-1" className="text-xs font-medium text-foreground">Asset Purchase Cost (<Cur />)</label>
              <input id="depreciation-calculator-1"
                type="number"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Original capitalized value</span>
            </div>

            <div>
              <label htmlFor="depreciation-calculator-2" className="text-xs font-medium text-foreground">Salvage / Scrap Value (<Cur />)</label>
              <input id="depreciation-calculator-2"
                type="number"
                value={salvage}
                onChange={(e) => setSalvage(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Estimated value at end of life</span>
            </div>

            <div>
              <label htmlFor="depreciation-calculator-3" className="text-xs font-medium text-foreground">Useful Life (Years)</label>
              <input id="depreciation-calculator-3"
                type="number"
                min="1"
                max="50"
                value={usefulLife}
                onChange={(e) => setUsefulLife(Math.min(50, Math.max(1, Number(e.target.value) || 1)))}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Standard: 3 (computers), 5 (vehicles), 7 (equipment)</span>
            </div>

            <div>
              <label htmlFor="depreciation-calculator-4" className="text-xs font-medium text-foreground">Depreciation Method</label>
              <select id="depreciation-calculator-4"
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="straight">Straight-Line (Equal annual expense)</option>
                <option value="ddb">Double Declining Balance (200% accelerated)</option>
                <option value="150db">150% Declining Balance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Banner (5 cols) */}
        <div className="rounded-xl bg-card p-5 shadow-lark-sm flex flex-col justify-between lg:col-span-5">
          <span className="text-sm font-semibold text-muted-foreground">
            Depreciation summary
          </span>

          <div className="my-4 space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <span className="text-xs text-muted-foreground">Year 1 Write-Off Expense</span>
              <ResultValue compact live className="mt-1">
                {fmtUSD(calc.year1Expense, 0)}
              </ResultValue>
              <span className="text-xs text-muted-foreground mt-1 block">
                Total Depreciable Base: <strong className="text-foreground">{fmtUSD(calc.depreciableBase, 0)}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg bg-muted/50 p-3">
                <span className="text-[11px] text-muted-foreground block">Total Write-Off</span>
                <span className="tnum font-display text-display-sm text-foreground font-bold">
                  {fmtUSD(calc.totalAccumulated, 0)}
                </span>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <span className="text-[11px] text-muted-foreground block">Residual Book Value</span>
                <span className="tnum font-display text-display-sm text-foreground font-bold">
                  {fmtUSD(calc.endingBookValue, 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground flex justify-between">
            <span>Accounting basis:</span>
            <strong className="text-foreground">
              {method === "straight" ? "Uniform straight-line" : "Accelerated depreciation schedule"}
            </strong>
          </div>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="rounded-xl bg-card p-5 shadow-lark-sm space-y-3">
        <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
          <FileSpreadsheet className="h-4 w-4 text-muted-foreground" /> Annual depreciation schedule
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground">
                <th className="pb-2 font-medium">Year</th>
                <th className="pb-2 font-medium">Beginning Book Value</th>
                <th className="pb-2 font-medium">Depreciation Expense</th>
                <th className="pb-2 font-medium">Accumulated Depreciation</th>
                <th className="pb-2 font-medium text-right">Ending Book Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {calc.schedule.map((r) => (
                <tr key={r.year} className="py-1.5">
                  <td className="py-2 font-semibold">Year {r.year}</td>
                  <td className="py-2 font-mono">{fmtUSD(r.startValue, 0)}</td>
                  <td className="py-2 font-mono font-bold text-deep-coral">−{fmtUSD(r.expense, 0)}</td>
                  <td className="py-2 font-mono text-muted-foreground">{fmtUSD(r.accumulated, 0)}</td>
                  <td className="py-2 font-mono font-semibold text-right text-foreground">
                    {fmtUSD(r.endValue, 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
