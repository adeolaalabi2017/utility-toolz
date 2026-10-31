"use client";

import React, { useState, useMemo } from "react";
import { fmtPct, fmtNum } from "@/lib/format";
import { Flame, AlertTriangle, ShieldCheck, RefreshCw } from "lucide-react";

export function AdFatigueEstimator() {
  const [audienceSize, setAudienceSize] = useState(250000);
  const [dailyImpressions, setDailyImpressions] = useState(20000);
  const [campaignDays, setCampaignDays] = useState(21);
  const [repeatRatio, setRepeatRatio] = useState(65);

  const calc = useMemo(() => {
    const totalImpressions = dailyImpressions * campaignDays;
    // Estimated unique reach based on repeat view concentration
    const estUniques = Math.min(
      audienceSize,
      totalImpressions * (1 - (repeatRatio / 100) * 0.6)
    );
    const avgFrequency = estUniques > 0 ? totalImpressions / estUniques : 1;
    const saturationPct = audienceSize > 0 ? (estUniques / audienceSize) * 100 : 0;

    // Fatigue risk score
    let risk = "Low";
    let riskColor = "text-[#1f5f45]";
    let refreshDays = Math.round(campaignDays * 1.5);

    if (avgFrequency >= 4.5 || saturationPct >= 75) {
      risk = "Critical Fatigue";
      riskColor = "text-[#cf4f43]";
      refreshDays = 7;
    } else if (avgFrequency >= 2.8 || saturationPct >= 45) {
      risk = "Moderate Fatigue";
      riskColor = "text-[#a4502c]";
      refreshDays = 14;
    }

    return {
      totalImpressions,
      estUniques,
      avgFrequency,
      saturationPct,
      risk,
      riskColor,
      refreshDays,
    };
  }, [audienceSize, dailyImpressions, campaignDays, repeatRatio]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Inputs (7 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4 lg:col-span-7">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-[#a4502c]" /> Audience & Ad Delivery
          </span>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-foreground">Total Addressable Audience</label>
              <input
                type="number"
                value={audienceSize}
                onChange={(e) => setAudienceSize(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Target group size</span>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Daily Ad Impressions</label>
              <input
                type="number"
                value={dailyImpressions}
                onChange={(e) => setDailyImpressions(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Daily serving volume</span>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Campaign Duration (Days)</label>
              <input
                type="number"
                min="1"
                max="180"
                value={campaignDays}
                onChange={(e) => setCampaignDays(Number(e.target.value) || 1)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Algorithm Retargeting Weight: {repeatRatio}%</label>
              <input
                type="range"
                min="20"
                max="90"
                value={repeatRatio}
                onChange={(e) => setRepeatRatio(Number(e.target.value))}
                className="mt-3 w-full"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Higher = algorithm retargets same people</span>
            </div>
          </div>
        </div>

        {/* Results Banner (5 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm flex flex-col justify-between lg:col-span-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Fatigue & Saturation Diagnosis
          </span>

          <div className="my-4 space-y-4">
            <div className="rounded-lg bg-[#faf5ea] p-4 text-center">
              <span className="text-xs text-muted-foreground">Average Ad Frequency</span>
              <p className="tnum font-display text-display-lg text-[#1f5f45] mt-1 font-bold">
                {calc.avgFrequency.toFixed(1)}x
              </p>
              <span className={`text-xs font-semibold mt-1 block ${calc.riskColor}`}>
                {calc.risk} Level
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="text-[11px] text-muted-foreground block">Audience Saturation</span>
                <span className="tnum font-display text-display-sm text-[#3f346f] font-bold">
                  {fmtPct(calc.saturationPct, 1)}
                </span>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="text-[11px] text-muted-foreground block">Est. Unique Reach</span>
                <span className="tnum font-display text-display-sm text-foreground font-bold">
                  {fmtNum(calc.estUniques, 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground flex justify-between">
            <span>Creative fatigue action:</span>
            <strong className="text-foreground">Refresh creative every {calc.refreshDays} days</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
