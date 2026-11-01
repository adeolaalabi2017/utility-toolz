import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { TOOLS } from "@/lib/registry";
import { TOOL_CONTENT } from "@/lib/registry/tool-content";

// The widget map is a client module built on next/dynamic, so read its keys
// from source rather than importing it into the test runner.
const componentSource = readFileSync(
  join(import.meta.dir, "../src/lib/registry/tool-components.tsx"),
  "utf8"
);
const componentSlugs = [...componentSource.matchAll(/^ {2}"([^"]+)": dynamic\(/gm)].map((m) => m[1]);

describe("Tool registry", () => {
  test("every tool has a widget", () => {
    const missing = TOOLS.map((t) => t.slug).filter((slug) => !componentSlugs.includes(slug));
    expect(missing).toEqual([]);
  });

  test("every widget belongs to a tool", () => {
    const slugs = new Set(TOOLS.map((t) => t.slug));
    expect(componentSlugs.filter((slug) => !slugs.has(slug))).toEqual([]);
  });

  test("every tool has page content", () => {
    const thin = TOOLS.filter((t) => {
      const c = TOOL_CONTENT[t.slug];
      return !c || c.howItWorks.length === 0 || !c.example || c.faqs.length === 0;
    });
    expect(thin.map((t) => t.slug)).toEqual([]);
  });

  // Importing the copy from a client component would put every tool's text
  // back into the shared bundle that this split exists to keep small.
  test("tool copy is never imported by a client component", () => {
    const src = join(import.meta.dir, "../src");
    const offenders = readdirSync(src, { recursive: true, encoding: "utf8" })
      .filter((f) => /\.tsx?$/.test(f))
      .filter((f) => {
        const code = readFileSync(join(src, f), "utf8");
        return /^["']use client["']/.test(code) && code.includes("registry/tool-content");
      });
    expect(offenders).toEqual([]);
  });
});
