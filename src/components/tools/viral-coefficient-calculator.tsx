"use client";

import React, { useState, useMemo } from "react";
import { fmtPct, fmtNum } from "@/lib/format";
import { Share2, Zap, TrendingUp, Users } from "lucide-react";

export function ViralCoefficientCalculator() {
  const [initialCohort, setInitialCohort] = useState(1000);
  const [invitesPerUser, setInvitesPerUser] = useState(4);
  const [conversionPct, setConversionPct] = useState(20);
  const [cycleDays, setCycleDays] = useState(7);

  const calc = useMemo(() => {
    const c = conversionPct / 100;
    const k = invitesPerUser * c;
    const isExponential = k > 1;

    const multiplier = k < 1 ? 1 / (1 - k) : Infinity;
    const totalPotentialUsers = k < 1 ? initialCohort * multiplier : Infinity;

    // Simulate 5 viral cycles
    const cycles: Array<{ cycle: number; newUsers: number; totalUsers: number; day: number }> = [];
    let currentCohort = initialCohort;
    let total = initialCohort;

    cycles.push({ cycle: 0, newUsers: initialCohort, totalUsers: initialCohort, day: 0 });
    for (let i = 1; i <= 5; i++) {
      const newUsers = Math.round(currentCohort * k);
      total += newUsers;
      cycles.push({
        cycle: i,
        newUsers,
        totalUsers: total,
        day: i * cycleDays,
      });
      currentCohort = newUsers;
    }

    return {
      k,
      isExponential,
      multiplier,
      totalPotentialUsers,
      cycles,
    };
  }, [initialCohort, invitesPerUser, conversionPct, cycleDays]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Inputs (7 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4 lg:col-span-7">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Share2 className="h-4 w-4 text-deep-orange" /> Referral & Loop Parameters
          </span>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="viral-coefficient-calculator-1" className="text-xs font-medium text-foreground">Initial User Cohort</label>
              <input id="viral-coefficient-calculator-1"
                type="number"
                value={initialCohort}
                onChange={(e) => setInitialCohort(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Starting seed audience</span>
            </div>

            <div>
              <label htmlFor="viral-coefficient-calculator-2" className="text-xs font-medium text-foreground">Invites Sent per User</label>
              <input id="viral-coefficient-calculator-2"
                type="number"
                step="0.1"
                value={invitesPerUser}
                onChange={(e) => setInvitesPerUser(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Average referrals generated</span>
            </div>

            <div>
              <label htmlFor="viral-coefficient-calculator-3" className="text-xs font-medium text-foreground">Referral Conversion Rate (%)</label>
              <input id="viral-coefficient-calculator-3"
                type="number"
                min="0"
                max="100"
                value={conversionPct}
                onChange={(e) => setConversionPct(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">% of invites who sign up</span>
            </div>

            <div>
              <label htmlFor="viral-coefficient-calculator-4" className="text-xs font-medium text-foreground">Cycle Time (Days)</label>
              <input id="viral-coefficient-calculator-4"
                type="number"
                min="1"
                max="60"
                value={cycleDays}
                onChange={(e) => setCycleDays(Number(e.target.value) || 1)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Days between invite and signup</span>
            </div>
          </div>
        </div>

        {/* Results Banner (5 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm flex flex-col justify-between lg:col-span-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Viral K-Factor
          </span>

          <div className="my-4 space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <span className="text-xs text-muted-foreground">Viral Coefficient (K)</span>
              <p className={`tnum font-display text-display-lg mt-1 font-bold ${
                calc.k >= 1 ? "text-deep-green" : calc.k >= 0.5 ? "text-deep-orange" : "text-foreground"
              }`}>
                {calc.k.toFixed(2)}
              </p>
              <span className="text-xs text-muted-foreground mt-1 block">
                {calc.isExponential ? "True Viral Loop (Exponential Growth)" : "Viral Amplification Loop"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="text-[11px] text-muted-foreground block">Viral Multiplier</span>
                <span className="tnum font-display text-display-sm text-deep-purple font-bold">
                  {calc.isExponential ? "∞" : `${calc.multiplier.toFixed(2)}x`}
                </span>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="text-[11px] text-muted-foreground block">Expanded Cohort</span>
                <span className="tnum font-display text-display-sm text-foreground font-bold">
                  {calc.isExponential ? "Unlimited" : fmtNum(calc.totalPotentialUsers, 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground flex justify-between">
            <span>Growth loop status:</span>
            <strong className="text-foreground">
              {calc.k >= 1.0 ? "Self-sustaining viral loop" : `${calc.multiplier.toFixed(2)}x organic multiplier on paid ads`}
            </strong>
          </div>
        </div>
      </div>

      {/* Cycle Progression */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          5-Cycle Growth Projection
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground">
                <th className="pb-2 font-medium">Cycle</th>
                <th className="pb-2 font-medium">Elapsed Time</th>
                <th className="pb-2 font-medium">New Invited Users</th>
                <th className="pb-2 font-medium text-right">Cumulative Cohort</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {calc.cycles.map((row) => (
                <tr key={row.cycle} className="py-1.5">
                  <td className="py-2 font-semibold">Cycle #{row.cycle}</td>
                  <td className="py-2 text-muted-foreground">Day {row.day}</td>
                  <td className="py-2 font-mono text-deep-green">+{fmtNum(row.newUsers, 0)}</td>
                  <td className="py-2 font-mono font-bold text-right text-foreground">
                    {fmtNum(row.totalUsers, 0)}
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
