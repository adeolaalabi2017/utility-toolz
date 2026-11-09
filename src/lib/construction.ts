/**
 * Material estimates for the Construction & DIY tools. Everything works in
 * SI units (metres, square metres, cubic metres, litres, kilograms); the
 * components convert imperial inputs on the way in and out.
 */

export const FT = 0.3048;
export const IN = 0.0254;
export const SQ_FT = FT * FT;
export const CU_FT = FT ** 3;
export const CU_YD = 27 * CU_FT;
export const L_PER_US_GAL = 3.785411784;
export const KG_PER_LB = 0.45359237;

export type UnitSystem = "metric" | "imperial";

/* ------------------------------------------------------------------ */
/* Paint                                                               */
/* ------------------------------------------------------------------ */

/** Paintable wall area: the room's perimeter times its height, minus doors and windows. */
export function wallArea(length: number, width: number, height: number, openings: number): number {
  return Math.max(0, 2 * (length + width) * height - openings);
}

/** Litres of paint for an area, number of coats and coverage in m² per litre. */
export const paintLitres = (area: number, coats: number, coverage: number) => (coverage > 0 ? (area * coats) / coverage : NaN);

/**
 * Larger tins cost less per litre. Retail prices for 1 / 2.5 / 5 litre tins
 * and US quarts / gallons both track size^0.65 closely, so that stands in for
 * price when no prices are given.
 */
const tinCost = (size: number) => size ** 0.65;

/** Past this many of the largest tin the search is cut short, because only the remainder changes the mix. */
const SEARCH_WINDOW_TINS = 20;
const MAX_TIN_NEED = 1e9;

/**
 * The likely cheapest mix of tin sizes that covers what's needed, by the cost
 * model above; on a tie, the mix with less paint left over. Sizes are in the
 * same unit as need.
 */
export function bestTins(need: number, sizes: number[]): { counts: number[]; total: number } | null {
  if (!Number.isFinite(need) || need < 0 || need > MAX_TIN_NEED || sizes.length === 0) return null;
  const sorted = [...sizes].sort((a, b) => b - a);
  // The largest tin is the cheapest per unit, so a big job is mostly those tins.
  // Take them up front; the exhaustive search below gets slow very quickly.
  const bulk = Math.max(0, Math.ceil(need / sorted[0] - SEARCH_WINDOW_TINS));
  const remainder = need - bulk * sorted[0];
  let best: { counts: number[]; total: number; cost: number } | null = null;
  const search = (i: number, counts: number[], total: number, cost: number) => {
    if (i === sorted.length) {
      if (total + 1e-9 < remainder) return;
      if (!best || cost < best.cost - 1e-9 || (Math.abs(cost - best.cost) < 1e-9 && total < best.total)) {
        best = { counts: [...counts], total, cost };
      }
      return;
    }
    const max = Math.ceil(Math.max(0, remainder - total) / sorted[i] - 1e-9) + (i === sorted.length - 1 ? 0 : 1);
    for (let n = 0; n <= max; n++) search(i + 1, [...counts, n], total + n * sorted[i], cost + n * tinCost(sorted[i]));
  };
  search(0, [], 0, 0);
  const found = best as { counts: number[]; total: number } | null;
  if (!found) return null;
  found.counts[0] += bulk;
  // Report counts in the caller's order of sizes.
  return { counts: sizes.map((s) => found.counts[sorted.indexOf(s)]), total: found.total + bulk * sorted[0] };
}

/* ------------------------------------------------------------------ */
/* Tile and flooring                                                   */
/* ------------------------------------------------------------------ */

/** Tiles for an area: each tile plus its grout joint takes (w + j) × (h + j), then waste is added. */
export function tileCount(area: number, tileW: number, tileH: number, joint: number, wastePct: number): number {
  const each = (tileW + joint) * (tileH + joint);
  if (!(each > 0) || !(area > 0)) return 0;
  return Math.ceil((area * (1 + wastePct / 100)) / each - 1e-9);
}

/** Area to buy with waste added, and the packs that covers. */
export function packsFor(area: number, wastePct: number, perPack: number): { buy: number; packs: number } {
  const buy = area * (1 + wastePct / 100);
  return { buy, packs: perPack > 0 ? Math.ceil(buy / perPack - 1e-9) : NaN };
}

/* ------------------------------------------------------------------ */
/* Concrete                                                            */
/* ------------------------------------------------------------------ */

/** Ready-mix weighs about 2,100 kg per cubic metre once mixed with water, the figure bag yields are based on. */
export const CONCRETE_KG_PER_M3 = 2100;

export function slabVolume(length: number, width: number, thickness: number): number {
  return length * width * thickness;
}

export function cylinderVolume(diameter: number, height: number): number {
  return Math.PI * (diameter / 2) ** 2 * height;
}

/** Bags of premix for a volume; the yield of each bag follows from its weight. */
export function concreteBags(volume: number, bagKg: number, wastePct: number): number {
  if (!(bagKg > 0)) return NaN;
  return Math.ceil((volume * (1 + wastePct / 100) * CONCRETE_KG_PER_M3) / bagKg - 1e-9);
}

/* ------------------------------------------------------------------ */
/* Roofing                                                             */
/* ------------------------------------------------------------------ */

/** How much longer a sloped rafter is than its flat run, for a pitch of rise in 12. */
export const pitchFactor = (risePer12: number) => Math.sqrt(1 + (risePer12 / 12) ** 2);

export const pitchDegrees = (risePer12: number) => (Math.atan(risePer12 / 12) * 180) / Math.PI;

/** Roof surface from its footprint (overhangs included) and pitch. */
export const roofArea = (footprint: number, risePer12: number) => footprint * pitchFactor(risePer12);

/** A roofing "square" is 100 square feet; standard shingles come three bundles to the square. */
export function shingleBundles(roofAreaM2: number, wastePct: number, bundlesPerSquare = 3): { squares: number; bundles: number } {
  const squares = (roofAreaM2 * (1 + wastePct / 100)) / (100 * SQ_FT);
  return { squares, bundles: Math.ceil(squares * bundlesPerSquare - 1e-9) };
}

/* ------------------------------------------------------------------ */
/* Wallpaper                                                           */
/* ------------------------------------------------------------------ */

/**
 * Rolls for the walls. Each drop is the wall height plus one pattern repeat
 * (so patterns can be lined up), a roll gives as many whole drops as fit its
 * length, and the room needs one drop per roll-width of wall.
 */
export function wallpaperRolls(o: {
  wallWidth: number;
  height: number;
  rollWidth: number;
  rollLength: number;
  repeat: number;
}): { drops: number; dropsPerRoll: number; rolls: number } {
  const drops = Math.ceil(o.wallWidth / o.rollWidth - 1e-9);
  const dropsPerRoll = Math.floor(o.rollLength / (o.height + o.repeat) + 1e-9);
  return { drops, dropsPerRoll, rolls: dropsPerRoll > 0 ? Math.ceil(drops / dropsPerRoll) : NaN };
}

/* ------------------------------------------------------------------ */
/* Landscaping materials                                               */
/* ------------------------------------------------------------------ */

/** Typical loose bulk densities in tonnes per cubic metre. Real loads vary with moisture. */
export const MATERIALS: Record<string, { label: string; density: number }> = {
  gravel: { label: "Gravel", density: 1.6 },
  crushed: { label: "Crushed stone", density: 1.5 },
  sand: { label: "Sand", density: 1.55 },
  topsoil: { label: "Topsoil", density: 1.3 },
  mulch: { label: "Bark mulch", density: 0.35 },
};

export const coverVolume = (area: number, depth: number) => area * depth;
