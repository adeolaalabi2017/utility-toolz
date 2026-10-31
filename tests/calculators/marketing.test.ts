import { describe, expect, test } from "bun:test";

describe("Marketing & Advertising Calculators - Formula & Precision Verification", () => {
  describe("ROAS & Break-Even ROAS", () => {
    const calculateRoas = (adSpend: number, revenue: number, profitMarginPct?: number) => {
      const roasRatio = adSpend > 0 ? revenue / adSpend : 0;
      const roasPct = Math.round(roasRatio * 10000) / 100;
      let breakEvenRoas = 0;
      if (profitMarginPct && profitMarginPct > 0) {
        breakEvenRoas = Math.round((1 / (profitMarginPct / 100)) * 100) / 100;
      }
      return {
        roasRatio: Math.round(roasRatio * 100) / 100,
        roasPct,
        breakEvenRoas,
        isProfitable: profitMarginPct ? roasRatio >= breakEvenRoas : roasRatio >= 1,
      };
    };

    test("computes standard ROAS of 3.5x (350%)", () => {
      const res = calculateRoas(2000, 7000);
      expect(res.roasRatio).toBe(3.5);
      expect(res.roasPct).toBe(350);
      expect(res.isProfitable).toBe(true);
    });

    test("computes break-even ROAS based on gross margin", () => {
      // 40% margin -> Break-even ROAS = 1 / 0.4 = 2.5x
      const res = calculateRoas(1000, 2400, 40);
      expect(res.breakEvenRoas).toBe(2.5);
      expect(res.roasRatio).toBe(2.4);
      expect(res.isProfitable).toBe(false); // 2.4x < 2.5x break-even
    });
  });

  describe("Target CPA & Max Allowable CPA", () => {
    test("calculates target CPA and assesses viability against margin", () => {
      const adSpend = 5000;
      const conversions = 125;
      const cpa = adSpend / conversions; // $40.00
      expect(cpa).toBe(40.0);

      const aov = 120; // Average Order Value
      const grossMarginPct = 0.5; // 50%
      const maxAllowableCpa = aov * grossMarginPct; // $60.00
      expect(maxAllowableCpa).toBe(60.0);
      expect(cpa).toBeLessThan(maxAllowableCpa);
    });
  });

  describe("CTR & CTOR (Click-to-Open Rate)", () => {
    test("calculates email CTOR accurately", () => {
      const opens = 2500;
      const clicks = 350;
      const ctor = (clicks / opens) * 100;
      expect(Math.round(ctor * 100) / 100).toBe(14.0);
    });
  });

  describe("Statistical Sample Size Calculator", () => {
    const calculateSampleSize = (
      confidenceLevel: 90 | 95 | 99,
      marginOfErrorPct: number,
      baselineConversionPct: number = 50
    ) => {
      // Z-scores: 90% = 1.645, 95% = 1.96, 99% = 2.576
      const zMap = { 90: 1.645, 95: 1.96, 99: 2.576 };
      const z = zMap[confidenceLevel];
      const p = baselineConversionPct / 100;
      const e = marginOfErrorPct / 100;

      // Cochran's formula: n = (Z^2 * p * (1 - p)) / e^2
      const n = (Math.pow(z, 2) * p * (1 - p)) / Math.pow(e, 2);
      return Math.ceil(n);
    };

    test("computes standard 95% confidence with 5% margin of error", () => {
      const n = calculateSampleSize(95, 5, 50);
      // Standard textbook sample size: 385
      expect(n).toBe(385);
    });

    test("computes sample size with 99% confidence and 2% margin of error", () => {
      const n = calculateSampleSize(99, 2, 50);
      expect(n).toBe(4148);
    });
  });
});
