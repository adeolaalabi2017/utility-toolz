/**
 * Domain accent system — adapted from the Larkfield design language.
 * The reference site rotates a fixed set of six vivid accents over cream
 * surfaces (stat cards, example cards). Each ToolDeck domain gets one so
 * icon chips, cards and highlights stay consistent site-wide.
 *
 * Class strings are literal so Tailwind's compiler can see them.
 */
export type DomainAccent = {
  /** hex of the accent */
  hex: string;
  /** deep text-safe variant (contrast on cream) */
  deep: string;
  /** solid chip: accent background + warm cream text */
  chip: string;
  /** soft chip: accent wash background + deep accent text */
  soft: string;
  /** decorative dot/bar */
  dot: string;
};

const A = {
  green: {
    hex: "#308f68",
    deep: "#1f5f45",
    chip: "bg-[#308f68] text-[#fef5de]",
    soft: "bg-[#308f68]/15 text-deep-green",
    dot: "bg-[#308f68]",
  },
  purple: {
    hex: "#6b5faf",
    deep: "#3f346f",
    chip: "bg-[#6b5faf] text-[#fef5de]",
    soft: "bg-[#6b5faf]/15 text-deep-purple",
    dot: "bg-[#6b5faf]",
  },
  coral: {
    hex: "#cf4f43",
    deep: "#a83a30",
    chip: "bg-[#cf4f43] text-[#fef5de]",
    soft: "bg-[#cf4f43]/15 text-deep-coral",
    dot: "bg-[#cf4f43]",
  },
  orange: {
    hex: "#e07a3c",
    deep: "#a4502c",
    chip: "bg-[#e07a3c] text-[#1f4a3f]",
    soft: "bg-[#e07a3c]/15 text-deep-orange",
    dot: "bg-[#e07a3c]",
  },
  pink: {
    hex: "#d1548a",
    deep: "#a83a67",
    chip: "bg-[#d1548a] text-[#fef5de]",
    soft: "bg-[#d1548a]/15 text-deep-pink",
    dot: "bg-[#d1548a]",
  },
  rust: {
    hex: "#c9603c",
    deep: "#9c4726",
    chip: "bg-[#c9603c] text-[#fef5de]",
    soft: "bg-[#c9603c]/15 text-deep-rust",
    dot: "bg-[#c9603c]",
  },
} satisfies Record<string, DomainAccent>;

export const DOMAIN_ACCENTS: Record<string, DomainAccent> = {
  finance: A.green,
  marketing: A.purple,
  advertising: A.coral,
  business: A.orange,
  seo: A.pink,
  content: A.rust,
  design: A.green,
  data: A.purple,
  developer: A.coral,
  productivity: A.orange,
  education: A.pink,
  everyday: A.rust,
  health: A.green,
  math: A.purple,
  files: A.coral,
};

export function domainAccent(slug: string): DomainAccent {
  return DOMAIN_ACCENTS[slug] ?? A.green;
}
