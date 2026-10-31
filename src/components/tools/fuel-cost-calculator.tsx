"use client";

import React, { useState, useMemo } from "react";
import { fmtUSD, fmtNum } from "@/lib/format";
import { Fuel, Car, Users, ArrowRightLeft } from "lucide-react";

export function FuelCostCalculator() {
  const [distance, setDistance] = useState(320);
  const [unitSystem, setUnitSystem] = useState<"us" | "metric">("us");
  const [mpg, setMpg] = useState(28);
  const [lPer100km, setLPer100km] = useState(8.4);
  const [fuelPrice, setFuelPrice] = useState(3.65);
  const [passengers, setPassengers] = useState(2);
  const [roundTrip, setRoundTrip] = useState(false);

  const calc = useMemo(() => {
    const effectiveDistance = roundTrip ? distance * 2 : distance;

    let fuelNeeded = 0;
    if (unitSystem === "us") {
      fuelNeeded = mpg > 0 ? effectiveDistance / mpg : 0;
    } else {
      fuelNeeded = (effectiveDistance / 100) * lPer100km;
    }

    const totalCost = fuelNeeded * fuelPrice;
    const travelers = Math.max(1, passengers);
    const perPersonCost = totalCost / travelers;
    const costPerDistance = effectiveDistance > 0 ? totalCost / effectiveDistance : 0;

    return {
      effectiveDistance,
      fuelNeeded,
      totalCost,
      perPersonCost,
      costPerDistance,
    };
  }, [distance, unitSystem, mpg, lPer100km, fuelPrice, passengers, roundTrip]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Inputs (7 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Fuel className="h-4 w-4 text-[#a4502c]" /> Journey & Vehicle Economy
            </span>
            <div className="flex rounded-md bg-muted/60 p-0.5 text-xs font-medium">
              <button
                onClick={() => setUnitSystem("us")}
                className={`rounded px-2.5 py-1 ${unitSystem === "us" ? "bg-card font-semibold shadow-xs" : "text-muted-foreground"}`}
              >
                US (Miles / Gal)
              </button>
              <button
                onClick={() => setUnitSystem("metric")}
                className={`rounded px-2.5 py-1 ${unitSystem === "metric" ? "bg-card font-semibold shadow-xs" : "text-muted-foreground"}`}
              >
                Metric (Km / L)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-foreground">
                Trip Distance ({unitSystem === "us" ? "Miles" : "Kilometers"})
              </label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">
                Fuel Economy ({unitSystem === "us" ? "MPG" : "L / 100km"})
              </label>
              {unitSystem === "us" ? (
                <input
                  type="number"
                  value={mpg}
                  onChange={(e) => setMpg(Number(e.target.value) || 0)}
                  className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              ) : (
                <input
                  type="number"
                  step="0.1"
                  value={lPer100km}
                  onChange={(e) => setLPer100km(Number(e.target.value) || 0)}
                  className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">
                Fuel Price ({unitSystem === "us" ? "$ / Gallon" : "$ / Liter"})
              </label>
              <input
                type="number"
                step="0.01"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Number of Passengers</label>
              <input
                type="number"
                min="1"
                max="10"
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value) || 1)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="col-span-2 pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={roundTrip}
                  onChange={(e) => setRoundTrip(e.target.checked)}
                  className="rounded border-input text-primary focus:ring-ring"
                />
                <span>Round-Trip Journey (Doubles distance to {distance * 2} {unitSystem === "us" ? "miles" : "km"})</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Banner (5 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm flex flex-col justify-between lg:col-span-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Trip Fuel Cost
          </span>

          <div className="my-4 space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <span className="text-xs text-muted-foreground">Estimated Total Fuel Cost</span>
              <p className="tnum font-display text-display-lg text-[#1f5f45] mt-1 font-bold">
                {fmtUSD(calc.totalCost, 2)}
              </p>
              <span className="text-xs text-muted-foreground mt-1 block">
                {fmtUSD(calc.perPersonCost, 2)} per passenger
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="text-[11px] text-muted-foreground block">Fuel Required</span>
                <span className="tnum font-display text-display-sm text-foreground font-bold">
                  {calc.fuelNeeded.toFixed(1)} {unitSystem === "us" ? "gal" : "L"}
                </span>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="text-[11px] text-muted-foreground block">Cost / {unitSystem === "us" ? "Mile" : "Km"}</span>
                <span className="tnum font-display text-display-sm text-[#3f346f] font-bold">
                  {fmtUSD(calc.costPerDistance, 2)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground flex justify-between">
            <span>Effective distance:</span>
            <strong className="text-foreground">{calc.effectiveDistance} {unitSystem === "us" ? "miles" : "km"}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
