import { describe, expect, test } from "bun:test";
import { projectInvestment, type InvestmentInput } from "@/lib/investing";

const plan: InvestmentInput = {
  initial: 10_000,
  monthly: 500,
  annualReturnPct: 7,
  annualFeePct: 0,
  inflationPct: 0,
  years: 10,
  contributionGrowthPct: 0,
};

describe("projectInvestment", () => {
  test("no return simply adds up the money", () => {
    const p = projectInvestment({ ...plan, annualReturnPct: 0 })!;
    expect(p.balance).toBeCloseTo(70_000, 6);
    expect(p.totalContributed).toBe(70_000);
    expect(p.growth).toBeCloseTo(0, 6);
  });

  test("matches the future-value formula", () => {
    const r = Math.pow(1.07, 1 / 12) - 1;
    const expected = 10_000 * Math.pow(1.07, 10) + (500 * (Math.pow(1 + r, 120) - 1)) / r;
    expect(projectInvestment(plan)!.balance).toBeCloseTo(expected, 4);
  });

  test("a fee lowers the balance by exactly what it reports", () => {
    const free = projectInvestment(plan)!;
    const fee = projectInvestment({ ...plan, annualFeePct: 1 })!;
    expect(fee.balance).toBeLessThan(free.balance);
    expect(fee.feesCost).toBeCloseTo(free.balance - fee.balance, 6);
    expect(free.feesCost).toBe(0);
  });

  test("inflation only changes the real balance", () => {
    const p = projectInvestment({ ...plan, inflationPct: 3 })!;
    expect(p.balance).toBeCloseTo(projectInvestment(plan)!.balance, 6);
    expect(p.realBalance).toBeCloseTo(p.balance / Math.pow(1.03, 10), 6);
  });

  test("contributions rise once a year", () => {
    const p = projectInvestment({ ...plan, annualReturnPct: 0, initial: 0, years: 2, contributionGrowthPct: 10 })!;
    expect(p.rows[0].contributed).toBeCloseTo(6_000, 6);
    expect(p.rows[1].contributed).toBeCloseTo(6_600, 6);
  });

  test("one row per year, and a part year gets its own row", () => {
    expect(projectInvestment(plan)!.rows).toHaveLength(10);
    const p = projectInvestment({ ...plan, years: 1.5 })!;
    expect(p.rows.map((r) => r.year)).toEqual([1, 2]);
    expect(p.rows[1].contributed).toBeCloseTo(3_000, 6);
  });

  test("impossible plans return null", () => {
    expect(projectInvestment({ ...plan, years: 0 })).toBeNull();
    expect(projectInvestment({ ...plan, years: 101 })).toBeNull();
    expect(projectInvestment({ ...plan, initial: 0, monthly: 0 })).toBeNull();
    expect(projectInvestment({ ...plan, annualFeePct: 100 })).toBeNull();
    expect(projectInvestment({ ...plan, annualReturnPct: NaN })).toBeNull();
    expect(projectInvestment({ ...plan, annualReturnPct: 1e300 })).toBeNull();
  });
});
