/** Investment projection for the Investment Calculator. No React, so it is unit-tested directly. */

export interface InvestmentInput {
  initial: number;
  /** Contribution in the first year, paid at the end of each month. */
  monthly: number;
  annualReturnPct: number;
  /** Yearly fund or platform fee, taken from the return. */
  annualFeePct: number;
  inflationPct: number;
  years: number;
  /** How much the monthly contribution rises each year. */
  contributionGrowthPct: number;
}

export interface InvestmentYear {
  year: number;
  contributed: number;
  growth: number;
  balance: number;
  /** The balance in today's money. */
  realBalance: number;
}

export interface InvestmentProjection {
  balance: number;
  realBalance: number;
  /** Starting amount plus every contribution. */
  totalContributed: number;
  growth: number;
  /** What the same plan would have gained with no fee. */
  feesCost: number;
  rows: InvestmentYear[];
}

function simulate(input: InvestmentInput, feePct: number) {
  const net = (1 + input.annualReturnPct / 100) * (1 - feePct / 100);
  const monthlyRate = Math.pow(net, 1 / 12) - 1;
  const months = Math.round(input.years * 12);
  const deflate = (balance: number, month: number) =>
    balance / Math.pow(1 + input.inflationPct / 100, month / 12);

  let balance = input.initial;
  let totalContributed = input.initial;
  let yearContributed = 0;
  let yearStart = balance;
  const rows: InvestmentYear[] = [];

  for (let m = 1; m <= months; m++) {
    const contribution = input.monthly * Math.pow(1 + input.contributionGrowthPct / 100, Math.floor((m - 1) / 12));
    balance += balance * monthlyRate + contribution;
    totalContributed += contribution;
    yearContributed += contribution;
    if (m % 12 === 0 || m === months) {
      rows.push({
        year: Math.ceil(m / 12),
        contributed: yearContributed,
        growth: balance - yearStart - yearContributed,
        balance,
        realBalance: deflate(balance, m),
      });
      yearStart = balance;
      yearContributed = 0;
    }
  }
  return { balance, realBalance: deflate(balance, months), totalContributed, rows };
}

/** Null when the inputs can't describe a real plan. */
export function projectInvestment(input: InvestmentInput): InvestmentProjection | null {
  const { initial, monthly, annualReturnPct, annualFeePct, inflationPct, years, contributionGrowthPct } = input;
  const valid =
    initial >= 0 &&
    monthly >= 0 &&
    initial + monthly > 0 &&
    annualReturnPct > -100 &&
    annualFeePct >= 0 &&
    annualFeePct < 100 &&
    inflationPct > -100 &&
    contributionGrowthPct > -100 &&
    years > 0 &&
    years <= 100 &&
    Math.round(years * 12) >= 1;
  if (!valid) return null;

  const result = simulate(input, annualFeePct);
  const noFee = simulate(input, 0);
  if (!Number.isFinite(result.balance) || !Number.isFinite(noFee.balance)) return null;

  return {
    ...result,
    growth: result.balance - result.totalContributed,
    feesCost: noFee.balance - result.balance,
  };
}
