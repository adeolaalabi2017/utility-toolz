"use client";

import { ResultValue } from "./result-value";
import React, { useState, useMemo } from "react";
import { fmtNum } from "@/lib/format";
import { Binary, Sparkles, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

function countSigFigs(str: string): number {
  const clean = str.trim();
  if (!clean || isNaN(Number(clean))) return 0;

  // Scientific notation e.g. 1.23e4
  if (clean.toLowerCase().includes("e")) {
    const mantissa = clean.toLowerCase().split("e")[0];
    return countSigFigs(mantissa);
  }

  // With decimal
  if (clean.includes(".")) {
    const stripped = clean.replace(/^-/, "");
    // Leading zeros
    const withoutLeading = stripped.replace(/^0+\.?0*/, "");
    const onlyDigits = withoutLeading.replace(".", "");
    return onlyDigits.length || 1;
  }

  // Integer without decimal point
  const stripped = clean.replace(/^-/, "");
  const withoutLeading = stripped.replace(/^0+/, "");
  // Trailing zeros in integers without decimal are conventionally non-significant
  const withoutTrailing = withoutLeading.replace(/0+$/, "");
  return withoutTrailing.length || 1;
}

function toScientific(num: number, sigFigs: number): string {
  if (num === 0) return "0";
  const str = num.toExponential(Math.max(0, sigFigs - 1));
  const [mantissa, exponent] = str.split("e");
  const expNum = parseInt(exponent, 10);
  return `${mantissa} × 10${expNum !== 0 ? `^${expNum}` : ""}`;
}

export function SigFigCalculator() {
  const [inputVal, setInputVal] = useState("0.004520");
  const [targetSigFigs, setTargetSigFigs] = useState(3);
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const raw = inputVal.trim();
    const num = Number(raw);
    if (isNaN(num)) return null;

    const detectedSigFigs = countSigFigs(raw);
    const sci = toScientific(num, detectedSigFigs);

    // Rounded to target sig figs
    const roundedSci = num.toPrecision(Math.max(1, targetSigFigs));
    const roundedNum = Number(roundedSci);

    return {
      num,
      detectedSigFigs,
      scientificNotation: sci,
      roundedSci,
      roundedNum,
    };
  }, [inputVal, targetSigFigs]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Input (7 cols) */}
        <div className="rounded-xl bg-card p-5 shadow-lark-sm space-y-4 lg:col-span-7">
          <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
            <Binary className="h-4 w-4 text-deep-orange" /> Number & precision
          </span>

          <div className="space-y-4">
            <div>
              <label htmlFor="sig-fig-calculator-1" className="text-xs font-medium text-foreground">Input Number</label>
              <input id="sig-fig-calculator-1"
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="e.g. 0.004520 or 12500"
                className="mt-1 w-full rounded-md border border-input bg-background p-2.5 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground mt-0.5 block">
                Type with decimals to preserve trailing significant zeros (e.g. 50.0 vs 50)
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-foreground">
                <label htmlFor="sig-fig-calculator-2">Round to Target Sig Figs: {targetSigFigs}</label>
                <span className="text-muted-foreground font-mono">1 to 8 digits</span>
              </div>
              <input id="sig-fig-calculator-2"
                type="range"
                min="1"
                max="8"
                value={targetSigFigs}
                onChange={(e) => setTargetSigFigs(Number(e.target.value))}
                className="mt-2 w-full"
              />
            </div>
          </div>
        </div>

        {/* Results Banner (5 cols) */}
        <div className="rounded-xl bg-card p-5 shadow-lark-sm flex flex-col justify-between lg:col-span-5">
          <span className="text-sm font-semibold text-muted-foreground">
            Significant figures analysis
          </span>

          {stats ? (
            <div className="my-4 space-y-4">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <span className="text-xs text-muted-foreground">Significant Figures Count</span>
                <ResultValue compact live className="mt-1">
                  {stats.detectedSigFigs}
                  <span className="text-xs text-muted-foreground font-normal"> Sig Figs</span>
                </ResultValue>
                <span className="text-xs text-muted-foreground mt-1 block font-mono">
                  Scientific: <strong className="text-foreground">{stats.scientificNotation}</strong>
                </span>
              </div>

              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <span className="text-[11px] text-muted-foreground block">
                  Rounded to {targetSigFigs} Sig Figs
                </span>
                <span className="tnum font-display text-display-sm text-foreground font-bold">
                  {stats.roundedSci}
                </span>
              </div>
            </div>
          ) : (
            <div className="my-auto text-center text-xs text-muted-foreground py-8">
              Enter a valid number above.
            </div>
          )}

          <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground flex justify-between">
            <span>Precision rules:</span>
            <strong className="text-foreground">Standard IUPAC / ASTM scientific rounding</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
