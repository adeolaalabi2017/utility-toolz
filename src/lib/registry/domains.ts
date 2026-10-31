import {
  Landmark,
  TrendingUp,
  Megaphone,
  Briefcase,
  Search,
  PenLine,
  Palette,
  BarChart3,
  Code2,
  Timer,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import type { Domain, DomainSlug, PlannedTool } from "./types";

/**
 * The twelve professional domains (build plan §2.1).
 * All twelve are live — the full 78-tool catalogue from Appendix A of the
 * build plan shipped through Phase 4 of the roadmap.
 */
export const DOMAINS: Domain[] = [
  {
    slug: "finance",
    name: "Finance & Accounting",
    shortName: "Finance",
    description:
      "Budgets, loans, interest, tax and profitability — the calculators accountants and business owners reach for every week.",
    icon: Landmark,
    status: "live",
    phase: 1,
  },
  {
    slug: "marketing",
    name: "Marketing & Growth",
    shortName: "Marketing",
    description:
      "ROI, funnels, conversion and customer value — measure every campaign against the money it actually makes.",
    icon: TrendingUp,
    status: "live",
    phase: 1,
  },
  {
    slug: "advertising",
    name: "Advertising & Media Buying",
    shortName: "Advertising",
    description:
      "CPC, CPM, CTR and ROAS — plan, buy and audit paid media across Google, Meta and every other channel.",
    icon: Megaphone,
    status: "live",
    phase: 1,
  },
  {
    slug: "business",
    name: "Business & E-commerce",
    shortName: "Business",
    description:
      "Margins, pricing, break-even and sales operations — the commercial math behind a healthy store or service business.",
    icon: Briefcase,
    status: "live",
    phase: 2,
  },
  {
    slug: "seo",
    name: "SEO & Website Management",
    shortName: "SEO",
    description:
      "Meta tags, schema, sitemaps and slugs — ship search-ready pages without touching a plugin.",
    icon: Search,
    status: "live",
    phase: 3,
  },
  {
    slug: "content",
    name: "Content & Writing",
    shortName: "Content",
    description:
      "Word counts, readability, headlines and text cleanup — write faster and format everything correctly.",
    icon: PenLine,
    status: "live",
    phase: 3,
  },
  {
    slug: "design",
    name: "Design & Creative",
    shortName: "Design",
    description:
      "Images, colours, aspect ratios and formats — prepare assets for web, print and social in seconds.",
    icon: Palette,
    status: "live",
    phase: 3,
  },
  {
    slug: "data",
    name: "Data & Analytics",
    shortName: "Data",
    description:
      "Percentages, averages, conversions and quick CSV/JSON wrangling — make sense of messy numbers fast.",
    icon: BarChart3,
    status: "live",
    phase: 3,
  },
  {
    slug: "developer",
    name: "Developer & Technology",
    shortName: "Developer",
    description:
      "Formatters, encoders, testers and generators — the small utilities every developer keeps bookmarked.",
    icon: Code2,
    status: "live",
    phase: 3,
  },
  {
    slug: "productivity",
    name: "Productivity & Project Management",
    shortName: "Productivity",
    description:
      "Timers, deadlines, working days and project costs — plan the work and the time it really takes.",
    icon: Timer,
    status: "live",
    phase: 4,
  },
  {
    slug: "education",
    name: "Education & Research",
    shortName: "Education",
    description:
      "Grades, GPA, percentages and citations — study tools for students, teachers and researchers.",
    icon: GraduationCap,
    status: "live",
    phase: 4,
  },
  {
    slug: "everyday",
    name: "Everyday Utilities",
    shortName: "Everyday",
    description:
      "Ages, dates, units and temperatures — the everyday conversions everyone needs once a week.",
    icon: Sparkles,
    status: "live",
    phase: 4,
  },
];

export const domainBySlug = (slug: string): Domain | undefined =>
  DOMAINS.find((d) => d.slug === slug);

export const LIVE_DOMAINS = DOMAINS.filter((d) => d.status === "live");

/**
 * The build-plan roadmap from Appendix A is fully shipped: Phases 1-4
 * delivered all 78 tools. The list is kept (empty) so hub "next up" and
 * profession "coming for you" sections keep compiling — future batches of
 * the catalogue would be appended here before their tools go live.
 */
export const PLANNED_TOOLS: PlannedTool[] = [];
