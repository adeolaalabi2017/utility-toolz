"use client";

import * as React from "react";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalcLayout, FieldGrid, NumberField, ResultHero, SelectField, ShareBar, StatRow, Verdict } from "./ui";
import { fmtMoney, fmtNum, num } from "@/lib/format";
import {
  addMonthsSafe,
  addWorkingDays,
  countWeekdays,
  fmtDate,
  fmtOffset,
  fmtZoneTime,
  parseISODate,
  todayISO,
  tzAbbrev,
  tzOffsetMs,
  zonedDayIndex,
  zonedToInstant,
} from "@/lib/datetime";

/* ================================================================== */
/* 65. Pomodoro timer                                                  */
/* ================================================================== */

export function PomodoroTimer() {
  const [focusInput, setFocusInput] = React.useState("25");
  const [breakInput, setBreakInput] = React.useState("5");
  const [mode, setMode] = React.useState<"focus" | "break">("focus");
  const [secondsLeft, setSecondsLeft] = React.useState(25 * 60);
  const [running, setRunning] = React.useState(false);
  const [completed, setCompleted] = React.useState(0);

  const focusMin = Math.min(180, Math.max(1, Math.round(num(focusInput, 25))));
  const breakMin = Math.min(60, Math.max(1, Math.round(num(breakInput, 5))));

  // Changing durations resets the clock to a fresh focus block
  React.useEffect(() => {
    setRunning(false);
    setMode("focus");
    setSecondsLeft(Math.round(focusMin * 60));
  }, [focusMin, breakMin]);

  React.useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  React.useEffect(() => {
    if (!running || secondsLeft > 0) return;
    if (mode === "focus") {
      setCompleted((c) => c + 1);
      setMode("break");
      setSecondsLeft(breakMin * 60);
    } else {
      setMode("focus");
      setSecondsLeft(focusMin * 60);
    }
  }, [secondsLeft, running, mode, breakMin, focusMin]);

  const total = (mode === "focus" ? focusMin : breakMin) * 60;
  const progress = total > 0 ? ((total - secondsLeft) / total) * 100 : 0;
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const reset = () => {
    setRunning(false);
    setMode("focus");
    setSecondsLeft(focusMin * 60);
  };
  const skip = () => {
    setRunning(false);
    if (mode === "focus") {
      setMode("break");
      setSecondsLeft(breakMin * 60);
    } else {
      setMode("focus");
      setSecondsLeft(focusMin * 60);
    }
  };

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <FieldGrid>
            <NumberField
              label="Focus length"
              value={focusInput}
              onChange={setFocusInput}
              suffix="min"
              hint="Classic Pomodoro: 25 min"
            />
            <NumberField
              label="Break length"
              value={breakInput}
              onChange={setBreakInput}
              suffix="min"
              hint="Short break: 5 min"
            />
          </FieldGrid>
          <div className="rounded-lg border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
            <p className="font-medium text-foreground">The cycle</p>
            <p className="mt-1">
              One <strong>pomodoro</strong> = {focusMin} min of single-task focus + {breakMin} min break.
              Every fourth round, take a longer 15–30 min break. The counter tracks today&apos;s completed
              blocks.
            </p>
          </div>
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label={mode === "focus" ? "Focus session" : "Break time"}
            value={`${mm}:${ss}`}
            sub={
              running
                ? mode === "focus"
                  ? "Running — one task only until the bell"
                  : "Running — step away from the screen"
                : "Paused — press start when ready"
            }
          />
          <ShareBar
            label="Session progress"
            actual={progress}
            target={100}
            actualLabel={`${Math.round(progress)}%`}
            targetLabel="done"
          />
          <div>
            <StatRow label="Completed pomodoros" value={String(completed)} emphasis />
            <StatRow label="Focus time banked" value={`${completed * focusMin} min`} />
            <StatRow label="Next up" value={mode === "focus" ? `${breakMin} min break` : `${focusMin} min focus`} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setRunning((r) => !r)} className="gap-1.5">
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? "Pause" : secondsLeft === total ? "Start" : "Resume"}
            </Button>
            <Button variant="outline" onClick={reset} className="gap-1.5">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
            <Button variant="outline" onClick={skip} className="gap-1.5">
              <SkipForward className="h-4 w-4" /> Skip
            </Button>
          </div>
          <Verdict tone="neutral">
            Four pomodoros ({4 * focusMin} min of focus) is a deep-work morning. Protect the block: phone
            face-down, one tab, one task.
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 66. Meeting cost calculator                                         */
/* ================================================================== */

const MEETING_FREQS = [
  { value: "1", label: "One-off (×1)" },
  { value: "12", label: "Monthly (×12)" },
  { value: "24", label: "Fortnightly (×24)" },
  { value: "48", label: "Weekly (×48)" },
];

export function MeetingCostCalculator() {
  const [attendees, setAttendees] = React.useState("6");
  const [rate, setRate] = React.useState("75");
  const [minutes, setMinutes] = React.useState("90");
  const [freq, setFreq] = React.useState("48");

  const people = num(attendees, 0);
  const hourly = num(rate, 0);
  const mins = num(minutes, 0);
  const factor = num(freq, 1);

  const hours = mins / 60;
  const perMeeting = people * hourly * hours;
  const perPerson = hourly * hours;
  const annual = perMeeting * factor;
  const monthly = annual / 12;
  const shortMins = Math.max(0, mins - 45);
  const shortSaving = people * hourly * (shortMins / 60) * factor;

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <FieldGrid>
            <NumberField label="Attendees" value={attendees} onChange={setAttendees} min={1} />
            <NumberField label="Blended hourly rate" value={rate} onChange={setRate} prefix="$" suffix="/hr" hint="Salary ÷ 1,800 working hours" />
          </FieldGrid>
          <FieldGrid>
            <NumberField label="Duration" value={minutes} onChange={setMinutes} suffix="min" />
            <SelectField label="Frequency" value={freq} onChange={setFreq} options={MEETING_FREQS} />
          </FieldGrid>
          <Verdict tone="neutral">
            The rate is loaded cost, not salary: add ~30% for benefits, tooling and overhead. A $75
            blended rate approximates a $95k salaried team.
          </Verdict>
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label="Cost per meeting"
            value={fmtMoney(perMeeting)}
            sub={`${people} people × ${fmtNum(mins)} min × ${fmtMoney(hourly)}/hr`}
          />
          <div>
            <StatRow label="Cost per participant" value={fmtMoney(perPerson, "$", 2)} />
            <StatRow label="Monthly cost (×48 pace)" value={fmtMoney(monthly)} emphasis />
            <StatRow label="Annual cost" value={fmtMoney(annual)} emphasis />
            <StatRow
              label={`Annual saving at 45 min (${fmtNum(shortMins)} min shorter)`}
              value={fmtMoney(shortSaving)}
            />
          </div>
          <Verdict tone={annual > 20_000 ? "warn" : "good"}>
            {annual > 20_000
              ? `${fmtMoney(annual)}/year for one recurring meeting. If a third of it could be an async update, that's ${fmtMoney(annual / 3)} back.`
              : `${fmtMoney(annual)}/year is defensible for a decision-making meeting — as long as it produces decisions, not status updates.`}
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 67. Working days calculator                                         */
/* ================================================================== */

export function WorkingDaysCalculator() {
  const [start, setStart] = React.useState("2026-01-01");
  const [end, setEnd] = React.useState("2026-01-31");
  const [holidays, setHolidays] = React.useState("0");

  const startD = parseISODate(start);
  const endD = parseISODate(end);
  const hol = Math.max(0, Math.round(num(holidays, 0)));

  let content: React.ReactNode;
  if (!startD || !endD) {
    content = <Verdict tone="neutral">Pick a start and an end date to count the working days between them.</Verdict>;
  } else if (endD < startD) {
    content = <Verdict tone="bad">The end date is before the start date — swap them around.</Verdict>;
  } else {
    const total = Math.round((endD.getTime() - startD.getTime()) / 86_400_000) + 1;
    const weekend = total - countWeekdays(startD, endD);
    const working = Math.max(0, countWeekdays(startD, endD) - hol);
    content = (
      <div className="space-y-4">
        <ResultHero
          label="Working days"
          value={fmtNum(working)}
          sub={`${fmtDate(startD)} → ${fmtDate(endD)}`}
        />
        <div>
          <StatRow label="Calendar days in range" value={fmtNum(total)} />
          <StatRow label="Weekend days" value={fmtNum(weekend)} />
          <StatRow label="Public holidays excluded" value={fmtNum(hol)} />
          <StatRow label="Working hours (8h/day)" value={`${fmtNum(working * 8)} h`} emphasis />
          <StatRow label="Working weeks" value={fmtNum(working / 5, 1)} />
        </div>
        <Verdict tone={hol > working / 5 ? "warn" : "neutral"}>
          {hol > working / 5
            ? `${hol} holidays eat a fifth of this window — sequence deliverables around them.`
            : `Count Mon–Fri only. Holidays are entered as a number above; most teams lose 8–12 of them a year.`}
        </Verdict>
      </div>
    );
  }

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <FieldGrid>
            <div className="space-y-1.5">
              <label htmlFor="wd-start" className="text-sm font-medium">Start date</label>
              <Input id="wd-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} className="tnum" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="wd-end" className="text-sm font-medium">End date</label>
              <Input id="wd-end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="tnum" />
            </div>
          </FieldGrid>
          <NumberField
            label="Public holidays in range (Mon–Fri)"
            value={holidays}
            onChange={setHolidays}
            min={0}
            hint="Count only the ones that fall on a weekday inside the range"
          />
        </div>
      }
      results={content}
    />
  );
}

/* ================================================================== */
/* 68. Project cost calculator                                         */
/* ================================================================== */

export function ProjectCostCalculator() {
  const [hours, setHours] = React.useState("320");
  const [rate, setRate] = React.useState("95");
  const [fixed, setFixed] = React.useState("4,500");
  const [contingency, setContingency] = React.useState("15");
  const [weeks, setWeeks] = React.useState("12");
  const [margin, setMargin] = React.useState("30");

  const h = num(hours, 0);
  const r = num(rate, 0);
  const fx = num(fixed, 0);
  const c = num(contingency, 0);
  const w = num(weeks, 0);
  const m = num(margin, 0);

  const labour = h * r;
  const contAmt = ((labour + fx) * c) / 100;
  const total = labour + fx + contAmt;
  const burn = w > 0 ? total / w : NaN;
  const quote = m < 100 ? total / (1 - m / 100) : NaN;
  const profit = quote - total;

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <FieldGrid>
            <NumberField label="Estimated hours" value={hours} onChange={setHours} suffix="h" hint="All roles combined" />
            <NumberField label="Blended hourly rate" value={rate} onChange={setRate} prefix="$" suffix="/hr" />
          </FieldGrid>
          <FieldGrid>
            <NumberField label="Fixed costs" value={fixed} onChange={setFixed} prefix="$" hint="Software, contractors, hardware" />
            <NumberField label="Contingency" value={contingency} onChange={setContingency} suffix="%" hint="15–25% is typical" />
          </FieldGrid>
          <FieldGrid>
            <NumberField label="Planned duration" value={weeks} onChange={setWeeks} suffix="wk" />
            <NumberField label="Target margin on quote" value={margin} onChange={setMargin} suffix="%" />
          </FieldGrid>
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label="Total project cost"
            value={fmtMoney(total)}
            sub={`${fmtNum(h)} h × ${fmtMoney(r)}/hr + fixed + contingency`}
          />
          <div>
            <StatRow label="Labour cost" value={fmtMoney(labour)} />
            <StatRow label="Fixed costs" value={fmtMoney(fx)} />
            <StatRow label={`Contingency (${fmtPctSafe(c)})`} value={fmtMoney(contAmt)} />
            <StatRow label="Burn per week" value={fmtMoney(burn)} emphasis />
            <StatRow label={`Suggested quote at ${fmtPctSafe(m)} margin`} value={fmtMoney(quote)} emphasis />
            <StatRow label="Profit on that quote" value={fmtMoney(profit)} />
          </div>
          <Verdict tone={c < 10 ? "warn" : "neutral"}>
            {c < 10
              ? "Contingency under 10% is optimistic for fixed-scope work — estimate overruns cluster at 20–40% on first-time scopes."
              : `Quote with margin, not markup: ${fmtPctSafe(m)} margin on cost means ${(m / (100 - m)).toFixed(0)}% on price. The pricing calculator shows why.`}
          </Verdict>
        </div>
      }
    />
  );
}

const fmtPctSafe = (n: number): string => `${n.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;

/* ================================================================== */
/* 69. Deadline calculator                                             */
/* ================================================================== */

const DEADLINE_UNITS = [
  { value: "wd", label: "Working days (Mon–Fri)" },
  { value: "cd", label: "Calendar days" },
  { value: "wk", label: "Weeks" },
  { value: "mo", label: "Months" },
];

export function DeadlineCalculator() {
  const [start, setStart] = React.useState("2026-11-02");
  const [amount, setAmount] = React.useState("15");
  const [unit, setUnit] = React.useState("wd");
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const startD = parseISODate(start);
  const n = Math.round(num(amount, 0));

  let content: React.ReactNode;
  if (!startD) {
    content = <Verdict tone="neutral">Pick a start date to project the deadline.</Verdict>;
  } else if (n <= 0) {
    content = <Verdict tone="bad">Enter a duration above zero.</Verdict>;
  } else {
    let deadline: Date;
    if (unit === "wd") deadline = addWorkingDays(startD, n);
    else if (unit === "cd") deadline = new Date(startD.getFullYear(), startD.getMonth(), startD.getDate() + n);
    else if (unit === "wk") deadline = new Date(startD.getFullYear(), startD.getMonth(), startD.getDate() + n * 7);
    else deadline = addMonthsSafe(startD, n);

    const span = Math.round((deadline.getTime() - startD.getTime()) / 86_400_000);
    const workingInSpan = countWeekdays(
      new Date(startD.getFullYear(), startD.getMonth(), startD.getDate() + 1),
      deadline
    );
    const today = mounted ? new Date() : null;
    const daysLeft = today ? Math.ceil((deadline.getTime() - today.getTime()) / 86_400_000) : null;

    content = (
      <div className="space-y-4">
        <ResultHero
          label="Deadline"
          value={fmtDate(deadline)}
          sub={
            daysLeft === null
              ? `${fmtNum(span)} calendar days after kickoff`
              : daysLeft >= 0
                ? daysLeft === 1
                  ? "1 day from today"
                  : `${fmtNum(daysLeft)} days from today`
                : -daysLeft === 1
                  ? "Passed 1 day ago"
                  : `Passed ${fmtNum(-daysLeft)} days ago`
          }
        />
        <div>
          <StatRow label="Kickoff" value={fmtDate(startD)} />
          <StatRow label="Deadline weekday" value={fmtDate(deadline, { weekday: "long" })} />
          <StatRow label="Calendar span" value={`${fmtNum(span)} days`} />
          <StatRow label="Working days in span" value={fmtNum(workingInSpan)} emphasis />
          <StatRow label="Duration used" value={`${fmtNum(n)} ${unit === "wd" ? "working days" : unit === "cd" ? "days" : unit === "wk" ? "weeks" : "months"}`} />
        </div>
        <Verdict tone={daysLeft !== null && daysLeft < 0 ? "warn" : "neutral"}>
          {unit === "wd"
            ? "Working days skip weekends; the start day itself is not counted — 15 working days from a Monday lands on the Monday three weeks later."
            : "Calendar math includes weekends. Switch to working days to exclude them."}
        </Verdict>
      </div>
    );
  }

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="dl-start" className="text-sm font-medium">Kickoff date</label>
            <Input id="dl-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} className="tnum" />
          </div>
          <FieldGrid>
            <NumberField label="Duration" value={amount} onChange={setAmount} min={0} />
            <SelectField label="Counted as" value={unit} onChange={setUnit} options={DEADLINE_UNITS} />
          </FieldGrid>
        </div>
      }
      results={content}
    />
  );
}

/* ================================================================== */
/* 70. Time zone converter                                             */
/* ================================================================== */

const ZONES: { id: string; label: string }[] = [
  { id: "UTC", label: "UTC" },
  { id: "America/Los_Angeles", label: "Los Angeles" },
  { id: "America/Denver", label: "Denver" },
  { id: "America/New_York", label: "New York" },
  { id: "America/Sao_Paulo", label: "São Paulo" },
  { id: "Europe/London", label: "London" },
  { id: "Europe/Berlin", label: "Berlin" },
  { id: "Africa/Lagos", label: "Lagos" },
  { id: "Asia/Dubai", label: "Dubai" },
  { id: "Asia/Shanghai", label: "Shanghai" },
  { id: "Asia/Tokyo", label: "Tokyo" },
  { id: "Australia/Sydney", label: "Sydney" },
];

const zoneLabel = (id: string): string => ZONES.find((z) => z.id === id)?.label ?? id;

export function TimeZoneConverter() {
  const [date, setDate] = React.useState("2026-01-15");
  const [time, setTime] = React.useState("14:30");
  const [fromZone, setFromZone] = React.useState("UTC");

  const instant = zonedToInstant(date, time, fromZone);

  const sourceDay = instant !== null ? zonedDayIndex(instant, fromZone) : 0;
  const rows = ZONES.map((z) => {
    if (instant === null) return null;
    const off = tzOffsetMs(new Date(instant), z.id);
    const dayShift = zonedDayIndex(instant, z.id) - sourceDay;
    return {
      id: z.id,
      label: z.label,
      time: fmtZoneTime(instant, z.id),
      dayShift,
      offset: fmtOffset(off),
      abbrev: tzAbbrev(instant, z.id),
      isSource: z.id === fromZone,
    };
  }).filter((r): r is NonNullable<typeof r> => r !== null);
  const offNow = instant !== null ? tzOffsetMs(new Date(instant), fromZone) : 0;
  const offJan = tzOffsetMs(new Date(Date.UTC(2026, 0, 15)), fromZone);
  const offJul = tzOffsetMs(new Date(Date.UTC(2026, 6, 15)), fromZone);
  const dst =
    offJan === offJul
      ? "no daylight saving observed"
      : offNow === Math.min(offJan, offJul)
        ? "daylight saving time"
        : "standard time";

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <FieldGrid>
            <div className="space-y-1.5">
              <label htmlFor="tz-date" className="text-sm font-medium">Date</label>
              <Input id="tz-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="tnum" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="tz-time" className="text-sm font-medium">Time</label>
              <Input id="tz-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="tnum" />
            </div>
          </FieldGrid>
          <SelectField
            label="From time zone"
            value={fromZone}
            onChange={setFromZone}
            options={ZONES.map((z) => ({ value: z.id, label: `${z.label} (${z.id.split("/").pop()})` }))}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDate(todayISO());
              const now = new Date();
              setTime(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
            }}
          >
            Use right now
          </Button>
        </div>
      }
      results={
        instant === null ? (
          <Verdict tone="bad">Enter a valid date and time (HH:MM, 24-hour).</Verdict>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1.5">
              {rows.map((r) => (
                <div
                  key={r.id}
                  className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 ${
                    r.isSource ? "border-primary/40 bg-secondary/50" : "bg-card"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {r.label}
                      {r.isSource && <span className="ml-1.5 text-xs text-primary">← source</span>}
                    </p>
                    <p className="tnum text-xs text-muted-foreground">
                      {r.abbrev} · {r.offset}
                      {r.dayShift !== 0 && (
                        <span className="ml-1 font-medium text-amber-700">
                          ({r.dayShift > 0 ? "+" : "−"}
                          {Math.abs(r.dayShift) === 1
                            ? "1 day"
                            : `${Math.abs(r.dayShift)} days`})
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="tnum shrink-0 text-lg font-semibold tracking-tight">{r.time}</p>
                </div>
              ))}
            </div>
            <Verdict tone="neutral">
              {zoneLabel(fromZone)} is on {dst} on this date ({tzAbbrev(instant, fromZone)},{" "}
              {fmtOffset(offNow)}). Days marked in amber have shifted to the previous or next calendar day.
            </Verdict>
          </div>
        )
      }
    />
  );
}
