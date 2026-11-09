import { describe, expect, test } from "bun:test";
import { percentDifference } from "@/lib/math";

describe("percentDifference", () => {
  test("measures against the average", () => {
    expect(percentDifference(120, 150)).toBeCloseTo(22.2222, 3);
  });
  test("is the same in both directions", () => {
    expect(percentDifference(150, 120)).toBe(percentDifference(120, 150));
  });
  test("equal values and two zeros are 0%", () => {
    expect(percentDifference(5, 5)).toBe(0);
    expect(percentDifference(0, 0)).toBe(0);
  });
  test("tops out at 200%", () => {
    expect(percentDifference(0, 10)).toBe(200);
    expect(percentDifference(-5, 5)).toBe(200);
  });
  test("rejects anything that isn't a number", () => {
    expect(percentDifference(NaN, 1)).toBeNull();
    expect(percentDifference(1, Infinity)).toBeNull();
  });
});
