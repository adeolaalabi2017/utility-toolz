"use client";

import { Cur } from "@/components/site/currency";
import React, { useState, useMemo } from "react";
import { fmtUSD, fmtPct, fmtNum } from "@/lib/format";
import { DollarSign, Briefcase, Calendar, ShieldCheck } from "lucide-react";

export function FreelanceRateCalculator() {
  const [targetIncome, setTargetIncome] = useState(90000);
  const [expenses, setExpenses] = useState(12000);
  const [taxRate, setTaxRate] = useState(25);
  const [weeksOff, setWeeksOff] = useState(4);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [billablePct, setBillablePct] = useState(60);

  const calc = useMemo(() => {
    // Gross revenue needed to cover income after taxes + expenses
    // Net Income = (Gross Revenue - Expenses) * (1 - TaxRate)
    // Gross Revenue = (Net Income / (1 - TaxRate)) + Expenses
    const effectiveTaxFactor = Math.max(0.01, 1 - taxRate / 100);
    const requiredGrossIncome = targetIncome / effectiveTaxFactor;
    const totalGrossRevenue = requiredGrossIncome + expenses;
    const taxOwed = requiredGrossIncome - targetIncome;

    const workingWeeks = Math.max(1, 52 - weeksOff);
    const totalYearHours = workingWeeks * hoursPerWeek;
    const billableHours = totalYearHours * (billablePct / 100);

    const hourlyRate = billableHours > 0 ? totalGrossRevenue / billableHours : 0;
    const dayRate = hourlyRate * (hoursPerWeek / 5);
    const monthlyTarget = totalGrossRevenue / 12;

    return {
      totalGrossRevenue,
      taxOwed,
      workingWeeks,
      totalYearHours,
      billableHours,
      hourlyRate,
      dayRate,
      monthlyTarget,
    };
  }, [targetIncome, expenses, taxRate, weeksOff, hoursPerWeek, billablePct]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Inputs (7 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4 lg:col-span-7">
          <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-deep-orange" /> Income, tax & working capacity
          </span>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="freelance-rate-calculator-1" className="text-xs font-medium text-foreground">Target Take-Home Net Income (<Cur />)</label>
              <input id="freelance-rate-calculator-1"
                type="number"
                value={targetIncome}
                onChange={(e) => setTargetIncome(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">What you want to take home</span>
            </div>

            <div>
              <label htmlFor="freelance-rate-calculator-2" className="text-xs font-medium text-foreground">Annual Business Overhead (<Cur />)</label>
              <input id="freelance-rate-calculator-2"
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Software, gear, accounting</span>
            </div>

            <div>
              <label htmlFor="freelance-rate-calculator-3" className="text-xs font-medium text-foreground">Estimated Tax Rate (%)</label>
              <input id="freelance-rate-calculator-3"
                type="number"
                min="0"
                max="60"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Income & self-employment tax</span>
            </div>

            <div>
              <label htmlFor="freelance-rate-calculator-4" className="text-xs font-medium text-foreground">Weeks Off per Year</label>
              <input id="freelance-rate-calculator-4"
                type="number"
                min="0"
                max="20"
                value={weeksOff}
                onChange={(e) => setWeeksOff(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Vacation, holidays, sick leave</span>
            </div>

            <div>
              <label htmlFor="freelance-rate-calculator-5" className="text-xs font-medium text-foreground">Work Hours / Week</label>
              <input id="freelance-rate-calculator-5"
                type="number"
                min="10"
                max="80"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Standard total weekly hours</span>
            </div>

            <div>
              <label htmlFor="freelance-rate-calculator-6" className="text-xs font-medium text-foreground">Billable Ratio (%): {billablePct}%</label>
              <input id="freelance-rate-calculator-6"
                type="range"
                min="30"
                max="90"
                value={billablePct}
                onChange={(e) => setBillablePct(Number(e.target.value))}
                className="mt-3 w-full"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Rest is admin, sales & pitches</span>
            </div>
          </div>
        </div>

        {/* Primary Rate Results (5 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm flex flex-col justify-between lg:col-span-5">
          <span className="text-sm font-semibold text-muted-foreground">
            Target billing rates
          </span>

          <div className="my-4 space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <span className="text-xs text-muted-foreground">Recommended Hourly Rate</span>
              <p className="tnum font-display text-display-lg text-deep-green mt-1 font-bold">
                {fmtUSD(calc.hourlyRate, 0)}
                <span className="text-base text-foreground font-normal"> / hr</span>
              </p>
              <span className="text-[11px] text-muted-foreground mt-1 block">
                Based on {Math.round(calc.billableHours)} billable hours/year
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg bg-muted/50 p-3">
                <span className="text-[11px] text-muted-foreground block">Day Rate</span>
                <span className="tnum font-display text-display-sm text-foreground font-bold">
                  {fmtUSD(calc.dayRate, 0)}
                </span>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <span className="text-[11px] text-muted-foreground block">Monthly Invoice Target</span>
                <span className="tnum font-display text-display-sm text-deep-purple font-bold">
                  {fmtUSD(calc.monthlyTarget, 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground flex justify-between">
            <span>Annual Gross Revenue:</span>
            <strong className="text-foreground">{fmtUSD(calc.totalGrossRevenue, 0)}</strong>
          </div>
        </div>
      </div>

      {/* Revenue Waterfall Breakdown */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm">
        <h4 className="text-sm font-semibold text-muted-foreground pb-3">
          Annual revenue allocation breakdown
        </h4>
        <div className="grid gap-3 sm:grid-cols-4 text-xs">
          <div className="rounded-lg bg-muted/50 p-3">
            <span className="text-muted-foreground block">Target Net Take-Home</span>
            <span className="text-sm font-bold text-deep-green mt-1 block">{fmtUSD(targetIncome, 0)}</span>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <span className="text-muted-foreground block">Estimated Tax Reserve</span>
            <span className="text-sm font-bold text-deep-orange mt-1 block">{fmtUSD(calc.taxOwed, 0)}</span>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <span className="text-muted-foreground block">Business Overhead</span>
            <span className="text-sm font-bold text-foreground mt-1 block">{fmtUSD(expenses, 0)}</span>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <span className="text-muted-foreground block">Weeks Worked / Year</span>
            <span className="text-sm font-bold text-foreground mt-1 block">{calc.workingWeeks} weeks ({52 - calc.workingWeeks} off)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
