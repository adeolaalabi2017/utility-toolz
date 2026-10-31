import { describe, expect, test } from "bun:test";

describe("Finance Calculators - Formula & Precision Verification", () => {
  describe("VAT Calculator", () => {
    const calculateVatExclusive = (amount: number, rate: number) => {
      const vat = Math.round(((amount * rate) / 100) * 100) / 100;
      const total = Math.round((amount + vat) * 100) / 100;
      return { net: amount, vat, total };
    };

    const calculateVatInclusive = (amount: number, rate: number) => {
      const net = Math.round((amount / (1 + rate / 100)) * 100) / 100;
      const vat = Math.round((amount - net) * 100) / 100;
      return { net, vat, total: amount };
    };

    test("computes UK standard 20% VAT exclusive with exact 2-decimal rounding", () => {
      const res = calculateVatExclusive(1234.56, 20);
      expect(res.net).toBe(1234.56);
      expect(res.vat).toBe(246.91);
      expect(res.total).toBe(1481.47);
    });

    test("computes 20% VAT inclusive cleanly without 1-cent discrepancy", () => {
      const res = calculateVatInclusive(120, 20);
      expect(res.net).toBe(100.0);
      expect(res.vat).toBe(20.0);
      expect(res.total).toBe(120.0);
    });

    test("handles non-integer VAT rates like 7.7% (Swiss standard)", () => {
      const res = calculateVatExclusive(1000, 7.7);
      expect(res.vat).toBe(77.0);
      expect(res.total).toBe(1077.0);
    });
  });

  describe("Loan Amortization", () => {
    const calculateMonthlyPayment = (principal: number, annualRatePct: number, years: number) => {
      if (annualRatePct === 0) return principal / (years * 12);
      const r = annualRatePct / 100 / 12;
      const n = years * 12;
      return (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    };

    test("computes standard 30-year fixed loan payment accurately", () => {
      const principal = 300000;
      const rate = 6.5; // 6.5%
      const years = 30;
      const monthlyPayment = calculateMonthlyPayment(principal, rate, years);
      // Standard financial benchmark: $1,896.20
      expect(Math.round(monthlyPayment * 100) / 100).toBe(1896.20);
    });

    test("amortization schedule reduces balance to zero", () => {
      const principal = 50000;
      const rate = 5; // 5%
      const years = 5;
      const monthlyPayment = calculateMonthlyPayment(principal, rate, years);
      const monthlyRate = rate / 100 / 12;
      const totalPayments = years * 12;

      let balance = principal;
      let totalInterest = 0;

      for (let i = 0; i < totalPayments; i++) {
        const interest = balance * monthlyRate;
        const principalPaid = monthlyPayment - interest;
        totalInterest += interest;
        balance -= principalPaid;
      }

      expect(Math.abs(balance)).toBeLessThan(0.01);
      expect(Math.round(totalInterest * 100) / 100).toBe(6613.70);
    });
  });

  describe("Compound Interest", () => {
    const calculateCompound = (
      principal: number,
      annualRatePct: number,
      years: number,
      compoundsPerYear: number,
      monthlyContribution: number = 0
    ) => {
      const r = annualRatePct / 100;
      const n = compoundsPerYear;
      const t = years;

      // Compound principal: P * (1 + r/n)^(nt)
      const futurePrincipal = principal * Math.pow(1 + r / n, n * t);

      // Future value of series: PMT * (((1 + r/12)^(12t) - 1) / (r/12))
      let futureContributions = 0;
      if (monthlyContribution > 0) {
        const monthlyRate = r / 12;
        futureContributions =
          monthlyContribution * ((Math.pow(1 + monthlyRate, 12 * t) - 1) / monthlyRate);
      }

      const total = futurePrincipal + futureContributions;
      const totalDeposited = principal + monthlyContribution * 12 * t;
      const interestEarned = total - totalDeposited;

      return {
        total: Math.round(total * 100) / 100,
        totalDeposited: Math.round(totalDeposited * 100) / 100,
        interestEarned: Math.round(interestEarned * 100) / 100,
      };
    };

    test("computes annual compounding over 10 years at 7%", () => {
      const res = calculateCompound(10000, 7, 10, 1, 0);
      // 10000 * 1.07^10 = 19671.51
      expect(res.total).toBe(19671.51);
      expect(res.interestEarned).toBe(9671.51);
    });

    test("computes compounding with monthly contributions", () => {
      const res = calculateCompound(5000, 8, 5, 12, 200);
      expect(res.totalDeposited).toBe(5000 + 200 * 60); // 17000
      expect(res.total).toBeGreaterThan(20000);
    });
  });

  describe("Cash Runway Calculator", () => {
    const calculateRunway = (cash: number, monthlyExpenses: number, monthlyRevenue: number = 0) => {
      const netBurn = monthlyExpenses - monthlyRevenue;
      if (netBurn <= 0) return { netBurn: 0, months: Infinity, isProfitable: true };
      const months = Math.round((cash / netBurn) * 10) / 10;
      return { netBurn, months, isProfitable: false };
    };

    test("calculates runway accurately for standard startup burn", () => {
      const res = calculateRunway(300000, 35000, 10000);
      expect(res.netBurn).toBe(25000);
      expect(res.months).toBe(12.0);
      expect(res.isProfitable).toBe(false);
    });

    test("detects cashflow positive / profitable state", () => {
      const res = calculateRunway(100000, 20000, 25000);
      expect(res.netBurn).toBe(0);
      expect(res.months).toBe(Infinity);
      expect(res.isProfitable).toBe(true);
    });
  });

  describe("Depreciation Calculator", () => {
    test("calculates straight-line annual depreciation", () => {
      const cost = 12000;
      const salvage = 2000;
      const lifeYears = 5;
      const annualDepreciation = (cost - salvage) / lifeYears;
      expect(annualDepreciation).toBe(2000);
    });
  });
});
