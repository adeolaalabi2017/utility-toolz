"use client";

import * as React from "react";
import {
  CalcLayout,
  FieldGrid,
  NumberField,
  ResultHero,
  SelectField,
  ShareBar,
  StatRow,
  Verdict,
  MiniTable,
  SectionLabel,
} from "./ui";
import { fmtDuration, fmtMoney, fmtNum, fmtPct, fmtUSD, num } from "@/lib/format";
import { ExportToolbar } from "@/components/site/export-toolbar";
import { useToolState } from "@/hooks/use-tool-state";
import { ToolShareBar } from "@/components/site/tool-share-bar";

/* ================================================================== */
/* 1. Budget & expense calculator                                      */
/* ================================================================== */

export function BudgetCalculator() {
  const [income, setIncome] = React.useState("4,200");
  const [housing, setHousing] = React.useState("1,400");
  const [utilities, setUtilities] = React.useState("240");
  const [groceries, setGroceries] = React.useState("450");
  const [transport, setTransport] = React.useState("180");
  const [insurance, setInsurance] = React.useState("120");
  const [dining, setDining] = React.useState("260");
  const [fun, setFun] = React.useState("150");
  const [shopping, setShopping] = React.useState("180");
  const [savings, setSavings] = React.useState("700");

  const inc = num(income);
  const needs = num(housing) + num(utilities) + num(groceries) + num(transport) + num(insurance);
  const wants = num(dining) + num(fun) + num(shopping);
  const sav = num(savings);
  const spent = needs + wants + sav;
  const leftover = inc - spent;
  const safe = (x: number) => (inc > 0 ? (x / inc) * 100 : 0);

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <NumberField label="Monthly take-home income" value={income} onChange={setIncome} prefix="$" />
          <SectionLabel>Needs</SectionLabel>
          <FieldGrid>
            <NumberField label="Housing (rent or mortgage)" value={housing} onChange={setHousing} prefix="$" />
            <NumberField label="Utilities & phone" value={utilities} onChange={setUtilities} prefix="$" />
            <NumberField label="Groceries" value={groceries} onChange={setGroceries} prefix="$" />
            <NumberField label="Transport" value={transport} onChange={setTransport} prefix="$" />
            <NumberField label="Insurance & health" value={insurance} onChange={setInsurance} prefix="$" />
          </FieldGrid>
          <SectionLabel>Wants</SectionLabel>
          <FieldGrid>
            <NumberField label="Dining out" value={dining} onChange={setDining} prefix="$" />
            <NumberField label="Entertainment" value={fun} onChange={setFun} prefix="$" />
            <NumberField label="Shopping & subscriptions" value={shopping} onChange={setShopping} prefix="$" />
          </FieldGrid>
          <SectionLabel>Savings & debt</SectionLabel>
          <FieldGrid>
            <NumberField label="Savings & investing" value={savings} onChange={setSavings} prefix="$" />
          </FieldGrid>
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label="Left over each month"
            value={fmtUSD(leftover)}
            sub={
              leftover >= 0
                ? `${fmtUSD(spent)} of ${fmtUSD(inc)} allocated`
                : `You are ${fmtUSD(Math.abs(leftover))} over budget`
            }
          />
          <div className="space-y-3.5">
            <ShareBar
              label="Needs"
              actual={safe(needs)}
              target={50}
              actualLabel={fmtPct(safe(needs), 1)}
              targetLabel="50%"
            />
            <ShareBar
              label="Wants"
              actual={safe(wants)}
              target={30}
              actualLabel={fmtPct(safe(wants), 1)}
              targetLabel="30%"
            />
            <ShareBar
              label="Savings & debt"
              actual={safe(sav)}
              target={20}
              actualLabel={fmtPct(safe(sav), 1)}
              targetLabel="20%"
            />
          </div>
          {leftover >= 0 && safe(sav) >= 20 ? (
            <Verdict tone="good">
              Strong budget: you save {fmtPct(safe(sav), 1)} of income, at or above the 20% benchmark.
            </Verdict>
          ) : leftover < 0 ? (
            <Verdict tone="bad">
              Spending exceeds income by {fmtUSD(Math.abs(leftover))} a month — trim wants first, they are the easiest lever.
            </Verdict>
          ) : (
            <Verdict tone="warn">
              Budget balances, but savings are {fmtPct(safe(sav), 1)} — below the 20% guideline. Moving {fmtUSD(Math.max(0, inc * 0.2 - sav))} more per month gets you there.
            </Verdict>
          )}
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 2. Loan & mortgage calculator                                       */
/* ================================================================== */

export function LoanMortgageCalculator() {
  const [amount, setAmount] = React.useState("350,000");
  const [rate, setRate] = React.useState("6.25");
  const [years, setYears] = React.useState("30");
  const [extra, setExtra] = React.useState("0");

  const P = num(amount);
  const r = num(rate) / 100 / 12;
  const n = Math.round(num(years) * 12);
  const e = num(extra);

  const basePayment =
    r > 0 && n > 0 ? (P * r) / (1 - Math.pow(1 + r, -n)) : n > 0 ? P / n : 0;
  const baseInterest = basePayment * n - P;

  // amortize with extra payment
  let months = 0;
  let interest = 0;
  let balance = P;
  const pay = basePayment + e;
  if (P > 0 && n > 0) {
    while (balance > 0 && months < 1200) {
      const i = balance * r;
      interest += i;
      balance = balance + i - Math.min(pay, balance + i);
      months++;
      if (balance <= 0.005) break;
    }
  }

  const interestSaved = baseInterest - interest;
  const monthsSaved = n - months;

  const scheduleRows = React.useMemo(() => {
    if (P <= 0 || n <= 0 || basePayment <= 0) return [];
    const rows: Array<{ month: number; payment: number; principal: number; interest: number; balance: number }> = [];
    let bal = P;
    for (let m = 1; m <= Math.min(n, 360); m++) {
      const intPay = bal * r;
      const princPay = Math.min(bal, basePayment + e - intPay);
      bal = Math.max(0, bal - princPay);
      rows.push({
        month: m,
        payment: Math.round((basePayment + e) * 100) / 100,
        principal: Math.round(princPay * 100) / 100,
        interest: Math.round(intPay * 100) / 100,
        balance: Math.round(bal * 100) / 100,
      });
      if (bal <= 0) break;
    }
    return rows;
  }, [P, r, n, basePayment, e]);

  return (
    <CalcLayout
      inputs={
        <FieldGrid>
          <NumberField label="Loan amount" value={amount} onChange={setAmount} prefix="$" className="sm:col-span-2" />
          <NumberField label="Annual interest rate" value={rate} onChange={setRate} suffix="%" />
          <NumberField label="Term" value={years} onChange={setYears} suffix="yrs" />
          <NumberField
            label="Extra monthly payment"
            value={extra}
            onChange={setExtra}
            prefix="$"
            hint="Optional — added to every payment"
            className="sm:col-span-2"
          />
        </FieldGrid>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label="Monthly payment"
            value={fmtUSD(basePayment)}
            sub={`${num(years)}-year term at ${fmtPct(num(rate), 2)} APR`}
          />
          <div>
            <StatRow label="Total interest" value={fmtUSD(baseInterest)} />
            <StatRow label="Total cost of loan" value={fmtUSD(P + baseInterest)} emphasis />
          </div>
          {e > 0 && (
            <div className="rounded-lg bg-secondary/60 px-3.5 py-3 text-sm">
              <p className="font-medium text-secondary-foreground">
                With {fmtUSD(e)} extra per month
              </p>
              <div className="mt-2 space-y-1">
                <StatRow label="Debt-free in" value={fmtDuration(months)} />
                <StatRow label="Interest saved" value={fmtUSD(Math.max(0, interestSaved))} emphasis />
                <StatRow label="Time saved" value={fmtDuration(monthsSaved)} />
              </div>
            </div>
          )}
          <ExportToolbar
            filename="loan-amortization-schedule"
            columns={[
              { header: "Payment #", key: "month" },
              { header: "Payment Amount ($)", key: "payment" },
              { header: "Principal ($)", key: "principal" },
              { header: "Interest ($)", key: "interest" },
              { header: "Remaining Balance ($)", key: "balance" },
            ]}
            rows={scheduleRows}
            className="pt-2 border-t border-border/60"
          />
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 3. Compound interest calculator                                     */
/* ================================================================== */

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = React.useState("10,000");
  const [contribution, setContribution] = React.useState("300");
  const [rate, setRate] = React.useState("7");
  const [years, setYears] = React.useState("20");
  const [frequency, setFrequency] = React.useState("12");

  const P = num(principal);
  const c = num(contribution);
  const r = num(rate) / 100;
  const t = num(years);
  const f = num(frequency, 12);

  const monthlyFactor = Math.pow(1 + r / f, f / 12) - 1;
  let balance = P;
  let contributed = P;
  const m = Math.round(t * 12);
  for (let i = 0; i < m; i++) {
    balance += balance * monthlyFactor;
    balance += c;
    contributed += c;
  }
  const earned = balance - contributed;

  return (
    <CalcLayout
      inputs={
        <FieldGrid>
          <NumberField label="Starting balance" value={principal} onChange={setPrincipal} prefix="$" />
          <NumberField label="Monthly contribution" value={contribution} onChange={setContribution} prefix="$" />
          <NumberField label="Annual return" value={rate} onChange={setRate} suffix="%" />
          <NumberField label="Years" value={years} onChange={setYears} suffix="yrs" />
          <SelectField
            label="Compounding"
            value={frequency}
            onChange={setFrequency}
            options={[
              { value: "1", label: "Annually" },
              { value: "4", label: "Quarterly" },
              { value: "12", label: "Monthly" },
              { value: "365", label: "Daily" },
            ]}
            className="sm:col-span-2"
          />
        </FieldGrid>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label="Future value"
            value={fmtUSD(balance)}
            sub={`After ${num(years)} years at ${fmtPct(num(rate), 1)}`}
          />
          <div>
            <StatRow label="Total contributed" value={fmtUSD(contributed)} />
            <StatRow label="Interest earned" value={fmtUSD(earned)} emphasis />
            <StatRow
              label="Growth share of balance"
              value={balance > 0 ? fmtPct((earned / balance) * 100, 1) : "—"}
            />
          </div>
          <Verdict tone="neutral">
            Compounding does the heavy lifting: {balance > contributed ? fmtPct((earned / Math.max(1, contributed)) * 100, 0) : "0"} growth on every dollar you put in.
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 4. Income tax calculator                                            */
/* ================================================================== */

const BRACKETS_2025 = {
  single: [
    { upto: 11925, rate: 0.1 },
    { upto: 48475, rate: 0.12 },
    { upto: 103350, rate: 0.22 },
    { upto: 197300, rate: 0.24 },
    { upto: 250525, rate: 0.32 },
    { upto: 626350, rate: 0.35 },
    { upto: Infinity, rate: 0.37 },
  ],
  married: [
    { upto: 23850, rate: 0.1 },
    { upto: 96950, rate: 0.12 },
    { upto: 206700, rate: 0.22 },
    { upto: 394600, rate: 0.24 },
    { upto: 501050, rate: 0.32 },
    { upto: 751600, rate: 0.35 },
    { upto: Infinity, rate: 0.37 },
  ],
} as const;

export function IncomeTaxCalculator() {
  const [income, setIncome] = React.useState("85,000");
  const [status, setStatus] = React.useState("single");
  const [deduction, setDeduction] = React.useState("15,000");
  const [stateRate, setStateRate] = React.useState("5");

  const updateStatus = (s: string) => {
    setStatus(s);
    setDeduction(s === "married" ? "30,000" : "15,000");
  };

  const gross = num(income);
  const brackets = status === "married" ? BRACKETS_2025.married : BRACKETS_2025.single;
  const taxable = Math.max(0, gross - num(deduction));
  const stateTax = gross * (num(stateRate) / 100);

  let federal = 0;
  let lower = 0;
  let marginal = 0;
  const rows: (string | number)[][] = [];
  for (const b of brackets) {
    if (taxable > lower) {
      const span = Math.min(taxable, b.upto) - lower;
      const tax = span * b.rate;
      federal += tax;
      rows.push([
        `${fmtUSD(lower)} – ${b.upto === Infinity ? "above" : fmtUSD(b.upto)}`,
        fmtPct(b.rate * 100, 0),
        fmtUSD(tax),
      ]);
      marginal = b.rate;
      lower = b.upto;
    } else break;
  }

  const effective = gross > 0 ? (federal / gross) * 100 : 0;
  const takeHome = gross - federal - stateTax;

  return (
    <CalcLayout
      inputs={
        <FieldGrid>
          <NumberField label="Gross annual income" value={income} onChange={setIncome} prefix="$" className="sm:col-span-2" />
          <SelectField
            label="Filing status"
            value={status}
            onChange={updateStatus}
            options={[
              { value: "single", label: "Single" },
              { value: "married", label: "Married filing jointly" },
            ]}
          />
          <NumberField label="Deductions" value={deduction} onChange={setDeduction} prefix="$" />
          <NumberField label="State income tax" value={stateRate} onChange={setStateRate} suffix="%" hint="Set 0 if your state has none" className="sm:col-span-2" />
        </FieldGrid>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label="Take-home pay (annual)"
            value={fmtUSD(takeHome)}
            sub={`${fmtUSD(takeHome / 12)} per month after federal + state tax`}
          />
          <div>
            <StatRow label="Taxable income" value={fmtUSD(taxable)} />
            <StatRow label="Federal tax" value={fmtUSD(federal)} emphasis />
            <StatRow label="State tax" value={fmtUSD(stateTax)} />
            <StatRow label="Effective federal rate" value={fmtPct(effective, 1)} />
            <StatRow label="Marginal bracket" value={fmtPct(marginal * 100, 0)} />
          </div>
          <MiniTable head={["Bracket", "Rate", "Tax"]} rows={rows} />
          <Verdict tone="neutral">
            Illustrative only — 2025 U.S. federal brackets and standard deductions, no credits or dependants. Not tax advice.
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 5. VAT / sales tax calculator                                       */
/* ================================================================== */

export function VATCalculator() {
  const [params, setParams, resetParams] = useToolState({
    amount: "1,000",
    rate: "20",
    mode: "add",
  });
  const { amount, rate, mode } = params;

  const a = num(amount);
  const v = num(rate) / 100;
  const net = mode === "add" ? a : a / (1 + v);
  const vat = mode === "add" ? a * v : a - net;
  const gross = mode === "add" ? a + vat : a;

  return (
    <CalcLayout
      actions={<ToolShareBar onReset={resetParams} />}
      inputs={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {(["add", "remove"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setParams({ mode: m })}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  mode === m
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-card hover:bg-accent"
                }`}
              >
                {m === "add" ? "Add VAT" : "Remove VAT"}
              </button>
            ))}
          </div>
          <NumberField
            label={mode === "add" ? "Net amount" : "Gross amount"}
            value={amount}
            onChange={(val) => setParams({ amount: val })}
            prefix="$"
          />
          <NumberField
            label="VAT / sales tax rate"
            value={rate}
            onChange={(val) => setParams({ rate: val })}
            suffix="%"
          />
          <div className="flex flex-wrap gap-2">
            {[5, 7.5, 10, 20, 21, 25].map((p) => (
              <button
                key={p}
                onClick={() => setParams({ rate: String(p) })}
                className="rounded-full border px-3 py-1 text-xs font-medium hover:bg-accent"
              >
                {p}%
              </button>
            ))}
          </div>
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label={mode === "add" ? "Gross (with VAT)" : "Net (without VAT)"}
            value={mode === "add" ? fmtUSD(gross) : fmtUSD(net)}
            sub={`At ${fmtPct(num(rate), 1)} VAT`}
          />
          <div>
            <StatRow label="Net amount" value={fmtUSD(net)} />
            <StatRow label={`VAT (${fmtPct(num(rate), 1)})`} value={fmtUSD(vat)} emphasis />
            <StatRow label="Gross amount" value={fmtUSD(gross)} />
          </div>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 6. Profit & loss calculator                                         */
/* ================================================================== */

export function ProfitLossCalculator() {
  const [revenue, setRevenue] = React.useState("250,000");
  const [cogs, setCogs] = React.useState("90,000");
  const [opex, setOpex] = React.useState("95,000");
  const [other, setOther] = React.useState("12,000");
  const [taxRate, setTaxRate] = React.useState("21");

  const rev = num(revenue);
  const gp = rev - num(cogs);
  const ebit = gp - num(opex);
  const preTax = ebit - num(other);
  const tax = Math.max(0, preTax) * (num(taxRate) / 100);
  const net = preTax - tax;
  const m = (x: number) => (rev > 0 ? (x / rev) * 100 : 0);

  return (
    <CalcLayout
      inputs={
        <FieldGrid>
          <NumberField label="Revenue" value={revenue} onChange={setRevenue} prefix="$" className="sm:col-span-2" />
          <NumberField label="Cost of goods sold" value={cogs} onChange={setCogs} prefix="$" />
          <NumberField label="Operating expenses" value={opex} onChange={setOpex} prefix="$" hint="Rent, payroll, software, marketing" />
          <NumberField label="Other expenses" value={other} onChange={setOther} prefix="$" hint="Interest, one-off costs" />
          <NumberField label="Tax rate" value={taxRate} onChange={setTaxRate} suffix="%" />
        </FieldGrid>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label="Net profit"
            value={fmtUSD(net)}
            sub={`${fmtPct(m(net), 1)} net margin`}
          />
          <div>
            <StatRow label="Gross profit" value={fmtUSD(gp)} />
            <StatRow label="Gross margin" value={fmtPct(m(gp), 1)} />
            <StatRow label="Operating profit (EBIT)" value={fmtUSD(ebit)} />
            <StatRow label="Operating margin" value={fmtPct(m(ebit), 1)} />
            <StatRow label={`Tax @ ${fmtPct(num(taxRate), 0)}`} value={fmtUSD(tax)} />
          </div>
          {net >= 0 ? (
            <Verdict tone={m(net) >= 10 ? "good" : "warn"}>
              {m(net) >= 10
                ? `Healthy: a ${fmtPct(m(net), 1)} net margin is solid for most small businesses.`
                : `Profitable but thin at ${fmtPct(m(net), 1)} net margin — watch operating expenses for leverage.`}
            </Verdict>
          ) : (
            <Verdict tone="bad">
              Losing {fmtUSD(Math.abs(net))} per period. Gross margin is {fmtPct(m(gp), 1)} — pricing or COGS is the first place to look.
            </Verdict>
          )}
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 7. Currency converter                                               */
/* ================================================================== */

const SNAPSHOT_RATES: Record<string, number> = {
  USD: 1.0, EUR: 0.92, GBP: 0.79, JPY: 149.5, CNY: 7.21, INR: 83.4,
  CAD: 1.37, AUD: 1.53, CHF: 0.88, SGD: 1.34, AED: 3.67, ZAR: 18.1,
  BRL: 5.42, MXN: 17.6, NGN: 1540, KRW: 1352, TRY: 34.2, PLN: 3.98,
  SEK: 10.45, NZD: 1.66, HKD: 7.79,
};

export function CurrencyConverter() {
  const [amount, setAmount] = React.useState("1,000");
  const [from, setFrom] = React.useState("USD");
  const [to, setTo] = React.useState("EUR");
  const [override, setOverride] = React.useState("");
  const [rates, setRates] = React.useState<Record<string, number>>(SNAPSHOT_RATES);
  const [rateSource, setRateSource] = React.useState<"live" | "snapshot">("snapshot");

  React.useEffect(() => {
    fetch("/api/rates")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates && typeof data.rates === "object") {
          setRates((prev) => ({ ...prev, ...data.rates }));
          if (data.source === "live") {
            setRateSource("live");
          }
        }
      })
      .catch(() => {
        // Keeps SNAPSHOT_RATES
      });
  }, []);

  const codes = Object.keys(rates).sort();
  const a = num(amount);
  const fromRate = rates[from] || 1;
  const toRate = rates[to] || 1;
  const tableRate = fromRate > 0 ? toRate / fromRate : 0;
  const rate = override.trim() !== "" ? num(override, tableRate) : tableRate;
  const converted = a * rate;

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <FieldGrid>
            <NumberField label="Amount" value={amount} onChange={setAmount} />
            <SelectField
              label="From"
              value={from}
              onChange={(v) => { setFrom(v); setOverride(""); }}
              options={codes.map((c) => ({ value: c, label: c }))}
            />
            <SelectField
              label="To"
              value={to}
              onChange={(v) => { setTo(v); setOverride(""); }}
              options={codes.map((c) => ({ value: c, label: c }))}
            />
            <NumberField
              label={`Rate (1 ${from} = ? ${to})`}
              value={override}
              onChange={setOverride}
              placeholder={tableRate.toFixed(4).replace(/\.?0+$/, "") || "—"}
              hint={override ? "Using your custom rate" : `${rateSource === "live" ? "Live edge" : "Snapshot"}: ${tableRate.toFixed(4)}`}
            />
          </FieldGrid>
          <Verdict tone={rateSource === "live" ? "good" : "neutral"}>
            {rateSource === "live"
              ? "Live Forex exchange rates provided via edge cache. Enter your specific bank or card rate above for exact settlement figures."
              : "Rates are an indicative snapshot — enter your bank or card rate above for exact figures."}
          </Verdict>
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label={`${fmtNum(a)} ${from} converts to`}
            value={converted.toLocaleString("en-US", { maximumFractionDigits: 2 })}
            sub={to}
          />
          <div>
            <StatRow label="Rate used" value={`1 ${from} = ${rate.toFixed(4)} ${to}`} emphasis />
            <StatRow label="Inverse rate" value={`1 ${to} = ${(rate > 0 ? 1 / rate : 0).toFixed(4)} ${from}`} />
          </div>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 8. Debt repayment calculator                                        */
/* ================================================================== */

interface Debt { balance: string; apr: string; min: string }

export function DebtRepaymentCalculator() {
  const [debts, setDebts] = React.useState<Debt[]>([
    { balance: "6,000", apr: "22.9", min: "150" },
    { balance: "11,000", apr: "7.5", min: "320" },
    { balance: "18,500", apr: "5.8", min: "210" },
    { balance: "", apr: "", min: "" },
  ]);
  const [extra, setExtra] = React.useState("150");
  const [strategy, setStrategy] = React.useState("avalanche");

  const setDebt = (i: number, key: keyof Debt, v: string) =>
    setDebts((ds) => ds.map((d, j) => (j === i ? { ...d, [key]: v } : d)));

  const live = debts
    .map((d, i) => ({ i, b: num(d.balance), r: num(d.apr) / 100 / 12, m: num(d.min) }))
    .filter((d) => d.b > 0);

  const simulate = (useExtra: boolean, prioritized: number[]) => {
    const bs = live.map((d) => d.b);
    const rs = live.map((d) => d.r);
    const ms = live.map((d) => d.m);
    const paidInterest = live.map(() => 0);
    const payoffOrder: number[] = [];
    const payoffMonth = live.map(() => NaN);
    let budget = ms.reduce((a, b) => a + b, 0) + (useExtra ? num(extra) : 0);
    let month = 0;
    let alive = bs.map((b) => b > 0);
    while (alive.some(Boolean) && month < 1200) {
      month++;
      let pool = budget;
      // interest accrues
      for (let i = 0; i < bs.length; i++) {
        if (!alive[i]) continue;
        const it = bs[i] * rs[i];
        bs[i] += it;
        paidInterest[i] += it;
      }
      // minimums
      for (let i = 0; i < bs.length; i++) {
        if (!alive[i]) continue;
        const pay = Math.min(ms[i], bs[i], pool);
        bs[i] -= pay;
        pool -= pay;
        if (bs[i] <= 0.005) {
          alive[i] = false;
          payoffOrder.push(live[i].i);
          payoffMonth[live[i].i] = month;
        }
      }
      // extra to priority targets
      for (const idx of prioritized) {
        const li = live.findIndex((d) => d.i === idx);
        if (li === -1 || !alive[li]) continue;
        const pay = Math.min(pool, bs[li]);
        bs[li] -= pay;
        pool -= pay;
        if (bs[li] <= 0.005) {
          alive[li] = false;
          payoffOrder.push(idx);
          payoffMonth[idx] = month;
        }
        if (pool <= 0) break;
      }
    }
    return { months: month, interest: paidInterest.reduce((a, b) => a + b, 0), payoffOrder, payoffMonth };
  };

  const priority =
    strategy === "avalanche"
      ? [...live].sort((a, b) => b.r - a.r).map((d) => d.i)
      : [...live].sort((a, b) => a.b - b.b).map((d) => d.i);

  const plan = simulate(true, priority);
  const baseline = live.length ? simulate(false, []) : { months: 0, interest: 0, payoffOrder: [], payoffMonth: [] as number[] };
  const saved = baseline.interest - plan.interest;

  const orderRows = plan.payoffOrder.map((idx, pos) => {
    const d = live.find((x) => x.i === idx)!;
    const orig = debts[idx];
    return [
      `${pos + 1}. Debt ${idx + 1}`,
      `${fmtPct(num(orig.apr), 1)} APR`,
      fmtUSD(num(orig.balance)),
      isNaN(plan.payoffMonth[idx]) ? "—" : fmtDuration(plan.payoffMonth[idx]),
    ];
  });

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <FieldGrid cols={3}>
            <SectionLabel>Debt</SectionLabel>
            <SectionLabel>Balance / APR</SectionLabel>
            <SectionLabel>Min payment</SectionLabel>
          </FieldGrid>
          {debts.map((d, i) => (
            <FieldGrid key={i} cols={3}>
              <div className="flex items-center text-sm font-medium text-muted-foreground">
                Debt {i + 1}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <NumberField label="" value={d.balance} onChange={(v) => setDebt(i, "balance", v)} prefix="$" />
                <NumberField label="" value={d.apr} onChange={(v) => setDebt(i, "apr", v)} suffix="%" />
              </div>
              <NumberField label="" value={d.min} onChange={(v) => setDebt(i, "min", v)} prefix="$" />
            </FieldGrid>
          ))}
          <FieldGrid>
            <NumberField label="Extra monthly budget" value={extra} onChange={setExtra} prefix="$" />
            <SelectField
              label="Strategy"
              value={strategy}
              onChange={setStrategy}
              options={[
                { value: "avalanche", label: "Avalanche (highest APR first)" },
                { value: "snowball", label: "Snowball (smallest balance first)" },
              ]}
            />
          </FieldGrid>
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label="Debt-free in"
            value={fmtDuration(plan.months)}
            sub={`${strategy === "avalanche" ? "Avalanche" : "Snowball"} strategy with ${fmtUSD(num(extra))} extra per month`}
          />
          <div>
            <StatRow label="Total interest paid" value={fmtUSD(plan.interest)} />
            <StatRow label="Interest saved vs minimums" value={fmtUSD(Math.max(0, saved))} emphasis />
            <StatRow
              label="Time saved vs minimums"
              value={baseline.months > 0 ? fmtDuration(Math.max(0, baseline.months - plan.months)) : "—"}
            />
          </div>
          <MiniTable
            head={["Payoff order", "Rate", "Balance", "Cleared"]}
            rows={orderRows}
          />
        </div>
      }
    />
  );
}
