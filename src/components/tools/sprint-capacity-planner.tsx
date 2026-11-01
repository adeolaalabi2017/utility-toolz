"use client";

import React, { useState, useMemo } from "react";
import { fmtNum, fmtPct } from "@/lib/format";
import { Users, Calendar, CheckSquare, Sparkles } from "lucide-react";
import { ExportToolbar } from "@/components/site/export-toolbar";

export function SprintCapacityPlanner() {
  const [teamSize, setTeamSize] = useState(5);
  const [sprintDays, setSprintDays] = useState(10);
  const [dailyHours, setDailyHours] = useState(8);
  const [totalPtoDays, setTotalPtoDays] = useState(2);
  const [ceremonyOverheadPct, setCeremonyOverheadPct] = useState(20);
  const [focusFactorPct, setFocusFactorPct] = useState(75);
  const [hoursPerStoryPoint, setHoursPerStoryPoint] = useState(6);

  const calc = useMemo(() => {
    const totalPotentialPersonDays = teamSize * sprintDays - totalPtoDays;
    const grossHours = Math.max(0, totalPotentialPersonDays * dailyHours);

    // After agile ceremonies (planning, standup, review, retro, refinement)
    const afterCeremoniesHours = grossHours * (1 - ceremonyOverheadPct / 100);

    // After unplanned context-switching / focus factor
    const productiveHours = afterCeremoniesHours * (focusFactorPct / 100);

    const totalStoryPoints = hoursPerStoryPoint > 0 ? productiveHours / hoursPerStoryPoint : 0;
    const safeCommitmentPoints = totalStoryPoints * 0.85;

    return {
      totalPotentialPersonDays,
      grossHours,
      afterCeremoniesHours,
      productiveHours,
      totalStoryPoints: Math.round(totalStoryPoints),
      safeCommitmentPoints: Math.round(safeCommitmentPoints),
    };
  }, [teamSize, sprintDays, dailyHours, totalPtoDays, ceremonyOverheadPct, focusFactorPct, hoursPerStoryPoint]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Inputs (7 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4 lg:col-span-7">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Users className="h-4 w-4 text-deep-orange" /> Team & Sprint Availability
          </span>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="sprint-capacity-planner-1" className="text-xs font-medium text-foreground">Team Size (Engineers)</label>
              <input id="sprint-capacity-planner-1"
                type="number"
                min="1"
                max="50"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value) || 1)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label htmlFor="sprint-capacity-planner-2" className="text-xs font-medium text-foreground">Sprint Length (Working Days)</label>
              <input id="sprint-capacity-planner-2"
                type="number"
                min="1"
                max="30"
                value={sprintDays}
                onChange={(e) => setSprintDays(Number(e.target.value) || 1)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Standard: 10 days (2 weeks)</span>
            </div>

            <div>
              <label htmlFor="sprint-capacity-planner-3" className="text-xs font-medium text-foreground">Total Team PTO / Holidays (Days)</label>
              <input id="sprint-capacity-planner-3"
                type="number"
                min="0"
                max="50"
                value={totalPtoDays}
                onChange={(e) => setTotalPtoDays(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold text-deep-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Cumulative vacation across team</span>
            </div>

            <div>
              <label htmlFor="sprint-capacity-planner-4" className="text-xs font-medium text-foreground">Hours per Story Point</label>
              <input id="sprint-capacity-planner-4"
                type="number"
                min="1"
                max="24"
                value={hoursPerStoryPoint}
                onChange={(e) => setHoursPerStoryPoint(Number(e.target.value) || 1)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Team point conversion benchmark</span>
            </div>

            <div>
              <label htmlFor="sprint-capacity-planner-5" className="text-xs font-medium text-foreground">Ceremony Overhead: {ceremonyOverheadPct}%</label>
              <input id="sprint-capacity-planner-5"
                type="range"
                min="10"
                max="40"
                value={ceremonyOverheadPct}
                onChange={(e) => setCeremonyOverheadPct(Number(e.target.value))}
                className="mt-3 w-full"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Standups, planning, retro, reviews</span>
            </div>

            <div>
              <label htmlFor="sprint-capacity-planner-6" className="text-xs font-medium text-foreground">Focus Factor: {focusFactorPct}%</label>
              <input id="sprint-capacity-planner-6"
                type="range"
                min="50"
                max="95"
                value={focusFactorPct}
                onChange={(e) => setFocusFactorPct(Number(e.target.value))}
                className="mt-3 w-full"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Productive coding vs context switching</span>
            </div>
          </div>
        </div>

        {/* Results Banner (5 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm flex flex-col justify-between lg:col-span-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Sprint Commitment Target
            </span>
            <ExportToolbar
              filename="sprint-capacity-plan"
              columns={[
                { header: "Sprint Planning Metric", key: "metric" },
                { header: "Value", key: "value" },
              ]}
              rows={[
                { metric: "Team Size", value: `${teamSize} engineers` },
                { metric: "Sprint Duration", value: `${sprintDays} working days` },
                { metric: "Gross Person Hours", value: `${calc.grossHours} hrs` },
                { metric: "PTO / Holidays", value: `${totalPtoDays} days` },
                { metric: "Ceremony Overhead", value: `${ceremonyOverheadPct}%` },
                { metric: "Focus Factor", value: `${focusFactorPct}%` },
                { metric: "Net Dev Hours", value: `${Math.round(calc.productiveHours)} hrs` },
                { metric: "Hours per Story Point", value: `${hoursPerStoryPoint} hrs/pt` },
                { metric: "Max Point Capacity", value: `${calc.totalStoryPoints} pts` },
                { metric: "Safe Commitment (85%)", value: `${calc.safeCommitmentPoints} pts` },
              ]}
              enableCsv={true}
              enableMarkdown={true}
              enablePrint={true}
            />
          </div>

          <div className="my-4 space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <span className="text-xs text-muted-foreground">Recommended Commitment</span>
              <p className="tnum font-display text-display-lg text-deep-green mt-1 font-bold">
                {calc.safeCommitmentPoints}
                <span className="text-sm font-normal text-muted-foreground"> Story Points</span>
              </p>
              <span className="text-xs text-muted-foreground mt-1 block">
                With 15% buffer against rollover
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="text-[11px] text-muted-foreground block">Max Capacity</span>
                <span className="tnum font-display text-display-sm text-foreground font-bold">
                  {calc.totalStoryPoints} pts
                </span>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="text-[11px] text-muted-foreground block">Net Dev Hours</span>
                <span className="tnum font-display text-display-sm text-deep-purple font-bold">
                  {Math.round(calc.productiveHours)} hrs
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground flex justify-between">
            <span>Gross available time:</span>
            <strong className="text-foreground">{calc.grossHours} total person-hours</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
