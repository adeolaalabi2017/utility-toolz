"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CalcLayout,
  FieldGrid,
  MiniTable,
  NumberField,
  ResultHero,
  SelectField,
  StatRow,
  Verdict,
  CopyButton,
  TextField,
} from "./ui";
import { fmtNum, fmtUSD, num } from "@/lib/format";
import { useToolState } from "@/hooks/use-tool-state";
import { ToolShareBar } from "@/components/site/tool-share-bar";
import { Button } from "@/components/ui/button";
import {
  addMonthsSafe,
  countWeekendDays,
  dateSpan,
  daysBetween,
  diffYMD,
  fmtDate,
  parseISODate,
} from "@/lib/datetime";

/* ================================================================== */
/* 75. Age calculator                                                  */
/* ================================================================== */

export function AgeCalculator() {
  const [birth, setBirth] = React.useState("1995-06-15");
  const [asOf, setAsOf] = React.useState("");
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const birthD = parseISODate(birth);
  const asOfD = asOf ? parseISODate(asOf) : mounted ? new Date() : null;

  let content: React.ReactNode;
  if (!birthD) {
    content = <Verdict tone="neutral">Enter a date of birth.</Verdict>;
  } else if (!asOfD) {
    content = <Verdict tone="neutral">Loading today&apos;s date — or enter an &quot;as of&quot; date above.</Verdict>;
  } else if (birthD > asOfD) {
    content = <Verdict tone="bad">The date of birth is after the &quot;as of&quot; date.</Verdict>;
  } else {
    const { y, m, d } = diffYMD(birthD, asOfD);
    const totalDays = daysBetween(birthD, asOfD);
    const totalMonths = y * 12 + m;

    // Next birthday (Feb 29 rolls to Mar 1 in non-leap years)
    const bm = birthD.getMonth();
    const bd = birthD.getDate();
    let next = new Date(asOfD.getFullYear(), bm, bd);
    const isToday =
      next.getMonth() === asOfD.getMonth() &&
      next.getDate() === asOfD.getDate();
    if (next < asOfD && !isToday) next = new Date(asOfD.getFullYear() + 1, bm, bd);
    const daysToNext = daysBetween(asOfD, next);

    content = (
      <div className="space-y-4">
        <ResultHero
          label="Age"
          value={`${y} yrs ${m} mo ${d} d`}
          sub={isToday ? "Birthday today — many happy returns" : undefined}
        />
        <div>
          <StatRow label="Total months" value={fmtNum(totalMonths)} />
          <StatRow label="Total weeks" value={`${fmtNum(Math.floor(totalDays / 7))} wk ${totalDays % 7} d`} />
          <StatRow label="Total days lived" value={fmtNum(totalDays)} emphasis />
          <StatRow label="Born on a" value={fmtDate(birthD, { weekday: "long" })} />
          <StatRow
            label="Next birthday"
            value={
              isToday
                ? "Today"
                : `${fmtDate(next)} (${daysToNext === 1 ? "1 day" : `${fmtNum(daysToNext)} days`})`
            }
          />
        </div>
        <Verdict tone="neutral">
          {fmtNum(totalDays)} sunrises since {fmtDate(birthD, { year: "numeric", month: "long", day: "numeric" })}.
          The next one ending in zeros: {(() => {
            const decade = Math.floor(y / 10) * 10 + 10;
            const diff = decade - y;
            return diff === 1 ? `${decade} in 1 year` : `${decade} in ${diff} years`;
          })()}.
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
              <Label htmlFor="age-birth" className="text-sm font-medium">Date of birth</Label>
              <Input id="age-birth" type="date" value={birth} onChange={(e) => setBirth(e.target.value)} className="tnum" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="age-asof" className="text-sm font-medium">Age as of</Label>
              <Input
                id="age-asof"
                type="date"
                value={asOf}
                placeholder="Today"
                onChange={(e) => setAsOf(e.target.value)}
                className="tnum"
              />
              <p className="text-xs text-muted-foreground">Leave empty to use today</p>
            </div>
          </FieldGrid>
        </div>
      }
      results={content}
    />
  );
}

/* ================================================================== */
/* Date to years, months and days                                      */
/* ================================================================== */

const plural = (n: number, word: string) => `${fmtNum(n)} ${word}${n === 1 ? "" : "s"}`;

export function YearsMonthsDaysCalculator() {
  const [params, setParams] = useToolState({ start: "2024-01-31", end: "2026-03-01", count: "no" });
  const from = parseISODate(params.start);
  const to = parseISODate(params.end);
  const span = from && to ? dateSpan(from, to, params.count === "yes") : null;

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <FieldGrid>
            <div className="space-y-1.5">
              <Label htmlFor="ymd-start" className="text-sm font-medium">Start date</Label>
              <Input id="ymd-start" type="date" value={params.start} onChange={(e) => setParams({ start: e.target.value })} className="tnum" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ymd-end" className="text-sm font-medium">End date</Label>
              <Input id="ymd-end" type="date" value={params.end} onChange={(e) => setParams({ end: e.target.value })} className="tnum" />
            </div>
          </FieldGrid>
          <SelectField
            label="Last day"
            value={params.count}
            onChange={(v) => setParams({ count: v })}
            options={[
              { value: "no", label: "Don't count the end date" },
              { value: "yes", label: "Count the end date as a full day" },
            ]}
          />
        </div>
      }
      results={
        !span ? (
          <Verdict tone="neutral">Enter a start date and an end date.</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label="Time between the dates"
              value={`${span.y} yrs ${span.m} mo ${span.d} d`}
              sub={span.swapped ? "The end date is before the start date, so they were counted in date order." : undefined}
            />
            <div>
              <StatRow
                label="Exact span"
                value={`${plural(span.y, "year")}, ${plural(span.m, "month")}, ${plural(span.d, "day")}`}
                emphasis
              />
              <StatRow label="In months and days" value={`${plural(span.totalMonths, "month")}, ${plural(span.d, "day")}`} />
              <StatRow
                label="In weeks and days"
                value={`${plural(Math.floor(span.totalDays / 7), "week")}, ${plural(span.totalDays % 7, "day")}`}
              />
              <StatRow label="Total days" value={fmtNum(span.totalDays)} emphasis />
            </div>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* 76. Date calculator                                                 */
/* ================================================================== */

const DATE_UNITS = [
  { value: "d", label: "Days" },
  { value: "w", label: "Weeks" },
  { value: "m", label: "Months" },
  { value: "y", label: "Years" },
];

export function DateCalculator() {
  const [start, setStart] = React.useState("2026-11-02");
  const [op, setOp] = React.useState("add");
  const [amount, setAmount] = React.useState("30");
  const [unit, setUnit] = React.useState("d");

  const startD = parseISODate(start);
  const n = Math.round(num(amount, 0));

  let content: React.ReactNode;
  if (!startD) {
    content = <Verdict tone="neutral">Pick a start date.</Verdict>;
  } else if (!isFinite(n) || Math.abs(n) > 100_000) {
    content = <Verdict tone="bad">Enter an amount between 0 and 100,000.</Verdict>;
  } else {
    const signed = op === "add" ? n : -n;
    let result: Date;
    if (unit === "m") result = addMonthsSafe(startD, signed);
    else if (unit === "y") result = addMonthsSafe(startD, signed * 12);
    else {
      const days = unit === "w" ? signed * 7 : signed;
      result = new Date(startD.getFullYear(), startD.getMonth(), startD.getDate() + days);
    }
    const [lo, hi] = result < startD ? [result, startD] : [startD, result];
    const span = Math.round((hi.getTime() - lo.getTime()) / 86_400_000);
    const clamped = startD.getDate() !== result.getDate() && (unit === "m" || unit === "y");

    content = (
      <div className="space-y-4">
        <ResultHero
          label={op === "add" ? "Result date" : "Result date (subtracted)"}
          value={fmtDate(result)}
          sub={`${fmtNum(span)} calendar days from ${fmtDate(lo, { month: "short", day: "numeric" })}`}
        />
        <div>
          <StatRow label="Lands on a" value={fmtDate(result, { weekday: "long" })} />
          <StatRow label="Start date" value={fmtDate(startD)} />
          <StatRow label="Span" value={`${fmtNum(span)} days ≈ ${fmtNum(span / 7, 1)} weeks`} />
          <StatRow label="Weekend days in span" value={fmtNum(countWeekendDays(lo, hi))} />
        </div>
        <Verdict tone={clamped ? "warn" : "neutral"}>
          {clamped
            ? `Month-end clamp: ${unit === "m" ? "months" : "years"} of different length roll the day back to the last valid day of the target month.`
            : op === "add"
              ? "Calendar arithmetic includes weekends — for a project deadline that skips them, use the deadline calculator."
              : "Subtraction walks back the calendar, weekends and all."}
        </Verdict>
      </div>
    );
  }

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="dc-start" className="text-sm font-medium">Start date</Label>
            <Input id="dc-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} className="tnum" />
          </div>
          <FieldGrid>
            <SelectField
              label="Operation"
              value={op}
              onChange={setOp}
              options={[
                { value: "add", label: "Add to date" },
                { value: "sub", label: "Subtract from date" },
              ]}
            />
            <NumberField label="Amount" value={amount} onChange={setAmount} min={0} />
          </FieldGrid>
          <SelectField label="Unit" value={unit} onChange={setUnit} options={DATE_UNITS} />
        </div>
      }
      results={content}
    />
  );
}

/* ================================================================== */
/* 77. Unit converter                                                  */
/* ================================================================== */

interface UnitDef {
  id: string;
  name: string;
  factor: number; // one unit = factor base units
}

type UnitGroupId = "length" | "mass" | "volume" | "data";

const UNIT_GROUPS: Record<UnitGroupId, { label: string; units: UnitDef[] }> = {
  length: {
    label: "Length",
    units: [
      { id: "mm", name: "Millimeters", factor: 0.001 },
      { id: "cm", name: "Centimeters", factor: 0.01 },
      { id: "m", name: "Meters", factor: 1 },
      { id: "km", name: "Kilometers", factor: 1000 },
      { id: "in", name: "Inches", factor: 0.0254 },
      { id: "ft", name: "Feet", factor: 0.3048 },
      { id: "yd", name: "Yards", factor: 0.9144 },
      { id: "mi", name: "Miles", factor: 1609.344 },
    ],
  },
  mass: {
    label: "Weight & mass",
    units: [
      { id: "g", name: "Grams", factor: 0.001 },
      { id: "kg", name: "Kilograms", factor: 1 },
      { id: "t", name: "Metric tons", factor: 1000 },
      { id: "oz", name: "Ounces", factor: 0.028349523125 },
      { id: "lb", name: "Pounds", factor: 0.45359237 },
      { id: "st", name: "Stones", factor: 6.35029318 },
    ],
  },
  volume: {
    label: "Volume",
    units: [
      { id: "ml", name: "Milliliters", factor: 0.001 },
      { id: "l", name: "Liters", factor: 1 },
      { id: "floz", name: "Fluid ounces (US)", factor: 0.0295735295625 },
      { id: "cup", name: "Cups (US)", factor: 0.2365882365 },
      { id: "pt", name: "Pints (US)", factor: 0.473176473 },
      { id: "qt", name: "Quarts (US)", factor: 0.946352946 },
      { id: "gal", name: "Gallons (US)", factor: 3.785411784 },
    ],
  },
  data: {
    label: "Data storage",
    units: [
      { id: "B", name: "Bytes", factor: 1 },
      { id: "KB", name: "Kilobytes (1000 B)", factor: 1e3 },
      { id: "MB", name: "Megabytes (1000²)", factor: 1e6 },
      { id: "GB", name: "Gigabytes (1000³)", factor: 1e9 },
      { id: "TB", name: "Terabytes (1000⁴)", factor: 1e12 },
      { id: "KiB", name: "Kibibytes (1024 B)", factor: 1024 },
      { id: "MiB", name: "Mebibytes (1024²)", factor: 1_048_576 },
      { id: "GiB", name: "Gibibytes (1024³)", factor: 1_073_741_824 },
      { id: "TiB", name: "Tebibytes (1024⁴)", factor: 1_099_511_627_776 },
    ],
  },
};

const fmtUnitValue = (n: number): string => {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-US", { maximumSignificantDigits: 7 });
};

export function UnitConverter() {
  const [group, setGroup] = React.useState<UnitGroupId>("length");
  const [value, setValue] = React.useState("1");
  const [from, setFrom] = React.useState("m");

  const units = UNIT_GROUPS[group].units;
  const fromUnit = units.find((u) => u.id === from) ?? units[0];
  const v = num(value, NaN);
  const inBase = v * fromUnit.factor;

  const changeGroup = (g: string) => {
    const gid = g as UnitGroupId;
    setGroup(gid);
    setFrom(UNIT_GROUPS[gid].units[2]?.id ?? UNIT_GROUPS[gid].units[0].id);
  };

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <SelectField
            label="Category"
            value={group}
            onChange={changeGroup}
            options={(Object.keys(UNIT_GROUPS) as UnitGroupId[]).map((g) => ({
              value: g,
              label: UNIT_GROUPS[g].label,
            }))}
          />
          <FieldGrid>
            <NumberField label="Value" value={value} onChange={setValue} />
            <SelectField
              label="From unit"
              value={fromUnit.id}
              onChange={setFrom}
              options={units.map((u) => ({ value: u.id, label: `${u.name} (${u.id})` }))}
            />
          </FieldGrid>
          <Verdict tone="neutral">
            Converting between categories — say, meters to pounds — is not defined; each category keeps
            its own family of units.
          </Verdict>
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label={`In base units (${UNIT_GROUPS[group].units.find((u) => u.factor === 1)?.id ?? ""})`}
            value={fmtUnitValue(inBase)}
            sub={`${fmtUnitValue(v)} ${fromUnit.id} converted to every unit in ${UNIT_GROUPS[group].label.toLowerCase()}`}
          />
          <MiniTable
            head={["Unit", "Value"]}
            rows={units.map((u) => [
              `${u.name} (${u.id})`,
              fmtUnitValue(inBase / u.factor),
            ])}
          />
          {group === "data" && (
            <Verdict tone="neutral">
              KB is decimal (1000 bytes) — what drive makers quote; KiB is binary (1024) — what operating
              systems show. A &quot;1 TB&quot; drive reads as ~909 TiB, hence the famous missing space.
            </Verdict>
          )}
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 78. Temperature converter                                           */
/* ================================================================== */

const TEMP_SCALES = [
  { value: "C", label: "Celsius (°C)" },
  { value: "F", label: "Fahrenheit (°F)" },
  { value: "K", label: "Kelvin (K)" },
];

export function TemperatureConverter() {
  const [value, setValue] = React.useState("100");
  const [from, setFrom] = React.useState("C");

  const t = num(value, NaN);
  const c = from === "C" ? t : from === "F" ? ((t - 32) * 5) / 9 : t - 273.15;
  const f = (c * 9) / 5 + 32;
  const k = c + 273.15;

  const ok = isFinite(c);
  const heroLabel = from === "C" ? "In Fahrenheit" : "In Celsius";
  const heroValue = !ok ? "—" : from === "C" ? `${fmtNum(f, 2)}°F` : `${fmtNum(c, 2)}°C`;

  const formula =
    from === "C"
      ? "°F = °C × 9⁄5 + 32"
      : from === "F"
        ? "°C = (°F − 32) × 5⁄9"
        : "°C = K − 273.15";

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <FieldGrid>
            <NumberField label="Temperature" value={value} onChange={setValue} />
            <SelectField label="From scale" value={from} onChange={setFrom} options={TEMP_SCALES} />
          </FieldGrid>
          <Verdict tone="neutral">
            Fahrenheit reads human weather (0 cold, 100 hot); Celsius anchors on water; Kelvin anchors on
            absolute zero and never goes negative.
          </Verdict>
        </div>
      }
      results={
        !ok ? (
          <Verdict tone="neutral">Enter a temperature to convert.</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero label={heroLabel} value={heroValue} sub={`Formula: ${formula}`} />
            <div>
              <StatRow label="Celsius" value={`${fmtNum(c, 2)} °C`} />
              <StatRow label="Fahrenheit" value={`${fmtNum(f, 2)} °F`} emphasis />
              <StatRow label="Kelvin" value={`${fmtNum(k, 2)} K`} emphasis />
            </div>
            <MiniTable
              head={["Reference point", "°C", "°F", "K"]}
              rows={[
                ["Absolute zero", "−273.15", "−459.67", "0"],
                ["Water freezes", "0", "32", "273.15"],
                ["Room temperature", "20", "68", "293.15"],
                ["Body temperature", "37", "98.6", "310.15"],
                ["Water boils", "100", "212", "373.15"],
              ]}
            />
            <Verdict tone={c < -273.15 ? "bad" : c <= 0 ? "neutral" : c >= 100 ? "neutral" : "good"}>
              {c < -273.15
                ? "Below absolute zero — physically impossible."
                : c >= 100
                  ? "Hotter than boiling water at sea level."
                  : c <= 0
                    ? "At or below water's freezing point."
                    : "Comfortable range for most life on Earth."}
            </Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* Electricity cost calculator                                         */
/* ================================================================== */

const APPLIANCES = [
  { label: "LED bulb", watts: 10 },
  { label: "Laptop", watts: 60 },
  { label: "TV", watts: 100 },
  { label: "Fridge", watts: 150 },
  { label: "Window AC", watts: 1000 },
  { label: "Space heater", watts: 1500 },
];

export function ElectricityCostCalculator() {
  const [params, setParams] = useToolState({ watts: "100", hours: "8", days: "30", rate: "0.16" });
  const { watts, hours, days, rate } = params;

  const kwhPerMonth = (num(watts) * num(hours) * num(days)) / 1000;
  const perHour = (num(watts) / 1000) * num(rate);
  const perDay = perHour * num(hours);
  const perMonth = kwhPerMonth * num(rate);

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">Start from an appliance</p>
            <div className="flex flex-wrap gap-2">
              {APPLIANCES.map((a) => (
                <button
                  type="button"
                  key={a.label}
                  aria-pressed={num(watts) === a.watts}
                  onClick={() => setParams({ watts: String(a.watts) })}
                  className="rounded-full border px-3 py-1 text-xs font-medium hover:bg-accent aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          <FieldGrid>
            <NumberField
              label="Power draw"
              value={watts}
              onChange={(v) => setParams({ watts: v })}
              suffix="W"
              min={0}
              hint="Check the label on the device"
            />
            <NumberField
              label="Hours used per day"
              value={hours}
              onChange={(v) => setParams({ hours: v })}
              suffix="h"
              min={0}
              step={0.5}
            />
            <NumberField
              label="Days used per month"
              value={days}
              onChange={(v) => setParams({ days: v })}
              min={0}
            />
            <NumberField
              label="Electricity price"
              value={rate}
              onChange={(v) => setParams({ rate: v })}
              prefix="$"
              suffix="/kWh"
              min={0}
              step={0.01}
              hint="Find it on your energy bill"
            />
          </FieldGrid>
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label="Monthly cost"
            value={fmtUSD(perMonth, 2)}
            sub={`${fmtNum(kwhPerMonth, 1)} kWh a month`}
          />
          <div>
            <StatRow label="Cost per hour" value={fmtUSD(perHour, 3)} />
            <StatRow label="Cost per day" value={fmtUSD(perDay, 2)} />
            <StatRow label="Cost per year" value={fmtUSD(perMonth * 12, 2)} emphasis />
          </div>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* Random number generator                                             */
/* ================================================================== */

function randomInt(min: number, max: number): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return min + (buf[0] % (max - min + 1));
}

export function RandomNumberGenerator() {
  const [params, setParams] = useToolState({ min: "1", max: "100", count: "1", unique: false as boolean });
  const [drawn, setDrawn] = React.useState<number[]>([]);
  const { min, max, count, unique } = params;

  const lo = Math.floor(num(min));
  const hi = Math.floor(num(max));
  const n = Math.floor(num(count));
  const rangeSize = hi - lo + 1;
  const problem =
    hi < lo
      ? "The maximum must be at least the minimum."
      : n < 1 || n > 1000
        ? "Choose between 1 and 1,000 numbers."
        : unique && n > rangeSize
          ? `Unique numbers need a range of at least ${n} values.`
          : "";

  const generate = () => {
    if (problem) return;
    const out: number[] = [];
    const seen = new Set<number>();
    while (out.length < n) {
      const v = randomInt(lo, hi);
      if (unique) {
        if (seen.has(v)) continue;
        seen.add(v);
      }
      out.push(v);
    }
    setDrawn(out);
  };

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <FieldGrid>
            <NumberField
              label="Minimum"
              value={min}
              onChange={(v) => setParams({ min: v })}
            />
            <NumberField
              label="Maximum"
              value={max}
              onChange={(v) => setParams({ max: v })}
            />
            <NumberField
              label="How many numbers"
              value={count}
              onChange={(v) => setParams({ count: v })}
              min={1}
            />
          </FieldGrid>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={unique}
              onChange={(e) => setParams({ unique: e.target.checked })}
              className="h-4 w-4 accent-primary"
            />
            No repeats
          </label>
          {problem && <Verdict tone="bad">{problem}</Verdict>}
          <Button type="button" onClick={generate} disabled={Boolean(problem)} className="w-full sm:w-auto">
            Generate numbers
          </Button>
        </div>
      }
      results={
        <div className="space-y-4" role="status" aria-live="polite">
          {drawn.length === 0 ? (
            <Verdict tone="neutral">Press Generate to draw numbers between {lo} and {hi}.</Verdict>
          ) : drawn.length === 1 ? (
            <ResultHero label="Your number" value={String(drawn[0])} sub={`Between ${lo} and ${hi}`} />
          ) : (
            <div className="space-y-3">
              <ul className="flex flex-wrap gap-2">
                {drawn.map((v, i) => (
                  <li key={`${v}-${i}`} className="tnum rounded-full bg-muted px-3 py-1 text-sm font-medium">
                    {v}
                  </li>
                ))}
              </ul>
              <CopyButton text={drawn.join(", ")} label="Copy numbers" />
            </div>
          )}
        </div>
      }
    />
  );
}

/* ================================================================== */
/* Roman numeral converter                                             */
/* ================================================================== */

const ROMAN_TABLE: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
  [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

function toRoman(n: number): string {
  let rest = n;
  let out = "";
  for (const [value, symbol] of ROMAN_TABLE) {
    while (rest >= value) {
      out += symbol;
      rest -= value;
    }
  }
  return out;
}

/** Returns the number for a canonical Roman numeral, or null. Round-trips so malformed input such as IIII is rejected. */
function fromRoman(text: string): number | null {
  const s = text.toUpperCase();
  if (!/^[MDCLXVI]+$/.test(s)) return null;
  const values: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = values[s[i]];
    const next = values[s[i + 1]] ?? 0;
    total += cur < next ? -cur : cur;
  }
  return total >= 1 && total <= 3999 && toRoman(total) === s ? total : null;
}

export function RomanNumeralConverter() {
  const [params, setParams] = useToolState({ text: "2026" });
  const { text } = params;
  const trimmed = text.trim();

  let result: string | null = null;
  let mode: "toRoman" | "fromRoman" | null = null;
  if (/^\d+$/.test(trimmed)) {
    const n = Number(trimmed);
    if (n >= 1 && n <= 3999) {
      result = toRoman(n);
      mode = "toRoman";
    }
  } else if (trimmed !== "") {
    const n = fromRoman(trimmed);
    if (n !== null) {
      result = String(n);
      mode = "fromRoman";
    }
  }

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <TextField
            label="Number or Roman numeral"
            value={text}
            onChange={(v) => setParams({ text: v })}
            mono
            placeholder="e.g. 2026 or MMXXVI"
            hint="Whole numbers from 1 to 3,999. Roman numerals are converted back automatically."
          />
        </div>
      }
      results={
        result === null ? (
          <Verdict tone="bad">
            Enter a whole number from 1 to 3,999, or a valid Roman numeral such as XIV.
          </Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label={mode === "toRoman" ? "Roman numeral" : "Number"}
              value={result}
              sub={mode === "toRoman" ? `${trimmed} in Roman numerals` : `${trimmed.toUpperCase()} as a number`}
              copyText={result}
            />
          </div>
        )
      }
    />
  );
}
