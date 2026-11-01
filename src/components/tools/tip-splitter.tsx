"use client";

import { Cur } from "@/components/site/currency";
import React, { useState, useMemo } from "react";
import { fmtUSD } from "@/lib/format";
import { Receipt, Users, DollarSign, Sparkles } from "lucide-react";

export function TipSplitter() {
  const [billAmount, setBillAmount] = useState(86.5);
  const [tipPct, setTipPct] = useState(18);
  const [splitCount, setSplitCount] = useState(3);
  const [roundUp, setRoundUp] = useState(false);

  const calc = useMemo(() => {
    const rawTip = billAmount * (tipPct / 100);
    let total = billAmount + rawTip;

    if (roundUp) {
      total = Math.ceil(total);
    }
    const tip = Math.max(0, total - billAmount);

    const people = Math.max(1, splitCount);
    const perPersonTotal = total / people;
    const perPersonTip = tip / people;

    return {
      tip,
      total,
      perPersonTotal,
      perPersonTip,
    };
  }, [billAmount, tipPct, splitCount, roundUp]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Inputs (7 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4 lg:col-span-7">
          <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
            <Receipt className="h-4 w-4 text-deep-orange" /> Bill & gratuity
          </span>

          <div className="space-y-4">
            <div>
              <label htmlFor="tip-splitter-1" className="text-xs font-medium text-foreground">Bill Amount before Tip (<Cur />)</label>
              <input id="tip-splitter-1"
                type="number"
                step="0.01"
                value={billAmount}
                onChange={(e) => setBillAmount(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2.5 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label htmlFor="tip-splitter-2" className="text-xs font-medium text-foreground block mb-1.5">Tip Percentage: {tipPct}%</label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {[15, 18, 20, 25].map((pct) => (
                  <button aria-pressed={tipPct === pct} type="button"
                    key={pct}
                    onClick={() => setTipPct(pct)}
                    className={`rounded-lg border p-2 text-xs font-bold transition-colors ${
                      tipPct === pct ? "bg-primary text-primary-foreground border-primary" : "border-border bg-background text-foreground"
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
                <div className="flex items-center">
                  <input id="tip-splitter-2"
                    type="number"
                    min="0"
                    max="100"
                    value={tipPct}
                    onChange={(e) => setTipPct(Number(e.target.value) || 0)}
                    className="w-full rounded-lg border border-input p-2 text-center text-xs font-bold font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2">
              <div>
                <p id="tip-split-label" className="text-xs font-medium text-foreground">Split between</p>
                <div role="group" aria-labelledby="tip-split-label" className="mt-1 flex items-center gap-2">
                  <button aria-label="One fewer person" type="button"
                    onClick={() => setSplitCount((c) => Math.max(1, c - 1))}
                    className="h-11 w-11 shrink-0 rounded-md border border-border bg-background text-sm font-bold sm:h-9 sm:w-9"
                  >
                    −
                  </button>
                  <span aria-live="polite" className="flex-1 whitespace-nowrap text-center font-mono text-sm font-bold text-foreground sm:text-base">
                    {splitCount} {splitCount === 1 ? "person" : "people"}
                  </span>
                  <button aria-label="One more person" type="button"
                    onClick={() => setSplitCount((c) => Math.min(30, c + 1))}
                    className="h-11 w-11 shrink-0 rounded-md border border-border bg-background text-sm font-bold sm:h-9 sm:w-9"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer pb-2">
                  <input
                    type="checkbox"
                    checked={roundUp}
                    onChange={(e) => setRoundUp(e.target.checked)}
                    className="rounded border-input text-primary focus:ring-ring"
                  />
                  <span>Round Total to Whole Dollar</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Results Banner (5 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm flex flex-col justify-between lg:col-span-5">
          <span className="text-sm font-semibold text-muted-foreground">
            Per-Person share
          </span>

          <div className="my-4 space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <span className="text-xs text-muted-foreground">Each Person Pays</span>
              <p className="tnum font-display text-display-lg text-deep-green mt-1 font-bold">
                {fmtUSD(calc.perPersonTotal, 2)}
              </p>
              <span className="text-xs text-muted-foreground mt-1 block">
                Includes {fmtUSD(calc.perPersonTip, 2)} tip each
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg bg-muted/50 p-3">
                <span className="text-[11px] text-muted-foreground block">Total Tip</span>
                <span className="tnum font-display text-display-sm text-foreground font-bold">
                  {fmtUSD(calc.tip, 2)}
                </span>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <span className="text-[11px] text-muted-foreground block">Total Bill + Tip</span>
                <span className="tnum font-display text-display-sm text-deep-purple font-bold">
                  {fmtUSD(calc.total, 2)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground flex justify-between">
            <span>Bill split mode:</span>
            <strong className="text-foreground">Even split between {splitCount} people</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
