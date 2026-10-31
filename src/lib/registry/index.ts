import { TOOLS } from "./tools";
import { DOMAINS, LIVE_DOMAINS, PLANNED_TOOLS, domainBySlug } from "./domains";
import { PROFESSIONS, professionBySlug } from "./professions";
import type { DomainSlug, Route, Tool } from "./types";

export { TOOLS, DOMAINS, LIVE_DOMAINS, PLANNED_TOOLS, PROFESSIONS, domainBySlug, professionBySlug };

export const toolBySlug = (slug: string): Tool | undefined =>
  TOOLS.find((t) => t.slug === slug);

export const toolsByDomain = (slug: DomainSlug): Tool[] =>
  TOOLS.filter((t) => t.domain === slug);

export const LIVE_TOOLS = TOOLS;

export const popularTools = (): Tool[] => TOOLS.filter((t) => t.popular);

export const recentTools = (n = 6): Tool[] => TOOLS.slice(-n);

/**
 * Related tools: sibling tools in the same domain first, then tools sharing
 * tags across domains (the cross-listing behaviour in build plan §2.3).
 */
export function relatedTools(tool: Tool, n = 6): Tool[] {
  const scored = TOOLS.filter((t) => t.slug !== tool.slug).map((t) => {
    let score = 0;
    if (t.domain === tool.domain) score += 2;
    const shared = t.tags.filter((tag) => tool.tags.includes(tag)).length;
    score += shared * 1.5;
    if (t.category === tool.category) score += 1;
    if (t.popular) score += 0.25;
    return { t, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, n).map((s) => s.t);
}

/** Search over live tools, domains and professions (the hero search). */
export function searchRegistry(query: string): Tool[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/);
  const scored = TOOLS.map((t) => {
    const haystack = [
      t.name,
      t.tagline,
      t.description,
      t.category,
      domainBySlug(t.domain)?.name ?? "",
      ...t.tags,
    ]
      .join(" ")
      .toLowerCase();
    let score = 0;
    for (const w of words) {
      if (t.name.toLowerCase().includes(w)) score += 3;
      if (t.tags.some((tag) => tag.toLowerCase().includes(w))) score += 2;
      if (haystack.includes(w)) score += 1;
    }
    return { t, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || (b.t.popular ? 1 : 0) - (a.t.popular ? 1 : 0))
    .map((s) => s.t);
}

export const categoriesByDomain = (slug: DomainSlug): string[] =>
  [...new Set(toolsByDomain(slug).map((t) => t.category))];

/** Parse a hash route: #/finance/roas-calculator, #/professions/marketer … */
export function parseRoute(hash: string): Route {
  const path = hash.replace(/^#/, "").replace(/^\/+|\/+$/g, "");
  if (!path) return { kind: "home" };
  const parts = path.split("/");
  if (parts[0] === "professions" && parts[1]) {
    const p = professionBySlug(parts[1]);
    if (p) return { kind: "profession", profession: p.slug };
    return { kind: "notfound", path };
  }
  const domain = domainBySlug(parts[0] ?? "");
  if (domain) {
    if (parts[1]) {
      const tool = toolBySlug(parts[1]);
      if (tool && tool.domain === domain.slug)
        return { kind: "tool", domain: domain.slug, tool: tool.slug };
      return { kind: "notfound", path };
    }
    return { kind: "domain", domain: domain.slug };
  }
  // Fallback: direct tool slug (e.g. #/roas-calculator)
  const directTool = toolBySlug(parts[0] ?? "");
  if (directTool) {
    return { kind: "tool", domain: directTool.domain, tool: directTool.slug };
  }
  return { kind: "notfound", path };
}

export const routeToPath = (r: Route): string => {
  switch (r.kind) {
    case "home":
      return "/";
    case "domain":
      return `/${r.domain}`;
    case "tool":
      return `/${r.domain}/${r.tool}`;
    case "profession":
      return `/professions/${r.profession}`;
    default:
      return "/";
  }
};

export const routeToHash = (r: Route): string => {
  switch (r.kind) {
    case "home":
      return "#/";
    case "domain":
      return `#/${r.domain}`;
    case "tool":
      return `#/${r.domain}/${r.tool}`;
    case "profession":
      return `#/professions/${r.profession}`;
    default:
      return "#/";
  }
};
