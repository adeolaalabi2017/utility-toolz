"use client";

import React, { useState, useMemo } from "react";
import { fmtUSD, fmtNum } from "@/lib/format";
import { Clock, DollarSign, Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportToolbar } from "@/components/site/export-toolbar";

interface DayRow {
  day: string;
  start: string;
  end: string;
  breakMins: number;
}

const DEFAULT_DAYS: DayRow[] = [
  { day: "Monday", start: "09:00", end: "17:30", breakMins: 45 },
  { day: "Tuesday", start: "09:00", end: "17:30", breakMins: 45 },
  { day: "Wednesday", start: "09:00", end: "17:30", breakMins: 45 },
  { day: "Thursday", start: "09:00", end: "17:30", breakMins: 45 },
  { day: "Friday", start: "09:00", end: "17:00", breakMins: 45 },
  { day: "Saturday", start: "", end: "", breakMins: 0 },
  { day: "Sunday", start: "", end: "", breakMins: 0 },
];

function calcDayHours(start: string, end: string, breakMins: number): number {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  const startTotal = sh * 60 + sm;
  const endTotal = eh * 60 + em;

  if (endTotal <= startTotal) return 0;
  const diffMins = endTotal - startTotal - breakMins;
  return Math.max(0, diffMins / 60);
}

export function TimesheetCalculator() {
  const [days, setDays] = useState<DayRow[]>(DEFAULT_DAYS);
  const [hourlyRate, setHourlyRate] = useState(45);
  const [otMultiplier, setOtMultiplier] = useState(1.5);
  const [otThreshold, setOtThreshold] = useState(40);

  const updateDay = (idx: number, patch: Partial<DayRow>) => {
    setDays((prev) => prev.map((d, i) => (i === idx ? { ...d, ...patch } : d)));
  };

  const calc = useMemo(() => {
    const dailyHours = days.map((d) => calcDayHours(d.start, d.end, d.breakMins));
    const totalHours = dailyHours.reduce((a, b) => a + b, 0);

    const regularHours = Math.min(otThreshold, totalHours);
    const overtimeHours = Math.max(0, totalHours - otThreshold);

    const regularPay = regularHours * hourlyRate;
    const overtimePay = overtimeHours * hourlyRate * otMultiplier;
    const totalPay = regularPay + overtimePay;

    return {
      dailyHours,
      totalHours,
      regularHours,
      overtimeHours,
      regularPay,
      overtimePay,
      totalPay,
    };
  }, [days, hourlyRate, otMultiplier, otThreshold]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Daily Schedule (8 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-[#a4502c]" /> Weekly Working Hours
            </span>
            <div className="flex items-center gap-2">
              <ExportToolbar
                filename="weekly-timesheet"
                columns={[
                  { header: "Day", key: "day" },
                  { header: "Start", key: (r) => r.start || "Off" },
                  { header: "End", key: (r) => r.end || "Off" },
                  { header: "Break (mins)", key: "breakMins" },
                  { header: "Hours", key: (r) => r.hours.toFixed(2) },
                ]}
                rows={days.map((d, i) => ({ ...d, hours: calc.dailyHours[i] }))}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDays(DEFAULT_DAYS)}
                className="h-8 text-xs"
              >
                Reset Week
              </Button>
            </div>
          </div>

          <div className="space-y-2.5">
            {days.map((row, i) => {
              const h = calc.dailyHours[i];
              return (
                <div key={row.day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-border bg-background p-2.5 text-xs">
                  <span className="w-24 font-semibold text-foreground">{row.day}</span>
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-muted-foreground">In:</label>
                    <input
                      type="time"
                      value={row.start}
                      onChange={(e) => updateDay(i, { start: e.target.value })}
                      className="rounded border border-input p-1 font-mono text-xs"
                    />
                    <label className="text-[11px] text-muted-foreground">Out:</label>
                    <input
                      type="time"
                      value={row.end}
                      onChange={(e) => updateDay(i, { end: e.target.value })}
                      className="rounded border border-input p-1 font-mono text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-muted-foreground">Break (m):</label>
                    <input
                      type="number"
                      min="0"
                      step="5"
                      value={row.breakMins}
                      onChange={(e) => updateDay(i, { breakMins: Number(e.target.value) || 0 })}
                      className="w-14 rounded border border-input p-1 text-center font-mono text-xs"
                    />
                  </div>
                  <span className="w-20 text-right font-mono font-bold text-foreground">
                    {h > 0 ? `${h.toFixed(2)}h` : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Results Banner (4 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm flex flex-col justify-between lg:col-span-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Weekly Pay Summary
          </span>

          <div className="my-4 space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <span className="text-xs text-muted-foreground">Gross Weekly Earnings</span>
              <p className="tnum font-display text-display-lg text-[#1f5f45] mt-1 font-bold">
                {fmtUSD(calc.totalPay, 2)}
              </p>
              <span className="text-xs text-muted-foreground mt-1 block">
                Total: <strong className="text-foreground">{calc.totalHours.toFixed(2)} hours worked</strong>
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-border/60 pb-1.5">
                <span className="text-muted-foreground">Regular Hours ({calc.regularHours.toFixed(2)}h):</span>
                <span className="font-mono font-semibold text-foreground">{fmtUSD(calc.regularPay, 2)}</span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-1.5">
                <span className="text-muted-foreground">Overtime ({calc.overtimeHours.toFixed(2)}h @ {otMultiplier}x):</span>
                <span className="font-mono font-semibold text-[#1f5f45]">{fmtUSD(calc.overtimePay, 2)}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div>
                <label className="text-xs font-medium text-foreground">Hourly Rate ($/hr)</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value) || 0)}
                  className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground flex justify-between">
            <span>Overtime basis:</span>
            <strong className="text-foreground">Over {otThreshold} hours / week</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
