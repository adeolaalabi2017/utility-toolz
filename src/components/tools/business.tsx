"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  CalcLayout,
  CopyButton,
  FieldGrid,
  MiniTable,
  NumberField,
  ResultHero,
  SelectField,
  ShareBar,
  StatRow,
  Verdict,
  downloadText,
} from "./ui";
import { fmtNum, fmtPct, fmtUSD, fmtX, num } from "@/lib/format";

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
        <button
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
/* 21. Profit margin calculator                                        */
/* ================================================================== */

export function ProfitMarginCalculator() {
  const [revenue, setRevenue] = React.useState("45,000");
  const [cost, setCost] = React.useState("27,000");

  const rev = num(revenue);
  const c = num(cost);

  const profit = rev - c;
  const margin = rev > 0 ? (profit / rev) * 100 : 0;
  const markup = c > 0 ? (profit / c) * 100 : 0;

  return (
    <CalcLayout
      inputs={
        <FieldGrid>
          <NumberField label="Revenue (sales)" value={revenue} onChange={setRevenue} prefix="$" />
          <NumberField label="Cost of goods sold" value={cost} onChange={setCost} prefix="$" hint="Direct costs of what you sold" />
        </FieldGrid>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label="Gross profit margin"
            value={fmtPct(margin, 1)}
            sub={`${fmtUSD(profit)} profit on ${fmtUSD(rev)} of sales`}
          />
          <div>
            <StatRow label="Gross profit" value={fmtUSD(profit)} emphasis />
            <StatRow label="Cost as % of revenue" value={fmtPct(rev > 0 ? (c / rev) * 100 : 0, 1)} />
            <StatRow label="Markup on cost" value={fmtX(markup / 100)} />
          </div>
          <ShareBar
            label="Where every $100 of sales goes"
            actual={rev > 0 ? (c / rev) * 100 : 0}
            target={30}
            actualLabel={`${fmtPct(rev > 0 ? (c / rev) * 100 : 0, 0)} cost`}
            targetLabel="30%"
          />
          <Verdict tone={margin >= 40 ? "good" : margin >= 20 ? "warn" : "bad"}>
            {margin >= 40
              ? `${fmtPct(margin, 1)} is a healthy gross margin — most product businesses live between 25% and 50%, software often 70%+.`
              : margin >= 20
                ? `${fmtPct(margin, 1)} sits in the normal band for product businesses (25–50% is typical) but leaves little room for ads and overhead. Watch it closely.`
                : `${fmtPct(margin, 1)} is dangerously thin. Below ~20% gross margin, marketing spend and overhead will consume the entire profit.`}
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 22. Markup calculator                                               */
/* ================================================================== */

export function MarkupCalculator() {
  const [mode, setMode] = React.useState("price");
  const [cost, setCost] = React.useState("60");
  const [markup, setMarkup] = React.useState("75");
  const [price, setPrice] = React.useState("105");

  const c = num(cost);
  const m = num(markup) / 100;
  const p = num(price);

  const priced = c * (1 + m);
  const backMarkup = c > 0 ? ((p - c) / c) * 100 : 0;
  const marginAtPrice = p > 0 ? ((p - c) / p) * 100 : 0;
  const marginOfMarkup = m > 0 ? (m / (1 + m)) * 100 : 0;

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <ModeToggle
            modes={[
              { id: "price", label: "Price from markup" },
              { id: "markup", label: "Markup from price" },
            ]}
            mode={mode}
            onMode={setMode}
          />
          <NumberField label="Unit cost" value={cost} onChange={setCost} prefix="$" />
          {mode === "price" ? (
            <NumberField label="Markup on cost" value={markup} onChange={setMarkup} suffix="%" />
          ) : (
            <NumberField label="Selling price" value={price} onChange={setPrice} prefix="$" />
          )}
        </div>
      }
      results={
        mode === "price" ? (
          <div className="space-y-4">
            <ResultHero
              label="Selling price"
              value={fmtUSD(priced, 2)}
              sub={`${fmtUSD(c)} cost marked up ${num(markup)}%`}
            />
            <div>
              <StatRow label="Profit per unit" value={fmtUSD(priced - c, 2)} emphasis />
              <StatRow label="Equivalent margin" value={fmtPct(marginOfMarkup, 1)} />
              <StatRow label="Cost share of price" value={fmtPct(c > 0 && priced > 0 ? (c / priced) * 100 : 0, 1)} />
            </div>
            <Verdict tone="neutral">
              A {num(markup)}% markup is only a {fmtPct(marginOfMarkup, 1)} margin — the same profit described against a bigger base. Quote margins internally to avoid the classic pricing mix-up.
            </Verdict>
          </div>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label="Markup on cost"
              value={fmtPct(backMarkup, 1)}
              sub={`${fmtUSD(p)} price over ${fmtUSD(c)} cost`}
            />
            <div>
              <StatRow label="Profit per unit" value={fmtUSD(p - c, 2)} emphasis />
              <StatRow label="Equivalent margin" value={fmtPct(marginAtPrice, 1)} />
              <StatRow label="Price multiplier" value={fmtX(c > 0 ? p / c : 0)} />
            </div>
            <Verdict tone="neutral">
              To hit a target margin instead, divide cost by (1 − margin): a $60 cost at a 50% margin prices at $120 — not $90, which is only a 33% margin.
            </Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* 23. Break-even calculator                                           */
/* ================================================================== */

export function BreakEvenCalculator() {
  const [fixed, setFixed] = React.useState("12,000");
  const [price, setPrice] = React.useState("45");
  const [variable, setVariable] = React.useState("27");
  const [current, setCurrent] = React.useState("800");

  const f = num(fixed);
  const p = num(price);
  const v = num(variable);
  const units = num(current);

  const cm = p - v;
  const cmPct = p > 0 ? (cm / p) * 100 : 0;
  const beUnits = cm > 0 ? f / cm : Infinity;
  const beRevenue = cm > 0 ? beUnits * p : Infinity;
  const safety = isFinite(beUnits) && units > 0 ? ((units - beUnits) / units) * 100 : NaN;

  return (
    <CalcLayout
      inputs={
        <FieldGrid>
          <NumberField label="Fixed costs / month" value={fixed} onChange={setFixed} prefix="$" hint="Rent, salaries, software — costs that don't move with volume" />
          <NumberField label="Price per unit" value={price} onChange={setPrice} prefix="$" />
          <NumberField label="Variable cost per unit" value={variable} onChange={setVariable} prefix="$" hint="Materials, shipping, payment fees" />
          <NumberField label="Units sold / month" value={current} onChange={setCurrent} hint="For the safety margin" />
        </FieldGrid>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label="Break-even point"
            value={`${fmtNum(beUnits, 0)} units`}
            sub={`${fmtUSD(beRevenue)} of monthly revenue to cover ${fmtUSD(f)} of fixed costs`}
          />
          <div>
            <StatRow label="Contribution margin per unit" value={fmtUSD(cm, 2)} emphasis />
            <StatRow label="Contribution margin rate" value={fmtPct(cmPct, 1)} />
            <StatRow label="Break-even revenue" value={fmtUSD(beRevenue)} />
            <StatRow
              label="Margin of safety"
              value={isFinite(safety) ? fmtPct(safety, 1) : "—"}
            />
          </div>
          <Verdict tone={!isFinite(safety) ? "neutral" : safety >= 25 ? "good" : safety >= 10 ? "warn" : "bad"}>
            {!isFinite(safety)
              ? "Add current monthly sales to see your margin of safety."
              : safety >= 25
                ? `Sales can fall ${fmtPct(safety, 1)} before you lose money — a comfortable cushion.`
                : safety >= 10
                  ? `Only ${fmtPct(safety, 1)} of cushion. One slow month puts you under water; cut variable cost or lift price before scaling spend.`
                  : `You are within ${fmtPct(safety, 1)} of break-even. This is survival mode — fixed costs must fall or contribution must rise now.`}
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 24. Pricing calculator                                              */
/* ================================================================== */

export function PricingCalculator() {
  const [mode, setMode] = React.useState("margin");
  const [cost, setCost] = React.useState("60");
  const [margin, setMargin] = React.useState("55");
  const [market, setMarket] = React.useState("110");

  const c = num(cost);
  const m = num(margin) / 100;
  const p = num(market);

  const priced = m < 1 ? c / (1 - m) : Infinity;
  const marketMargin = p > 0 ? ((p - c) / p) * 100 : 0;
  const markupNeeded = m > 0 && m < 1 ? (m / (1 - m)) * 100 : Infinity;

  const ladder = [40, 50, 60].map((mg) => ({
    mg,
    price: c / (1 - mg / 100),
  }));

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <ModeToggle
            modes={[
              { id: "margin", label: "Price from margin" },
              { id: "check", label: "Margin at market price" },
            ]}
            mode={mode}
            onMode={setMode}
          />
          <NumberField label="Unit cost" value={cost} onChange={setCost} prefix="$" />
          {mode === "margin" ? (
            <NumberField label="Target gross margin" value={margin} onChange={setMargin} suffix="%" />
          ) : (
            <NumberField label="Market / competitor price" value={market} onChange={setMarket} prefix="$" />
          )}
        </div>
      }
      results={
        mode === "margin" ? (
          <div className="space-y-4">
            <ResultHero
              label="Price for a target margin"
              value={fmtUSD(priced, 2)}
              sub={`${fmtUSD(c)} cost at a ${num(margin)}% margin`}
            />
            <div>
              <StatRow label="Profit per unit" value={fmtUSD(priced - c, 2)} emphasis />
              <StatRow label="Markup this requires" value={fmtPct(markupNeeded, 0)} />
              <StatRow label="Break-even price" value={fmtUSD(c, 2)} />
            </div>
            <MiniTable
              head={["Target margin", "Required price"]}
              rows={ladder.map((l) => [`${l.mg}%`, fmtUSD(l.price, 2)])}
            />
            <Verdict tone="neutral">
              Cost-plus is a floor, not a strategy: start from the margin you need, then check what the market will actually pay — and what a stronger position would justify.
            </Verdict>
          </div>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label="Margin at market price"
              value={fmtPct(marketMargin, 1)}
              sub={`${fmtUSD(p)} price over ${fmtUSD(c)} cost`}
            />
            <div>
              <StatRow label="Profit per unit" value={fmtUSD(p - c, 2)} emphasis />
              <StatRow label="Markup on cost" value={fmtPct(c > 0 ? ((p - c) / c) * 100 : 0, 1)} />
              <StatRow
                label="Price gap to target margin"
                value={isFinite(priced) ? fmtUSD(priced - p, 2) : "—"}
              />
            </div>
            <Verdict tone={marketMargin >= num(margin) ? "good" : marketMargin >= num(margin) - 10 ? "warn" : "bad"}>
              {marketMargin >= num(margin)
                ? `The market price beats your ${num(margin)}% target by ${fmtPct(marketMargin - num(margin), 1)} points.`
                : marketMargin >= num(margin) - 10
                  ? `The market price lands within 10 points of your ${num(margin)}% target — closable with volume terms or a cheaper COGS.`
                  : `At this market price your margin misses the ${num(margin)}% target badly. Competing here means competing on cost.`}
            </Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* 25. Discount calculator                                             */
/* ================================================================== */

export function DiscountCalculator() {
  const [list, setList] = React.useState("249");
  const [discount, setDiscount] = React.useState("20");
  const [cost, setCost] = React.useState("140");

  const l = num(list);
  const d = num(discount) / 100;
  const c = num(cost);

  const final = l * (1 - d);
  const saved = l - final;
  const marginBefore = l > 0 ? ((l - c) / l) * 100 : 0;
  const marginAfter = final > 0 ? ((final - c) / final) * 100 : 0;
  const profitBefore = l - c;
  const profitAfter = final - c;
  const volumeNeeded = profitAfter > 0 ? profitBefore / profitAfter : Infinity;

  return (
    <CalcLayout
      inputs={
        <FieldGrid>
          <NumberField label="List price" value={list} onChange={setList} prefix="$" />
          <NumberField label="Discount" value={discount} onChange={setDiscount} suffix="%" />
          <NumberField label="Unit cost" value={cost} onChange={setCost} prefix="$" hint="Optional — powers the margin impact" />
        </FieldGrid>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label="Final price"
            value={fmtUSD(final, 2)}
            sub={`${fmtUSD(saved)} off the ${fmtUSD(l)} list price`}
          />
          <div>
            <StatRow label="Margin before discount" value={fmtPct(marginBefore, 1)} />
            <StatRow label="Margin after discount" value={fmtPct(marginAfter, 1)} emphasis />
            <StatRow
              label="Extra volume to earn the same profit"
              value={isFinite(volumeNeeded) ? fmtX(volumeNeeded) : "—"}
            />
          </div>
          <Verdict tone={marginAfter >= 30 ? "good" : marginAfter >= 15 ? "warn" : "bad"}>
            {marginAfter >= 30
              ? `A ${num(discount)}% discount still leaves a ${fmtPct(marginAfter, 1)} margin — affordable as a nudge.`
              : marginAfter >= 15
                ? `The discount cuts your margin from ${fmtPct(marginBefore, 1)} to ${fmtPct(marginAfter, 1)}. You now need ${fmtX(volumeNeeded)}× the volume just to earn the same profit.`
                : `At a ${fmtPct(marginAfter, 1)} margin this discount nearly works for free. You need ${isFinite(volumeNeeded) ? fmtX(volumeNeeded) : "many"}× the volume to match the profit of selling undiscounted.`}
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 26. Sales commission calculator                                     */
/* ================================================================== */

export function SalesCommissionCalculator() {
  const [mode, setMode] = React.useState("base");
  const [revenue, setRevenue] = React.useState("85,000");
  const [rate, setRate] = React.useState("6");
  const [base, setBase] = React.useState("2,800");

  const r = num(revenue);
  const rateN = num(rate) / 100;
  const b = num(base);

  const commission = r * rateN;
  const total = mode === "base" ? commission + b : commission;
  const effective = r > 0 ? (total / r) * 100 : 0;

  const ladder = [60_000, 85_000, 110_000].map((rev) => ({
    rev,
    commission: rev * rateN,
    total: mode === "base" ? rev * rateN + b : rev * rateN,
  }));

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <ModeToggle
            modes={[
              { id: "straight", label: "Straight %" },
              { id: "base", label: "Base + %" },
            ]}
            mode={mode}
            onMode={setMode}
          />
          <NumberField label="Sales revenue" value={revenue} onChange={setRevenue} prefix="$" hint="Monthly unless your plan says otherwise" />
          <NumberField label="Commission rate" value={rate} onChange={setRate} suffix="%" />
          {mode === "base" && (
            <NumberField label="Base salary" value={base} onChange={setBase} prefix="$" />
          )}
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label="Total pay"
            value={fmtUSD(total)}
            sub={
              mode === "base"
                ? `${fmtUSD(b)} base + ${fmtUSD(commission)} commission`
                : `${fmtPct(num(rate), 1)} of ${fmtUSD(r)} in sales`
            }
          />
          <div>
            <StatRow label="Commission earned" value={fmtUSD(commission)} emphasis />
            <StatRow label="Effective rate on revenue" value={fmtPct(effective, 2)} />
            <StatRow label="Sales needed for $10K month" value={mode === "base" ? fmtUSD(Math.max(0, (10_000 - b) / rateN)) : fmtUSD(10_000 / rateN)} />
          </div>
          <MiniTable
            head={["Sales", "Commission", "Total pay"]}
            rows={ladder.map((l) => [
              fmtUSD(l.rev),
              fmtUSD(l.commission),
              fmtUSD(l.total),
            ])}
          />
          <Verdict tone="neutral">
            Keep the effective rate visible: base salaries quietly push it above the headline %, which is exactly what territory planning and quota debates turn on.
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 31. Shipping cost calculator                                        */
/* ================================================================== */

const ZONE_RATES: { zone: string; base: number; perLb: number }[] = [
  { zone: "Zone 2 — local (0–150 mi)", base: 6.4, perLb: 0.55 },
  { zone: "Zone 3 — regional (151–300 mi)", base: 7.8, perLb: 0.72 },
  { zone: "Zone 4 — (301–600 mi)", base: 9.6, perLb: 0.9 },
  { zone: "Zone 5 — (601–1000 mi)", base: 11.9, perLb: 1.1 },
  { zone: "Zone 6 — coast to coast (1001–1400 mi)", base: 14.2, perLb: 1.3 },
  { zone: "Zone 8 — farthest (1401+ mi)", base: 17.5, perLb: 1.55 },
];

const SERVICE_FACTORS: { service: string; factor: number; days: string }[] = [
  { service: "Ground", factor: 1, days: "3–5 business days" },
  { service: "Express (2-day)", factor: 1.75, days: "2 business days" },
  { service: "Overnight", factor: 3.1, days: "next business day" },
];

export function ShippingCostCalculator() {
  const [weight, setWeight] = React.useState("4");
  const [length, setLength] = React.useState("14");
  const [width, setWidth] = React.useState("10");
  const [height, setHeight] = React.useState("6");
  const [zoneIdx, setZoneIdx] = React.useState("2");
  const [serviceIdx, setServiceIdx] = React.useState("0");
  const [packaging, setPackaging] = React.useState("1.5");

  const w = num(weight);
  const dims = num(length) * num(width) * num(height);
  const dimWeight = dims / 139;
  const billable = Math.max(w, dimWeight);
  const zone = ZONE_RATES[Number(zoneIdx)] ?? ZONE_RATES[0];
  const service = SERVICE_FACTORS[Number(serviceIdx)] ?? SERVICE_FACTORS[0];
  const freight = (zone.base + billable * zone.perLb) * service.factor;
  const total = freight + num(packaging);
  const perLbEffective = w > 0 ? total / w : 0;

  const ladder = SERVICE_FACTORS.map((s) => ({
    service: s.service,
    freight: (zone.base + billable * zone.perLb) * s.factor,
    total: (zone.base + billable * zone.perLb) * s.factor + num(packaging),
    days: s.days,
  }));

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <FieldGrid cols={3}>
            <NumberField label="Actual weight" value={weight} onChange={setWeight} suffix="lb" />
            <NumberField label="Length" value={length} onChange={setLength} suffix="in" />
            <NumberField label="Width" value={width} onChange={setWidth} suffix="in" />
            <NumberField label="Height" value={height} onChange={setHeight} suffix="in" />
            <NumberField label="Packaging / handling" value={packaging} onChange={setPackaging} prefix="$" />
            <SelectField
              label="Destination zone"
              value={zoneIdx}
              onChange={setZoneIdx}
              options={ZONE_RATES.map((z, i) => ({ value: String(i), label: z.zone }))}
            />
          </FieldGrid>
          <SelectField
            label="Service level"
            value={serviceIdx}
            onChange={setServiceIdx}
            options={SERVICE_FACTORS.map((s, i) => ({ value: String(i), label: `${s.service} — ${s.days}` }))}
          />
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label={`Estimated ${service.service.toLowerCase()} cost`}
            value={fmtUSD(total, 2)}
            sub={`${fmtUSD(freight, 2)} freight + ${fmtUSD(num(packaging), 2)} packaging`}
          />
          <div>
            <StatRow label="Billable weight" value={`${fmtNum(billable, 1)} lb`} emphasis />
            <StatRow label="Dimensional weight" value={`${fmtNum(dimWeight, 1)} lb (L×W×H ÷ 139)`} />
            <StatRow label="Effective cost per lb" value={fmtUSD(perLbEffective, 2)} />
          </div>
          <MiniTable
            head={["Service", "Freight", "All-in", "Transit"]}
            rows={ladder.map((l) => [l.service, fmtUSD(l.freight, 2), fmtUSD(l.total, 2), l.days])}
          />
          <Verdict tone={dimWeight > w * 1.3 ? "warn" : "neutral"}>
            {dimWeight > w * 1.3
              ? `This box bills at its dimensional weight (${fmtNum(dimWeight, 1)} lb vs ${fmtNum(w, 1)} lb actual). A smaller box is free money — dim weight is pure waste.`
              : "Actual weight governs this shipment — the box is efficient for its size. Check dim weight again before changing packaging."}
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 32. Invoice generator                                               */
/* ================================================================== */

type LineItem = { desc: string; qty: string; rate: string };

export function InvoiceGenerator() {
  const [sellerName, setSellerName] = React.useState("Brightlist Studio LLC");
  const [sellerEmail, setSellerEmail] = React.useState("billing@brightlist.example");
  const [clientName, setClientName] = React.useState("Northwind Trading Co.");
  const [clientEmail, setClientEmail] = React.useState("accounts@northwind.example");
  const [invoiceNo, setInvoiceNo] = React.useState("INV-2026-014");
  const [date, setDate] = React.useState(() => new Date().toISOString().slice(0, 10));
  const [dueDays, setDueDays] = React.useState("14");
  const [taxRate, setTaxRate] = React.useState("8.5");
  const [notes, setNotes] = React.useState("Payment by bank transfer. Late payments accrue 1.5% monthly interest.");
  const [items, setItems] = React.useState<LineItem[]>([
    { desc: "Landing page design", qty: "1", rate: "1800" },
    { desc: "Copywriting — 6 sections", qty: "6", rate: "180" },
    { desc: "Analytics setup", qty: "2", rate: "240" },
  ]);

  const updateItem = (i: number, patch: Partial<LineItem>) =>
    setItems((list) => list.map((it, ii) => (ii === i ? { ...it, ...patch } : it)));

  const subtotal = items.reduce((a, it) => a + num(it.qty) * num(it.rate), 0);
  const tax = subtotal * (num(taxRate) / 100);
  const total = subtotal + tax;
  const due = new Date(date);
  due.setDate(due.getDate() + Math.round(num(dueDays)));
  const dueStr = due.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const invoiceHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${invoiceNo}</title>
<style>body{font-family:Arial,Helvetica,sans-serif;max-width:720px;margin:40px auto;padding:0 24px;color:#111}
h1{font-size:22px;margin:0}.muted{color:#555;font-size:13px}table{width:100%;border-collapse:collapse;margin-top:18px}
th{text-align:left;border-bottom:2px solid #111;padding:8px 6px;font-size:13px}td{border-bottom:1px solid #ddd;padding:8px 6px;font-size:14px}
.r{text-align:right}.totals td{border:0;padding:4px 6px}.totals .grand{font-weight:bold;font-size:16px;border-top:2px solid #111}
.meta{display:flex;justify-content:space-between;margin-top:24px;font-size:14px}.badge{background:#1f4a3f;color:#fff;padding:2px 10px;border-radius:999px;font-size:11px}</style></head><body>
<h1>${sellerName}</h1><p class="muted">${sellerEmail}</p>
<p><span class="badge">INVOICE ${invoiceNo}</span></p>
<div class="meta"><div><strong>Billed to</strong><br>${clientName}<br><span class="muted">${clientEmail}</span></div>
<div><strong>Details</strong><br>Issued ${date}<br>Due ${dueStr}</div></div>
<table><thead><tr><th>Description</th><th class="r">Qty</th><th class="r">Rate</th><th class="r">Amount</th></tr></thead><tbody>
${items
    .map(
      (it) =>
        `<tr><td>${it.desc || "—"}</td><td class="r">${it.qty}</td><td class="r">$${num(it.rate).toFixed(2)}</td><td class="r">$${(num(it.qty) * num(it.rate)).toFixed(2)}</td></tr>`
    )
    .join("\n")}
</tbody></table>
<table class="totals"><tr><td></td><td class="r" style="width:180px">Subtotal</td><td class="r" style="width:110px">$${subtotal.toFixed(2)}</td></tr>
<tr><td></td><td class="r">Tax (${num(taxRate)}%)</td><td class="r">$${tax.toFixed(2)}</td></tr>
<tr class="grand"><td></td><td class="r">Total due</td><td class="r">$${total.toFixed(2)}</td></tr></table>
<p class="muted" style="margin-top:28px">${notes}</p></body></html>`;

  const printInvoice = () => {
    try {
      const frame = document.createElement("iframe");
      frame.style.position = "fixed";
      frame.style.right = "0";
      frame.style.bottom = "0";
      frame.style.width = "0";
      frame.style.height = "0";
      frame.style.border = "0";
      document.body.appendChild(frame);
      const doc = frame.contentWindow?.document;
      if (!doc) return;
      doc.open();
      doc.write(invoiceHtml);
      doc.close();
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      window.setTimeout(() => document.body.removeChild(frame), 2000);
    } catch {
      downloadText(`${invoiceNo}.html`, invoiceHtml, "text/html");
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <div className="rounded-xl border bg-muted/40 p-4 sm:p-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Invoice details
          </p>
          <div className="space-y-4">
            <FieldGrid>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">From (your business)</Label>
                <Input value={sellerName} onChange={(e) => setSellerName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Billing email</Label>
                <Input value={sellerEmail} onChange={(e) => setSellerEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Bill to (client)</Label>
                <Input value={clientName} onChange={(e) => setClientName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Client email</Label>
                <Input value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
              </div>
              <FieldGrid>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Invoice #</Label>
                  <Input value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Issue date</Label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <NumberField label="Due in (days)" value={dueDays} onChange={setDueDays} />
                <NumberField label="Tax rate" value={taxRate} onChange={setTaxRate} suffix="%" />
              </FieldGrid>
            </FieldGrid>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Line items</Label>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5"
                  onClick={() => setItems((l) => [...l, { desc: "", qty: "1", rate: "0" }])}
                >
                  <Plus className="h-4 w-4" /> Add item
                </Button>
              </div>
              <div className="grid grid-cols-[1fr_64px_88px_32px] gap-2 px-1 text-xs font-medium text-muted-foreground">
                <span>Description</span>
                <span className="text-right">Qty</span>
                <span className="text-right">Rate</span>
                <span />
              </div>
              {items.map((it, i) => (
                <div key={i} className="grid grid-cols-[1fr_64px_88px_32px] items-center gap-2">
                  <Input
                    value={it.desc}
                    onChange={(e) => updateItem(i, { desc: e.target.value })}
                    placeholder="Service or product"
                    aria-label={`Item ${i + 1} description`}
                  />
                  <Input
                    value={it.qty}
                    onChange={(e) => updateItem(i, { qty: e.target.value })}
                    inputMode="decimal"
                    className="tnum text-right"
                    aria-label={`Item ${i + 1} quantity`}
                  />
                  <Input
                    value={it.rate}
                    onChange={(e) => updateItem(i, { rate: e.target.value })}
                    inputMode="decimal"
                    className="tnum text-right"
                    aria-label={`Item ${i + 1} rate`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setItems((l) => l.filter((_, li) => li !== i))}
                    aria-label={`Remove item ${i + 1}`}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Payment notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="resize-y"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-4 shadow-sm sm:p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Totals
            </p>
            <p className="tnum text-3xl font-bold tracking-tight">{fmtUSD(total, 2)}</p>
            <p className="text-sm text-muted-foreground">due {dueStr}</p>
            <div className="mt-4">
              <StatRow label="Subtotal" value={fmtUSD(subtotal, 2)} emphasis />
              <StatRow label={`Tax (${num(taxRate)}%)`} value={fmtUSD(tax, 2)} />
              <StatRow label="Total due" value={fmtUSD(total, 2)} emphasis />
              <StatRow label="Line items" value={String(items.length)} />
            </div>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm sm:p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Invoice preview
            </p>
            <div className="rounded-lg border bg-white p-4 text-[13px] leading-relaxed">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold">{sellerName || "Your business"}</p>
                  <p className="text-xs text-muted-foreground">{sellerEmail}</p>
                </div>
                <div className="rounded-full bg-[#1f4a3f] px-2.5 py-1 text-[10px] font-semibold text-white">
                  {invoiceNo}
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                Billed to <span className="font-medium text-foreground">{clientName || "Client"}</span> ·
                issued {date} · due {dueStr}
              </div>
              <table className="mt-3 w-full text-xs">
                <tbody>
                  {items.map((it, i) => (
                    <tr key={i} className="border-b border-border/60 last:border-0">
                      <td className="py-1.5 pr-2">{it.desc || "—"}</td>
                      <td className="tnum py-1.5 text-right">{it.qty}×</td>
                      <td className="tnum py-1.5 text-right">{fmtUSD(num(it.rate), 2)}</td>
                      <td className="tnum py-1.5 text-right font-medium">
                        {fmtUSD(num(it.qty) * num(it.rate), 2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 flex items-baseline justify-between text-sm font-bold">
                <span>Total due</span>
                <span className="tnum">{fmtUSD(total, 2)}</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" onClick={printInvoice}>
                Print / save as PDF
              </Button>
              <CopyButton text={invoiceHtml} label="Copy HTML" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadText(`${invoiceNo}.html`, invoiceHtml, "text/html")}
              >
                Download HTML
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
