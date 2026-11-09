import { describe, expect, test } from "bun:test";
import {
  MathError,
  combinations,
  divisorsFromFactors,
  evaluate,
  factorial,
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
  toggleLastSign,
} from "@/lib/math";

describe("Expression evaluator", () => {
  test("follows operator precedence", () => {
    expect(evaluate("2+3*4")).toBe(14);
    expect(evaluate("(2+3)*4")).toBe(20);
    expect(evaluate("10-4-3")).toBe(3);
    expect(evaluate("2^3^2")).toBe(512);
    expect(evaluate("-2^2")).toBe(-4);
    expect(evaluate("2^-1")).toBe(0.5);
  });

  test("accepts keypad symbols", () => {
    expect(evaluate("6×7")).toBe(42);
    expect(evaluate("9÷3")).toBe(3);
    expect(evaluate("9−3")).toBe(6);
    expect(evaluate("√16")).toBe(4);
    expect(formatResult(evaluate("2π"))).toBe("6.28318530718");
  });

  test("multiplies implicitly", () => {
    expect(evaluate("2(3+4)")).toBe(14);
    expect(evaluate("(1+1)(2+2)")).toBe(8);
    expect(evaluate("2sin(30)")).toBe(1);
  });

  test("handles percent the way phone calculators do", () => {
    expect(evaluate("200+15%")).toBe(230);
    expect(evaluate("200-10%")).toBe(180);
    expect(evaluate("50%")).toBe(0.5);
    expect(evaluate("200*15%")).toBe(30);
  });

  test("trig in degrees snaps exact angles", () => {
    expect(evaluate("sin(30)")).toBe(0.5);
    expect(evaluate("sin(180)")).toBe(0);
    expect(evaluate("cos(90)")).toBe(0);
    expect(evaluate("tan(45)")).toBe(1);
    expect(evaluate("asin(1)")).toBe(90);
    expect(() => evaluate("tan(90)")).toThrow(MathError);
  });

  test("trig in radians", () => {
    expect(evaluate("cos(pi)", { angle: "rad" })).toBe(-1);
    expect(evaluate("sin(pi/2)", { angle: "rad" })).toBe(1);
  });

  test("logs, roots, factorial, mod, ans", () => {
    expect(evaluate("log(1000)")).toBe(3);
    expect(evaluate("ln(e)")).toBe(1);
    expect(evaluate("5!")).toBe(120);
    expect(evaluate("17 mod 5")).toBe(2);
    expect(evaluate("-7 mod 3")).toBe(2);
    expect(evaluate("ans*2", { ans: 21 })).toBe(42);
    expect(evaluate("1.5E3")).toBe(1500);
  });

  test("forgives a missing final bracket", () => {
    expect(evaluate("2*(3+4")).toBe(14);
  });

  test("rejects bad input with a readable error", () => {
    for (const bad of ["", "2+", "1/0", "sqrt(-4)", "(-8)^0.5", "3.5!", "foo(2)", "2)", "2 & 3"]) {
      expect(() => evaluate(bad)).toThrow(MathError);
    }
  });

  test("never runs code", () => {
    expect(() => evaluate("alert(1)")).toThrow(MathError);
    expect(() => evaluate("constructor")).toThrow(MathError);
  });
});

describe("Result formatting", () => {
  test("hides floating point noise", () => {
    expect(formatResult(0.1 + 0.2)).toBe("0.3");
    expect(formatResult(1 / 3)).toBe("0.333333333333");
  });

  test("uses capital-E exponents the parser can read back", () => {
    expect(formatResult(1e21)).toBe("1E21");
    expect(formatResult(1.5e-10)).toBe("1.5E-10");
    expect(evaluate(formatResult(1.5e-10))).toBe(1.5e-10);
  });
});

describe("± key", () => {
  test("negates and restores the last number", () => {
    expect(toggleLastSign("12")).toBe("-12");
    expect(toggleLastSign("-12")).toBe("12");
    expect(toggleLastSign("5×3")).toBe("5×-3");
    expect(toggleLastSign("5×-3")).toBe("5×3");
    expect(toggleLastSign("5-3")).toBe("5--3");
    expect(toggleLastSign("5--3")).toBe("5-3");
    expect(toggleLastSign("2.5")).toBe("-2.5");
    expect(toggleLastSign("(")).toBe("(");
  });
});

describe("Number theory", () => {
  test("gcd and lcm", () => {
    expect(gcd(48, 18)).toBe(6);
    expect(lcmAll([4, 6, 10])).toBe(60n);
    expect(lcmAll([1_000_000_007, 998_244_353])).toBe(998244359987710471n);
  });

  test("prime factors and divisors", () => {
    expect(primeFactors(360)).toEqual([[2, 3], [3, 2], [5, 1]]);
    expect(formatFactors(primeFactors(360))).toBe("2³ × 3² × 5");
    expect(divisorsFromFactors(primeFactors(12))).toEqual([1, 2, 3, 4, 6, 12]);
    expect(primeFactors(9_007_199_254_740_881)).toEqual([[9_007_199_254_740_881, 1]]);
    // Two 8-digit primes: too slow for trial division, fast for Pollard's rho.
    expect(primeFactors(99_999_989 * 89_999_999)).toEqual([[89_999_999, 1], [99_999_989, 1]]);
    expect(primeFactors(2 ** 52)).toEqual([[2, 52]]);
    expect(primeFactors(1_000_000)).toEqual([[2, 6], [5, 6]]);
  });

  test("primality and neighbours", () => {
    expect(isPrime(97)).toBe(true);
    expect(isPrime(1)).toBe(false);
    expect(isPrime(91)).toBe(false);
    expect(nextPrime(97)).toBe(101);
    expect(previousPrime(97)).toBe(89);
    expect(previousPrime(2)).toBe(null);
  });
});

describe("Counting", () => {
  test("permutations and combinations", () => {
    expect(permutations(10, 3)).toBe(720n);
    expect(combinations(52, 5)).toBe(2598960n);
    expect(combinations(5, 7)).toBe(0n);
    expect(combinations(100, 50)).toBe(100891344545564193334812497256n);
    expect(factorial(0)).toBe(1);
  });

  test("big results switch to scientific", () => {
    expect(formatBig(2598960n)).toBe("2,598,960");
    expect(formatBig(combinations(100, 50))).toBe("1.008913 × 10²⁹");
  });
});

describe("Rounding", () => {
  test("rounds as written, not as stored", () => {
    expect(roundTo(1.005, 2, "half-up")).toBe(1.01);
    expect(roundTo(-2.5, 0, "half-up")).toBe(-3);
    expect(roundTo(2.5, 0, "half-even")).toBe(2);
    expect(roundTo(3.5, 0, "half-even")).toBe(4);
    expect(roundTo(2.341, 2, "up")).toBe(2.35);
    expect(roundTo(-2.349, 2, "truncate")).toBe(-2.34);
    expect(roundTo(1234.5, -2, "half-up")).toBe(1200);
    expect(roundTo(1e-7, 2, "half-up")).toBe(0);
  });

  test("nearest multiple", () => {
    expect(roundToMultiple(7.33, 0.05, "half-up")).toBe(7.35);
    expect(roundToMultiple(0.7, 0.1, "down")).toBe(0.7);
    expect(roundToMultiple(0.7, 0.1, "truncate")).toBe(0.7);
    expect(roundToMultiple(0.75, 0.1, "down")).toBe(0.7);
    expect(roundToMultiple(1234, 50, "half-up")).toBe(1250);
    expect(roundToMultiple(12.1, 0.25, "up")).toBe(12.25);
  });
});

describe("Ratios and quadratics", () => {
  test("simplifies ratios, including decimals", () => {
    expect(simplifyRatio([1920, 1080])).toEqual([16, 9]);
    expect(simplifyRatio([1.5, 2.25])).toEqual([2, 3]);
    expect(simplifyRatio([6, 9, 12])).toEqual([2, 3, 4]);
  });

  test("solves quadratics", () => {
    expect(solveQuadratic(1, -3, 2)).toEqual({ kind: "two", x1: 1, x2: 2 });
    expect(solveQuadratic(1, 2, 1)).toEqual({ kind: "one", x: -1 });
    expect(solveQuadratic(1, 0, 4)).toEqual({ kind: "complex", re: 0, im: 2 });
    expect(solveQuadratic(0, 2, -4)).toEqual({ kind: "linear", x: 2 });
    expect(solveQuadratic(0, 0, 0)).toEqual({ kind: "all" });
    expect(solveQuadratic(0, 0, 3)).toEqual({ kind: "none" });
    expect(solveQuadratic(2, 0, -8)).toEqual({ kind: "two", x1: -2, x2: 2 });
  });

  test("stays accurate when b² dwarfs 4ac", () => {
    const r = solveQuadratic(1, 1e8, 1);
    expect(r.kind).toBe("two");
    if (r.kind === "two") expect(r.x2).toBeCloseTo(-1e-8, 20);
  });
});
