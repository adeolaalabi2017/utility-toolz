"use client";

import * as React from "react";
import {
  CalcLayout,
  FieldGrid,
  NumberField,
  ResultHero,
  SelectField,
  StatRow,
  TextField,
  Verdict,
} from "./ui";
import { fmtDate, parseISODate } from "@/lib/datetime";
import { fmtNum, num } from "@/lib/format";
import { useToolState } from "@/hooks/use-tool-state";
import { ToolShareBar } from "@/components/site/tool-share-bar";

const LB_PER_KG = 2.20462;
const CM_PER_IN = 2.54;

const GENERAL_NOTE = "Estimates for general information only. They are not medical advice.";

/* ================================================================== */
/* BMI calculator                                                      */
/* ================================================================== */

export function BmiCalculator() {
  const [params, setParams] = useToolState({ units: "metric", weight: "70", height: "175" });
  const { units, weight, height } = params;
  const metric = units === "metric";

  const kg = metric ? num(weight) : num(weight) / LB_PER_KG;
  const m = metric ? num(height) / 100 : (num(height) * CM_PER_IN) / 100;
  const valid = kg > 0 && m > 0;
  const bmi = valid ? kg / (m * m) : 0;

  const band = bmi < 18.5
    ? { label: "Underweight", tone: "warn" as const }
    : bmi < 25
      ? { label: "Healthy weight", tone: "good" as const }
      : bmi < 30
        ? { label: "Overweight", tone: "warn" as const }
        : { label: "Obesity", tone: "bad" as const };

  const showWeight = (k: number) => (metric ? `${fmtNum(k, 1)} kg` : `${fmtNum(k * LB_PER_KG, 1)} lb`);

  // Switching units converts the values already entered, so the result stays the same.
  const changeUnits = (next: string) => {
    if (next === units) return;
    if (next === "imperial") {
      setParams({
        units: next,
        weight: String(Math.round(kg * LB_PER_KG)),
        height: String(Math.round((m * 100) / CM_PER_IN)),
      });
    } else {
      setParams({ units: next, weight: String(Math.round(kg)), height: String(Math.round(m * 100)) });
    }
  };

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <SelectField
            label="Units"
            value={units}
            onChange={changeUnits}
            options={[
              { value: "metric", label: "Metric (kg, cm)" },
              { value: "imperial", label: "Imperial (lb, in)" },
            ]}
          />
          <FieldGrid>
            <NumberField
              label="Weight"
              value={weight}
              onChange={(v) => setParams({ weight: v })}
              suffix={metric ? "kg" : "lb"}
              min={0}
            />
            <NumberField
              label="Height"
              value={height}
              onChange={(v) => setParams({ height: v })}
              suffix={metric ? "cm" : "in"}
              min={0}
            />
          </FieldGrid>
        </div>
      }
      results={
        !valid ? (
          <Verdict tone="bad">Enter a weight and height above zero.</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero label="Body mass index" value={fmtNum(bmi, 1)} sub={band.label} />
            <div>
              <StatRow label="Healthy weight range for your height" value={`${showWeight(18.5 * m * m)} to ${showWeight(24.9 * m * m)}`} emphasis />
              <StatRow label="Your weight" value={showWeight(kg)} />
            </div>
            <Verdict tone={band.tone}>
              Adult categories: under 18.5 underweight, 18.5 to 24.9 healthy, 25 to 29.9 overweight, 30 and above obesity.
            </Verdict>
            <Verdict tone="neutral">{GENERAL_NOTE} BMI does not separate muscle from fat, so it can mislead for athletes.</Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* Calorie (TDEE) calculator                                           */
/* ================================================================== */

const ACTIVITY_LEVELS = [
  { value: "1.2", label: "Little or no exercise" },
  { value: "1.375", label: "Light, 1 to 3 days a week" },
  { value: "1.55", label: "Moderate, 3 to 5 days a week" },
  { value: "1.725", label: "Hard, 6 to 7 days a week" },
  { value: "1.9", label: "Very hard, or a physical job" },
];

export function CalorieCalculator() {
  const [params, setParams] = useToolState({
    sex: "male",
    age: "30",
    weight: "75",
    height: "175",
    activity: "1.55",
  });
  const { sex, age, weight, height, activity } = params;

  const bmr = 10 * num(weight) + 6.25 * num(height) - 5 * num(age) + (sex === "male" ? 5 : -161);
  const maintain = bmr * Number(activity);
  const lose = maintain - 500;
  const gain = maintain + 250;
  const floor = sex === "male" ? 1500 : 1200;

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <FieldGrid>
            <SelectField
              label="Sex at birth"
              value={sex}
              onChange={(v) => setParams({ sex: v })}
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
            />
            <NumberField label="Age" value={age} onChange={(v) => setParams({ age: v })} suffix="years" min={15} />
            <NumberField label="Weight" value={weight} onChange={(v) => setParams({ weight: v })} suffix="kg" min={0} />
            <NumberField label="Height" value={height} onChange={(v) => setParams({ height: v })} suffix="cm" min={0} />
          </FieldGrid>
          <SelectField label="Activity level" value={activity} onChange={(v) => setParams({ activity: v })} options={ACTIVITY_LEVELS} />
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultHero label="Maintenance calories a day" value={`${Math.round(maintain).toLocaleString("en-US")} kcal`} sub="Eating this keeps your weight steady" />
          <div>
            <StatRow label="Resting energy (BMR)" value={`${Math.round(bmr).toLocaleString("en-US")} kcal`} />
            <StatRow label="To lose about 0.5 kg a week" value={`${Math.round(lose).toLocaleString("en-US")} kcal`} emphasis />
            <StatRow label="To gain about 0.25 kg a week" value={`${Math.round(gain).toLocaleString("en-US")} kcal`} />
          </div>
          {lose < floor && (
            <Verdict tone="warn">
              The deficit target falls below {floor.toLocaleString("en-US")} kcal a day. Very low intakes need medical supervision.
            </Verdict>
          )}
          <Verdict tone="neutral">{GENERAL_NOTE} The figures use the Mifflin-St Jeor equation and an activity multiplier, so real needs vary.</Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* Pregnancy due date calculator                                       */
/* ================================================================== */

export function PregnancyDueDateCalculator() {
  const [params, setParams] = useToolState({ lmp: "2026-03-01", cycle: "28" });
  const { lmp, cycle } = params;

  const start = parseISODate(lmp);
  const cycleLength = num(cycle);
  const valid = start !== null && cycleLength >= 20 && cycleLength <= 45;
  // Naegele's rule counts 280 days from the first day of the last period, for a 28-day cycle.
  const shift = cycleLength - 28;
  const addDays = (d: Date, n: number) => {
    const out = new Date(d);
    out.setDate(out.getDate() + n);
    return out;
  };
  const due = valid ? addDays(start, 280 + shift) : null;
  const conception = valid ? addDays(start, 14 + shift) : null;
  const midpoint = valid ? addDays(start, 140) : null;

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <FieldGrid>
            <TextField
              label="First day of your last period"
              type="date"
              value={lmp}
              onChange={(v) => setParams({ lmp: v })}
            />
            <NumberField
              label="Average cycle length"
              value={cycle}
              onChange={(v) => setParams({ cycle: v })}
              suffix="days"
              min={20}
              hint="Most cycles are 21 to 35 days"
            />
          </FieldGrid>
        </div>
      }
      results={
        !valid || !due || !conception || !midpoint ? (
          <Verdict tone="bad">Enter the first day of your last period and a cycle length from 20 to 45 days.</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero label="Estimated due date" value={fmtDate(due, { weekday: "long", day: "numeric", month: "long", year: "numeric" })} sub="Based on 40 weeks from your last period" />
            <div>
              <StatRow label="Estimated conception" value={fmtDate(conception)} />
              <StatRow label="Week 20 (mid-pregnancy)" value={fmtDate(midpoint)} />
              <StatRow label="Due date" value={fmtDate(due)} emphasis />
            </div>
            <Verdict tone="neutral">
              {GENERAL_NOTE} Only about 4 in 100 babies arrive on the due date. Your midwife or doctor confirms dates with an early scan.
            </Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* Body fat percentage (US Navy method)                                */
/* ================================================================== */

export function BodyFatCalculator() {
  const [params, setParams] = useToolState({
    sex: "male",
    height: "178",
    neck: "38",
    waist: "88",
    hip: "98",
  });
  const { sex, height, neck, waist, hip } = params;
  const male = sex === "male";

  const h = num(height);
  const n = num(neck);
  const w = num(waist);
  const hp = num(hip);
  const measure = male ? w - n : w + hp - n;
  const valid = h > 0 && n > 0 && w > 0 && measure > 0 && (male || hp > 0);
  const bodyFat = valid
    ? male
      ? 86.01 * Math.log10(measure) - 70.041 * Math.log10(h) + 36.76
      : 163.205 * Math.log10(measure) - 97.684 * Math.log10(h) - 78.387
    : 0;

  const category = !valid
    ? null
    : male
      ? bodyFat < 6 ? "Essential fat" : bodyFat < 14 ? "Athletic" : bodyFat < 18 ? "Fitness" : bodyFat < 25 ? "Average" : "Above average"
      : bodyFat < 14 ? "Essential fat" : bodyFat < 21 ? "Athletic" : bodyFat < 25 ? "Fitness" : bodyFat < 32 ? "Average" : "Above average";

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <FieldGrid>
            <SelectField
              label="Sex at birth"
              value={sex}
              onChange={(v) => setParams({ sex: v })}
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
            />
            <NumberField label="Height" value={height} onChange={(v) => setParams({ height: v })} suffix="cm" min={0} />
            <NumberField label="Neck" value={neck} onChange={(v) => setParams({ neck: v })} suffix="cm" min={0} hint="Below the larynx, at its narrowest" />
            <NumberField label="Waist" value={waist} onChange={(v) => setParams({ waist: v })} suffix="cm" min={0} hint="At the navel for men, narrowest point for women" />
            {!male && (
              <NumberField label="Hip" value={hip} onChange={(v) => setParams({ hip: v })} suffix="cm" min={0} hint="At the widest point" />
            )}
          </FieldGrid>
        </div>
      }
      results={
        !valid ? (
          <Verdict tone="bad">
            {male ? "The waist must be larger than the neck." : "Waist plus hip must be larger than the neck."}
          </Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero label="Estimated body fat" value={`${fmtNum(bodyFat, 1)}%`} sub={category ?? undefined} />
            <div>
              <StatRow label="Method" value="US Navy tape measure" />
              <StatRow label="Category" value={category ?? "—"} emphasis />
            </div>
            <Verdict tone="neutral">
              {GENERAL_NOTE} Tape estimates usually fall within about 3 to 4 percentage points of a scan.
            </Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* Target heart rate zones                                             */
/* ================================================================== */

const HR_ZONES: { name: string; low: number; high: number; use: string }[] = [
  { name: "Zone 1, very light", low: 50, high: 60, use: "Warm-up and recovery" },
  { name: "Zone 2, light", low: 60, high: 70, use: "Easy aerobic base" },
  { name: "Zone 3, moderate", low: 70, high: 80, use: "Steady cardio" },
  { name: "Zone 4, hard", low: 80, high: 90, use: "Intervals and threshold" },
  { name: "Zone 5, maximum", low: 90, high: 100, use: "Short all-out efforts" },
];

export function TargetHeartRateCalculator() {
  const [params, setParams] = useToolState({ age: "35" });
  const { age } = params;
  const maxHr = 220 - num(age);
  const valid = num(age) >= 10 && num(age) <= 100;

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <NumberField label="Age" value={age} onChange={(v) => setParams({ age: v })} suffix="years" min={10} hint="Uses the common estimate: 220 minus age" />
        </div>
      }
      results={
        !valid ? (
          <Verdict tone="bad">Enter an age between 10 and 100.</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero label="Estimated maximum heart rate" value={`${maxHr} bpm`} sub="220 minus your age" />
            <div>
              {HR_ZONES.map((z) => (
                <StatRow
                  key={z.name}
                  label={`${z.name} (${z.use})`}
                  value={`${Math.round((maxHr * z.low) / 100)} to ${Math.round((maxHr * z.high) / 100)} bpm`}
                />
              ))}
            </div>
            <Verdict tone="neutral">
              {GENERAL_NOTE} Age-based maximums can be off by 10 or more beats either way. Beta blockers and some conditions change heart rate, so ask a clinician before intense training.
            </Verdict>
          </div>
        )
      }
    />
  );
}
