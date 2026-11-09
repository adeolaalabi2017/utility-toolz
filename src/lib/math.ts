/**
 * Pure maths behind the Math domain tools: a safe expression evaluator for
 * the calculators (no eval), number theory and the small solvers. Kept free
 * of React so it can be unit-tested directly.
 */

/* ------------------------------------------------------------------ */
/* Expression evaluator                                                */
/* ------------------------------------------------------------------ */

export class MathError extends Error {}

export type AngleMode = "deg" | "rad";

type Token =
  | { kind: "num"; value: number }
  | { kind: "id"; value: string }
  | { kind: "op"; value: string };

const OP_ALIASES: Record<string, string> = {
  "×": "*",
  "·": "*",
  "÷": "/",
  "−": "-",
  "–": "-",
};

function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      // Digits and one decimal point, then an optional exponent written with a
      // capital E (1.5E-7). Lower-case e is always Euler's number.
      const m = /^(\d+\.?\d*|\.\d+)(E[+-]?\d+)?/.exec(src.slice(i));
      if (!m) throw new MathError(`Unexpected "${ch}"`);
      tokens.push({ kind: "num", value: Number(m[0]) });
      i += m[0].length;
      continue;
    }
    if (/[a-zA-Zπ√]/.test(ch)) {
      if (ch === "π" || ch === "√") {
        tokens.push({ kind: "id", value: ch === "π" ? "pi" : "sqrt" });
        i++;
        continue;
      }
      const m = /^[a-zA-Z]+/.exec(src.slice(i))!;
      tokens.push({ kind: "id", value: m[0].toLowerCase() });
      i += m[0].length;
      continue;
    }
    const op = OP_ALIASES[ch] ?? ch;
    if ("+-*/^()!%,".includes(op)) {
      tokens.push({ kind: "op", value: op });
      i++;
      continue;
    }
    throw new MathError(`Unexpected "${ch}"`);
  }
  return tokens;
}

const CONSTANTS: Record<string, number> = { pi: Math.PI, e: Math.E };

const FUNCTIONS = new Set([
  "sin", "cos", "tan", "asin", "acos", "atan",
  "sqrt", "cbrt", "ln", "log", "abs", "exp",
]);

/**
 * Trig results lose the last bit or two to π's rounding: sin(30°) comes out
 * as 0.49999999999999994 and sin(180°) as 1.2e-16. Snap near-integers and
 * trim to 15 significant digits so exact angles give exact answers.
 */
const snap = (v: number) => {
  const r = Math.round(v);
  return Math.abs(v - r) < 1e-12 ? r : Number(v.toPrecision(15));
};

export function factorial(n: number): number {
  if (!Number.isInteger(n) || n < 0) throw new MathError("Factorial needs a whole number of 0 or more");
  if (n > 170) throw new MathError("Factorial overflows above 170!");
  let r = 1;
  for (let k = 2; k <= n; k++) r *= k;
  return r;
}

function applyFunction(name: string, x: number, angle: AngleMode): number {
  const toRad = (v: number) => (angle === "deg" ? (v * Math.PI) / 180 : v);
  const fromRad = (v: number) => (angle === "deg" ? (v * 180) / Math.PI : v);
  switch (name) {
    case "sin":
      return snap(Math.sin(toRad(x)));
    case "cos":
      return snap(Math.cos(toRad(x)));
    case "tan":
      if (angle === "deg" && Math.abs(x % 180) === 90) throw new MathError(`tan(${x}°) is undefined`);
      return snap(Math.tan(toRad(x)));
    case "asin":
    case "acos":
      if (x < -1 || x > 1) throw new MathError(`${name} needs a value between −1 and 1`);
      return snap(fromRad(name === "asin" ? Math.asin(x) : Math.acos(x)));
    case "atan":
      return snap(fromRad(Math.atan(x)));
    case "sqrt":
      if (x < 0) throw new MathError("Square root of a negative number is not real");
      return Math.sqrt(x);
    case "cbrt":
      return Math.cbrt(x);
    case "ln":
    case "log":
      if (x <= 0) throw new MathError(`${name} needs a positive number`);
      return name === "ln" ? Math.log(x) : Math.log10(x);
    case "abs":
      return Math.abs(x);
    default:
      return Math.exp(x);
  }
}

interface Operand {
  value: number;
  /** True when the operand was a lone "n%", so "a + n%" can mean a plus n% of a. */
  percent: boolean;
}

class Parser {
  private pos = 0;
  constructor(
    private tokens: Token[],
    private angle: AngleMode,
    private ans: number
  ) {}

  parse(): number {
    if (this.tokens.length === 0) throw new MathError("Enter an expression");
    const v = this.expr();
    if (this.pos < this.tokens.length) {
      const t = this.tokens[this.pos];
      throw new MathError(t.value === ")" ? "Unmatched closing bracket" : `Unexpected "${t.value}"`);
    }
    return v;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private isOp(v: string): boolean {
    const t = this.peek();
    return t?.kind === "op" && t.value === v;
  }

  private expr(): number {
    let left = this.term().value;
    while (this.isOp("+") || this.isOp("-")) {
      const op = this.tokens[this.pos++].value;
      const right = this.term();
      // Calculator convention: 200 + 15% adds 15% of 200.
      const r = right.percent ? left * right.value : right.value;
      left = op === "+" ? left + r : left - r;
    }
    return left;
  }

  private startsOperand(): boolean {
    const t = this.peek();
    if (!t) return false;
    return t.kind === "num" || t.kind === "id" || (t.kind === "op" && t.value === "(");
  }

  private term(): Operand {
    let left = this.unary();
    for (;;) {
      if (this.isOp("*") || this.isOp("/")) {
        const op = this.tokens[this.pos++].value;
        const right = this.unary().value;
        if (op === "/" && right === 0) throw new MathError("Cannot divide by zero");
        left = { value: op === "*" ? left.value * right : left.value / right, percent: false };
      } else if (this.peek()?.kind === "id" && this.peek()!.value === "mod") {
        this.pos++;
        const right = this.unary().value;
        if (right === 0) throw new MathError("Cannot take mod 0");
        left = { value: left.value - right * Math.floor(left.value / right), percent: false };
      } else if (this.startsOperand()) {
        // Implicit multiplication: 2π, 3(4), 2sin(30)
        left = { value: left.value * this.unary().value, percent: false };
      } else {
        return left;
      }
    }
  }

  private unary(): Operand {
    if (this.isOp("-")) {
      this.pos++;
      const v = this.unary();
      return { value: -v.value, percent: v.percent };
    }
    if (this.isOp("+")) {
      this.pos++;
      return this.unary();
    }
    return this.power();
  }

  private power(): Operand {
    const base = this.postfix();
    if (this.isOp("^")) {
      this.pos++;
      const exp = this.unary().value;
      const v = Math.pow(base.value, exp);
      if (Number.isNaN(v)) throw new MathError("A negative number to a fractional power is not real");
      return { value: v, percent: false };
    }
    return base;
  }

  private postfix(): Operand {
    let v = this.primary();
    let percent = false;
    for (;;) {
      if (this.isOp("!")) {
        this.pos++;
        v = factorial(v);
        percent = false;
      } else if (this.isOp("%")) {
        this.pos++;
        v = v / 100;
        percent = true;
      } else {
        return { value: v, percent };
      }
    }
  }

  private primary(): number {
    const t = this.peek();
    if (!t) throw new MathError("Expression ends too soon");
    this.pos++;
    if (t.kind === "num") {
      if (!Number.isFinite(t.value)) throw new MathError("Number is too large");
      return t.value;
    }
    if (t.kind === "op") {
      if (t.value === "(") {
        const v = this.expr();
        // A missing final bracket is forgiven, as on a handheld calculator.
        if (this.isOp(")")) this.pos++;
        else if (this.pos < this.tokens.length) throw new MathError("Missing closing bracket");
        return v;
      }
      throw new MathError(`Unexpected "${t.value}"`);
    }
    if (t.value === "ans") return this.ans;
    if (t.value in CONSTANTS) return CONSTANTS[t.value];
    if (FUNCTIONS.has(t.value)) {
      // sin(30) or sin 30; the argument binds tighter than * and /.
      const arg = this.isOp("(") ? this.primary() : this.power().value;
      return applyFunction(t.value, arg, this.angle);
    }
    throw new MathError(`Unknown name "${t.value}"`);
  }
}

export function evaluate(
  expression: string,
  opts: { angle?: AngleMode; ans?: number } = {}
): number {
  const v = new Parser(tokenize(expression), opts.angle ?? "deg", opts.ans ?? 0).parse();
  if (!Number.isFinite(v)) throw new MathError("Result is too large");
  return v;
}

/** Result for the calculator display: 12 significant digits, capital-E exponent. */
export function formatResult(v: number): string {
  if (!Number.isFinite(v)) return "Error";
  if (v === 0) return "0";
  const clean = Number(v.toPrecision(12));
  const abs = Math.abs(clean);
  if (abs >= 1e15 || abs < 1e-9) {
    return clean.toExponential().replace("e+", "E").replace("e", "E");
  }
  return String(clean);
}

/** ± key: negate the last number typed, or restore it if it is already negated. */
export function toggleLastSign(expr: string): string {
  const m = /(\d*\.?\d+(?:E[+-]?\d+)?|\d+\.)$/.exec(expr);
  if (!m) return expr;
  const start = m.index;
  const before = expr.slice(0, start);
  // A "-" right before the number is a sign (not subtraction) when nothing
  // or an operator/bracket precedes it.
  if (/(^|[+\-×÷*/^(])-$/.test(before)) return before.slice(0, -1) + m[0];
  return `${before}-${m[0]}`;
}

/* ------------------------------------------------------------------ */
/* Number theory                                                       */
/* ------------------------------------------------------------------ */

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x;
}

/** LCM of whole numbers as a BigInt, since it overflows doubles quickly. */
export function lcmAll(nums: number[]): bigint {
  let acc = 1n;
  for (const n of nums) {
    const b = BigInt(Math.abs(n));
    if (b === 0n) return 0n;
    let x = acc;
    let y = b;
    while (y) [x, y] = [y, x % y];
    acc = (acc / x) * b;
  }
  return acc;
}

function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  let r = 1n;
  let b = base % mod;
  let e = exp;
  while (e > 0n) {
    if (e & 1n) r = (r * b) % mod;
    b = (b * b) % mod;
    e >>= 1n;
  }
  return r;
}

const bigGcd = (a: bigint, b: bigint): bigint => {
  while (b) [a, b] = [b, a % b];
  return a < 0n ? -a : a;
};

/** Miller–Rabin with the first twelve primes as witnesses: deterministic below 3.3 × 10²⁴. */
function isPrimeBig(n: bigint): boolean {
  if (n < 2n) return false;
  const witnesses = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
  for (const p of witnesses) if (n % p === 0n) return n === p;
  let d = n - 1n;
  let s = 0;
  while ((d & 1n) === 0n) {
    d >>= 1n;
    s++;
  }
  outer: for (const a of witnesses) {
    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) continue;
    for (let i = 1; i < s; i++) {
      x = (x * x) % n;
      if (x === n - 1n) continue outer;
    }
    return false;
  }
  return true;
}

/** Pollard's rho (Brent's cycle detection): a non-trivial factor of composite n. */
function pollardRho(n: bigint): bigint {
  if (n % 2n === 0n) return 2n;
  for (let c = 1n; ; c++) {
    const f = (x: bigint) => (x * x + c) % n;
    let y = 2n;
    let r = 1;
    let q = 1n;
    let g = 1n;
    let x = y;
    let ys = y;
    while (g === 1n) {
      x = y;
      for (let i = 0; i < r; i++) y = f(y);
      for (let k = 0; k < r && g === 1n; k += 128) {
        ys = y;
        for (let i = 0; i < Math.min(128, r - k); i++) {
          y = f(y);
          q = (q * (x > y ? x - y : y - x)) % n;
        }
        g = bigGcd(q, n);
      }
      r *= 2;
    }
    if (g === n) {
      // The batched product overshot; step back one at a time.
      do {
        ys = f(ys);
        g = bigGcd(x > ys ? x - ys : ys - x, n);
      } while (g === 1n);
    }
    if (g !== n) return g;
  }
}

/**
 * Prime factors as [prime, exponent] pairs. Small primes come off by trial
 * division; whatever is left is split with Pollard's rho, so even 16-digit
 * inputs answer in milliseconds.
 */
export function primeFactors(n: number): [number, number][] {
  if (!Number.isSafeInteger(n) || n < 2) return [];
  const counts = new Map<number, number>();
  const add = (p: number) => counts.set(p, (counts.get(p) ?? 0) + 1);
  let rest = n;
  for (let p = 2; p < 1000 && p * p <= rest; p += p === 2 ? 1 : 2) {
    while (rest % p === 0) {
      rest /= p;
      add(p);
    }
  }
  const stack = rest > 1 ? [BigInt(rest)] : [];
  while (stack.length) {
    const m = stack.pop()!;
    if (isPrimeBig(m)) add(Number(m));
    else {
      const d = pollardRho(m);
      stack.push(d, m / d);
    }
  }
  return [...counts.entries()].sort((a, b) => a[0] - b[0]);
}

export const isPrime = (n: number): boolean => Number.isSafeInteger(n) && isPrimeBig(BigInt(n));

export function divisorsFromFactors(factors: [number, number][]): number[] {
  let divs = [1];
  for (const [p, e] of factors) {
    const next: number[] = [];
    for (const d of divs) {
      let pk = 1;
      for (let k = 0; k <= e; k++) {
        next.push(d * pk);
        pk *= p;
      }
    }
    divs = next;
  }
  return divs.sort((a, b) => a - b);
}

export function nextPrime(n: number): number {
  let k = Math.max(2, Math.floor(n) + 1);
  while (!isPrime(k)) k++;
  return k;
}

export function previousPrime(n: number): number | null {
  for (let k = Math.ceil(n) - 1; k >= 2; k--) if (isPrime(k)) return k;
  return null;
}

const SUPERSCRIPTS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
export const superscript = (n: number) =>
  String(n)
    .split("")
    .map((d) => SUPERSCRIPTS[Number(d)])
    .join("");

export const formatFactors = (factors: [number, number][]) =>
  factors.map(([p, e]) => (e > 1 ? `${p}${superscript(e)}` : `${p}`)).join(" × ");

/* ------------------------------------------------------------------ */
/* Counting                                                            */
/* ------------------------------------------------------------------ */

/** n! / (n − r)! exactly. */
export function permutations(n: number, r: number): bigint {
  if (r > n) return 0n;
  let acc = 1n;
  for (let k = n - r + 1; k <= n; k++) acc *= BigInt(k);
  return acc;
}

/** n choose r exactly. */
export function combinations(n: number, r: number): bigint {
  if (r > n) return 0n;
  const k = Math.min(r, n - r);
  let acc = 1n;
  for (let i = 1; i <= k; i++) acc = (acc * BigInt(n - k + i)) / BigInt(i);
  return acc;
}

/** Big integer for display: grouped digits up to 21 digits, scientific beyond. */
export function formatBig(v: bigint): string {
  const s = v.toString();
  if (s.length <= 21) return v.toLocaleString("en-US");
  return `${s[0]}.${s.slice(1, 7)} × 10${superscript(s.length - 1)}`;
}

/* ------------------------------------------------------------------ */
/* Rounding                                                            */
/* ------------------------------------------------------------------ */

export type RoundMethod = "half-up" | "half-even" | "up" | "down" | "truncate";

/**
 * Multiply by 10^places through the decimal string ("1.005e+0" → "1.005e2"),
 * so values like 1.005 scale exactly as written instead of to 100.49999….
 */
function shift(value: number, places: number): number {
  const [mantissa, exp] = value.toExponential().split("e");
  return Number(`${mantissa}e${Number(exp) + places}`);
}

/** Round to a number of decimal places (negative places round to tens, hundreds …). */
export function roundTo(value: number, places: number, method: RoundMethod): number {
  const scaled = shift(value, places);
  let r: number;
  switch (method) {
    case "up":
      r = Math.ceil(scaled);
      break;
    case "down":
      r = Math.floor(scaled);
      break;
    case "truncate":
      r = Math.trunc(scaled);
      break;
    case "half-even": {
      const fl = Math.floor(scaled);
      const diff = scaled - fl;
      if (Math.abs(diff - 0.5) < 1e-9) r = fl % 2 === 0 ? fl : fl + 1;
      else r = Math.round(scaled);
      break;
    }
    default:
      // Half away from zero, the school rule.
      r = Math.sign(scaled) * Math.round(Math.abs(scaled));
  }
  return shift(r, -places) + 0;
}

/** Round to the nearest multiple of step (0.05, 10, 0.25 …). */
export function roundToMultiple(value: number, step: number, method: RoundMethod): number {
  const [mantissa, exp] = step.toExponential().split("e");
  const decimals = Math.max(0, (mantissa.split(".")[1] ?? "").length - Number(exp));
  // Divide as scaled decimals: 0.7 / 0.1 is 6.999… in binary, but 7 / 1 is exact.
  const units = roundTo(shift(value, decimals) / shift(step, decimals), 0, method);
  return Number((units * step).toFixed(decimals)) + 0;
}

/* ------------------------------------------------------------------ */
/* Ratios                                                              */
/* ------------------------------------------------------------------ */

const decimalsOf = (n: number) => (String(n).split(".")[1] ?? "").replace(/e.*/, "").length;

/** Reduce a ratio of any positive numbers to whole numbers in lowest terms. */
export function simplifyRatio(parts: number[]): number[] {
  const scale = 10 ** Math.max(...parts.map(decimalsOf));
  const ints = parts.map((p) => Math.round(p * scale));
  const g = ints.reduce((acc, n) => gcd(acc, n), 0) || 1;
  return ints.map((n) => n / g);
}

/* ------------------------------------------------------------------ */
/* Quadratic                                                           */
/* ------------------------------------------------------------------ */

export type QuadraticRoots =
  | { kind: "two"; x1: number; x2: number }
  | { kind: "one"; x: number }
  | { kind: "complex"; re: number; im: number }
  | { kind: "linear"; x: number }
  | { kind: "none" }
  | { kind: "all" };

export function solveQuadratic(a: number, b: number, c: number): QuadraticRoots {
  if (a === 0) {
    if (b === 0) return c === 0 ? { kind: "all" } : { kind: "none" };
    return { kind: "linear", x: -c / b + 0 };
  }
  const d = b * b - 4 * a * c;
  if (d === 0) return { kind: "one", x: -b / (2 * a) + 0 };
  if (d < 0) return { kind: "complex", re: -b / (2 * a) + 0, im: Math.sqrt(-d) / (2 * Math.abs(a)) };
  // The textbook formula loses precision when b² dwarfs 4ac; compute the
  // larger-magnitude root first and get the other from x1·x2 = c/a.
  const q = -0.5 * (b + Math.sign(b || 1) * Math.sqrt(d));
  const r1 = q / a;
  const r2 = c / q;
  return { kind: "two", x1: Math.min(r1, r2) + 0, x2: Math.max(r1, r2) + 0 };
}
