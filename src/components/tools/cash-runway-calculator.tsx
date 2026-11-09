"use client";

import { currencySymbol } from "@/lib/format";
import { Cur } from "@/components/site/currency";
import React, { useState, useMemo } from "react";
import { fmtUSD, fmtPct, fmtNum } from "@/lib/format";
import { Landmark, AlertOctagon, TrendingDown, Calendar } from "lucide-react";
import { ExportToolbar } from "@/components/site/export-toolbar";

export function CashRunwayCalculator() {
  const [cashBalance, setCashBalance] = useState(250000);
  const [grossBurn, setGrossBurn] = useState(35000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(15000);
  const [revGrowthPct, setRevGrowthPct] = useState(5);
  const [expenseGrowthPct, setExpenseGrowthPct] = useState(2);

  const calc = useMemo(() => {
    const initialNetBurn = Math.max(0, grossBurn - monthlyRevenue);

    // Simple static runway
    const staticRunwayMonths = initialNetBurn > 0 ? cashBalance / initialNetBurn : 999;

    // Dynamic month-by-month simulation (up to 60 months)
    let currentCash = cashBalance;
    let curRev = monthlyRevenue;
    let curExp = grossBurn;
    let months = 0;
    const schedule: Array<{
      month: number;
      revenue: number;
      expenses: number;
      netBurn: number;
      cashEnding: number;
    }> = [];

    while (currentCash > 0 && months < 60) {
      months++;
      const net = curExp - curRev;
      currentCash -= net;

      if (months <= 12 || currentCash <= 0 || months % 3 === 0) {
        schedule.push({
          month: months,
          revenue: curRev,
          expenses: curExp,
          netBurn: net,
          cashEnding: Math.max(0, currentCash),
        });
      }

      curRev *= 1 + revGrowthPct / 100;
      curExp *= 1 + expenseGrowthPct / 100;
      if (currentCash <= 0) break;
    }

    const dynamicRunwayMonths = months;
    const zeroCashDate = new Date();
    zeroCashDate.setMonth(zeroCashDate.getMonth() + dynamicRunwayMonths);

    return {
      initialNetBurn,
      staticRunwayMonths,
      dynamicRunwayMonths,
      zeroCashDate: zeroCashDate.toLocaleDateString(undefined, { month: "short", year: "numeric" }),
      schedule: schedule.slice(0, 10),
    };
  }, [cashBalance, grossBurn, monthlyRevenue, revGrowthPct, expenseGrowthPct]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Inputs (7 cols) */}
        <div className="rounded-xl bg-card p-5 shadow-lark-sm space-y-4 lg:col-span-7">
          <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
            <Landmark className="h-4 w-4 text-deep-orange" /> Cash & burn parameters
          </span>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label htmlFor="cash-runway-calculator-1" className="text-xs font-medium text-foreground">Current Cash Reserves (<Cur />)</label>
              <input id="cash-runway-calculator-1"
                type="number"
                value={cashBalance}
                onChange={(e) => setCashBalance(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label htmlFor="cash-runway-calculator-2" className="text-xs font-medium text-foreground">Monthly Gross Burn (<Cur />)</label>
              <input id="cash-runway-calculator-2"
                type="number"
                value={grossBurn}
                onChange={(e) => setGrossBurn(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold text-deep-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Total monthly expenses</span>
            </div>

            <div>
              <label htmlFor="cash-runway-calculator-3" className="text-xs font-medium text-foreground">Monthly Inflows / Revenue (<Cur />)</label>
              <input id="cash-runway-calculator-3"
                type="number"
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold text-deep-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Cash receipts / month</span>
            </div>

            <div>
              <label htmlFor="cash-runway-calculator-4" className="text-xs font-medium text-foreground">Monthly Revenue Growth (%)</label>
              <input id="cash-runway-calculator-4"
                type="number"
                min="0"
                max="50"
                value={revGrowthPct}
                onChange={(e) => setRevGrowthPct(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label htmlFor="cash-runway-calculator-5" className="text-xs font-medium text-foreground">Monthly Expense Growth (%)</label>
              <input id="cash-runway-calculator-5"
                type="number"
                min="0"
                max="50"
                value={expenseGrowthPct}
                onChange={(e) => setExpenseGrowthPct(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Results Banner (5 cols) */}
        <div className="rounded-xl bg-card p-5 shadow-lark-sm flex flex-col justify-between lg:col-span-5">
          <span className="text-sm font-semibold text-muted-foreground">
            Estimated runway
          </span>

          <div className="my-4 space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <span className="text-xs text-muted-foreground">Cash Depletion Horizon</span>
              <p className={`tnum font-display text-display-md mt-1 font-bold ${
                calc.dynamicRunwayMonths >= 18 ? "text-deep-green" : calc.dynamicRunwayMonths >= 6 ? "text-deep-orange" : "text-deep-coral"
              }`}>
                {calc.dynamicRunwayMonths >= 60 ? "60+ Months" : `${calc.dynamicRunwayMonths.toFixed(1)} Months`}
              </p>
              <span className="text-xs text-muted-foreground mt-1 block">
                Estimated Zero-Cash Date: <strong className="text-foreground">{calc.zeroCashDate}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg bg-muted/50 p-3">
                <span className="text-[11px] text-muted-foreground block">Net Monthly Burn</span>
                <span className="tnum font-display text-display-sm text-deep-coral font-bold">
                  {fmtUSD(calc.initialNetBurn, 0)}
                </span>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <span className="text-[11px] text-muted-foreground block">Static Runway</span>
                <span className="tnum font-display text-display-sm text-foreground font-bold">
                  {calc.staticRunwayMonths.toFixed(1)} mo
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground flex justify-between">
            <span>Fundraising recommendation:</span>
            <strong className="text-foreground">
              {calc.dynamicRunwayMonths < 6 ? "Raise capital immediately" : calc.dynamicRunwayMonths < 12 ? "Begin investor prep" : "Comfortable capital cushion"}
            </strong>
          </div>
        </div>
      </div>

      {/* Projection Table */}
      <div className="rounded-xl bg-card p-5 shadow-lark-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Projected monthly cash trajectory
          </h4>
          <ExportToolbar
            filename="cash-runway-trajectory"
            columns={[
              { header: "Month", key: (r) => `Month +${r.month}` },
              { header: `Revenue (${currencySymbol()})`, key: (r) => Math.round(r.revenue) },
              { header: `Expenses (${currencySymbol()})`, key: (r) => Math.round(r.expenses) },
              { header: `Net Burn (${currencySymbol()})`, key: (r) => Math.round(r.netBurn) },
              { header: `Ending Cash (${currencySymbol()})`, key: (r) => Math.round(r.cashEnding) },
            ]}
            rows={calc.schedule}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground">
                <th className="pb-2 font-medium">Month</th>
                <th className="pb-2 font-medium">Revenue</th>
                <th className="pb-2 font-medium">Expenses</th>
                <th className="pb-2 font-medium">Net Burn</th>
                <th className="pb-2 font-medium text-right">Ending Cash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {calc.schedule.map((row) => (
                <tr key={row.month} className="py-1.5">
                  <td className="py-2 font-mono font-medium">Month +{row.month}</td>
                  <td className="py-2 text-deep-green">{fmtUSD(row.revenue, 0)}</td>
                  <td className="py-2 text-deep-coral">{fmtUSD(row.expenses, 0)}</td>
                  <td className="py-2 font-medium">{fmtUSD(row.netBurn, 0)}</td>
                  <td className="py-2 font-mono font-bold text-right text-foreground">
                    {fmtUSD(row.cashEnding, 0)}
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
