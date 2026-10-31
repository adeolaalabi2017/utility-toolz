import { describe, expect, test } from "bun:test";

describe("Business Calculators - Formula & Precision Verification", () => {
  describe("Break-Even Analysis", () => {
    const calculateBreakEven = (fixedCosts: number, unitPrice: number, variableCost: number) => {
      const contributionMargin = unitPrice - variableCost;
      if (contributionMargin <= 0) {
        return { units: null, revenue: null, cmRatio: 0 };
      }
      const units = Math.ceil(fixedCosts / contributionMargin);
      const revenue = units * unitPrice;
      const cmRatio = contributionMargin / unitPrice;
      return { units, revenue, cmRatio: Math.round(cmRatio * 1000) / 10 };
    };

    test("calculates break-even units and revenue accurately", () => {
      // Fixed: $50,000, Price: $100, Var Cost: $40 -> CM = $60
      const res = calculateBreakEven(50000, 100, 40);
      expect(res.units).toBe(834); // Math.ceil(50000 / 60) = 833.33 -> 834
      expect(res.revenue).toBe(83400);
      expect(res.cmRatio).toBe(60.0);
    });

    test("handles edge case where unit price <= variable cost", () => {
      const res = calculateBreakEven(10000, 20, 25);
      expect(res.units).toBeNull();
      expect(res.revenue).toBeNull();
    });
  });

  describe("Margin vs Markup Inversion", () => {
    const marginFromMarkup = (markupPct: number) => {
      const markup = markupPct / 100;
      return Math.round((markup / (1 + markup)) * 10000) / 100;
    };

    const markupFromMargin = (marginPct: number) => {
      const margin = marginPct / 100;
      if (margin >= 1) return Infinity;
      return Math.round((margin / (1 - margin)) * 10000) / 100;
    };

    test("verifies that 100% markup equals 50% profit margin", () => {
      expect(marginFromMarkup(100)).toBe(50.0);
      expect(markupFromMargin(50)).toBe(100.0);
    });

    test("verifies that 25% markup equals 20% profit margin", () => {
      expect(marginFromMarkup(25)).toBe(20.0);
      expect(markupFromMargin(20)).toBe(25.0);
    });

    test("verifies that 50% markup equals 33.33% margin", () => {
      expect(marginFromMarkup(50)).toBe(33.33);
      expect(markupFromMargin(33.333333)).toBe(50.0);
    });
  });

  describe("Unit Economics & LTV/CAC", () => {
    const calculateUnitEconomics = (
      arpu: number,
      cogs: number,
      cac: number,
      monthlyChurnPct: number
    ) => {
      const grossProfit = arpu - cogs;
      const grossMarginPct = grossProfit / arpu;
      const churnRate = monthlyChurnPct / 100;
      const ltv = churnRate > 0 ? grossProfit / churnRate : 0;
      const ltvCacRatio = cac > 0 ? ltv / cac : 0;
      const cacPaybackMonths = grossProfit > 0 ? cac / grossProfit : 0;

      return {
        grossProfit,
        grossMarginPct: Math.round(grossMarginPct * 1000) / 10,
        ltv: Math.round(ltv * 100) / 100,
        ltvCacRatio: Math.round(ltvCacRatio * 10) / 10,
        cacPaybackMonths: Math.round(cacPaybackMonths * 10) / 10,
      };
    };

    test("computes SaaS healthy benchmarks (LTV:CAC > 3x, Payback < 12m)", () => {
      // ARPU: $100/mo, COGS: $20, CAC: $600, Churn: 2.5%/mo
      const res = calculateUnitEconomics(100, 20, 600, 2.5);
      expect(res.grossProfit).toBe(80);
      expect(res.grossMarginPct).toBe(80.0);
      // LTV = $80 / 0.025 = $3,200
      expect(res.ltv).toBe(3200);
      // LTV:CAC = 3200 / 600 = 5.3x
      expect(res.ltvCacRatio).toBe(5.3);
      // Payback = 600 / 80 = 7.5 months
      expect(res.cacPaybackMonths).toBe(7.5);
    });
  });

  describe("Inventory Turnover & DSI", () => {
    test("calculates inventory turnover ratio and days sales of inventory", () => {
      const cogs = 500000;
      const avgInventory = 100000;
      const turnoverRatio = cogs / avgInventory; // 5.0x
      const dsi = Math.round((365 / turnoverRatio) * 10) / 10; // 73 days
      expect(turnoverRatio).toBe(5.0);
      expect(dsi).toBe(73.0);
    });
  });
});
