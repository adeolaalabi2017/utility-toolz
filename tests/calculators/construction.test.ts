import { describe, expect, test } from "bun:test";
import {
  CU_YD,
  FT,
  IN,
  SQ_FT,
  bestTins,
  concreteBags,
  coverVolume,
  cylinderVolume,
  packsFor,
  paintLitres,
  pitchDegrees,
  pitchFactor,
  roofArea,
  shingleBundles,
  slabVolume,
  tileCount,
  wallArea,
  wallpaperRolls,
} from "@/lib/construction";

describe("Paint", () => {
  test("wall area subtracts openings and never goes negative", () => {
    expect(wallArea(4, 3.5, 2.4, 3.5)).toBeCloseTo(32.5);
    expect(wallArea(1, 1, 1, 50)).toBe(0);
  });

  test("litres from coats and coverage", () => {
    expect(paintLitres(32.5, 2, 10)).toBeCloseTo(6.5);
    expect(Number.isNaN(paintLitres(10, 2, 0))).toBe(true);
  });

  test("tin mix favours bigger, cheaper-per-litre tins", () => {
    expect(bestTins(6.5, [5, 2.5, 1])).toEqual({ counts: [1, 1, 0], total: 7.5 });
    expect(bestTins(5.6, [5, 2.5, 1])).toEqual({ counts: [1, 0, 1], total: 6 });
    expect(bestTins(7.4, [5, 2.5, 1])).toEqual({ counts: [1, 1, 0], total: 7.5 });
    expect(bestTins(10, [5, 2.5, 1])).toEqual({ counts: [2, 0, 0], total: 10 });
    expect(bestTins(0.3, [5, 2.5, 1])).toEqual({ counts: [0, 0, 1], total: 1 });
    // US sizes: two gallons cost less than a gallon and three quarts.
    expect(bestTins(1.6, [1, 0.25])).toEqual({ counts: [2, 0], total: 2 });
    expect(bestTins(1.2, [1, 0.25])).toEqual({ counts: [1, 1], total: 1.25 });
  });
});

describe("Tile and flooring", () => {
  test("counts tiles with the grout joint and waste", () => {
    // 3 m × 2.5 m with 30 × 60 cm tiles, 3 mm joints, 10% waste.
    expect(tileCount(7.5, 0.3, 0.6, 0.003, 10)).toBe(46);
    expect(tileCount(1, 0.5, 0.5, 0, 0)).toBe(4);
    expect(tileCount(0, 0.3, 0.3, 0, 10)).toBe(0);
  });

  test("packs round up after waste", () => {
    expect(packsFor(20, 10, 2.2).buy).toBeCloseTo(22);
    expect(packsFor(20, 10, 2.2).packs).toBe(10);
    expect(packsFor(19.8, 0, 2.2).packs).toBe(9);
  });
});

describe("Concrete", () => {
  test("volumes and bag counts", () => {
    expect(slabVolume(3, 3, 0.1)).toBeCloseTo(0.9);
    expect(cylinderVolume(0.3, 1)).toBeCloseTo(0.0707, 4);
    // 0.9 m³ + 10% at 2,100 kg/m³ in 25 kg bags.
    expect(concreteBags(0.9, 25, 10)).toBe(84);
    // A US 80 lb bag yields about 0.6 ft³, the figure printed on the bag.
    expect((80 * 0.45359237) / 2100 / FT ** 3).toBeCloseTo(0.61, 2);
    expect(slabVolume(10 * FT, 10 * FT, 4 * IN) / CU_YD).toBeCloseTo(1.235, 3);
  });
});

describe("Roofing", () => {
  test("pitch factor and angle", () => {
    expect(pitchFactor(0)).toBe(1);
    expect(pitchFactor(12)).toBeCloseTo(Math.SQRT2);
    expect(pitchDegrees(6)).toBeCloseTo(26.57, 2);
  });

  test("squares and bundles", () => {
    const area = roofArea(1500 * SQ_FT, 6);
    expect(area / SQ_FT).toBeCloseTo(1677.05, 1);
    const { squares, bundles } = shingleBundles(area, 10);
    expect(squares).toBeCloseTo(18.45, 2);
    expect(bundles).toBe(56);
  });
});

describe("Wallpaper", () => {
  test("drops per roll account for the pattern repeat", () => {
    const r = wallpaperRolls({ wallWidth: 14, height: 2.4, rollWidth: 0.53, rollLength: 10.05, repeat: 0.53 });
    expect(r).toEqual({ drops: 27, dropsPerRoll: 3, rolls: 9 });
    expect(wallpaperRolls({ wallWidth: 14, height: 2.4, rollWidth: 0.53, rollLength: 10.05, repeat: 0 }).dropsPerRoll).toBe(4);
  });
});

describe("Landscaping", () => {
  test("cover volume", () => {
    expect(coverVolume(20, 0.05)).toBeCloseTo(1);
  });
});
