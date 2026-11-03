"use client";

import * as React from "react";
import {
  CalcLayout,
  CopyButton,
  FieldGrid,
  MiniTable,
  NumberField,
  ResultHero,
  SelectField,
  StatRow,
  TextField,
  Verdict,
} from "./ui";
import { fmtNum, num } from "@/lib/format";
import { useToolState } from "@/hooks/use-tool-state";
import { ToolShareBar } from "@/components/site/tool-share-bar";
import {
  combinations,
  divisorsFromFactors,
  formatBig,
  formatFactors,
  formatResult,
  gcd,
  isPrime,
  lcmAll,
  nextPrime,
  permutations,
  previousPrime,
  primeFactors,
  roundTo,
  roundToMultiple,
  simplifyRatio,
  solveQuadratic,
  type RoundMethod,
} from "@/lib/math";

/* ================================================================== */
/* Percentage calculator                                               */
/* ================================================================== */

const PCT_MODES = [
  { value: "of", label: "X% of Y" },
  { value: "iswhat", label: "X is what % of Y" },
  { value: "change", label: "% change from X to Y" },
];

export function PercentageCalculator() {
  const [mode, setMode] = React.useState("of");
  const [a, setA] = React.useState("15");
  const [b, setB] = React.useState("240");

  const x = num(a, NaN);
  const y = num(b, NaN);

  let heroLabel = "";
  let heroValue = "";
  let formula = "";
  const extras: { label: string; value: string }[] = [];

  if (mode === "of") {
    const r = (x * y) / 100;
    heroLabel = `${fmtNum(x)}% of ${fmtNum(y)}`;
    heroValue = isFinite(r) ? fmtNum(r, Math.abs(r) < 100 && r % 1 !== 0 ? 2 : 0) : "—";
    formula = "percent × value ÷ 100";
    extras.push(
      { label: `${fmtNum(y)} increased by ${fmtNum(x)}%`, value: isFinite(r) ? fmtNum(y * (1 + x / 100), 2) : "—" },
      { label: `${fmtNum(y)} decreased by ${fmtNum(x)}%`, value: isFinite(r) ? fmtNum(y * (1 - x / 100), 2) : "—" }
    );
  } else if (mode === "iswhat") {
    const r = (x / y) * 100;
    heroLabel = `${fmtNum(x)} as a share of ${fmtNum(y)}`;
    heroValue = isFinite(r) ? `${fmtNum(r, 2)}%` : "—";
    formula = "part ÷ whole × 100";
    extras.push(
      { label: "Difference (whole − part)", value: isFinite(r) ? fmtNum(y - x, 2) : "—" },
      { label: "Part as a fraction of whole", value: isFinite(r) && y !== 0 ? fmtNum(x / y, 4) : "—" }
    );
  } else {
    const r = isFinite(x) && x !== 0 ? ((y - x) / Math.abs(x)) * 100 : NaN;
    heroLabel = `Change from ${fmtNum(x)} to ${fmtNum(y)}`;
    heroValue = isFinite(r) ? `${r > 0 ? "+" : ""}${fmtNum(r, 2)}%` : "—";
    formula = "(new − old) ÷ |old| × 100";
    extras.push(
      { label: "Multiplier", value: isFinite(r) && x !== 0 ? `${fmtNum(y / x, 3)}x` : "—" },
      {
        label: "Change to get back",
        value: isFinite(r) && y !== 0 ? `${fmtNum(((x - y) / Math.abs(y)) * 100, 2)}%` : "—",
      }
    );
  }

  const labelA = mode === "of" ? "Percent" : mode === "iswhat" ? "Part" : "Original value";
  const labelB = mode === "of" ? "Of value" : mode === "iswhat" ? "Whole" : "New value";

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <SelectField label="What do you need?" value={mode} onChange={setMode} options={PCT_MODES} />
          <FieldGrid>
            <NumberField label={labelA} value={a} onChange={setA} suffix={mode === "of" ? "%" : undefined} />
            <NumberField label={labelB} value={b} onChange={setB} />
          </FieldGrid>
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultHero label={heroLabel} value={heroValue} sub={`Formula: ${formula}`} />
          {extras.length > 0 && (
            <div>
              {extras.map((e) => (
                <StatRow key={e.label} label={e.label} value={e.value} />
              ))}
            </div>
          )}
          <Verdict tone="neutral">
            {mode === "change"
              ? "A +25% rise needs only −20% to undo: percentage changes are not symmetric, they divide by different bases."
              : "Percentages always divide by a base — when a stat surprises you, ask what the base was."}
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* Fraction calculator                                                 */
/* ================================================================== */

function fractionGcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x || 1;
}

const FRACTION_OPS = [
  { value: "add", label: "Add (+)" },
  { value: "subtract", label: "Subtract (−)" },
  { value: "multiply", label: "Multiply (×)" },
  { value: "divide", label: "Divide (÷)" },
];

export function FractionCalculator() {
  const [params, setParams] = useToolState({ n1: "3", d1: "4", op: "add", n2: "2", d2: "5" });
  const { n1, d1, op, n2, d2 } = params;

  const a = Math.floor(num(n1));
  const b = Math.floor(num(d1));
  const c = Math.floor(num(n2));
  const d = Math.floor(num(d2));
  const problem =
    b === 0 || d === 0
      ? "A denominator cannot be zero."
      : op === "divide" && c === 0
        ? "You cannot divide by zero."
        : "";

  let rn = 0;
  let rd = 1;
  if (!problem) {
    if (op === "add") {
      rn = a * d + c * b;
      rd = b * d;
    } else if (op === "subtract") {
      rn = a * d - c * b;
      rd = b * d;
    } else if (op === "multiply") {
      rn = a * c;
      rd = b * d;
    } else {
      rn = a * d;
      rd = b * c;
    }
    if (rd < 0) {
      rn = -rn;
      rd = -rd;
    }
    const g = fractionGcd(rn, rd);
    rn /= g;
    rd /= g;
  }

  const whole = Math.trunc(rn / rd);
  const remainder = Math.abs(rn) % rd;
  const simple = rd === 1 ? `${rn}` : `${rn}/${rd}`;
  const mixed = remainder === 0 ? `${whole}` : whole === 0 ? simple : `${whole} ${remainder}/${rd}`;
  const decimal = rn / rd;

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <FieldGrid cols={3}>
            <NumberField label="Numerator" value={n1} onChange={(v) => setParams({ n1: v })} ariaLabel="First numerator" />
            <NumberField label="Denominator" value={d1} onChange={(v) => setParams({ d1: v })} ariaLabel="First denominator" />
            <SelectField label="Operation" value={op} onChange={(v) => setParams({ op: v })} options={FRACTION_OPS} />
            <NumberField label="Numerator" value={n2} onChange={(v) => setParams({ n2: v })} ariaLabel="Second numerator" />
            <NumberField label="Denominator" value={d2} onChange={(v) => setParams({ d2: v })} ariaLabel="Second denominator" />
          </FieldGrid>
        </div>
      }
      results={
        problem ? (
          <Verdict tone="bad">{problem}</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label="Simplified result"
              value={simple}
              sub={`Mixed number ${mixed}`}
            />
            <div>
              <StatRow label="Decimal" value={fmtNum(decimal, 4)} emphasis />
              <StatRow label="Mixed number" value={mixed} />
            </div>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* Ratio calculator                                                    */
/* ================================================================== */

const RATIO_MODES = [
  { value: "solve", label: "Find the missing value (A : B = C : ?)" },
  { value: "simplify", label: "Simplify a ratio (A : B)" },
];

const ratioText = (parts: number[]) => parts.map((p) => fmtNum(p, p % 1 === 0 ? 0 : 4)).join(" : ");

export function RatioCalculator() {
  const [params, setParams] = useToolState({ mode: "solve", a: "3", b: "5", c: "12" });
  const { mode, a, b, c } = params;
  const x = num(a, NaN);
  const y = num(b, NaN);
  const z = num(c, NaN);
  const needsC = mode === "solve";

  const problem =
    !isFinite(x) || !isFinite(y) || (needsC && !isFinite(z))
      ? "Fill in every value."
      : x <= 0 || y <= 0 || (needsC && z <= 0)
        ? "Ratios here use positive numbers only."
        : "";

  const simplified = problem ? [] : simplifyRatio([x, y]);
  const d = (y * z) / x;

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <SelectField label="What do you need?" value={mode} onChange={(v) => setParams({ mode: v })} options={RATIO_MODES} />
          <FieldGrid cols={needsC ? 3 : 2}>
            <NumberField label="A" value={a} onChange={(v) => setParams({ a: v })} />
            <NumberField label="B" value={b} onChange={(v) => setParams({ b: v })} />
            {needsC && <NumberField label="C" value={c} onChange={(v) => setParams({ c: v })} hint="The value that matches A" />}
          </FieldGrid>
          <Verdict tone="neutral">
            {needsC
              ? "Read it as “A is to B as C is to ?”. For a recipe that uses 3 cups of flour to 5 of water, enter 3, 5 and the flour you actually have."
              : "Decimals are fine: 1.5 : 2.25 is scaled to whole numbers before it is reduced."}
          </Verdict>
        </div>
      }
      results={
        problem ? (
          <Verdict tone="neutral">{problem}</Verdict>
        ) : needsC ? (
          <div className="space-y-4">
            <ResultHero
              label="Missing value"
              value={formatResult(d)}
              sub={`${ratioText([x, y])} = ${ratioText([z])} : ${formatResult(d)}`}
            />
            <div>
              <StatRow label="Scale factor (C ÷ A)" value={`${formatResult(z / x)}×`} emphasis />
              <StatRow label="A : B in simplest form" value={ratioText(simplified)} />
              <StatRow label="Formula" value="? = B × C ÷ A" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <ResultHero label="Simplest form" value={ratioText(simplified)} sub={`From ${ratioText([x, y])}`} />
            <div>
              <StatRow label="As 1 : n" value={`1 : ${formatResult(y / x)}`} emphasis />
              <StatRow label="As n : 1" value={`${formatResult(x / y)} : 1`} />
              <StatRow label="A as a share of the total" value={`${fmtNum((x / (x + y)) * 100, 2)}%`} />
              <StatRow label="B as a share of the total" value={`${fmtNum((y / (x + y)) * 100, 2)}%`} />
            </div>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* Rounding calculator                                                 */
/* ================================================================== */

const ROUND_METHODS: { value: RoundMethod; label: string; note: string }[] = [
  { value: "half-up", label: "Half up (school rule)", note: "Halves go away from zero: 2.5 → 3, −2.5 → −3." },
  { value: "half-even", label: "Half to even (banker's)", note: "Halves go to the even neighbour: 2.5 → 2, 3.5 → 4. It stops totals drifting upwards." },
  { value: "up", label: "Always up (ceiling)", note: "Any remainder goes up towards +∞: 2.01 → 3, −2.9 → −2." },
  { value: "down", label: "Always down (floor)", note: "Any remainder goes down towards −∞: 2.99 → 2, −2.1 → −3." },
  { value: "truncate", label: "Truncate (chop off)", note: "Extra digits are dropped: 2.99 → 2, −2.99 → −2." },
];

const PLACE_OPTIONS = [
  { value: "-3", label: "Nearest thousand" },
  { value: "-2", label: "Nearest hundred" },
  { value: "-1", label: "Nearest ten" },
  { value: "0", label: "Whole number" },
  ...[1, 2, 3, 4, 5, 6, 8, 10].map((p) => ({ value: String(p), label: `${p} decimal place${p === 1 ? "" : "s"}` })),
];

export function RoundingCalculator() {
  const [params, setParams] = useToolState({ value: "1234.5678", mode: "places", places: "2", step: "0.05", method: "half-up" });
  const { value, mode, places, step, method } = params;
  const v = num(value, NaN);
  const p = Number(places);
  const s = num(step, NaN);
  const byPlaces = mode === "places";
  const stepDecimals = (String(s).split(".")[1] ?? "").length;

  const problem = !isFinite(v) ? "Enter a number to round." : !byPlaces && !(s > 0) ? "The multiple must be greater than zero." : "";

  const round = (m: RoundMethod) => (byPlaces ? roundTo(v, p, m) : roundToMultiple(v, s, m));
  const show = (n: number) => fmtNum(n, byPlaces ? Math.max(0, p) : stepDecimals);
  const result = problem ? NaN : round(method as RoundMethod);
  const chosen = ROUND_METHODS.find((m) => m.value === method)!;
  // 10 significant digits drop the float noise in 1,234.57 − 1,234.5678.
  const change = Number(Math.abs(result - v).toPrecision(10));

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <NumberField label="Number to round" value={value} onChange={(x) => setParams({ value: x })} />
          <FieldGrid>
            <SelectField
              label="Round to"
              value={mode}
              onChange={(x) => setParams({ mode: x })}
              options={[
                { value: "places", label: "Decimal places" },
                { value: "multiple", label: "Nearest multiple" },
              ]}
            />
            {byPlaces ? (
              <SelectField label="Precision" value={places} onChange={(x) => setParams({ places: x })} options={PLACE_OPTIONS} />
            ) : (
              <NumberField label="Multiple" value={step} onChange={(x) => setParams({ step: x })} hint="0.05 for cash, 5 or 10 for prices" />
            )}
          </FieldGrid>
          <SelectField
            label="Rounding rule"
            value={method}
            onChange={(x) => setParams({ method: x })}
            options={ROUND_METHODS.map(({ value: mv, label }) => ({ value: mv, label }))}
          />
          <Verdict tone="neutral">{chosen.note}</Verdict>
        </div>
      }
      results={
        problem ? (
          <Verdict tone="neutral">{problem}</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label="Rounded"
              value={show(result)}
              sub={`${chosen.label}, ${byPlaces ? PLACE_OPTIONS.find((o) => o.value === places)?.label.toLowerCase() : `nearest ${step}`}`}
            />
            <div>
              <StatRow label="Original" value={formatResult(v)} />
              <StatRow label="Change" value={`${result - v >= 0 ? "+" : "−"}${formatResult(change)}`} />
            </div>
            <MiniTable
              head={["Rule", "Result"]}
              rows={ROUND_METHODS.map((m) => [m.label, show(round(m.value))])}
            />
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* Quadratic equation solver                                           */
/* ================================================================== */

/** "+ 3" / "− 3" for writing terms after the first one. */
const signed = (n: number) => `${n < 0 ? "−" : "+"} ${formatResult(Math.abs(n))}`;

function equationText(a: number, b: number, c: number): string {
  const lead = a === 1 ? "x²" : a === -1 ? "−x²" : `${formatResult(a).replace("-", "−")}x²`;
  const mid = b === 0 ? "" : ` ${b < 0 ? "−" : "+"} ${Math.abs(b) === 1 ? "" : formatResult(Math.abs(b))}x`;
  const end = c === 0 ? "" : ` ${signed(c)}`;
  return `${lead}${mid}${end} = 0`;
}

export function QuadraticEquationSolver() {
  const [params, setParams] = useToolState({ a: "2", b: "-4", c: "-6" });
  const a = num(params.a, NaN);
  const b = num(params.b, NaN);
  const c = num(params.c, NaN);
  const filled = isFinite(a) && isFinite(b) && isFinite(c);
  const roots = filled ? solveQuadratic(a, b, c) : null;
  const disc = b * b - 4 * a * c;
  const vx = -b / (2 * a);
  const vy = a * vx * vx + b * vx + c;
  const r = (n: number) => formatResult(n).replace(/^-/, "−");

  let hero = "";
  let sub = "";
  let factored = "";
  let tone: "good" | "warn" | "neutral" = "neutral";
  let verdict = "";
  if (roots) {
    switch (roots.kind) {
      case "two":
        hero = `x = ${r(roots.x1)} or ${r(roots.x2)}`;
        sub = "Two real roots";
        factored = `${a === 1 ? "" : r(a)}(x ${signed(-roots.x1)})(x ${signed(-roots.x2)})`;
        tone = "good";
        verdict = `The discriminant is positive, so the parabola crosses the x-axis at x = ${r(roots.x1)} and x = ${r(roots.x2)}.`;
        break;
      case "one":
        hero = `x = ${r(roots.x)}`;
        sub = "One repeated real root";
        factored = `${a === 1 ? "" : r(a)}(x ${signed(-roots.x)})²`;
        tone = "good";
        verdict = "The discriminant is zero, so the parabola just touches the x-axis at its vertex.";
        break;
      case "complex":
        hero = `x = ${r(roots.re)} ± ${r(roots.im)}i`;
        sub = "Two complex roots";
        tone = "warn";
        verdict = "The discriminant is negative, so the parabola never meets the x-axis and there are no real solutions.";
        break;
      case "linear":
        hero = `x = ${r(roots.x)}`;
        sub = "a is 0, so this is the linear equation bx + c = 0";
        verdict = "With no x² term the equation is a straight line with a single root.";
        break;
      case "all":
        hero = "Every x";
        sub = "0 = 0 is true for any value";
        verdict = "All three coefficients are zero, so every x is a solution.";
        break;
      case "none":
        hero = "No solution";
        sub = `${r(c)} = 0 is never true`;
        tone = "warn";
        verdict = "With a and b both zero, the equation reduces to a false statement.";
        break;
    }
  }
  const isQuadratic = roots && !["linear", "all", "none"].includes(roots.kind);

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <FieldGrid cols={3}>
            <NumberField label="a (x² term)" value={params.a} onChange={(v) => setParams({ a: v })} />
            <NumberField label="b (x term)" value={params.b} onChange={(v) => setParams({ b: v })} />
            <NumberField label="c (constant)" value={params.c} onChange={(v) => setParams({ c: v })} />
          </FieldGrid>
          {filled && (
            <p className="tnum rounded-lg bg-muted px-4 py-3 text-center text-lg font-medium">{equationText(a, b, c)}</p>
          )}
          <Verdict tone="neutral">
            Move everything to one side first: 2x² = 4x + 6 becomes 2x² − 4x − 6 = 0, so a = 2, b = −4 and c = −6.
          </Verdict>
        </div>
      }
      results={
        !roots ? (
          <Verdict tone="neutral">Enter a, b and c.</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero label="Solution" value={hero} sub={sub} />
            {isQuadratic && (
              <>
                <div>
                  <StatRow label="Discriminant b² − 4ac" value={r(disc)} emphasis />
                  <StatRow label="Vertex" value={`(${r(vx)}, ${r(vy)})`} />
                  <StatRow label="Axis of symmetry" value={`x = ${r(vx)}`} />
                  <StatRow label="Opens" value={a > 0 ? "Upwards (minimum)" : "Downwards (maximum)"} />
                  {factored && <StatRow label="Factored form" value={factored} />}
                </div>
                <MiniTable
                  head={["Step", ""]}
                  rows={[
                    ["Formula", "x = (−b ± √(b² − 4ac)) ÷ 2a"],
                    ["Substitute", `x = (${r(-b)} ± √${disc < 0 ? `(${r(disc)})` : r(disc)}) ÷ ${r(2 * a)}`],
                    [disc < 0 ? "√ of a negative" : "Square root", disc < 0 ? `√(${r(disc)}) = ${r(Math.sqrt(-disc))}i` : `√${r(disc)} = ${r(Math.sqrt(disc))}`],
                  ]}
                />
              </>
            )}
            <Verdict tone={tone}>{verdict}</Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* GCD & LCM calculator                                                */
/* ================================================================== */

export function GcdLcmCalculator() {
  const [params, setParams] = useToolState({ list: "12, 18, 30" });
  const tokens = params.list.split(/[\s,;]+/).filter(Boolean);
  const nums = tokens.map((t) => Number(t.replace(/_/g, "")));
  const bad = tokens.find((t, i) => !Number.isSafeInteger(nums[i]) || nums[i] <= 0);
  const problem = bad
    ? `“${bad}” is not a positive whole number.`
    : nums.length < 2
      ? "Enter at least two numbers."
      : nums.length > 30
        ? "Up to 30 numbers at a time."
        : "";

  const g = problem ? 0 : nums.reduce((acc, n) => gcd(acc, n), 0);
  const l = problem ? 0n : lcmAll(nums);

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <TextField
            label="Whole numbers"
            value={params.list}
            onChange={(v) => setParams({ list: v })}
            hint="Separate with commas or spaces, such as 12, 18, 30"
          />
          <Verdict tone="neutral">
            The GCD (also called the HCF) is the largest number that divides all of them. The LCM is the smallest
            number all of them divide into.
          </Verdict>
        </div>
      }
      results={
        problem ? (
          <Verdict tone="neutral">{problem}</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero label="Greatest common divisor" value={fmtNum(g)} sub={`LCM ${formatBig(l)}`} />
            <div>
              <StatRow label="Least common multiple" value={formatBig(l)} emphasis />
              <StatRow label="Coprime (GCD is 1)" value={g === 1 ? "Yes" : "No"} />
            </div>
            <MiniTable
              head={["Number", "Prime factors"]}
              rows={nums.map((n) => [fmtNum(n), n === 1 ? "1" : formatFactors(primeFactors(n))])}
            />
            <Verdict tone="neutral">
              GCD keeps only the primes every number shares, at their lowest power. LCM takes every prime that
              appears, at its highest power.
            </Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* Prime factorization & prime checker                                 */
/* ================================================================== */

export function PrimeFactorizationCalculator() {
  const [params, setParams] = useToolState({ n: "360" });
  const raw = params.n.replace(/[,\s]/g, "");
  const n = Number(raw);
  const valid = raw !== "" && Number.isSafeInteger(n) && n >= 0;

  const factors = valid && n >= 2 ? primeFactors(n) : [];
  const prime = valid && isPrime(n);
  const divisorCount = factors.reduce((acc, [, e]) => acc * (e + 1), 1);
  const divisorSum = factors.reduce((acc, [p, e]) => (acc * (BigInt(p) ** BigInt(e + 1) - 1n)) / BigInt(p - 1), 1n);
  const divisors = divisorCount <= 96 ? divisorsFromFactors(factors) : null;
  const prev = valid ? previousPrime(n) : null;
  const next = valid && n < Number.MAX_SAFE_INTEGER - 1000 ? nextPrime(n) : null;

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <NumberField
            label="Whole number"
            value={params.n}
            onChange={(v) => setParams({ n: v })}
            hint="Up to 9,007,199,254,740,991"
          />
          <Verdict tone="neutral">
            A prime has exactly two divisors, 1 and itself. Every whole number above 1 is either prime or a
            product of primes in exactly one way.
          </Verdict>
        </div>
      }
      results={
        !valid ? (
          <Verdict tone="neutral">
            {raw === "" ? "Enter a whole number." : "Enter a whole number from 0 up to 9,007,199,254,740,991."}
          </Verdict>
        ) : n < 2 ? (
          <Verdict tone="neutral">
            {n} is neither prime nor composite. Primes start at 2.
          </Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label={prime ? "Prime" : "Not prime"}
              value={prime ? fmtNum(n) : formatFactors(factors)}
              sub={prime ? `${fmtNum(n)} is divisible only by 1 and itself` : `Prime factorisation of ${fmtNum(n)}`}
            />
            <div>
              <StatRow label="Number of divisors" value={fmtNum(divisorCount)} emphasis />
              <StatRow label="Sum of divisors" value={formatBig(divisorSum)} />
              <StatRow label="Previous prime" value={prev === null ? "None" : fmtNum(prev)} />
              <StatRow label="Next prime" value={next === null ? "—" : fmtNum(next)} />
            </div>
            {divisors && !prime && (
              <div className="space-y-2">
                <p className="text-sm font-medium">All divisors</p>
                <p className="tnum rounded-lg bg-muted px-3.5 py-3 text-sm leading-relaxed">
                  {divisors.map((d) => fmtNum(d)).join(", ")}
                </p>
                <CopyButton text={divisors.join(", ")} label="Copy divisors" />
              </div>
            )}
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* Permutation & combination calculator                                */
/* ================================================================== */

export function PermutationCombinationCalculator() {
  const [params, setParams] = useToolState({ n: "52", r: "5", order: "no", repeat: "no" });
  const n = num(params.n, NaN);
  const r = num(params.r, NaN);
  const ordered = params.order === "yes";
  const repeat = params.repeat === "yes";

  const problem =
    !Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0
      ? "n and r must be whole numbers of 0 or more."
      : n > 10000 || r > 10000
        ? "n and r go up to 10,000."
        : !repeat && r > n
          ? "Without repetition you cannot pick more items (r) than there are (n)."
          : "";

  const perm = problem ? 0n : repeat ? BigInt(n) ** BigInt(r) : permutations(n, r);
  const comb = problem ? 0n : repeat ? combinations(n + r - 1, r) : combinations(n, r);
  const main = ordered ? perm : comb;
  const formula = ordered ? (repeat ? "nʳ" : "n! ÷ (n − r)!") : repeat ? "(n + r − 1)! ÷ (r! (n − 1)!)" : "n! ÷ (r! (n − r)!)";

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <FieldGrid>
            <NumberField label="Total items (n)" value={params.n} onChange={(v) => setParams({ n: v })} />
            <NumberField label="Items chosen (r)" value={params.r} onChange={(v) => setParams({ r: v })} />
          </FieldGrid>
          <FieldGrid>
            <SelectField
              label="Does order matter?"
              value={params.order}
              onChange={(v) => setParams({ order: v })}
              options={[
                { value: "no", label: "No, a group (combination)" },
                { value: "yes", label: "Yes, an arrangement (permutation)" },
              ]}
            />
            <SelectField
              label="Can items repeat?"
              value={params.repeat}
              onChange={(v) => setParams({ repeat: v })}
              options={[
                { value: "no", label: "No, each item once" },
                { value: "yes", label: "Yes, items can repeat" },
              ]}
            />
          </FieldGrid>
          <Verdict tone="neutral">
            A poker hand is a combination: the same five cards in any order are one hand. A PIN is a permutation
            with repetition: 1-2-3-4 and 4-3-2-1 are different, and digits can repeat.
          </Verdict>
        </div>
      }
      results={
        problem ? (
          <Verdict tone="neutral">{problem}</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label={ordered ? "Permutations" : "Combinations"}
              value={formatBig(main)}
              sub={`Formula: ${formula}`}
            />
            <div>
              <StatRow label={ordered ? "Combinations (order ignored)" : "Permutations (order counted)"} value={formatBig(ordered ? comb : perm)} />
              <StatRow label="Chance of one specific outcome" value={main > 0n ? `1 in ${formatBig(main)}` : "—"} emphasis />
              <StatRow label="Digits in the exact answer" value={fmtNum(main.toString().length)} />
            </div>
            {main.toString().length > 21 && <CopyButton text={main.toString()} label="Copy exact value" />}
          </div>
        )
      }
    />
  );
}
