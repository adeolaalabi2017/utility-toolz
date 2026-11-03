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
  HeartPulse,
  Sigma,
  FileArchive,
  Hammer,
} from "lucide-react";
import type { Domain, DomainSlug, PlannedTool } from "./types";

/**
 * The live domains (build plan §2.1), plus Health & Body, Math, Files and Construction added later.
 * Every domain listed here is live; the planned roadmap is kept in PLANNED_TOOLS.
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
      "Grades, GPA, exam targets and citations — study tools for students, teachers and researchers.",
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
  {
    slug: "health",
    name: "Health & Body",
    shortName: "Health",
    description:
      "Body metrics, calorie needs, pregnancy dates and heart-rate zones, with the limits of each estimate stated.",
    icon: HeartPulse,
    status: "live",
    phase: 5,
  },
  {
    slug: "math",
    name: "Math",
    shortName: "Math",
    description:
      "Calculators, fractions, ratios, equations, primes and shapes — the arithmetic, algebra and geometry behind homework and everyday sums.",
    icon: Sigma,
    status: "live",
    phase: 5,
  },
  {
    slug: "files",
    name: "Files & Documents",
    shortName: "Files",
    description:
      "Merge, split and convert PDFs, convert spreadsheets, and pack or unpack ZIP and TAR archives, all in your browser with nothing uploaded.",
    icon: FileArchive,
    status: "live",
    phase: 5,
  },
  {
    slug: "construction",
    name: "Construction & DIY",
    shortName: "Construction",
    description:
      "Paint, tiles, flooring, concrete, roofing and landscaping — how much to buy for the job, in metric or imperial.",
    icon: Hammer,
    status: "live",
    phase: 5,
  },
];

export const domainBySlug = (slug: string): Domain | undefined =>
  DOMAINS.find((d) => d.slug === slug);

export const LIVE_DOMAINS = DOMAINS.filter((d) => d.status === "live");

/**
 * The build-plan roadmap from Appendix A is fully shipped. The list is
 * kept (empty) so hub "next up" and
 * profession "coming for you" sections keep compiling — future batches of
 * the catalogue would be appended here before their tools go live.
 */
export const PLANNED_TOOLS: PlannedTool[] = [];
