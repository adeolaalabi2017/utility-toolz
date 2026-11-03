"use client";

import * as React from "react";
import { CalcLayout, FieldGrid, MiniTable, NumberField, ResultHero, SelectField, StatRow, Verdict } from "./ui";
import { fmtNum, num } from "@/lib/format";
import { useToolState } from "@/hooks/use-tool-state";
import { ToolShareBar } from "@/components/site/tool-share-bar";
import {
  CU_FT,
  CU_YD,
  FT,
  IN,
  KG_PER_LB,
  L_PER_US_GAL,
  MATERIALS,
  SQ_FT,
  bestTins,
  concreteBags,
  coverVolume,
  cylinderVolume,
  packsFor,
  paintLitres,
  pitchDegrees,
  roofArea,
  shingleBundles,
  slabVolume,
  tileCount,
  wallArea,
  wallpaperRolls,
  type UnitSystem,
} from "@/lib/construction";

/* ------------------------------------------------------------------ */
/* Units                                                               */
/* ------------------------------------------------------------------ */

/** Kinds of input that change when the unit system flips. */
type Dim = "len" | "cm" | "mm" | "area" | "coverage";

/** Multiply a metric value by this to get the imperial one. */
const TO_IMPERIAL: Record<Dim, number> = {
  len: 1 / FT, // m → ft
  cm: 1 / 2.54, // cm → in
  mm: 1 / 25.4, // mm → in
  area: 1 / SQ_FT, // m² → ft²
  coverage: (1 / SQ_FT) * L_PER_US_GAL, // m² per litre → ft² per US gallon
};

const UNIT_LABEL: Record<Dim, [string, string]> = {
  len: ["m", "ft"],
  cm: ["cm", "in"],
  mm: ["mm", "in"],
  area: ["m²", "ft²"],
  coverage: ["m²/L", "ft²/gal"],
};

/** Converts the entered numbers so switching units keeps the same real sizes. */
function convertedFor<T extends Record<string, string>>(params: T, dims: Partial<Record<keyof T, Dim>>, to: UnitSystem): Partial<T> {
  const out: Record<string, string> = {};
  for (const [key, dim] of Object.entries(dims) as [string, Dim][]) {
    const v = num(params[key], NaN);
    if (!isFinite(v)) continue;
    const f = to === "imperial" ? TO_IMPERIAL[dim] : 1 / TO_IMPERIAL[dim];
    out[key] = String(Number((v * f).toPrecision(3)));
  }
  return out as Partial<T>;
}

/** Shared state for a calculator with a metric/imperial switch. */
function useUnitTool<T extends Record<string, string> & { units: string }>(defaults: T, dims: Partial<Record<keyof T, Dim>>, extra?: (to: UnitSystem) => Partial<T>) {
  const [params, setParams] = useToolState(defaults);
  const imperial = params.units === "imperial";
  /** Metric value of a field (metres, cm, mm, m², m²/L). */
  const si = (key: keyof T) => {
    const v = num(params[key] as string, NaN);
    const dim = dims[key];
    return dim && imperial ? v / TO_IMPERIAL[dim] : v;
  };
  const unit = (dim: Dim) => UNIT_LABEL[dim][imperial ? 1 : 0];
  const setUnits = (to: string) => {
    if (to === params.units) return;
    setParams({ ...convertedFor(params, dims, to as UnitSystem), ...extra?.(to as UnitSystem), units: to } as Partial<T>);
  };
  return { params, setParams, imperial, si, unit, setUnits };
}

const UNIT_OPTIONS = [
  { value: "metric", label: "Metric (m, cm)" },
  { value: "imperial", label: "Imperial (ft, in)" },
];

const fmtArea = (m2: number, imperial: boolean) => (imperial ? `${fmtNum(m2 / SQ_FT, 0)} ft²` : `${fmtNum(m2, 1)} m²`);

/* ================================================================== */
/* Paint                                                               */
/* ================================================================== */

/** A typical interior door and window, as wall area they don't need painting. */
const DOOR_M2 = 1.9;
const WINDOW_M2 = 1.5;

export function PaintCalculator() {
  const { params, setParams, imperial, si, unit, setUnits } = useUnitTool(
    { units: "metric", length: "4", width: "3.5", height: "2.4", doors: "1", windows: "1", coats: "2", ceiling: "no", coverage: "10" },
    { length: "len", width: "len", height: "len", coverage: "coverage" }
  );
  const L = si("length");
  const W = si("width");
  const H = si("height");
  const coverage = si("coverage");
  const openings = num(params.doors, 0) * DOOR_M2 + num(params.windows, 0) * WINDOW_M2;
  const walls = wallArea(L, W, H, openings);
  const area = walls + (params.ceiling === "yes" ? L * W : 0);
  const litres = paintLitres(area, Number(params.coats), coverage);
  const ok = L > 0 && W > 0 && H > 0 && coverage > 0;

  const sizes = imperial ? [1, 0.25] : [5, 2.5, 1];
  const need = imperial ? litres / L_PER_US_GAL : litres;
  const tins = ok ? bestTins(need, sizes) : null;
  const tinLabel = (s: number) => (imperial ? (s === 1 ? "1 gallon" : "1 quart") : `${s} L`);

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <SelectField label="Units" value={params.units} onChange={setUnits} options={UNIT_OPTIONS} />
          <FieldGrid cols={3}>
            <NumberField label="Room length" value={params.length} onChange={(v) => setParams({ length: v })} suffix={unit("len")} />
            <NumberField label="Room width" value={params.width} onChange={(v) => setParams({ width: v })} suffix={unit("len")} />
            <NumberField label="Wall height" value={params.height} onChange={(v) => setParams({ height: v })} suffix={unit("len")} />
          </FieldGrid>
          <FieldGrid>
            <NumberField label="Doors" value={params.doors} onChange={(v) => setParams({ doors: v })} min={0} />
            <NumberField label="Windows" value={params.windows} onChange={(v) => setParams({ windows: v })} min={0} />
            <SelectField
              label="Coats"
              value={params.coats}
              onChange={(v) => setParams({ coats: v })}
              options={[
                { value: "1", label: "1 coat (refresh, same colour)" },
                { value: "2", label: "2 coats (standard)" },
                { value: "3", label: "3 coats (big colour change)" },
              ]}
            />
            <SelectField
              label="Paint the ceiling too"
              value={params.ceiling}
              onChange={(v) => setParams({ ceiling: v })}
              options={[
                { value: "no", label: "No, walls only" },
                { value: "yes", label: "Yes, add the ceiling" },
              ]}
            />
          </FieldGrid>
          <NumberField
            label="Coverage"
            value={params.coverage}
            onChange={(v) => setParams({ coverage: v })}
            suffix={unit("coverage")}
            hint={imperial ? "Printed on the can: usually 350–400 ft² per gallon" : "Printed on the tin: usually 10–12 m² per litre"}
          />
        </div>
      }
      results={
        !ok ? (
          <Verdict tone="neutral">Enter the room size and the paint&apos;s coverage.</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label="Paint needed"
              value={imperial ? `${fmtNum(need, 2)} gal` : `${fmtNum(litres, 1)} L`}
              sub={`${params.coats} coat${params.coats === "1" ? "" : "s"} over ${fmtArea(area, imperial)}`}
            />
            {tins && (
              <div>
                <StatRow
                  label="Buy"
                  value={sizes
                    .map((s, i) => (tins.counts[i] ? `${tins.counts[i]} × ${tinLabel(s)}` : ""))
                    .filter(Boolean)
                    .join(" + ")}
                  emphasis
                />
                <StatRow label="Paint in those tins" value={imperial ? `${fmtNum(tins.total, 2)} gal` : `${fmtNum(tins.total, 1)} L`} />
                <StatRow label="Wall area after doors and windows" value={fmtArea(walls, imperial)} />
              </div>
            )}
            <Verdict tone="neutral">
              Doors count as {imperial ? "20 ft²" : `${DOOR_M2} m²`} and windows as {imperial ? "16 ft²" : `${WINDOW_M2} m²`}. Rough
              or freshly plastered walls soak up more, so allow an extra 10–20% for those.
            </Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* Tiles                                                               */
/* ================================================================== */

const WASTE_OPTIONS = [
  { value: "5", label: "5% (simple room, straight lay)" },
  { value: "10", label: "10% (standard)" },
  { value: "15", label: "15% (diagonal or lots of cuts)" },
  { value: "20", label: "20% (herringbone, patterns)" },
];

export function TileCalculator() {
  const { params, setParams, imperial, si, unit, setUnits } = useUnitTool(
    { units: "metric", length: "3", width: "2.5", tileW: "30", tileH: "60", joint: "3", waste: "10", perBox: "8" },
    { length: "len", width: "len", tileW: "cm", tileH: "cm", joint: "mm" }
  );
  const area = si("length") * si("width");
  const tileW = si("tileW") / 100;
  const tileH = si("tileH") / 100;
  const joint = si("joint") / 1000;
  const tiles = tileCount(area, tileW, tileH, joint, Number(params.waste));
  const perBox = Math.floor(num(params.perBox, 0));
  const ok = area > 0 && tileW > 0 && tileH > 0 && joint >= 0;

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <SelectField label="Units" value={params.units} onChange={setUnits} options={UNIT_OPTIONS} />
          <FieldGrid>
            <NumberField label="Area length" value={params.length} onChange={(v) => setParams({ length: v })} suffix={unit("len")} />
            <NumberField label="Area width" value={params.width} onChange={(v) => setParams({ width: v })} suffix={unit("len")} />
          </FieldGrid>
          <FieldGrid cols={3}>
            <NumberField label="Tile width" value={params.tileW} onChange={(v) => setParams({ tileW: v })} suffix={unit("cm")} />
            <NumberField label="Tile length" value={params.tileH} onChange={(v) => setParams({ tileH: v })} suffix={unit("cm")} />
            <NumberField label="Grout joint" value={params.joint} onChange={(v) => setParams({ joint: v })} suffix={unit("mm")} min={0} />
          </FieldGrid>
          <FieldGrid>
            <SelectField label="Waste allowance" value={params.waste} onChange={(v) => setParams({ waste: v })} options={WASTE_OPTIONS} />
            <NumberField label="Tiles per box" value={params.perBox} onChange={(v) => setParams({ perBox: v })} hint="Leave empty if you buy single tiles" min={0} />
          </FieldGrid>
        </div>
      }
      results={
        !ok ? (
          <Verdict tone="neutral">Enter the area and the tile size.</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero label="Tiles to buy" value={fmtNum(tiles)} sub={`For ${fmtArea(area, imperial)}, including ${params.waste}% for cuts and breakage`} />
            <div>
              {perBox > 0 && <StatRow label="Boxes" value={`${fmtNum(Math.ceil(tiles / perBox))} boxes of ${perBox}`} emphasis />}
              <StatRow label="Tiles before waste" value={fmtNum(Math.ceil(area / ((tileW + joint) * (tileH + joint)) - 1e-9))} />
              <StatRow label="Tile area each" value={imperial ? `${fmtNum((tileW * tileH) / SQ_FT, 2)} ft²` : `${fmtNum(tileW * tileH, 3)} m²`} />
            </div>
            <Verdict tone="neutral">
              Buy every box from the same batch, and keep a few spare tiles: replacements for a cracked tile years later
              rarely match exactly.
            </Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* Flooring                                                            */
/* ================================================================== */

export function FlooringCalculator() {
  const { params, setParams, imperial, si, unit, setUnits } = useUnitTool(
    { units: "metric", length: "5", width: "4", pattern: "7", perPack: "2.2" },
    { length: "len", width: "len", perPack: "area" }
  );
  const L = si("length");
  const W = si("width");
  const area = L * W;
  const perPack = si("perPack");
  const { buy, packs } = packsFor(area, Number(params.pattern), perPack);
  const ok = L > 0 && W > 0 && perPack > 0;

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <SelectField label="Units" value={params.units} onChange={setUnits} options={UNIT_OPTIONS} />
          <FieldGrid>
            <NumberField label="Room length" value={params.length} onChange={(v) => setParams({ length: v })} suffix={unit("len")} />
            <NumberField label="Room width" value={params.width} onChange={(v) => setParams({ width: v })} suffix={unit("len")} />
          </FieldGrid>
          <FieldGrid>
            <SelectField
              label="Laying pattern"
              value={params.pattern}
              onChange={(v) => setParams({ pattern: v })}
              options={[
                { value: "7", label: "Straight (7% waste)" },
                { value: "15", label: "Diagonal (15% waste)" },
                { value: "20", label: "Herringbone (20% waste)" },
              ]}
            />
            <NumberField
              label="Coverage per pack"
              value={params.perPack}
              onChange={(v) => setParams({ perPack: v })}
              suffix={unit("area")}
              hint="Printed on the pack"
            />
          </FieldGrid>
        </div>
      }
      results={
        !ok ? (
          <Verdict tone="neutral">Enter the room size and how much one pack covers.</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero label="Packs to buy" value={fmtNum(packs)} sub={`Covers ${fmtArea(packs * perPack, imperial)}`} />
            <div>
              <StatRow label="Floor area" value={fmtArea(area, imperial)} />
              <StatRow label="Area with waste" value={fmtArea(buy, imperial)} emphasis />
              <StatRow
                label={imperial ? "Baseboard length" : "Skirting length"}
                value={imperial ? `${fmtNum((2 * (L + W)) / FT, 0)} ft` : `${fmtNum(2 * (L + W), 1)} m`}
              />
            </div>
            <Verdict tone="neutral">
              For an L-shaped room, work out each rectangle separately and add the packs. Leave packs in the room for
              48 hours before fitting so the boards adjust to its temperature and humidity.
            </Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* Concrete                                                            */
/* ================================================================== */

const BAGS: Record<UnitSystem, { value: string; label: string }[]> = {
  metric: [
    { value: "20", label: "20 kg bags" },
    { value: "25", label: "25 kg bags" },
    { value: "40", label: "40 kg bags" },
  ],
  imperial: [
    { value: "40", label: "40 lb bags" },
    { value: "60", label: "60 lb bags" },
    { value: "80", label: "80 lb bags" },
  ],
};

export function ConcreteCalculator() {
  const { params, setParams, imperial, si, unit, setUnits } = useUnitTool(
    { units: "metric", shape: "slab", length: "3", width: "3", depth: "10", diameter: "30", height: "1", count: "1", waste: "10", bag: "25" },
    { length: "len", width: "len", depth: "cm", diameter: "cm", height: "len" },
    (to) => ({ bag: to === "imperial" ? "80" : "25" })
  );
  const slab = params.shape === "slab";
  const count = Math.max(0, Math.floor(num(params.count, 0)));
  const volume = slab
    ? slabVolume(si("length"), si("width"), si("depth") / 100)
    : cylinderVolume(si("diameter") / 100, si("height")) * count;
  const waste = Number(params.waste);
  const bagKg = imperial ? Number(params.bag) * KG_PER_LB : Number(params.bag);
  const bags = concreteBags(volume, bagKg, waste);
  const ok = volume > 0;
  const withWaste = volume * (1 + waste / 100);

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <FieldGrid>
            <SelectField label="Units" value={params.units} onChange={setUnits} options={UNIT_OPTIONS} />
            <SelectField
              label="Shape"
              value={params.shape}
              onChange={(v) => setParams({ shape: v })}
              options={[
                { value: "slab", label: "Slab, path or footing" },
                { value: "round", label: "Round posts or columns" },
              ]}
            />
          </FieldGrid>
          {slab ? (
            <FieldGrid cols={3}>
              <NumberField label="Length" value={params.length} onChange={(v) => setParams({ length: v })} suffix={unit("len")} />
              <NumberField label="Width" value={params.width} onChange={(v) => setParams({ width: v })} suffix={unit("len")} />
              <NumberField label="Thickness" value={params.depth} onChange={(v) => setParams({ depth: v })} suffix={unit("cm")} />
            </FieldGrid>
          ) : (
            <FieldGrid cols={3}>
              <NumberField label="Hole diameter" value={params.diameter} onChange={(v) => setParams({ diameter: v })} suffix={unit("cm")} />
              <NumberField label="Depth" value={params.height} onChange={(v) => setParams({ height: v })} suffix={unit("len")} />
              <NumberField label="How many" value={params.count} onChange={(v) => setParams({ count: v })} min={1} />
            </FieldGrid>
          )}
          <FieldGrid>
            <SelectField
              label="Extra for spillage and uneven ground"
              value={params.waste}
              onChange={(v) => setParams({ waste: v })}
              options={[
                { value: "5", label: "5% (formwork on a level base)" },
                { value: "10", label: "10% (standard)" },
                { value: "15", label: "15% (rough or soft ground)" },
              ]}
            />
            <SelectField label="Premix bag size" value={params.bag} onChange={(v) => setParams({ bag: v })} options={BAGS[imperial ? "imperial" : "metric"]} />
          </FieldGrid>
        </div>
      }
      results={
        !ok ? (
          <Verdict tone="neutral">Enter the size of what you&apos;re pouring.</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label="Concrete needed"
              value={imperial ? `${fmtNum(withWaste / CU_YD, 2)} yd³` : `${fmtNum(withWaste, 2)} m³`}
              sub={`Including ${waste}% extra`}
            />
            <div>
              <StatRow label={`Premix bags (${BAGS[imperial ? "imperial" : "metric"].find((b) => b.value === params.bag)?.label})`} value={fmtNum(bags)} emphasis />
              <StatRow label="Volume before extra" value={imperial ? `${fmtNum(volume / CU_FT, 1)} ft³` : `${fmtNum(volume, 3)} m³`} />
              <StatRow label="Weight of mixed concrete" value={imperial ? `${fmtNum((withWaste * 2100) / KG_PER_LB, 0)} lb` : `${fmtNum(withWaste * 2100, 0)} kg`} />
            </div>
            <Verdict tone={withWaste > 1 ? "warn" : "neutral"}>
              {withWaste > 1
                ? `That's ${fmtNum(bags)} bags to mix by hand. Above about 1 m³ (1.3 yd³), a ready-mix truck or a mixer hire is usually cheaper and much faster.`
                : "Bag yields assume concrete weighs about 2,100 kg per m³ once mixed, which matches the yield printed on standard premix bags."}
            </Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* Roofing                                                             */
/* ================================================================== */

export function RoofingCalculator() {
  const { params, setParams, imperial, si, unit, setUnits } = useUnitTool(
    { units: "metric", length: "12", width: "9", pitch: "6", style: "10" },
    { length: "len", width: "len" }
  );
  const footprint = si("length") * si("width");
  const rise = Number(params.pitch);
  const area = roofArea(footprint, rise);
  const { squares, bundles } = shingleBundles(area, Number(params.style));
  const ok = footprint > 0;

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <SelectField label="Units" value={params.units} onChange={setUnits} options={UNIT_OPTIONS} />
          <FieldGrid>
            <NumberField label="Length including overhangs" value={params.length} onChange={(v) => setParams({ length: v })} suffix={unit("len")} />
            <NumberField label="Width including overhangs" value={params.width} onChange={(v) => setParams({ width: v })} suffix={unit("len")} />
          </FieldGrid>
          <FieldGrid>
            <SelectField
              label="Roof pitch"
              value={params.pitch}
              onChange={(v) => setParams({ pitch: v })}
              options={[2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((r) => ({ value: String(r), label: `${r} in 12 (${fmtNum(pitchDegrees(r), 1)}°)` }))}
            />
            <SelectField
              label="Roof shape"
              value={params.style}
              onChange={(v) => setParams({ style: v })}
              options={[
                { value: "10", label: "Gable (10% waste)" },
                { value: "15", label: "Hip or with valleys (15% waste)" },
              ]}
            />
          </FieldGrid>
          <Verdict tone="neutral">Measure the footprint from the ground, eaves to eaves. The pitch is how many units the roof rises for every 12 it runs.</Verdict>
        </div>
      }
      results={
        !ok ? (
          <Verdict tone="neutral">Enter the roof&apos;s footprint.</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero label="Shingle bundles" value={fmtNum(bundles)} sub={`${fmtNum(squares, 1)} squares including ${params.style}% waste`} />
            <div>
              <StatRow label="Roof surface area" value={fmtArea(area, imperial)} emphasis />
              <StatRow label="Footprint" value={fmtArea(footprint, imperial)} />
              <StatRow label="Pitch" value={`${rise} in 12, ${fmtNum(pitchDegrees(rise), 1)}°`} />
            </div>
            <Verdict tone={rise < 4 ? "warn" : "neutral"}>
              {rise < 4
                ? "Asphalt shingles need a pitch of at least 4 in 12, or 2 in 12 with a doubled underlayment. Lower roofs need membrane roofing."
                : "One square covers 100 ft² and takes three bundles of standard shingles. Add starter strip and ridge caps separately."}
            </Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* Wallpaper                                                           */
/* ================================================================== */

/** Roll sizes in metres. */
const ROLLS: Record<string, { label: string; width: number; length: number }> = {
  eu: { label: "Standard (0.53 × 10.05 m)", width: 0.53, length: 10.05 },
  wide: { label: "Wide (0.70 × 10.05 m)", width: 0.7, length: 10.05 },
  us: { label: "US double roll (20.5 in × 33 ft)", width: 20.5 * IN, length: 33 * FT },
};

export function WallpaperCalculator() {
  const { params, setParams, imperial, si, unit, setUnits } = useUnitTool(
    { units: "metric", length: "4", width: "3.5", height: "2.4", openings: "0.9", roll: "eu", repeat: "0" },
    { length: "len", width: "len", height: "len", openings: "len", repeat: "cm" },
    (to) => ({ roll: to === "imperial" ? "us" : "eu" })
  );
  const roll = ROLLS[params.roll] ?? ROLLS.eu;
  const wallWidth = Math.max(0, 2 * (si("length") + si("width")) - si("openings"));
  const height = si("height");
  const repeat = si("repeat") / 100;
  const r = wallpaperRolls({ wallWidth, height, rollWidth: roll.width, rollLength: roll.length, repeat: repeat || 0 });
  const ok = wallWidth > 0 && height > 0 && r.dropsPerRoll > 0;

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <SelectField label="Units" value={params.units} onChange={setUnits} options={UNIT_OPTIONS} />
          <FieldGrid cols={3}>
            <NumberField label="Room length" value={params.length} onChange={(v) => setParams({ length: v })} suffix={unit("len")} />
            <NumberField label="Room width" value={params.width} onChange={(v) => setParams({ width: v })} suffix={unit("len")} />
            <NumberField label="Wall height" value={params.height} onChange={(v) => setParams({ height: v })} suffix={unit("len")} />
          </FieldGrid>
          <NumberField
            label="Width to skip"
            value={params.openings}
            onChange={(v) => setParams({ openings: v })}
            suffix={unit("len")}
            min={0}
            hint="Doors and floor-to-ceiling windows only. Paper over normal windows and trim the waste."
          />
          <FieldGrid>
            <SelectField label="Roll size" value={params.roll} onChange={(v) => setParams({ roll: v })} options={Object.entries(ROLLS).map(([value, x]) => ({ value, label: x.label }))} />
            <NumberField label="Pattern repeat" value={params.repeat} onChange={(v) => setParams({ repeat: v })} suffix={unit("cm")} min={0} hint="On the label; 0 for plain paper" />
          </FieldGrid>
        </div>
      }
      results={
        !ok ? (
          <Verdict tone={height > roll.length ? "bad" : "neutral"}>
            {height > roll.length ? "The walls are taller than one roll is long." : "Enter the room size."}
          </Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero label="Rolls to buy" value={fmtNum(r.rolls)} sub={`${roll.label.split(" (")[0]} rolls`} />
            <MiniTable
              head={["Working", ""]}
              rows={[
                ["Wall width to cover", imperial ? `${fmtNum(wallWidth / FT, 1)} ft` : `${fmtNum(wallWidth, 2)} m`],
                ["Drops (strips) needed", fmtNum(r.drops)],
                ["Each drop", imperial ? `${fmtNum((height + repeat) / IN, 0)} in` : `${fmtNum((height + repeat) * 100, 0)} cm`],
                ["Whole drops per roll", fmtNum(r.dropsPerRoll)],
              ]}
            />
            <Verdict tone="neutral">
              Check every roll has the same batch number, and buy one spare: a later batch can differ in shade.
            </Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* Gravel, soil and mulch                                              */
/* ================================================================== */

/** How each material is commonly sold, as a weight or a volume per bag. */
const BAG_OPTIONS: Record<UnitSystem, { value: string; label: string; kg?: number; m3?: number }[]> = {
  metric: [
    { value: "kg25", label: "25 kg bags", kg: 25 },
    { value: "l60", label: "60 L bags", m3: 0.06 },
    { value: "bulk", label: "Bulk bags (about 0.75 m³)", m3: 0.75 },
  ],
  imperial: [
    { value: "lb50", label: "50 lb bags", kg: 50 * KG_PER_LB },
    { value: "cf2", label: "2 ft³ bags", m3: 2 * CU_FT },
    { value: "yd1", label: "Cubic yards (bulk)", m3: CU_YD },
  ],
};

export function GravelMulchCalculator() {
  const { params, setParams, imperial, si, unit, setUnits } = useUnitTool(
    { units: "metric", material: "gravel", length: "5", width: "4", depth: "5", bag: "kg25" },
    { length: "len", width: "len", depth: "cm" },
    (to) => ({ bag: to === "imperial" ? "lb50" : "kg25" })
  );
  const material = MATERIALS[params.material] ?? MATERIALS.gravel;
  const area = si("length") * si("width");
  const volume = coverVolume(area, si("depth") / 100);
  const tonnes = volume * material.density;
  const bag = BAG_OPTIONS[imperial ? "imperial" : "metric"].find((b) => b.value === params.bag) ?? BAG_OPTIONS.metric[0];
  const bags = bag.kg ? Math.ceil((tonnes * 1000) / bag.kg - 1e-9) : Math.ceil(volume / bag.m3! - 1e-9);
  const ok = volume > 0;

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <FieldGrid>
            <SelectField label="Units" value={params.units} onChange={setUnits} options={UNIT_OPTIONS} />
            <SelectField
              label="Material"
              value={params.material}
              onChange={(v) => setParams({ material: v })}
              options={Object.entries(MATERIALS).map(([value, m]) => ({ value, label: m.label }))}
            />
          </FieldGrid>
          <FieldGrid cols={3}>
            <NumberField label="Length" value={params.length} onChange={(v) => setParams({ length: v })} suffix={unit("len")} />
            <NumberField label="Width" value={params.width} onChange={(v) => setParams({ width: v })} suffix={unit("len")} />
            <NumberField label="Depth" value={params.depth} onChange={(v) => setParams({ depth: v })} suffix={unit("cm")} />
          </FieldGrid>
          <SelectField label="Sold as" value={params.bag} onChange={(v) => setParams({ bag: v })} options={BAG_OPTIONS[imperial ? "imperial" : "metric"]} />
          <Verdict tone="neutral">
            Typical depths: {imperial ? "2 in" : "5 cm"} for gravel paths and driveway top-ups, {imperial ? "3 in" : "7.5 cm"} for
            mulch to keep weeds down, {imperial ? "4–6 in" : "10–15 cm"} of topsoil for new lawns and beds.
          </Verdict>
        </div>
      }
      results={
        !ok ? (
          <Verdict tone="neutral">Enter the area and depth to cover.</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero label={bag.label} value={fmtNum(bags)} sub={`${material.label}, ${imperial ? `${fmtNum(volume / CU_YD, 2)} yd³` : `${fmtNum(volume, 2)} m³`}`} />
            <div>
              <StatRow label="Volume" value={imperial ? `${fmtNum(volume / CU_FT, 1)} ft³` : `${fmtNum(volume, 2)} m³`} />
              <StatRow
                label="Approximate weight"
                value={imperial ? `${fmtNum((tonnes * 1000) / KG_PER_LB / 2000, 2)} US tons` : `${fmtNum(tonnes, 2)} tonnes`}
                emphasis
              />
              <StatRow label="Area covered" value={fmtArea(area, imperial)} />
            </div>
            <Verdict tone="neutral">
              Weight uses {material.density} tonnes per m³ for {material.label.toLowerCase()}. Wet material is heavier,
              so check what a delivery truck or trailer can carry.
            </Verdict>
          </div>
        )
      }
    />
  );
}
