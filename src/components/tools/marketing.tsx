"use client";

import * as React from "react";
import {
  CalcLayout,
  FieldGrid,
  NumberField,
  ResultHero,
  SelectField,
  StatRow,
  Verdict,
  MiniTable,
  SectionLabel,
} from "./ui";
import { fmtCompact, fmtMoney, fmtNum, fmtPct, fmtUSD, fmtX, num } from "@/lib/format";

/* ================================================================== */
/* 9. Marketing ROI calculator                                         */
/* ================================================================== */

export function MarketingROICalculator() {
  const [revenue, setRevenue] = React.useState("60,000");
  const [spend, setSpend] = React.useState("12,000");
  const [margin, setMargin] = React.useState("60");

  const rev = num(revenue);
  const s = num(spend);
  const gp = rev * (num(margin) / 100);
  const netReturn = gp - s;
  const roi = s > 0 ? (netReturn / s) * 100 : 0;
  const roas = s > 0 ? rev / s : 0;
  const perDollar = s > 0 ? netReturn / s : 0;

  return (
    <CalcLayout
      inputs={
        <FieldGrid>
          <NumberField label="Revenue attributed to marketing" value={revenue} onChange={setRevenue} prefix="$" className="sm:col-span-2" />
          <NumberField label="Total marketing spend" value={spend} onChange={setSpend} prefix="$" />
          <NumberField
            label="Gross margin"
            value={margin}
            onChange={setMargin}
            suffix="%"
            hint="Use 100% if you want revenue-based ROI"
          />
        </FieldGrid>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label="Marketing ROI"
            value={fmtPct(roi, 1)}
            sub={netReturn >= 0 ? "Profitable after margin" : "Losing money after margin"}
          />
          <div>
            <StatRow label="Gross profit generated" value={fmtUSD(gp)} />
            <StatRow label="Net return after spend" value={fmtUSD(netReturn)} emphasis />
            <StatRow label="ROAS (revenue ÷ spend)" value={fmtX(roas)} />
            <StatRow label="Profit per $1 spent" value={fmtMoney(perDollar, "$", 2)} />
          </div>
          {netReturn >= 0 ? (
            <Verdict tone={roi >= 100 ? "good" : "warn"}>
              {roi >= 100
                ? `Strong: every $1 spent returns $${(perDollar).toFixed(2)} in profit. Scale spend while efficiency holds.`
                : `Positive but thin. Raising margin or conversion beats raising budget here.`}
            </Verdict>
          ) : (
            <Verdict tone="bad">
              At a {fmtPct(num(margin), 0)} margin you need more than {fmtUSD(s / Math.max(0.01, num(margin) / 100))} in revenue to break even.
            </Verdict>
          )}
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 10. Campaign performance calculator                                 */
/* ================================================================== */

export function CampaignPerformanceCalculator() {
  const [impressions, setImpressions] = React.useState("400,000");
  const [clicks, setClicks] = React.useState("6,400");
  const [conversions, setConversions] = React.useState("192");
  const [spend, setSpend] = React.useState("9,600");
  const [revenue, setRevenue] = React.useState("28,800");

  const imp = num(impressions);
  const cl = num(clicks);
  const cv = num(conversions);
  const s = num(spend);
  const rev = num(revenue);

  const ctr = imp > 0 ? (cl / imp) * 100 : 0;
  const cvr = cl > 0 ? (cv / cl) * 100 : 0;
  const cpc = cl > 0 ? s / cl : 0;
  const cpm = imp > 0 ? (s / imp) * 1000 : 0;
  const cpa = cv > 0 ? s / cv : 0;
  const roas = s > 0 ? rev / s : 0;
  const profit = rev - s;

  return (
    <CalcLayout
      inputs={
        <FieldGrid>
          <NumberField label="Impressions" value={impressions} onChange={setImpressions} />
          <NumberField label="Clicks" value={clicks} onChange={setClicks} />
          <NumberField label="Conversions" value={conversions} onChange={setConversions} />
          <NumberField label="Ad spend" value={spend} onChange={setSpend} prefix="$" />
          <NumberField label="Revenue from campaign" value={revenue} onChange={setRevenue} prefix="$" className="sm:col-span-2" />
        </FieldGrid>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label="Campaign ROAS"
            value={fmtX(roas)}
            sub={`${profit >= 0 ? fmtUSD(profit) + " profit" : fmtUSD(Math.abs(profit)) + " loss"} on ${fmtUSD(s)} spend`}
          />
          <MiniTable
            head={["Metric", "Value"]}
            rows={[
              ["CTR", fmtPct(ctr, 2)],
              ["Conversion rate", fmtPct(cvr, 2)],
              ["CPC", fmtUSD(cpc, 2)],
              ["CPM", fmtUSD(cpm, 2)],
              ["Cost per acquisition", fmtUSD(cpa, 2)],
              ["Revenue per 1,000 impressions", fmtUSD(imp > 0 ? (rev / imp) * 1000 : 0, 2)],
            ]}
          />
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 11. CAC calculator                                                  */
/* ================================================================== */

export function CACCalculator() {
  const [mktSpend, setMktSpend] = React.useState("30,000");
  const [salesSpend, setSalesSpend] = React.useState("18,000");
  const [customers, setCustomers] = React.useState("120");
  const [arpu, setArpu] = React.useState("120");
  const [margin, setMargin] = React.useState("75");

  const spend = num(mktSpend) + num(salesSpend);
  const c = num(customers);
  const cac = c > 0 ? spend / c : 0;
  const monthlyProfit = num(arpu) * (num(margin) / 100);
  const payback = monthlyProfit > 0 ? cac / monthlyProfit : NaN;

  return (
    <CalcLayout
      inputs={
        <FieldGrid>
          <NumberField label="Marketing spend (period)" value={mktSpend} onChange={setMktSpend} prefix="$" />
          <NumberField label="Sales spend (period)" value={salesSpend} onChange={setSalesSpend} prefix="$" hint="Salaries, tools, commissions" />
          <NumberField label="New customers acquired" value={customers} onChange={setCustomers} />
          <NumberField label="Avg revenue per customer / month" value={arpu} onChange={setArpu} prefix="$" />
          <NumberField label="Gross margin" value={margin} onChange={setMargin} suffix="%" className="sm:col-span-2" />
        </FieldGrid>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label="Customer acquisition cost"
            value={fmtUSD(cac, 2)}
            sub={`${fmtNum(c)} customers from ${fmtUSD(spend)}`}
          />
          <div>
            <StatRow label="All-in spend per customer" value={fmtUSD(cac, 2)} emphasis />
            <StatRow
              label="CAC payback period"
              value={isFinite(payback) ? `${payback.toFixed(1)} months` : "—"}
            />
            <StatRow
              label="Monthly profit per customer"
              value={fmtUSD(monthlyProfit, 2)}
            />
          </div>
          {isFinite(payback) ? (
            payback <= 12 ? (
              <Verdict tone="good">
                CAC repaid in {payback.toFixed(1)} months — inside the 12-month benchmark most healthy businesses target.
              </Verdict>
            ) : payback <= 18 ? (
              <Verdict tone="warn">
                {payback.toFixed(1)}-month payback is workable but cash-hungry. Shorten it with conversion rate or margin, not more spend.
              </Verdict>
            ) : (
              <Verdict tone="bad">
                {payback.toFixed(1)}-month payback ties up cash for too long. Fix retention, pricing or acquisition before scaling.
              </Verdict>
            )
          ) : (
            <Verdict tone="neutral">Add revenue per customer to compute payback.</Verdict>
          )}
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 12. Conversion rate calculator                                      */
/* ================================================================== */

export function ConversionRateCalculator() {
  const [sessions, setSessions] = React.useState("24,000");
  const [conversions, setConversions] = React.useState("528");

  const s = num(sessions);
  const cv = num(conversions);
  const cvr = s > 0 ? (cv / s) * 100 : 0;
  const per10k = (cvr / 100) * 10000;

  return (
    <CalcLayout
      inputs={
        <FieldGrid>
          <NumberField label="Sessions / visitors" value={sessions} onChange={setSessions} />
          <NumberField label="Conversions" value={conversions} onChange={setConversions} hint="Sales, leads, signups — your goal" />
        </FieldGrid>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label="Conversion rate"
            value={fmtPct(cvr, 2)}
            sub={`1 conversion per ${cvr > 0 ? fmtNum(100 / cvr, 1) : "—"} visitors`}
          />
          <div className="space-y-1">
            <StatRow label="Conversions per 10,000 sessions" value={fmtNum(per10k, 0)} />
            <StatRow label="Conversions per 100,000 sessions" value={fmtNum(per10k * 10, 0)} />
          </div>
          <MiniTable
            head={["To get this many conversions…", "Sessions needed"]}
            rows={[10, 50, 100, 250].map((n) => [
              fmtNum(n, 0),
              cvr > 0 ? fmtCompact((n / cvr) * 100) : "—",
            ])}
          />
          <Verdict tone="neutral">
            Median e-commerce sites convert in the 2–4% range; lead-generation pages often double that. Benchmark against your own history first.
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 13. Marketing budget planner                                        */
/* ================================================================== */

export function MarketingBudgetPlanner() {
  const [goal, setGoal] = React.useState("500,000");
  const [deal, setDeal] = React.useState("1,000");
  const [close, setClose] = React.useState("20");
  const [visitLead, setVisitLead] = React.useState("4");
  const [cpl, setCpl] = React.useState("12");

  const g = num(goal);
  const d = num(deal);
  const cr = num(close) / 100;
  const vlr = num(visitLead) / 100;
  const c = num(cpl);

  const customersNeeded = d > 0 ? g / d : 0;
  const leadsNeeded = cr > 0 ? customersNeeded / cr : 0;
  const sessionsNeeded = vlr > 0 ? leadsNeeded / vlr : 0;
  const leadBudget = leadsNeeded * c;
  const monthly = leadBudget / 12;

  return (
    <CalcLayout
      inputs={
        <FieldGrid>
          <NumberField label="Revenue goal (next 12 months)" value={goal} onChange={setGoal} prefix="$" />
          <NumberField label="Average sale value" value={deal} onChange={setDeal} prefix="$" />
          <NumberField label="Lead → customer close rate" value={close} onChange={setClose} suffix="%" />
          <NumberField label="Visitor → lead rate" value={visitLead} onChange={setVisitLead} suffix="%" />
          <NumberField label="Target cost per lead" value={cpl} onChange={setCpl} prefix="$" />
        </FieldGrid>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label="Marketing budget for the year"
            value={fmtUSD(leadBudget)}
            sub={`${fmtUSD(monthly)} per month on lead generation`}
          />
          <MiniTable
            head={["You need", "Volume"]}
            rows={[
              ["Customers", fmtNum(customersNeeded, 0)],
              ["Qualified leads", fmtNum(leadsNeeded, 0)],
              ["Website sessions", fmtCompact(sessionsNeeded)],
              ["Leads per month", fmtNum(leadsNeeded / 12, 0)],
            ]}
          />
          {cr > 0 && vlr > 0 ? (
            <Verdict tone="neutral">
              Goal ÷ deal size ÷ close rate ÷ visitor-to-lead rate = sessions; sessions × CPL = budget. If the budget looks too big, the levers are deal size and close rate first, CPL second.
            </Verdict>
          ) : (
            <Verdict tone="warn">Set every rate above 0 to run the plan.</Verdict>
          )}
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 14. Marketing funnel calculator                                     */
/* ================================================================== */

export function FunnelCalculator() {
  const [sessions, setSessions] = React.useState("50,000");
  const [v2l, setV2l] = React.useState("3.5");
  const [l2o, setL2o] = React.useState("25");
  const [o2c, setO2c] = React.useState("30");
  const [deal, setDeal] = React.useState("800");

  const s = num(sessions);
  const leads = s * (num(v2l) / 100);
  const opps = leads * (num(l2o) / 100);
  const custs = opps * (num(o2c) / 100);
  const revenue = custs * num(deal);

  return (
    <CalcLayout
      inputs={
        <FieldGrid>
          <NumberField label="Sessions (top of funnel)" value={sessions} onChange={setSessions} className="sm:col-span-2" />
          <NumberField label="Visitor → lead rate" value={v2l} onChange={setV2l} suffix="%" />
          <NumberField label="Lead → opportunity rate" value={l2o} onChange={setL2o} suffix="%" />
          <NumberField label="Opportunity → customer rate" value={o2c} onChange={setO2c} suffix="%" />
          <NumberField label="Average sale value" value={deal} onChange={setDeal} prefix="$" />
        </FieldGrid>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label="Predicted revenue"
            value={fmtUSD(revenue)}
            sub={`${fmtNum(custs, 1)} customers from ${fmtCompact(s)} sessions`}
          />
          <MiniTable
            head={["Stage", "Volume", "Drop-off"]}
            rows={[
              ["Sessions", fmtCompact(s), "—"],
              ["Leads", fmtNum(leads, 0), `${fmtNum(Math.max(0, s - leads), 0)} lost`],
              ["Opportunities", fmtNum(opps, 0), `${fmtNum(Math.max(0, leads - opps), 0)} lost`],
              ["Customers", fmtNum(custs, 1), `${fmtNum(Math.max(0, opps - custs), 0)} lost`],
            ]}
          />
          <Verdict tone="neutral">
            Overall visitor → customer rate: {s > 0 ? fmtPct((custs / s) * 100, 2) : "—"} — a 0.1pt gain at any single stage compounds through the whole funnel.
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 15. A/B test significance calculator                                */
/* ================================================================== */

/** Abramowitz & Stegun erf approximation → normal CDF. */
function normalCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804014327 * Math.exp((-z * z) / 2);
  const p =
    d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return z >= 0 ? 1 - p : p;
}

export function ABTestSignificanceCalculator() {
  const [va, setVa] = React.useState("10,000");
  const [ca, setCa] = React.useState("340");
  const [vb, setVb] = React.useState("10,000");
  const [cb, setCb] = React.useState("402");
  const [conf, setConf] = React.useState("95");

  const na = num(va);
  const nb = num(vb);
  const xa = num(ca);
  const xb = num(cb);
  const pa = na > 0 ? xa / na : 0;
  const pb = nb > 0 ? xb / nb : 0;
  const pool = (na + nb > 0) ? (xa + xb) / (na + nb) : 0;
  const se = Math.sqrt(pool * (1 - pool) * (1 / Math.max(1, na) + 1 / Math.max(1, nb)));
  const z = se > 0 ? (pb - pa) / se : 0;
  const pValue = 2 * (1 - normalCdf(Math.abs(z)));
  const lift = pa > 0 ? ((pb - pa) / pa) * 100 : 0;
  const threshold = num(conf) / 100;
  const significant = pValue < 1 - threshold;
  const winner = pb > pa ? "B" : "A";

  return (
    <CalcLayout
      inputs={
        <FieldGrid>
          <SectionLabel>Variant A (control)</SectionLabel>
          <SectionLabel>Variant B (challenge)</SectionLabel>
          <NumberField label="Visitors" value={va} onChange={setVa} />
          <NumberField label="Visitors" value={vb} onChange={setVb} />
          <NumberField label="Conversions" value={ca} onChange={setCa} />
          <NumberField label="Conversions" value={cb} onChange={setCb} />
          <SelectField
            label="Confidence level"
            value={conf}
            onChange={setConf}
            options={[
              { value: "90", label: "90%" },
              { value: "95", label: "95%" },
              { value: "99", label: "99%" },
            ]}
            className="sm:col-span-2"
          />
        </FieldGrid>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label={significant ? `Variant ${winner} wins` : "No clear winner yet"}
            value={fmtPct(lift, 1)}
            sub={`Relative lift for B over A · ${fmtPct(1 - pValue > 0.9999 ? 99.99 : Math.max(0, (1 - pValue) * 100), 2)} confidence achieved`}
          />
          <div>
            <StatRow label="Variant A rate" value={fmtPct(pa * 100, 2)} />
            <StatRow label="Variant B rate" value={fmtPct(pb * 100, 2)} />
            <StatRow label="z-score" value={z.toFixed(3)} />
            <StatRow label="p-value" value={pValue < 0.0001 ? "< 0.0001" : pValue.toFixed(4)} emphasis />
          </div>
          <Verdict tone={significant ? "good" : "warn"}>
            {significant
              ? `The difference is statistically significant at the ${conf}% level — variant ${winner} is the safer bet.`
              : `Below ${conf}% confidence. Keep the test running — stopping early is how false winners happen.`}
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 16. Customer lifetime value calculator                              */
/* ================================================================== */

export function LTVCalculator() {
  const [aov, setAov] = React.useState("85");
  const [freq, setFreq] = React.useState("6");
  const [margin, setMargin] = React.useState("65");
  const [churn, setChurn] = React.useState("15");
  const [cac, setCac] = React.useState("95");

  const a = num(aov);
  const f = num(freq);
  const m = num(margin) / 100;
  const ch = num(churn) / 100;
  const c = num(cac);

  const lifespan = ch > 0 ? 1 / ch : NaN;
  const annualValue = a * f * m;
  const ltv = isFinite(lifespan) ? annualValue * lifespan : NaN;
  const ratio = c > 0 && isFinite(ltv) ? ltv / c : NaN;

  return (
    <CalcLayout
      inputs={
        <FieldGrid>
          <NumberField label="Average order value" value={aov} onChange={setAov} prefix="$" />
          <NumberField label="Purchases per year" value={freq} onChange={setFreq} />
          <NumberField label="Gross margin" value={margin} onChange={setMargin} suffix="%" />
          <NumberField label="Annual churn" value={churn} onChange={setChurn} suffix="%" hint="Share of customers lost per year" />
          <NumberField label="CAC (optional)" value={cac} onChange={setCac} prefix="$" className="sm:col-span-2" />
        </FieldGrid>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label="Customer lifetime value"
            value={isFinite(ltv) ? fmtUSD(ltv) : "—"}
            sub={`Gross profit over a ${isFinite(lifespan) ? lifespan.toFixed(1) : "—"}-year expected lifespan`}
          />
          <div>
            <StatRow label="Annual profit per customer" value={fmtUSD(annualValue, 2)} />
            <StatRow label="Expected lifespan" value={isFinite(lifespan) ? `${lifespan.toFixed(1)} yrs` : "—"} />
            <StatRow label="LTV" value={isFinite(ltv) ? fmtUSD(ltv) : "—"} emphasis />
            {c > 0 && <StatRow label="LTV : CAC ratio" value={isFinite(ratio) ? fmtX(ratio, 1) : "—"} />}
          </div>
          {isFinite(ratio) && c > 0 ? (
            ratio >= 3 ? (
              <Verdict tone="good">
                {ratio.toFixed(1)}:1 is at or above the 3:1 rule of thumb — acquisition economics are healthy.
              </Verdict>
            ) : ratio >= 1.5 ? (
              <Verdict tone="warn">
                {ratio.toFixed(1)}:1 is below the 3:1 benchmark. Raise retention or order frequency before buying more traffic.
              </Verdict>
            ) : (
              <Verdict tone="bad">
                {ratio.toFixed(1)}:1 — customers cost nearly what they return. This model is not scalable yet.
              </Verdict>
            )
          ) : (
            <Verdict tone="neutral">Add a CAC to see the LTV:CAC health ratio.</Verdict>
          )}
        </div>
      }
    />
  );
}
