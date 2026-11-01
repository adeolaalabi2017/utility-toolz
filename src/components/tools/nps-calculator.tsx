"use client";

import React, { useState, useMemo } from "react";
import { fmtPct, fmtNum } from "@/lib/format";
import { Smile, Frown, Meh, Award } from "lucide-react";

export function NpsCalculator() {
  const [promoters, setPromoters] = useState(140);
  const [passives, setPassives] = useState(70);
  const [detractors, setDetractors] = useState(30);

  const calc = useMemo(() => {
    const total = promoters + passives + detractors;
    if (total === 0) {
      return { total: 0, pPct: 0, passPct: 0, dPct: 0, nps: 0 };
    }

    const pPct = (promoters / total) * 100;
    const passPct = (passives / total) * 100;
    const dPct = (detractors / total) * 100;
    const nps = Math.round(pPct - dPct);

    return { total, pPct, passPct, dPct, nps };
  }, [promoters, passives, detractors]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Inputs (7 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4 lg:col-span-7">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Smile className="h-4 w-4 text-deep-orange" /> Survey Response Counts
          </span>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-foreground">
                <span className="flex items-center gap-1.5 text-deep-green">
                  <Smile className="h-4 w-4" /> Promoters (Scores 9–10)
                </span>
                <span className="text-muted-foreground">{calc.pPct.toFixed(1)}%</span>
              </div>
              <input
                aria-label="Promoters (scores 9–10)"
                type="number"
                value={promoters}
                onChange={(e) => setPromoters(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-medium text-foreground">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Meh className="h-4 w-4" /> Passives (Scores 7–8)
                </span>
                <span className="text-muted-foreground">{calc.passPct.toFixed(1)}%</span>
              </div>
              <input
                aria-label="Passives (scores 7–8)"
                type="number"
                value={passives}
                onChange={(e) => setPassives(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-medium text-foreground">
                <span className="flex items-center gap-1.5 text-deep-coral">
                  <Frown className="h-4 w-4" /> Detractors (Scores 0–6)
                </span>
                <span className="text-muted-foreground">{calc.dPct.toFixed(1)}%</span>
              </div>
              <input
                aria-label="Detractors (scores 0–6)"
                type="number"
                value={detractors}
                onChange={(e) => setDetractors(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Results Banner (5 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm flex flex-col justify-between lg:col-span-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Net Promoter Score
          </span>

          <div className="my-4 space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <span className="text-xs text-muted-foreground">Net Promoter Score (NPS)</span>
              <p className={`tnum font-display text-display-lg mt-1 font-bold ${
                calc.nps >= 50 ? "text-deep-green" : calc.nps >= 0 ? "text-deep-purple" : "text-deep-coral"
              }`}>
                {calc.nps > 0 ? `+${calc.nps}` : calc.nps}
              </p>
              <span className="text-xs text-muted-foreground mt-1 block">
                {calc.nps >= 70 ? "World-Class Loyalty" : calc.nps >= 50 ? "Excellent (+50 to +70)" : calc.nps >= 0 ? "Good (Positive Score)" : "High Detractor Risk"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="text-[11px] text-muted-foreground block">Total Responses</span>
                <span className="tnum font-display text-display-sm text-foreground font-bold">
                  {fmtNum(calc.total, 0)}
                </span>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="text-[11px] text-muted-foreground block">Promoter Ratio</span>
                <span className="tnum font-display text-display-sm text-deep-green font-bold">
                  {calc.pPct.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground flex justify-between">
            <span>Score formula:</span>
            <strong className="text-foreground">% Promoters − % Detractors</strong>
          </div>
        </div>
      </div>

      {/* Visual Composition Bar */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Respondent Audience Distribution
        </h4>
        <div className="h-4 w-full overflow-hidden rounded-full flex bg-muted">
          <div style={{ width: `${calc.pPct}%` }} className="bg-lf-green" title="Promoters" />
          <div style={{ width: `${calc.passPct}%` }} className="bg-muted-foreground/40" title="Passives" />
          <div style={{ width: `${calc.dPct}%` }} className="bg-lf-coral" title="Detractors" />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-lf-green" /> Promoters: {calc.pPct.toFixed(1)}%</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" /> Passives: {calc.passPct.toFixed(1)}%</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-lf-coral" /> Detractors: {calc.dPct.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}
