"use client";

import React, { useState, useMemo } from "react";
import { Copy, Check, Calendar, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const PRESETS = [
  { label: "Every minute", expr: "* * * * *" },
  { label: "Every 15 minutes", expr: "*/15 * * * *" },
  { label: "Every hour (at :00)", expr: "0 * * * *" },
  { label: "Every day at midnight", expr: "0 0 * * *" },
  { label: "Every day at 9:00 AM", expr: "0 9 * * *" },
  { label: "Every weekday at 9:00 AM", expr: "0 9 * * 1-5" },
  { label: "Every Sunday at noon", expr: "0 12 * * 0" },
  { label: "1st of every month at midnight", expr: "0 0 1 * *" },
];

function describeCron(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return "Invalid cron format. Expected 5 fields.";

  const [min, hr, dom, mon, dow] = parts;

  let timeDesc = "";
  if (min === "*" && hr === "*") {
    timeDesc = "Every minute";
  } else if (min.startsWith("*/") && hr === "*") {
    timeDesc = `Every ${min.slice(2)} minutes`;
  } else if (min === "0" && hr === "*") {
    timeDesc = "At the start of every hour";
  } else if (min === "0" && hr === "0") {
    timeDesc = "At midnight (00:00)";
  } else if (!hr.includes("*") && !min.includes("*")) {
    const pad = (v: string) => v.padStart(2, "0");
    timeDesc = `At ${pad(hr)}:${pad(min)}`;
  } else {
    timeDesc = `Minute ${min}, Hour ${hr}`;
  }

  let dayDesc = "";
  if (dom === "*" && dow === "*") {
    dayDesc = "every day";
  } else if (dom !== "*" && dow === "*") {
    dayDesc = `on day ${dom} of the month`;
  } else if (dow !== "*" && dom === "*") {
    const daysMap: Record<string, string> = {
      "0": "Sunday",
      "1": "Monday",
      "2": "Tuesday",
      "3": "Wednesday",
      "4": "Thursday",
      "5": "Friday",
      "6": "Saturday",
      "7": "Sunday",
      "1-5": "Monday through Friday",
      "0,6": "Saturday and Sunday",
    };
    dayDesc = `on ${daysMap[dow] || `weekday ${dow}`}`;
  } else {
    dayDesc = `on day ${dom} and weekday ${dow}`;
  }

  let monthDesc = "";
  if (mon !== "*") {
    monthDesc = ` in month ${mon}`;
  }

  return `${timeDesc}, ${dayDesc}${monthDesc}.`;
}

function computeNextRuns(expr: string, count = 5): Date[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return [];

  const [minStr, hrStr] = parts;
  const runs: Date[] = [];
  const current = new Date();
  current.setSeconds(0, 0);

  // Simple lookahead simulation up to 100 days
  let stepMinutes = 1;
  if (minStr.startsWith("*/")) {
    stepMinutes = parseInt(minStr.slice(2), 10) || 1;
  }

  const iter = new Date(current.getTime() + 60000);
  for (let i = 0; i < 20000 && runs.length < count; i++) {
    const m = iter.getMinutes();
    const h = iter.getHours();
    const dom = iter.getDate();
    const mon = iter.getMonth() + 1;
    const dow = iter.getDay();

    const matchMin =
      minStr === "*" ||
      (minStr.startsWith("*/") && m % (parseInt(minStr.slice(2), 10) || 1) === 0) ||
      minStr.split(",").includes(String(m));

    const matchHr =
      hrStr === "*" ||
      (hrStr.startsWith("*/") && h % (parseInt(hrStr.slice(2), 10) || 1) === 0) ||
      hrStr.split(",").includes(String(h));

    const matchDom = parts[2] === "*" || parts[2].split(",").includes(String(dom));
    const matchMon = parts[3] === "*" || parts[3].split(",").includes(String(mon));
    const matchDow =
      parts[4] === "*" ||
      parts[4].split(",").includes(String(dow)) ||
      (parts[4] === "1-5" && dow >= 1 && dow <= 5) ||
      (parts[4] === "0,6" && (dow === 0 || dow === 6));

    if (matchMin && matchHr && matchDom && matchMon && matchDow) {
      runs.push(new Date(iter));
      iter.setMinutes(iter.getMinutes() + 1);
    } else {
      iter.setMinutes(iter.getMinutes() + stepMinutes);
    }
  }

  return runs;
}

export function CronBuilder() {
  const [cron, setCron] = useState("0 9 * * 1-5");
  const [copied, setCopied] = useState(false);

  const parts = useMemo(() => {
    const p = cron.trim().split(/\s+/);
    return {
      min: p[0] || "*",
      hr: p[1] || "*",
      dom: p[2] || "*",
      mon: p[3] || "*",
      dow: p[4] || "*",
    };
  }, [cron]);

  const updatePart = (index: number, val: string) => {
    const cur = cron.trim().split(/\s+/);
    while (cur.length < 5) cur.push("*");
    cur[index] = val.trim() || "*";
    setCron(cur.join(" "));
  };

  const description = useMemo(() => describeCron(cron), [cron]);
  const nextRuns = useMemo(() => computeNextRuns(cron, 5), [cron]);

  const copyCron = () => {
    navigator.clipboard.writeText(cron);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Expression Banner */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-lark-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <span className="text-sm font-semibold text-muted-foreground">
              Cron expression (5 fields)
            </span>
            <div className="mt-2 flex items-center gap-3">
              <input
                aria-label="Cron expression (5 fields)"
                type="text"
                value={cron}
                onChange={(e) => setCron(e.target.value)}
                className="w-full max-w-md rounded-lg border border-input bg-background px-4 py-2.5 font-mono text-lg font-bold tracking-wider text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button onClick={copyCron} variant="outline" className="shrink-0 gap-1.5">
                {copied ? <Check className="h-4 w-4 text-deep-green" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </Button>
            </div>
          </div>
          <div className="rounded-lg bg-muted/60 p-4 sm:max-w-xs">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-deep-orange" /> Plain English
            </span>
            <p className="mt-1 text-sm font-semibold text-foreground leading-snug">
              {description}
            </p>
          </div>
        </div>

        {/* Presets */}
        <div className="mt-5 border-t border-border/60 pt-4">
          <span className="text-xs font-medium text-muted-foreground mr-2">Quick Presets:</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button type="button"
                key={p.label}
                onClick={() => setCron(p.expr)}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-lf-purple hover:text-deep-purple"
              >
                {p.label} ({p.expr})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Field Breakdowns */}
      <div className="grid gap-4 sm:grid-cols-5">
        {[
          { label: "Minute", hint: "0-59, *, */15", val: parts.min, idx: 0 },
          { label: "Hour", hint: "0-23, *, */2", val: parts.hr, idx: 1 },
          { label: "Day of Month", hint: "1-31, *", val: parts.dom, idx: 2 },
          { label: "Month", hint: "1-12, *", val: parts.mon, idx: 3 },
          { label: "Day of Week", hint: "0-6 (0=Sun), 1-5", val: parts.dow, idx: 4 },
        ].map((f) => (
          <div key={f.label} className="rounded-xl border border-border bg-card p-4 shadow-lark-sm">
            <span className="text-xs font-semibold text-foreground">{f.label}</span>
            <input
              aria-label={`${f.label} field`}
              type="text"
              value={f.val}
              onChange={(e) => updatePart(f.idx, e.target.value)}
              className="mt-2 w-full rounded-md border border-input bg-background p-2 font-mono text-center text-sm font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <span className="mt-2 block text-[11px] text-muted-foreground">{f.hint}</span>
          </div>
        ))}
      </div>

      {/* Next scheduled runs */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm">
        <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-deep-green" /> Next 5 scheduled executions
        </h4>
        <div className="mt-4 divide-y divide-border/60">
          {nextRuns.length > 0 ? (
            nextRuns.map((r, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                <span className="font-medium text-foreground flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  Run #{i + 1}: {r.toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
                </span>
                <span className="font-mono font-semibold text-deep-green">
                  {r.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))
          ) : (
            <p className="py-3 text-xs text-muted-foreground">No upcoming executions found within simulation threshold.</p>
          )}
        </div>
      </div>
    </div>
  );
}
