"use client";

import * as React from "react";
import { CalcLayout, FieldGrid, NumberField, ResultHero, SelectField, StatRow, Verdict } from "./ui";
import { fmtNum, num } from "@/lib/format";
import { formatResult } from "@/lib/math";
import { useToolState } from "@/hooks/use-tool-state";
import { ToolShareBar } from "@/components/site/tool-share-bar";

const UNITS = [
  // Radix Select can't take an empty value, so "none" stands for unitless.
  { value: "none", label: "No unit" },
  { value: "mm", label: "Millimetres (mm)" },
  { value: "cm", label: "Centimetres (cm)" },
  { value: "m", label: "Metres (m)" },
  { value: "km", label: "Kilometres (km)" },
  { value: "in", label: "Inches (in)" },
  { value: "ft", label: "Feet (ft)" },
  { value: "yd", label: "Yards (yd)" },
];

/** Litres in one cubic unit, for the capacity line on the volume calculator. */
const LITRES_PER_CUBIC: Record<string, number> = {
  mm: 1e-6,
  cm: 1e-3,
  m: 1000,
  in: 0.016387064,
  ft: 28.316846592,
  yd: 764.554857984,
};

const withUnit = (v: number, unit: string, power: 1 | 2 | 3 = 1) =>
  `${fmtNum(v, Math.abs(v) >= 1000 ? 2 : 4)}${unit !== "none" ? ` ${unit}${power === 2 ? "²" : power === 3 ? "³" : ""}` : ""}`;

const deg = (rad: number) => (rad * 180) / Math.PI;

/* ================================================================== */
/* Pythagorean theorem                                                 */
/* ================================================================== */

/** Right triangle with the unknown side drawn in the accent colour. */
function TriangleDiagram({ unknown }: { unknown: "a" | "b" | "c" }) {
  const stroke = (side: "a" | "b" | "c") =>
    side === unknown ? { stroke: "var(--primary)", strokeWidth: 4 } : { stroke: "currentColor", strokeWidth: 2 };
  return (
    <svg viewBox="0 0 220 150" className="mx-auto h-36 w-auto text-foreground" role="img" aria-label={`Right triangle, solving for side ${unknown}`}>
      <line x1="30" y1="20" x2="30" y2="125" {...stroke("a")} strokeLinecap="round" />
      <line x1="30" y1="125" x2="190" y2="125" {...stroke("b")} strokeLinecap="round" />
      <line x1="30" y1="20" x2="190" y2="125" {...stroke("c")} strokeLinecap="round" />
      <polyline points="30,111 44,111 44,125" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <text x="14" y="78" className="fill-current text-[15px] font-semibold">a</text>
      <text x="106" y="144" className="fill-current text-[15px] font-semibold">b</text>
      <text x="116" y="64" className="fill-current text-[15px] font-semibold">c</text>
      <text x="168" y="118" className="fill-current text-[11px]" opacity="0.7">A</text>
      <text x="36" y="40" className="fill-current text-[11px]" opacity="0.7">B</text>
    </svg>
  );
}

export function PythagoreanTheoremCalculator() {
  const [params, setParams] = useToolState({ solve: "c", a: "3", b: "4", c: "5", unit: "none" });
  const solve = params.solve as "a" | "b" | "c";
  let a = num(params.a, NaN);
  let b = num(params.b, NaN);
  let c = num(params.c, NaN);

  let problem = "";
  if (solve === "c") c = Math.hypot(a, b);
  else {
    const leg = solve === "a" ? b : a;
    if (isFinite(c) && isFinite(leg) && c <= leg) problem = "The hypotenuse c must be longer than either leg.";
    else if (solve === "a") a = Math.sqrt(c * c - b * b);
    else b = Math.sqrt(c * c - a * a);
  }
  if (!problem && (!(a > 0) || !(b > 0) || !(c > 0))) problem = "Enter two positive side lengths.";

  const unknownValue = solve === "a" ? a : solve === "b" ? b : c;
  const formula =
    solve === "c" ? "c = √(a² + b²)" : solve === "a" ? "a = √(c² − b²)" : "b = √(c² − a²)";
  const field = (side: "a" | "b" | "c", label: string) =>
    side === solve ? null : (
      <NumberField key={side} label={label} value={params[side]} onChange={(v) => setParams({ [side]: v })} />
    );

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <FieldGrid>
            <SelectField
              label="Find"
              value={solve}
              onChange={(v) => setParams({ solve: v })}
              options={[
                { value: "c", label: "Hypotenuse c" },
                { value: "a", label: "Leg a" },
                { value: "b", label: "Leg b" },
              ]}
            />
            <SelectField label="Unit" value={params.unit} onChange={(v) => setParams({ unit: v })} options={UNITS} />
          </FieldGrid>
          <FieldGrid>
            {field("a", "Leg a")}
            {field("b", "Leg b")}
            {field("c", "Hypotenuse c")}
          </FieldGrid>
          <TriangleDiagram unknown={solve} />
        </div>
      }
      results={
        problem ? (
          <Verdict tone={problem.startsWith("The") ? "bad" : "neutral"}>{problem}</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero label={solve === "c" ? "Hypotenuse c" : `Leg ${solve}`} value={withUnit(unknownValue, params.unit)} sub={formula} />
            <div>
              <StatRow label="Angle A (opposite a)" value={`${formatResult(Number(deg(Math.atan2(a, b)).toFixed(4)))}°`} emphasis />
              <StatRow label="Angle B (opposite b)" value={`${formatResult(Number(deg(Math.atan2(b, a)).toFixed(4)))}°`} />
              <StatRow label="Area" value={withUnit((a * b) / 2, params.unit, 2)} />
              <StatRow label="Perimeter" value={withUnit(a + b + c, params.unit)} />
            </div>
            <Verdict tone="neutral">
              The two short sides squared add up to the long side squared: {formatResult(a)}² + {formatResult(b)}² ={" "}
              {formatResult(c)}².
            </Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* Area calculator                                                     */
/* ================================================================== */

interface ShapeSpec {
  label: string;
  fields: { key: string; label: string }[];
  formula: string;
  /** Area for flat shapes, volume for solids. */
  main: (v: Record<string, number>) => number;
  /** Perimeter for flat shapes, surface area for solids. */
  extra?: (v: Record<string, number>) => number;
  extraLabel?: string;
  check?: (v: Record<string, number>) => string;
}

const AREA_SHAPES: Record<string, ShapeSpec> = {
  rectangle: {
    label: "Rectangle",
    fields: [{ key: "l", label: "Length" }, { key: "w", label: "Width" }],
    formula: "A = length × width",
    main: (v) => v.l * v.w,
    extra: (v) => 2 * (v.l + v.w),
  },
  square: {
    label: "Square",
    fields: [{ key: "s", label: "Side" }],
    formula: "A = side²",
    main: (v) => v.s * v.s,
    extra: (v) => 4 * v.s,
  },
  triangle: {
    label: "Triangle (base and height)",
    fields: [{ key: "b", label: "Base" }, { key: "h", label: "Height" }],
    formula: "A = ½ × base × height",
    main: (v) => (v.b * v.h) / 2,
  },
  heron: {
    label: "Triangle (three sides)",
    fields: [{ key: "a", label: "Side a" }, { key: "b", label: "Side b" }, { key: "c", label: "Side c" }],
    formula: "Heron: A = √(s(s−a)(s−b)(s−c)), s = half the perimeter",
    main: (v) => {
      const s = (v.a + v.b + v.c) / 2;
      return Math.sqrt(s * (s - v.a) * (s - v.b) * (s - v.c));
    },
    extra: (v) => v.a + v.b + v.c,
    check: (v) =>
      v.a + v.b <= v.c || v.a + v.c <= v.b || v.b + v.c <= v.a
        ? "Those sides can't close into a triangle: any two must add up to more than the third."
        : "",
  },
  circle: {
    label: "Circle",
    fields: [{ key: "r", label: "Radius" }],
    formula: "A = πr²",
    main: (v) => Math.PI * v.r * v.r,
    extra: (v) => 2 * Math.PI * v.r,
    extraLabel: "Circumference",
  },
  trapezoid: {
    label: "Trapezoid",
    fields: [{ key: "a", label: "Parallel side a" }, { key: "b", label: "Parallel side b" }, { key: "h", label: "Height" }],
    formula: "A = ½ × (a + b) × height",
    main: (v) => ((v.a + v.b) / 2) * v.h,
  },
  parallelogram: {
    label: "Parallelogram",
    fields: [{ key: "b", label: "Base" }, { key: "h", label: "Height" }, { key: "s", label: "Slanted side" }],
    formula: "A = base × height",
    main: (v) => v.b * v.h,
    extra: (v) => 2 * (v.b + v.s),
    check: (v) => (v.s < v.h ? "The slanted side can't be shorter than the height." : ""),
  },
  ellipse: {
    label: "Ellipse",
    fields: [{ key: "a", label: "Semi-major axis" }, { key: "b", label: "Semi-minor axis" }],
    formula: "A = π × a × b",
    main: (v) => Math.PI * v.a * v.b,
    // Ramanujan's approximation, accurate to well under 0.01% for everyday ellipses.
    extra: (v) => Math.PI * (3 * (v.a + v.b) - Math.sqrt((3 * v.a + v.b) * (v.a + 3 * v.b))),
    extraLabel: "Perimeter (approx.)",
  },
};

const AREA_DEFAULTS = { shape: "rectangle", unit: "m", l: "8", w: "5", s: "6", b: "10", h: "4", a: "7", c: "5", r: "3" };

function shapeValues(spec: ShapeSpec, params: Record<string, string>) {
  const values: Record<string, number> = {};
  for (const f of spec.fields) values[f.key] = num(params[f.key], NaN);
  const missing = spec.fields.some((f) => !(values[f.key] > 0));
  const problem = missing ? "Enter every measurement as a positive number." : (spec.check?.(values) ?? "");
  return { values, problem };
}

export function AreaCalculator() {
  const [params, setParams] = useToolState(AREA_DEFAULTS);
  const spec = AREA_SHAPES[params.shape] ?? AREA_SHAPES.rectangle;
  const { values, problem } = shapeValues(spec, params);
  const unit = params.unit;
  const area = problem ? NaN : spec.main(values);
  const perimeter = problem || !spec.extra ? NaN : spec.extra(values);

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <FieldGrid>
            <SelectField
              label="Shape"
              value={params.shape}
              onChange={(v) => setParams({ shape: v })}
              options={Object.entries(AREA_SHAPES).map(([value, s]) => ({ value, label: s.label }))}
            />
            <SelectField label="Unit" value={unit} onChange={(v) => setParams({ unit: v })} options={UNITS} />
          </FieldGrid>
          <FieldGrid cols={spec.fields.length === 3 ? 3 : 2}>
            {spec.fields.map((f) => (
              <NumberField
                key={f.key}
                label={f.label}
                value={params[f.key as keyof typeof AREA_DEFAULTS]}
                onChange={(v) => setParams({ [f.key]: v })}
                suffix={unit === "none" ? undefined : unit}
              />
            ))}
          </FieldGrid>
          <Verdict tone="neutral">Height always means the perpendicular height, measured at a right angle to the base.</Verdict>
        </div>
      }
      results={
        problem ? (
          <Verdict tone={spec.check?.(values) ? "bad" : "neutral"}>{problem}</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero label={`Area of the ${spec.label.split(" (")[0].toLowerCase()}`} value={withUnit(area, unit, 2)} sub={spec.formula} />
            <div>
              {spec.extra && <StatRow label={spec.extraLabel ?? "Perimeter"} value={withUnit(perimeter, unit)} emphasis />}
              {params.shape === "circle" && <StatRow label="Diameter" value={withUnit(2 * values.r, unit)} />}
              {unit === "m" && <StatRow label="In hectares" value={fmtNum(area / 10000, 4)} />}
              {unit === "ft" && <StatRow label="In acres" value={fmtNum(area / 43560, 4)} />}
            </div>
            {!spec.extra && (
              <Verdict tone="neutral">
                The perimeter needs the length of every side, which base and height alone don&apos;t give. Use the
                three-sides triangle for a perimeter.
              </Verdict>
            )}
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* Volume calculator                                                   */
/* ================================================================== */

const VOLUME_SHAPES: Record<string, ShapeSpec> = {
  cube: {
    label: "Cube",
    fields: [{ key: "s", label: "Side" }],
    formula: "V = side³",
    main: (v) => v.s ** 3,
    extra: (v) => 6 * v.s * v.s,
  },
  cuboid: {
    label: "Rectangular box (cuboid)",
    fields: [{ key: "l", label: "Length" }, { key: "w", label: "Width" }, { key: "h", label: "Height" }],
    formula: "V = length × width × height",
    main: (v) => v.l * v.w * v.h,
    extra: (v) => 2 * (v.l * v.w + v.l * v.h + v.w * v.h),
  },
  cylinder: {
    label: "Cylinder",
    fields: [{ key: "r", label: "Radius" }, { key: "h", label: "Height" }],
    formula: "V = πr²h",
    main: (v) => Math.PI * v.r * v.r * v.h,
    extra: (v) => 2 * Math.PI * v.r * (v.r + v.h),
  },
  sphere: {
    label: "Sphere",
    fields: [{ key: "r", label: "Radius" }],
    formula: "V = ⁴⁄₃πr³",
    main: (v) => (4 / 3) * Math.PI * v.r ** 3,
    extra: (v) => 4 * Math.PI * v.r * v.r,
  },
  hemisphere: {
    label: "Hemisphere",
    fields: [{ key: "r", label: "Radius" }],
    formula: "V = ⅔πr³",
    main: (v) => (2 / 3) * Math.PI * v.r ** 3,
    extra: (v) => 3 * Math.PI * v.r * v.r,
  },
  cone: {
    label: "Cone",
    fields: [{ key: "r", label: "Base radius" }, { key: "h", label: "Height" }],
    formula: "V = ⅓πr²h",
    main: (v) => (Math.PI * v.r * v.r * v.h) / 3,
    extra: (v) => Math.PI * v.r * (v.r + Math.hypot(v.r, v.h)),
  },
  pyramid: {
    label: "Rectangular pyramid",
    fields: [{ key: "l", label: "Base length" }, { key: "w", label: "Base width" }, { key: "h", label: "Height" }],
    formula: "V = ⅓ × length × width × height",
    main: (v) => (v.l * v.w * v.h) / 3,
    extra: (v) =>
      v.l * v.w + v.l * Math.hypot(v.w / 2, v.h) + v.w * Math.hypot(v.l / 2, v.h),
  },
};

const VOLUME_DEFAULTS = { shape: "cylinder", unit: "cm", s: "10", l: "30", w: "20", h: "25", r: "5" };

export function VolumeCalculator() {
  const [params, setParams] = useToolState(VOLUME_DEFAULTS);
  const spec = VOLUME_SHAPES[params.shape] ?? VOLUME_SHAPES.cylinder;
  const { values, problem } = shapeValues(spec, params);
  const unit = params.unit;
  const volume = problem ? NaN : spec.main(values);
  const surface = problem ? NaN : spec.extra!(values);
  const litres = LITRES_PER_CUBIC[unit] ? volume * LITRES_PER_CUBIC[unit] : NaN;

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <FieldGrid>
            <SelectField
              label="Solid"
              value={params.shape}
              onChange={(v) => setParams({ shape: v })}
              options={Object.entries(VOLUME_SHAPES).map(([value, s]) => ({ value, label: s.label }))}
            />
            <SelectField label="Unit" value={unit} onChange={(v) => setParams({ unit: v })} options={UNITS} />
          </FieldGrid>
          <FieldGrid cols={spec.fields.length === 3 ? 3 : 2}>
            {spec.fields.map((f) => (
              <NumberField
                key={f.key}
                label={f.label}
                value={params[f.key as keyof typeof VOLUME_DEFAULTS]}
                onChange={(v) => setParams({ [f.key]: v })}
                suffix={unit === "none" ? undefined : unit}
              />
            ))}
          </FieldGrid>
          <Verdict tone="neutral">Use the inside measurements of a container to find how much it holds.</Verdict>
        </div>
      }
      results={
        problem ? (
          <Verdict tone="neutral">{problem}</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero label={`Volume of the ${spec.label.split(" (")[0].toLowerCase()}`} value={withUnit(volume, unit, 3)} sub={spec.formula} />
            <div>
              <StatRow label="Surface area" value={withUnit(surface, unit, 2)} emphasis />
              {isFinite(litres) && (
                <>
                  <StatRow label="Capacity in litres" value={`${fmtNum(litres, litres >= 100 ? 1 : 3)} L`} />
                  <StatRow label="Capacity in US gallons" value={`${fmtNum(litres / 3.785411784, 3)} gal`} />
                </>
              )}
            </div>
          </div>
        )
      }
    />
  );
}
