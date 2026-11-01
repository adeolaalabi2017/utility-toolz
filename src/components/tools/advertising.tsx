"use client";

import * as React from "react";
import {
  CalcLayout,
  FieldGrid,
  MiniTable,
  NumberField,
  ResultHero,
  SectionLabel,
  StatRow,
  Verdict,
} from "./ui";
import { fmtCompact, fmtNum, fmtPct, fmtUSD, fmtX, num } from "@/lib/format";
import { useToolState } from "@/hooks/use-tool-state";
import { ToolShareBar } from "@/components/site/tool-share-bar";

function ModeToggle({
  modes,
  mode,
  onMode,
}: {
  modes: { id: string; label: string }[];
  mode: string;
  onMode: (m: string) => void;
}) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${modes.length}, minmax(0, 1fr))` }}>
      {modes.map((m) => (
        <button aria-pressed={mode === m.id} type="button"
          key={m.id}
          onClick={() => onMode(m.id)}
          className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
            mode === m.id
              ? "border-primary bg-primary text-primary-foreground"
              : "bg-card hover:bg-accent"
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

/* ================================================================== */
/* 17. CPC calculator                                                  */
/* ================================================================== */

export function CPCCalculator() {
  const [mode, setMode] = React.useState("calc");
  const [spend, setSpend] = React.useState("2,400");
  const [clicks, setClicks] = React.useState("860");
  const [target, setTarget] = React.useState("2.50");

  const s = num(spend);
  const c = num(clicks);
  const t = num(target);

  const cpc = c > 0 ? s / c : 0;
  const plannedClicks = t > 0 ? s / t : 0;

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <ModeToggle
            modes={[
              { id: "calc", label: "CPC from spend" },
              { id: "plan", label: "Clicks from budget" },
            ]}
            mode={mode}
            onMode={setMode}
          />
          <NumberField label="Total spend" value={spend} onChange={setSpend} prefix="$" />
          {mode === "calc" ? (
            <NumberField label="Clicks received" value={clicks} onChange={setClicks} />
          ) : (
            <NumberField label="Target CPC" value={target} onChange={setTarget} prefix="$" />
          )}
        </div>
      }
      results={
        mode === "calc" ? (
          <div className="space-y-4">
            <ResultHero
              label="Cost per click"
              value={fmtUSD(cpc, 2)}
              sub={`${fmtNum(c, 0)} clicks on ${fmtUSD(s)}`}
            />
            <MiniTable
              head={["Budget", "Clicks at this CPC"]}
              rows={[
                [fmtUSD(100), cpc > 0 ? fmtNum(100 / cpc, 0) : "—"],
                [fmtUSD(1_000), cpc > 0 ? fmtNum(1000 / cpc, 0) : "—"],
                [fmtUSD(10_000), cpc > 0 ? fmtNum(10000 / cpc, 0) : "—"],
              ]}
            />
            <Verdict tone="neutral">
              Search CPCs commonly range from about $1–$6; display is far cheaper but converts lower. Judge CPC against what a click is worth to you, not against averages.
            </Verdict>
          </div>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label="Expected clicks"
              value={fmtNum(plannedClicks, 0)}
              sub={`${fmtUSD(s)} budget at ${fmtUSD(t, 2)} CPC`}
            />
            <StatRow label="Cost per 100 clicks" value={fmtUSD(t * 100)} />
            <StatRow
              label="Clicks per $1,000"
              value={t > 0 ? fmtNum(1000 / t, 0) : "—"}
              emphasis
            />
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* 18. CPM calculator                                                  */
/* ================================================================== */

export function CPMCalculator() {
  const [mode, setMode] = React.useState("calc");
  const [spend, setSpend] = React.useState("5,000");
  const [impressions, setImpressions] = React.useState("1,250,000");
  const [target, setTarget] = React.useState("6");

  const s = num(spend);
  const i = num(impressions);
  const t = num(target);

  const cpm = i > 0 ? (s / i) * 1000 : 0;
  const plannedImpressions = t > 0 ? (s / t) * 1000 : 0;

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <ModeToggle
            modes={[
              { id: "calc", label: "CPM from spend" },
              { id: "plan", label: "Reach from budget" },
            ]}
            mode={mode}
            onMode={setMode}
          />
          <NumberField label="Total spend" value={spend} onChange={setSpend} prefix="$" />
          {mode === "calc" ? (
            <NumberField label="Impressions delivered" value={impressions} onChange={setImpressions} />
          ) : (
            <NumberField label="Target CPM" value={target} onChange={setTarget} prefix="$" />
          )}
        </div>
      }
      results={
        mode === "calc" ? (
          <div className="space-y-4">
            <ResultHero
              label="CPM (cost per 1,000 impressions)"
              value={fmtUSD(cpm, 2)}
              sub={`${fmtCompact(i)} impressions on ${fmtUSD(s)}`}
            />
            <StatRow label="Cost per single impression" value={fmtUSD(i > 0 ? s / i : 0, 4)} />
            <StatRow label="Impressions per $100" value={cpm > 0 ? fmtCompact((100 / cpm) * 1000) : "—"} emphasis />
            <Verdict tone="neutral">
              Social feeds typically trade between $5–$15 CPM and premium video can run $20+. A rising CPM with flat conversions means your creative is tiring.
            </Verdict>
          </div>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label="Expected impressions"
              value={fmtCompact(plannedImpressions)}
              sub={`${fmtUSD(s)} budget at ${fmtUSD(t, 2)} CPM`}
            />
            <StatRow label="At spend level" value={fmtUSD(s)} />
            <StatRow label="Cost per impression" value={fmtUSD(t / 1000, 4)} emphasis />
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* 19. CTR calculator                                                  */
/* ================================================================== */

export function CTRCalculator() {
  const [mode, setMode] = React.useState("calc");
  const [impressions, setImpressions] = React.useState("120,000");
  const [clicks, setClicks] = React.useState("3,900");
  const [target, setTarget] = React.useState("2");

  const i = num(impressions);
  const c = num(clicks);
  const t = num(target);

  const ctr = i > 0 ? (c / i) * 100 : 0;
  const plannedClicks = i * (t / 100);

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <ModeToggle
            modes={[
              { id: "calc", label: "CTR from results" },
              { id: "plan", label: "Clicks from CTR" },
            ]}
            mode={mode}
            onMode={setMode}
          />
          <NumberField label="Impressions" value={impressions} onChange={setImpressions} />
          {mode === "calc" ? (
            <NumberField label="Clicks" value={clicks} onChange={setClicks} />
          ) : (
            <NumberField label="Expected CTR" value={target} onChange={setTarget} suffix="%" />
          )}
        </div>
      }
      results={
        mode === "calc" ? (
          <div className="space-y-4">
            <ResultHero
              label="Click-through rate"
              value={fmtPct(ctr, 2)}
              sub={`${fmtNum(c, 0)} clicks from ${fmtCompact(i)} impressions`}
            />
            <StatRow label="Clicks per 10,000 impressions" value={fmtNum((ctr / 100) * 10000, 0)} />
            <StatRow label="Impressions per click" value={ctr > 0 ? fmtNum(100 / ctr, 1) : "—"} emphasis />
            <Verdict tone={ctr >= 1.5 ? "good" : "warn"}>
              {ctr >= 1.5
                ? `${fmtPct(ctr, 2)} is a respectable CTR — search ads often sit in the 3–6% range, display and feeds nearer 0.5–1.5%.`
                : `${fmtPct(ctr, 2)} is on the low side for search (3–6% is common) but normal for display (0.5–1.5%). Test headlines and audiences before touching bids.`}
            </Verdict>
          </div>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label="Expected clicks"
              value={fmtNum(plannedClicks, 0)}
              sub={`${fmtCompact(i)} impressions at ${fmtPct(t, 2)} CTR`}
            />
            <StatRow label="Impressions needed per click" value={t > 0 ? fmtNum(100 / t, 1) : "—"} />
            <StatRow label="At current impressions" value={fmtCompact(i)} emphasis />
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* 20. ROAS calculator                                                 */
/* ================================================================== */

export function ROASCalculator() {
  const [params, setParams] = useToolState({
    revenue: "45,000",
    spend: "9,000",
    margin: "55",
    target: "6",
  });
  const { revenue, spend, margin, target } = params;

  const rev = num(revenue);
  const s = num(spend);
  const m = num(margin) / 100;
  const t = num(target);

  const roas = s > 0 ? rev / s : 0;
  const profit = rev * m - s;
  const breakEven = m > 0 ? 1 / m : NaN;
  const neededRevenue = s * t;

  const status = roas >= breakEven ? (roas >= 4 ? "good" : "warn") : "bad";

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <FieldGrid>
          <NumberField
            label="Revenue from ads"
            value={revenue}
            onChange={(val) => setParams({ revenue: val })}
            prefix="$"
          />
          <NumberField
            label="Ad spend"
            value={spend}
            onChange={(val) => setParams({ spend: val })}
            prefix="$"
          />
          <NumberField
            label="Gross margin"
            value={margin}
            onChange={(val) => setParams({ margin: val })}
            suffix="%"
            hint="Used for the break-even line"
          />
          <NumberField
            label="Target ROAS"
            value={target}
            onChange={(val) => setParams({ target: val })}
            suffix="x"
          />
        </FieldGrid>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label="Return on ad spend"
            value={fmtX(roas)}
            sub={`${fmtUSD(rev)} revenue on ${fmtUSD(s)} spend`}
          />
          <div>
            <StatRow label="Gross profit after spend" value={fmtUSD(profit)} emphasis />
            <StatRow label="Break-even ROAS" value={fmtX(breakEven)} />
            <StatRow label="Revenue needed for target" value={fmtUSD(neededRevenue)} />
            <StatRow label="Spend headroom to target" value={roas > 0 && t > 0 ? fmtUSD(Math.max(0, rev / t - s)) : "—"} />
          </div>
          <Verdict tone={status as "good" | "warn" | "bad"}>
            {isFinite(breakEven) && roas >= breakEven
              ? `At a ${num(margin)}% margin you break even at ${breakEven.toFixed(2)}x — you are ${fmtX(roas - breakEven, 2)} above the line.`
              : `At a ${num(margin)}% margin you need ${fmtX(breakEven)} to break even — current ROAS loses money on every sale.`}
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 27. Ad budget calculator                                            */
/* ================================================================== */

export function AdBudgetCalculator() {
  const [mode, setMode] = React.useState("forecast");
  const [budget, setBudget] = React.useState("10,000");
  const [cpc, setCpc] = React.useState("2.00");
  const [cvr, setCvr] = React.useState("2.5");
  const [aov, setAov] = React.useState("120");
  const [goal, setGoal] = React.useState("45,000");

  const b = num(budget);
  const c = num(cpc);
  const v = num(cvr) / 100;
  const a = num(aov);
  const g = num(goal);

  // Revenue produced per $1 of spend through the CPC → CVR → AOV chain
  const roasPerDollar = c > 0 ? (1 / c) * v * a : 0;
  const clicks = c > 0 ? b / c : 0;
  const conversions = clicks * v;
  const cpa = conversions > 0 ? b / conversions : 0;
  const revenue = b * roasPerDollar;
  const requiredBudget = roasPerDollar > 0 ? g / roasPerDollar : Infinity;

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <ModeToggle
            modes={[
              { id: "forecast", label: "Results from budget" },
              { id: "goal", label: "Budget from goal" },
            ]}
            mode={mode}
            onMode={setMode}
          />
          <FieldGrid>
            <NumberField label="Avg cost per click" value={cpc} onChange={setCpc} prefix="$" />
            <NumberField label="Conversion rate" value={cvr} onChange={setCvr} suffix="%" />
            <NumberField label="Avg order value" value={aov} onChange={setAov} prefix="$" />
            {mode === "forecast" ? (
              <NumberField label="Monthly budget" value={budget} onChange={setBudget} prefix="$" />
            ) : (
              <NumberField label="Revenue goal" value={goal} onChange={setGoal} prefix="$" />
            )}
          </FieldGrid>
        </div>
      }
      results={
        mode === "forecast" ? (
          <div className="space-y-4">
            <ResultHero
              label="Projected revenue"
              value={fmtUSD(revenue)}
              sub={`${fmtUSD(b)} budget at a ${fmtX(roasPerDollar)} return per dollar`}
            />
            <MiniTable
              head={["Clicks", "Orders", "CPA", "ROAS"]}
              rows={[
                [
                  fmtNum(clicks, 0),
                  fmtNum(conversions, 0),
                  fmtUSD(cpa, 2),
                  fmtX(roasPerDollar),
                ],
              ]}
            />
            <StatRow label="Revenue per $100 spent" value={fmtUSD(roasPerDollar * 100, 2)} emphasis />
            <StatRow label="Break-even ROAS at 50% margin" value={fmtX(2)} />
            <Verdict tone={roasPerDollar >= 2 ? "good" : roasPerDollar >= 1.5 ? "warn" : "bad"}>
              {roasPerDollar >= 2
                ? `${fmtX(roasPerDollar)} per dollar clears a 50%-margin break-even with room — this funnel can scale.`
                : roasPerDollar >= 1.5
                  ? `${fmtX(roasPerDollar)} per dollar is workable but thin: profitable above ~40% margins, underwater below.`
                  : `${fmtX(roasPerDollar)} per dollar only breaks even above ~67% margins. Fix CPC, CVR or AOV before spending.`}
            </Verdict>
          </div>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label="Budget required"
              value={fmtUSD(requiredBudget)}
              sub={`To reach ${fmtUSD(g)} at ${fmtX(roasPerDollar)} per dollar`}
            />
            <MiniTable
              head={["Metric", "At this budget"]}
              rows={[
                ["Clicks", fmtNum(requiredBudget / (c || 1), 0)],
                ["Orders", fmtNum((requiredBudget / (c || 1)) * v, 0)],
                ["Effective CPA", fmtUSD(c > 0 ? c / v : 0, 2)],
              ]}
            />
            <StatRow label="Ad spend share of goal" value={fmtPct(g > 0 ? (requiredBudget / g) * 100 : 0, 1)} emphasis />
            <Verdict tone="neutral">
              This chain is only as good as its weakest number. Pull CPC from recent campaigns, CVR from the actual landing page, and AOV from the last 90 days — not from the media kit.
            </Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* 28. Impression estimator                                            */
/* ================================================================== */

export function ImpressionEstimator() {
  const [mode, setMode] = React.useState("impressions");
  const [budget, setBudget] = React.useState("6,000");
  const [cpm, setCpm] = React.useState("7.50");
  const [freq, setFreq] = React.useState("2.4");
  const [reachGoal, setReachGoal] = React.useState("500,000");

  const b = num(budget);
  const cp = num(cpm);
  const f = Math.max(1, num(freq));
  const rg = num(reachGoal);

  const impressions = cp > 0 ? (b / cp) * 1000 : 0;
  const reach = impressions / f;
  const goalImpressions = rg * f;
  const goalBudget = cp > 0 ? (goalImpressions / 1000) * cp : Infinity;

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <ModeToggle
            modes={[
              { id: "impressions", label: "Impressions from budget" },
              { id: "budget", label: "Budget from reach goal" },
            ]}
            mode={mode}
            onMode={setMode}
          />
          <NumberField label="Average CPM" value={cpm} onChange={setCpm} prefix="$" />
          <NumberField label="Target frequency" value={freq} onChange={setFreq} suffix="x" hint="Average views per person (1 = everyone sees it once)" />
          {mode === "impressions" ? (
            <NumberField label="Budget" value={budget} onChange={setBudget} prefix="$" />
          ) : (
            <NumberField label="Unique people to reach" value={reachGoal} onChange={setReachGoal} />
          )}
        </div>
      }
      results={
        mode === "impressions" ? (
          <div className="space-y-4">
            <ResultHero
              label="Estimated impressions"
              value={fmtCompact(impressions)}
              sub={`${fmtUSD(b)} at a ${fmtUSD(cp, 2)} CPM`}
            />
            <div>
              <StatRow label="Unique people reached" value={fmtCompact(reach)} emphasis />
              <StatRow label="Cost per person reached" value={reach > 0 ? fmtUSD(b / reach, 3) : "—"} />
              <StatRow label="Impressions per $100" value={cp > 0 ? fmtCompact((100 / cp) * 1000) : "—"} />
            </div>
            <Verdict tone="neutral">
              Awareness buys are priced in CPM and judged in reach at a sensible frequency — 2–4 views per person is the usual band. Same budget, lower frequency: more people, fewer repeats.
            </Verdict>
          </div>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label="Budget required"
              value={fmtUSD(goalBudget)}
              sub={`To reach ${fmtCompact(rg)} people ${num(freq)}x each`}
            />
            <div>
              <StatRow label="Total impressions needed" value={fmtCompact(goalImpressions)} emphasis />
              <StatRow label="Cost per person reached" value={rg > 0 ? fmtUSD(goalBudget / rg, 3) : "—"} />
              <StatRow label="At CPM" value={fmtUSD(cp, 2)} />
            </div>
            <Verdict tone="neutral">
              Frequency is the dial that moves budget fastest: reaching the same people 3.6x instead of 2.4x costs 50% more. Decide how often the message must land before you set the number.
            </Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* 29. Reach & frequency calculator                                    */
/* ================================================================== */

export function ReachFrequencyCalculator() {
  const [audience, setAudience] = React.useState("2,000,000");
  const [impressions, setImpressions] = React.useState("1,500,000");
  const [freq, setFreq] = React.useState("1.5");

  const aud = num(audience);
  const imp = num(impressions);
  const f = Math.max(0.1, num(freq));

  const reach = imp / f;
  const coverage = aud > 0 ? (reach / aud) * 100 : 0;
  const grps = coverage * f;
  const effectiveReach = reach / (1 + 0.12 * Math.max(0, f - 3)); // decay beyond 3+ exposures

  const table = [1.2, 1.5, 2.0, 3.0].map((fr) => {
    const r = imp / fr;
    return [fmtX(fr, 1), fmtCompact(r), fmtPct(aud > 0 ? (r / aud) * 100 : 0, 1)];
  });

  return (
    <CalcLayout
      inputs={
        <FieldGrid>
          <NumberField label="Audience size" value={audience} onChange={setAudience} hint="Addressable people the campaign can deliver to" />
          <NumberField label="Impressions bought" value={impressions} onChange={setImpressions} />
          <NumberField label="Average frequency" value={freq} onChange={setFreq} suffix="x" hint="Views per person reached" />
        </FieldGrid>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label="Unique reach"
            value={fmtCompact(reach)}
            sub={`${fmtPct(coverage, 1)} of the audience at ${fmtX(f, 1)} average frequency`}
          />
          <div>
            <StatRow label="Audience coverage" value={fmtPct(coverage, 1)} emphasis />
            <StatRow label="GRPs (reach % × frequency)" value={fmtNum(grps, 0)} />
            <StatRow label="Effective reach (3+ fatigue decay)" value={fmtCompact(Math.min(reach, effectiveReach))} />
          </div>
          <MiniTable head={["Frequency", "Unique reach", "Coverage"]} rows={table} />
          <Verdict tone={coverage >= 60 ? "good" : coverage >= 30 ? "warn" : "neutral"}>
            {coverage >= 60
              ? `${fmtPct(coverage, 1)} coverage at ${fmtX(f, 1)} frequency is a strong awareness buy — most of the audience has seen the message.`
              : coverage >= 30
                ? `${fmtPct(coverage, 1)} coverage means the campaign is skimming the audience. More impressions — or a smaller audience — deepens it.`
                : `You are trading breadth for repetition. Frequency of ${fmtX(f, 1)} on ${fmtPct(coverage, 1)} of the audience suits retargeting, not launch awareness.`}
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 30. Media planning calculator                                       */
/* ================================================================== */

interface PlanChannel {
  name: string;
  share: string;
  cpm: string;
  ctr: string;
}

export function MediaPlanningCalculator() {
  const [total, setTotal] = React.useState("20,000");
  const [channels, setChannels] = React.useState<PlanChannel[]>([
    { name: "Search", share: "50", cpm: "90", ctr: "4.5" },
    { name: "Social", share: "30", cpm: "9", ctr: "1.1" },
    { name: "Display", share: "20", cpm: "4", ctr: "0.6" },
  ]);

  const T = num(total);

  const setChannel = (i: number, patch: Partial<PlanChannel>) =>
    setChannels((cs) => cs.map((c, ci) => (ci === i ? { ...c, ...patch } : c)));

  const rows = channels.map((ch) => {
    const budget = (num(ch.share) / 100) * T;
    const impressions = num(ch.cpm) > 0 ? (budget / num(ch.cpm)) * 1000 : 0;
    const clicks = impressions * (num(ch.ctr) / 100);
    const cpc = clicks > 0 ? budget / clicks : 0;
    return { ...ch, budget, impressions, clicks, cpc };
  });

  const sumImpressions = rows.reduce((a, r) => a + r.impressions, 0);
  const sumClicks = rows.reduce((a, r) => a + r.clicks, 0);
  const shareSum = channels.reduce((a, c) => a + num(c.share), 0);
  const blendedCpm = sumImpressions > 0 ? (T / sumImpressions) * 1000 : 0;
  const blendedCtr = sumImpressions > 0 ? (sumClicks / sumImpressions) * 100 : 0;
  const effCpc = sumClicks > 0 ? T / sumClicks : 0;

  return (
    <CalcLayout
      inputs={
        <div className="space-y-5">
          <NumberField label="Total monthly budget" value={total} onChange={setTotal} prefix="$" />
          <div>
            <SectionLabel>Channel mix</SectionLabel>
            <div className="mt-3 space-y-4">
              {channels.map((ch, i) => (
                <div key={ch.name} className="rounded-lg border bg-card p-3">
                  <p className="mb-2.5 text-sm font-semibold">{ch.name}</p>
                  <FieldGrid cols={3}>
                    <NumberField label="Share" value={ch.share} onChange={(v) => setChannel(i, { share: v })} suffix="%" />
                    <NumberField label="CPM" value={ch.cpm} onChange={(v) => setChannel(i, { cpm: v })} prefix="$" />
                    <NumberField label="CTR" value={ch.ctr} onChange={(v) => setChannel(i, { ctr: v })} suffix="%" />
                  </FieldGrid>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label="Blended CPM"
            value={fmtUSD(blendedCpm, 2)}
            sub={`${fmtCompact(sumImpressions)} impressions and ${fmtNum(sumClicks, 0)} clicks from ${fmtUSD(T)}`}
          />
          <MiniTable
            head={["Channel", "Budget", "Impr.", "Clicks", "CPC"]}
            rows={rows.map((r) => [
              r.name,
              fmtUSD(r.budget),
              fmtCompact(r.impressions),
              fmtNum(r.clicks, 0),
              fmtUSD(r.cpc, 2),
            ])}
          />
          <div>
            <StatRow label="Blended CTR" value={fmtPct(blendedCtr, 2)} emphasis />
            <StatRow label="Effective CPC across plan" value={fmtUSD(effCpc, 2)} />
            <StatRow
              label="Share check"
              value={shareSum === 100 ? "allocations sum to 100%" : `allocations sum to ${fmtNum(shareSum, 0)}%`}
            />
          </div>
          <Verdict tone={shareSum === 100 ? "neutral" : "warn"}>
            {shareSum === 100
              ? "Shift share between channels and watch blended CPC move — that single number is what the plan is really buying."
              : `Channel shares currently add up to ${fmtNum(shareSum, 0)}%, so the plan is scaled on that total. Set them to 100% for a clean read.`}
          </Verdict>
        </div>
      }
    />
  );
}
