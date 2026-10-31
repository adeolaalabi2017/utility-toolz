import type { Tool } from "./types";
import {
  BudgetCalculator,
  LoanMortgageCalculator,
  CompoundInterestCalculator,
  IncomeTaxCalculator,
  VATCalculator,
  ProfitLossCalculator,
  CurrencyConverter,
  DebtRepaymentCalculator,
} from "@/components/tools/finance";
import {
  MarketingROICalculator,
  CampaignPerformanceCalculator,
  CACCalculator,
  ConversionRateCalculator,
  MarketingBudgetPlanner,
  FunnelCalculator,
  ABTestSignificanceCalculator,
  LTVCalculator,
} from "@/components/tools/marketing";
import {
  CPCCalculator,
  CPMCalculator,
  CTRCalculator,
  ROASCalculator,
  AdBudgetCalculator,
  ImpressionEstimator,
  ReachFrequencyCalculator,
  MediaPlanningCalculator,
} from "@/components/tools/advertising";
import {
  ProfitMarginCalculator,
  MarkupCalculator,
  BreakEvenCalculator,
  PricingCalculator,
  DiscountCalculator,
  SalesCommissionCalculator,
  ShippingCostCalculator,
  InvoiceGenerator,
} from "@/components/tools/business";
import {
  MetaTitleGenerator,
  MetaDescriptionGenerator,
  SerpSnippetPreview,
  KeywordDensityChecker,
  RobotsTxtGenerator,
  XmlSitemapGenerator,
  UrlSlugGenerator,
  SchemaMarkupGenerator,
} from "@/components/tools/seo";
import {
  WordCounter,
  CharacterCounter,
  ReadingTimeCalculator,
  TextCaseConverter,
  LoremIpsumGenerator,
  HeadlineAnalyser,
} from "@/components/tools/content";
import {
  ImageCompressor,
  ImageResizer,
  ImageCropper,
  ColourPaletteGenerator,
  HexRgbConverter,
  AspectRatioCalculator,
} from "@/components/tools/design";
import {
  PercentageChangeCalculator,
  DataFormatConverter,
  CsvViewer,
  JsonToCsvConverter,
  AverageCalculator,
  StandardDeviationCalculator,
} from "@/components/tools/data";
import {
  JsonFormatter,
  RegexTester,
  Base64EncoderDecoder,
  UrlEncoderDecoder,
  UuidGenerator,
  HashGenerator,
} from "@/components/tools/developer";
import {
  PomodoroTimer,
  MeetingCostCalculator,
  WorkingDaysCalculator,
  ProjectCostCalculator,
  DeadlineCalculator,
  TimeZoneConverter,
} from "@/components/tools/productivity";
import {
  GpaCalculator,
  GradeCalculator,
  PercentageCalculator,
  CitationFormatter,
} from "@/components/tools/education";
import {
  AgeCalculator,
  DateCalculator,
  UnitConverter,
  TemperatureConverter,
} from "@/components/tools/everyday";
import { ContrastChecker } from "@/components/tools/contrast-checker";
import { DiffChecker } from "@/components/tools/diff-checker";
import { PasswordGenerator } from "@/components/tools/password-generator";
import { JwtDecoder } from "@/components/tools/jwt-decoder";
import { CronBuilder } from "@/components/tools/cron-builder";
import { CurlToCode } from "@/components/tools/curl-to-code";
import { TimestampConverter } from "@/components/tools/timestamp-converter";
import { BoxShadowGenerator } from "@/components/tools/box-shadow-generator";
import { SvgToCss } from "@/components/tools/svg-to-css";
import { ClampCalculator } from "@/components/tools/clamp-calculator";
import { FaviconGenerator } from "@/components/tools/favicon-generator";
import { FreelanceRateCalculator } from "@/components/tools/freelance-rate-calculator";
import { MrrChurnCalculator } from "@/components/tools/mrr-churn-calculator";
import { CashRunwayCalculator } from "@/components/tools/cash-runway-calculator";
import { DepreciationCalculator } from "@/components/tools/depreciation-calculator";
import { UtmBuilder } from "@/components/tools/utm-builder";
import { CtorCalculator } from "@/components/tools/ctor-calculator";
import { ViralCoefficientCalculator } from "@/components/tools/viral-coefficient-calculator";
import { TargetCpaCalculator } from "@/components/tools/target-cpa-calculator";
import { VideoCompletionCalculator } from "@/components/tools/video-completion-calculator";
import { AdFatigueEstimator } from "@/components/tools/ad-fatigue-estimator";
import { UnitEconomicsCalculator } from "@/components/tools/unit-economics-calculator";
import { InventoryTurnoverCalculator } from "@/components/tools/inventory-turnover-calculator";
import { NpsCalculator } from "@/components/tools/nps-calculator";
import { SocialSharePreview } from "@/components/tools/social-share-preview";
import { HreflangGenerator } from "@/components/tools/hreflang-generator";
import { RedirectGenerator } from "@/components/tools/redirect-generator";
import { ReadabilityAnalyzer } from "@/components/tools/readability-analyzer";
import { MarkdownConverter } from "@/components/tools/markdown-converter";
import { FilenameSanitizer } from "@/components/tools/filename-sanitizer";
import { SampleSizeCalculator } from "@/components/tools/sample-size-calculator";
import { CorrelationCalculator } from "@/components/tools/correlation-calculator";
import { DataDeduplicator } from "@/components/tools/data-deduplicator";
import { SprintCapacityPlanner } from "@/components/tools/sprint-capacity-planner";
import { TimesheetCalculator } from "@/components/tools/timesheet-calculator";
import { PriorityMatrix } from "@/components/tools/priority-matrix";
import { FinalExamCalculator } from "@/components/tools/final-exam-calculator";
import { SigFigCalculator } from "@/components/tools/sig-fig-calculator";
import { TipSplitter } from "@/components/tools/tip-splitter";
import { FuelCostCalculator } from "@/components/tools/fuel-cost-calculator";
import { CountdownTimer } from "@/components/tools/countdown-timer";


/**
 * The complete catalogue: all 78 tools across twelve domains, matching
 * Appendix A of the build plan (Finance 8 · Marketing 8 · Advertising 8 ·
 * Business 8 · SEO 8 · Content 6 · Design 6 · Data 6 · Developer 6 ·
 * Productivity 6 · Education 4 · Everyday 4). Every entry carries the
 * full tool-page template content so each URL is a complete, unique page —
 * never a bare widget.
 */
export const TOOLS: Tool[] = [
  /* ---------------------------- FINANCE ---------------------------- */
  {
    slug: "budget-expense-calculator",
    name: "Budget & Expense Calculator",
    domain: "finance",
    category: "Budgeting",
    tagline: "Split your income across needs, wants and savings — and see where the money leaks.",
    description:
      "Enter your monthly income and expenses to see your personal 50/30/20 split, spot overspending and find your leftover cash.",
    tags: ["budget", "expenses", "50/30/20", "personal finance", "savings"],
    popular: true,
    howItWorks: [
      "Your expenses are grouped the way the 50/30/20 rule sees them: needs (housing, utilities, groceries, transport, insurance), wants (dining, entertainment, shopping) and savings or extra debt payments.",
      "Each group is compared against its benchmark — 50% of take-home income for needs, 30% for wants and 20% for savings — with the marker on each bar showing the target.",
      "The leftover figure is what remains unallocated. Positive means you have room to save more; negative means you are funding your lifestyle with debt.",
    ],
    example:
      "On $4,200 take-home, the sample numbers show $2,390 on needs (57%), $590 on wants (14%) and $700 saved (17%) — leaving $520 unallocated. Needs run above the 50% line, so the fastest fix is housing or transport; savings are one transfer of $140 away from hitting 20%.",
    faqs: [
      {
        q: "Should I use take-home or gross income?",
        a: "Take-home (after tax). The 50/30/20 rule works on the money that actually lands in your account, not the headline salary.",
      },
      {
        q: "What counts as a need?",
        a: "Anything you cannot skip without consequences: housing, utilities, basic groceries, transport to work, insurance and minimum debt payments. Restaurants and streaming are wants, even if they feel essential.",
      },
      {
        q: "My percentages are off. What do I fix first?",
        a: "Wants are the easiest to trim, housing is the biggest lever. Cut wants to the 30% line before touching anything that keeps a roof over your head.",
      },
      {
        q: "Are minimum debt payments needs or savings?",
        a: "Minimum payments are needs. Anything you pay above the minimum counts as savings and debt reduction — that is the number the 20% target measures.",
      },
    ],
    component: BudgetCalculator,
  },
  {
    slug: "loan-mortgage-calculator",
    name: "Loan & Mortgage Calculator",
    domain: "finance",
    category: "Loans & Debt",
    tagline: "Your real monthly payment, total interest and what an extra payment saves you.",
    description:
      "Calculate monthly loan and mortgage payments, see the true cost of borrowing, and test how extra payments shorten your loan.",
    tags: ["mortgage", "loan", "amortization", "monthly payment", "interest"],
    popular: true,
    howItWorks: [
      "The monthly payment uses the standard amortization formula: M = P × r ÷ (1 − (1+r)⁻ⁿ), where P is the principal, r the monthly rate and n the number of payments.",
      "Total cost is simply payment × months − principal — that difference is the interest, and it is usually the shock.",
      "Add an extra monthly payment and the calculator re-runs the full amortization schedule to show your new payoff date and interest saved. Extra payments attack principal directly, so every dollar saves you the full rate over the remaining term.",
    ],
    example:
      "A $350,000 mortgage over 30 years at 6.25% costs about $2,155 a month and roughly $426,000 in interest — more than the house costs. Pay an extra $200 a month and the loan is done about 6 years sooner, with roughly $101,000 less interest paid.",
    faqs: [
      {
        q: "Does this include taxes, insurance and PMI?",
        a: "No — it shows principal and interest only, which is the loan itself. Escrow items vary by property and lender, so add them separately when budgeting.",
      },
      {
        q: "Is it worth making extra payments?",
        a: "Compare the loan rate to what your spare cash could earn elsewhere. Paying extra on a 6.25% loan is effectively a guaranteed 6.25% return — hard to beat risk-free.",
      },
      {
        q: "Why is total interest so high on long loans?",
        a: "Early payments are mostly interest because interest is charged on the full remaining balance. Shorter terms or extra payments flip that balance faster.",
      },
      {
        q: "Can I use this for car loans or student loans?",
        a: "Yes. Any fixed-rate, fully amortizing loan works: enter the amount, rate and term regardless of loan type.",
      },
    ],
    component: LoanMortgageCalculator,
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    domain: "finance",
    category: "Investing",
    tagline: "Watch savings snowball — set the rate, the years and let compounding do the work.",
    description:
      "Project the future value of savings or investments with monthly contributions and any compounding frequency.",
    tags: ["compound interest", "investment", "savings", "future value", "growth"],
    popular: true,
    howItWorks: [
      "Interest compounds when earned interest starts earning its own interest. The calculator steps through every month, applying your compounding frequency before adding each contribution.",
      "Compounding frequency matters, but less than people expect: daily versus annual compounding on a 7% rate changes the 20-year result by a few percent. Time and contribution rate matter far more.",
      "The growth share line shows what fraction of your final balance is pure interest — the longer the horizon, the more that share dominates.",
    ],
    example:
      "Start with $10,000, add $300 a month at 7% for 20 years and you contribute $82,000 out of pocket — but the balance lands near $196,700. Roughly $114,700, well over half the total, is interest you never worked for.",
    faqs: [
      {
        q: "What return should I assume?",
        a: "Long-run global equity indexes have averaged around 7% nominal before inflation; savings accounts are lower and steadier. Model a conservative rate you can believe for decades.",
      },
      {
        q: "Does this account for inflation or taxes?",
        a: "No — it shows nominal values. Subtract expected inflation (often 2–3%) from your rate to see purchasing power, and remember investment gains are usually taxable.",
      },
      {
        q: "Why does compounding frequency barely change the result?",
        a: "The differences scale with the rate divided by the number of periods. At typical rates the gap between annual and daily compounding is a rounding error compared with time in the market.",
      },
      {
        q: "Can I model a one-time deposit only?",
        a: "Set the monthly contribution to zero and the calculator reduces to the classic compound interest formula.",
      },
    ],
    component: CompoundInterestCalculator,
  },
  {
    slug: "income-tax-calculator",
    name: "Income Tax Calculator",
    domain: "finance",
    category: "Taxes",
    tagline: "Estimate federal and state income tax, marginal bracket and take-home pay.",
    description:
      "Work through 2025 U.S. federal brackets step by step, add state tax, and see your effective rate and monthly take-home.",
    tags: ["income tax", "tax brackets", "take-home pay", "federal tax", "salary"],
    howItWorks: [
      "The calculator subtracts your deduction from gross income, then walks the taxable amount through each federal bracket in order — every dollar is taxed only at its own bracket's rate.",
      "Because brackets are layered, your effective rate is always below your marginal rate. The table shows exactly which slice of income paid what.",
      "State tax is applied as a simple flat rate on gross income to keep the estimate conservative and easy to reason about.",
    ],
    example:
      "A single filer earning $85,000 with the $15,000 standard deduction has $70,000 taxable. That lands in the 22% marginal bracket but pays roughly $10,300 federal — an effective rate near 12.1%. Add 5% state tax and take-home is about $70,400, or $5,870 a month.",
    faqs: [
      {
        q: "Is this my exact tax bill?",
        a: "No. It is an illustrative estimate using 2025 U.S. federal brackets and standard deductions — it ignores credits, dependants, capital gains and payroll taxes. Use it for planning, not filing.",
      },
      {
        q: "Why is my effective rate lower than my bracket?",
        a: "Only the dollars inside a bracket pay that bracket's rate. A 22% marginal rate applies just to the slice of income above the previous threshold, which pulls the average far below 22%.",
      },
      {
        q: "What are the 2025 standard deductions?",
        a: "The calculator defaults to $15,000 for single filers and $30,000 for married filing jointly. If you itemize, enter your itemized total instead.",
      },
      {
        q: "Does it handle self-employment tax?",
        a: "Not separately. Self-employed readers should treat the result as a floor — add roughly 15.3% of net earnings for Social Security and Medicare.",
      },
    ],
    component: IncomeTaxCalculator,
  },
  {
    slug: "vat-calculator",
    name: "VAT / Sales Tax Calculator",
    domain: "finance",
    category: "Taxes",
    tagline: "Add or remove VAT at any rate — invoices and pricing in one glance.",
    description:
      "Add VAT to a net price or strip it out of a gross price at any rate, with one-tap presets for common rates.",
    tags: ["vat", "sales tax", "invoice", "gross", "net"],
    howItWorks: [
      "Adding VAT multiplies the net amount by (1 + rate). Removing VAT divides the gross amount by (1 + rate) — the step most people get wrong by subtracting the percentage instead.",
      "Because tax is included in the gross figure, removing 20% is not 'minus 20%': $120 gross at 20% VAT contains exactly $20 of tax, netting $100.",
      "Use the presets for the rate you actually charge — the UK's 20%, the EU's range around 21–25%, or US sales tax between 0% and 10%.",
    ],
    example:
      "Invoice a client $1,000 net at 20% VAT and the gross becomes $1,200 with $200 of tax to remit. Reverse it on a $1,200 gross receipt and the same $200 separates cleanly — subtracting 20% directly would wrongly net $960.",
    faqs: [
      {
        q: "Why doesn't removing 20% equal minus 20%?",
        a: "The tax is a share of the net, not of the gross. Gross = net × 1.2, so tax = gross − gross ÷ 1.2. The calculator applies the division for you.",
      },
      {
        q: "Can I use it for US sales tax?",
        a: "Yes — the math is identical. Set the mode to 'Add' and enter your combined state + local rate.",
      },
      {
        q: "Which rate should my invoice use?",
        a: "Your country's standard or reduced rate for that product or service, plus any destination rules for cross-border sales. The presets are starting points, not advice.",
      },
    ],
    component: VATCalculator,
  },
  {
    slug: "profit-loss-calculator",
    name: "Profit & Loss Calculator",
    domain: "finance",
    category: "Business Finance",
    tagline: "From revenue to net profit — margins at every level of the statement.",
    description:
      "Turn revenue, COGS and expenses into gross profit, operating profit and net profit with margins for each.",
    tags: ["profit and loss", "net profit", "gross margin", "ebit", "income statement"],
    popular: true,
    howItWorks: [
      "The calculator follows the income statement: revenue minus COGS gives gross profit; minus operating expenses gives operating profit (EBIT); minus other items and tax gives net profit.",
      "Each margin is that profit line divided by revenue. Gross margin shows product economics, operating margin shows overhead discipline, and net margin is what survives everything.",
      "The verdict compares your net margin with common small-business territory — 10%+ net is generally healthy, while a negative figure points at pricing or COGS first.",
    ],
    example:
      "With $250,000 revenue, $90,000 COGS and $95,000 operating expenses: gross profit is $160,000 (64% margin), EBIT is $65,000 (26%), and after $12,000 of other costs plus 21% tax, net profit lands near $42,000 — a 16.7% net margin.",
    faqs: [
      {
        q: "What belongs in operating expenses?",
        a: "The recurring cost of running the business: rent, payroll, software, marketing, utilities. Loan interest and one-off charges go in 'other expenses'.",
      },
      {
        q: "What is a good net margin?",
        a: "It varies wildly by industry — groceries run 2–4%, software often 20%+. Judge yourself against your own industry and, above all, your own trend line.",
      },
      {
        q: "Why separate gross margin from net margin?",
        a: "They answer different questions. Gross margin says your product or service makes money; net margin says the whole operation does. A great gross margin with a terrible net margin is an overhead problem, not a pricing one.",
      },
    ],
    component: ProfitLossCalculator,
  },
  {
    slug: "currency-converter",
    name: "Currency Converter",
    domain: "finance",
    category: "Business Finance",
    tagline: "Convert between 21 currencies with an editable rate you control.",
    description:
      "Convert amounts across major currencies using an indicative snapshot rate — or type in your bank's exact rate for precise figures.",
    tags: ["currency", "exchange rate", "forex", "travel", "international"],
    howItWorks: [
      "The converter holds an indicative mid-market snapshot for 21 major currencies, anchored to USD. Cross rates are derived: amount ÷ base rate of your currency × base rate of the target.",
      "Because real-world rates move continuously and banks add a margin, the rate field is editable. Paste the exact rate from your bank or card provider and the conversion becomes exact.",
      "The inverse rate is shown so you can sanity-check quotes you receive — a 2–3% gap from the mid-market rate is normal retail FX; anything wider deserves scrutiny.",
    ],
    example:
      "Convert $1,000 to euros at a snapshot rate of 0.92 and you get €920 mid-market. Your bank offers 0.908 — that 1.3% margin costs you about $12, which is why checking the inverse rate before large transfers pays for itself.",
    faqs: [
      {
        q: "Are these live exchange rates?",
        a: "No — they are an indicative snapshot for planning. Exchange rates change every second; enter the exact rate from your provider for real decisions.",
      },
      {
        q: "Why is my bank's rate different?",
        a: "Banks and cards add a conversion margin (typically 0.5–3%) on top of the mid-market rate. Specialist services usually charge less; airport bureaus charge far more.",
      },
      {
        q: "What is the mid-market rate?",
        a: "The midpoint between what buyers bid and sellers ask on global FX markets — the 'fair' rate you see on financial sites, before any retail margin.",
      },
    ],
    component: CurrencyConverter,
  },
  {
    slug: "debt-repayment-calculator",
    name: "Debt Repayment Calculator",
    domain: "finance",
    category: "Loans & Debt",
    tagline: "Avalanche vs snowball — see the payoff order, timeline and interest saved.",
    description:
      "Line up your debts, choose a strategy, and get the fastest route to debt-free with the exact interest you'll save.",
    tags: ["debt", "avalanche", "snowball", "payoff", "credit card"],
    howItWorks: [
      "The simulator pays minimums on every debt, then throws your extra monthly budget at one target: the highest APR (avalanche) or the smallest balance (snowball).",
      "When a debt is cleared, its minimum payment rolls into the pool — that cascade is why payoff accelerates in the final months.",
      "Avalanche minimizes interest mathematically; snowball minimizes time-to-first-win psychologically. The comparison row shows exactly what the difference is worth in your case.",
    ],
    example:
      "Three debts — $6,000 card at 22.9%, $11,000 auto at 7.5%, $18,500 student loan at 5.8% — plus $150 extra a month: avalanche clears everything in about 4 years 3 months and pays roughly $6,200 interest, versus 9 years 8 months and over $12,500 paying minimums only. The $150 extra is worth about $6,300 in saved interest and five and a half years of payments.",
    faqs: [
      {
        q: "Which strategy should I choose?",
        a: "Avalanche if you are motivated by numbers, snowball if early wins keep you going. The interest gap between them is usually small; the strategy you actually stick to is the best one.",
      },
      {
        q: "Are minimum payments enough?",
        a: "On high-rate cards, minimums can stretch payoff past a decade with most of it interest. The baseline row in the results shows exactly what minimums-only costs you.",
      },
      {
        q: "What about consolidation?",
        a: "Consolidation changes rates and terms, not behaviour. Simulate it by entering the consolidated loan as a single debt with its new APR.",
      },
      {
        q: "Should I keep a small emergency fund first?",
        a: "Yes — one month of expenses stashed prevents new card debt from undoing your progress. Then throw everything extra at the plan.",
      },
    ],
    component: DebtRepaymentCalculator,
  },

  /* --------------------------- MARKETING --------------------------- */
  {
    slug: "marketing-roi-calculator",
    name: "Marketing ROI Calculator",
    domain: "marketing",
    category: "Performance",
    tagline: "The honest version of marketing ROI — profit after margin, not vanity revenue.",
    description:
      "Measure true marketing return on investment: revenue adjusted for gross margin, minus spend, expressed as profit per dollar.",
    tags: ["marketing roi", "romi", "return on investment", "profit"],
    popular: true,
    howItWorks: [
      "Revenue-based ROI flatters campaigns on thin margins. This version converts revenue into gross profit first (revenue × margin), then subtracts spend — only what is left is a real return.",
      "ROI is net return divided by spend; the profit-per-dollar figure is the same number per $1. ROAS is shown alongside for teams that report in platform terms.",
      "A 100% ROI means marketing doubled its money after margin. Below your cost of capital — or below zero — spend is destroying value no matter how good revenue looks.",
    ],
    example:
      "A campaign drives $60,000 of revenue at a 60% margin on $12,000 of spend. Gross profit is $36,000, so the net return is $24,000 — a 200% ROI, $2 profit per $1 spent, and a 5x ROAS. Cut margin to 20% and the same campaign lands exactly at break-even: margin is the silent variable.",
    faqs: [
      {
        q: "What is a good marketing ROI?",
        a: "Most businesses target 300–500% (5:1 revenue-to-spend) with healthy margins. Anything above 0% after margin is technically profitable, but thin returns rarely survive attribution error.",
      },
      {
        q: "What margin should I enter?",
        a: "Your gross margin on the products or services sold by the campaign. Use 100% only if you deliberately want revenue-based ROI for comparison with other reports.",
      },
      {
        q: "How is this different from ROAS?",
        a: "ROAS is revenue ÷ spend — a platform metric. ROI accounts for what that revenue actually earns after costs. A 4x ROAS at a 20% margin is losing money; the two numbers together tell the truth.",
      },
    ],
    component: MarketingROICalculator,
  },
  {
    slug: "campaign-performance-calculator",
    name: "Campaign Performance Calculator",
    domain: "marketing",
    category: "Performance",
    tagline: "Paste one campaign row, get every metric that matters.",
    description:
      "Turn raw impressions, clicks, conversions, spend and revenue into CTR, CVR, CPC, CPM, CPA and ROAS at once.",
    tags: ["campaign metrics", "ctr", "cpa", "roas", "analytics"],
    popular: true,
    howItWorks: [
      "Every metric is a ratio of two raw numbers: CTR = clicks ÷ impressions, CVR = conversions ÷ clicks, CPC = spend ÷ clicks, CPM = spend per 1,000 impressions, CPA = spend ÷ conversions, ROAS = revenue ÷ spend.",
      "Reading them as a chain tells the story: a healthy CTR with a weak CVR points at the landing page; weak CTR points at creative or audience; strong everything with a bad ROAS is an offer-price problem.",
      "Revenue per 1,000 impressions is included because it is the one number that lets you compare totally different campaigns — channels, formats and price points — on equal footing.",
    ],
    example:
      "400,000 impressions, 6,400 clicks, 192 conversions, $9,600 spend, $28,800 revenue: CTR 1.6%, CVR 3%, CPC $1.50, CPM $24, CPA $50, ROAS 3.0x. The funnel leaks least at the click stage — the $50 CPA against a $150 average order is where the next test belongs.",
    faqs: [
      {
        q: "Which metric should I optimize first?",
        a: "Follow the funnel: fix the worst stage-to-stage drop. Improving CTR lowers CPC everywhere downstream; improving CVR raises ROAS without touching spend.",
      },
      {
        q: "Is a 3x ROAS good?",
        a: "It depends on margin. At a 60% gross margin, break-even ROAS is 1.67x, so 3x is comfortably profitable. At a 25% margin, break-even is 4x and 3x loses money.",
      },
      {
        q: "Can I use this for organic campaigns?",
        a: "Yes — set spend to your content or time cost estimate. The ratios stay meaningful; ROAS becomes return on effort.",
      },
    ],
    component: CampaignPerformanceCalculator,
  },
  {
    slug: "cac-calculator",
    name: "Customer Acquisition Cost Calculator",
    domain: "marketing",
    category: "Customers",
    tagline: "What a customer really costs — and how many months it takes to earn them back.",
    description:
      "Blend marketing and sales spend into a true CAC, then compute payback period against monthly profit per customer.",
    tags: ["cac", "acquisition cost", "payback period", "unit economics"],
    popular: true,
    howItWorks: [
      "True CAC is all acquisition cost — marketing plus sales, including salaries, tools and commissions — divided by new customers won in the same period. Counting only ad spend flatters the number.",
      "Payback period divides CAC by monthly profit per customer (ARPU × gross margin). It answers the cash question: how long until each customer has repaid their own acquisition?",
      "Most healthy subscription businesses recover CAC within 12 months. Longer paybacks are workable with low churn, but they consume cash and amplify every acquisition mistake.",
    ],
    example:
      "Spend $30,000 on marketing and $18,000 on sales to win 120 customers: CAC is $400. At $120 monthly revenue with a 75% margin, each customer contributes $90 a month — payback in 4.4 months, comfortably inside the 12-month benchmark.",
    faqs: [
      {
        q: "Should salaries really be in CAC?",
        a: "Yes, if those people exist to win customers. Fully-loaded CAC is slower to improve but honest; ad-only CAC is useful for platform comparisons, not business decisions.",
      },
      {
        q: "What is a good payback period?",
        a: "Under 12 months is the classic benchmark for subscriptions; e-commerce often needs under 3 months because repeat purchase is less certain.",
      },
      {
        q: "How do I lower CAC without cutting spend?",
        a: "Raise conversion rate at any funnel stage, improve targeting to cut wasted impressions, or shift mix toward channels with longer-lived assets like SEO and referrals.",
      },
    ],
    component: CACCalculator,
  },
  {
    slug: "conversion-rate-calculator",
    name: "Conversion Rate Calculator",
    domain: "marketing",
    category: "Performance",
    tagline: "Your conversion rate — plus the sessions you'll need for any goal.",
    description:
      "Calculate conversion rate from sessions and conversions, and see planning tables in both directions.",
    tags: ["conversion rate", "cvr", "sessions", "optimization"],
    howItWorks: [
      "Conversion rate is conversions divided by sessions, expressed as a percentage. The 'one per N visitors' figure makes it tangible — every extra decimal point removes work from that line.",
      "The planning tables run the math in both directions: how many sessions it takes to reach a conversion target, and how many conversions a traffic plan should produce.",
      "Because rates compound with traffic, small CVR gains are multiplicative: at constant traffic, moving 2% to 2.5% lifts conversions by 25%.",
    ],
    example:
      "528 sales from 24,000 sessions is a 2.2% conversion rate — one order per 45.5 visits. At that rate, 100 orders needs about 4,545 sessions, and every extra 0.1pt of CVR is worth roughly 24 more orders a month at the same traffic.",
    faqs: [
      {
        q: "What is a good conversion rate?",
        a: "E-commerce commonly lands between 2% and 4%, lead generation between 5% and 10% on focused pages. Your best benchmark is your own trailing average — beat yourself first.",
      },
      {
        q: "Sessions or visitors?",
        a: "Both are used; sessions is the platform default and slightly understates per-person rates when people visit twice. Pick one and stay consistent.",
      },
      {
        q: "Why did my rate fall when traffic grew?",
        a: "New traffic sources usually convert worse than the existing audience — brand and referral visitors already trust you. Segment by source before panicking.",
      },
    ],
    component: ConversionRateCalculator,
  },
  {
    slug: "marketing-budget-planner",
    name: "Marketing Budget Planner",
    domain: "marketing",
    category: "Planning",
    tagline: "Work backwards from a revenue goal to the budget that actually funds it.",
    description:
      "Turn a revenue target into customers, leads, sessions and a marketing budget using your own funnel rates.",
    tags: ["budget planning", "revenue goal", "cost per lead", "planning"],
    howItWorks: [
      "The planner runs the funnel in reverse: revenue goal ÷ average sale value = customers needed; ÷ close rate = leads needed; ÷ visitor-to-lead rate = sessions needed.",
      "Sessions multiplied by your target cost per lead (via lead volume) produces the annual lead budget, shown monthly so it can face a cash-flow reality check.",
      "If the number feels too big, the levers in order of leverage are: average sale value, close rate, visitor-to-lead rate — and only then cost per lead. Raising CPL buys traffic that may not fit your funnel.",
    ],
    example:
      "A $500,000 goal at a $1,000 average sale needs 500 customers. At a 20% close rate that is 2,500 leads; at a 4% visitor-to-lead rate, 62,500 sessions. At $12 per lead the year costs about $30,000 — $2,500 a month to fund a half-million revenue line.",
    faqs: [
      {
        q: "Where do I find my close rate?",
        a: "Divide customers won by qualified leads over a meaningful period. If you have never tracked it, estimate conservatively — a hopeful close rate understates the budget more than anything else.",
      },
      {
        q: "Should the budget include brand or content spend?",
        a: "This plan covers direct-response lead generation. Content and brand spend typically rides on top — many teams reserve 10–20% of budget for longer-horizon channels.",
      },
      {
        q: "What if my sale value varies?",
        a: "Use average revenue per customer over their first year if deals vary. Mixing in retention pushes the required customer count down further.",
      },
    ],
    component: MarketingBudgetPlanner,
  },
  {
    slug: "funnel-calculator",
    name: "Marketing Funnel Calculator",
    domain: "marketing",
    category: "Planning",
    tagline: "Sessions in, revenue out — see every stage and every drop-off.",
    description:
      "Model a four-stage funnel from sessions to customers to predicted revenue, with drop-offs at each stage.",
    tags: ["funnel", "leads", "opportunities", "revenue forecast"],
    howItWorks: [
      "Each stage multiplies the previous one by its conversion rate: sessions × visitor-to-lead % = leads; leads × lead-to-opportunity % = opportunities; opportunities × close rate = customers.",
      "The drop-off column shows raw losses at every stage — the number that should choose your next project. A huge session-to-lead leak is a site or offer problem; a late-stage leak is a sales problem.",
      "The overall visitor-to-customer rate at the bottom is the single number to benchmark month over month. It compounds every team's progress into one figure.",
    ],
    example:
      "50,000 sessions at 3.5% to leads yields 1,750 leads; 25% to opportunities gives 437; closing 30% produces 131 customers — $105,000 of revenue at an $800 average sale. The biggest absolute leak is sessions-to-leads (48,250 lost), which is where a lead magnet beats another sales training.",
    faqs: [
      {
        q: "What are typical rates per stage?",
        a: "Visitor-to-lead of 2–5% and lead-to-opportunity of 20–30% are common B2B shapes; close rates vary from 15% (inbound) to 40%+ (qualified outbound). Calibrate with your CRM data.",
      },
      {
        q: "Where do I find these numbers?",
        a: "Analytics gives sessions, the CRM gives leads, opportunities and wins. If stages are fuzzy, define them once in writing — the definitions matter more than the precision.",
      },
      {
        q: "Can I add more stages?",
        a: "Keep it to the stages you actually measure. A five-stage model with guessed numbers is less useful than a four-stage model you can defend.",
      },
    ],
    component: FunnelCalculator,
  },
  {
    slug: "ab-test-significance-calculator",
    name: "A/B Test Significance Calculator",
    domain: "marketing",
    category: "Testing",
    tagline: "Know if your test truly won — z-score, p-value and a plain-English verdict.",
    description:
      "Run a two-proportion significance test on A/B results and get the confidence level, lift and whether to call it.",
    tags: ["a/b test", "significance", "p-value", "statistics", "split test"],
    howItWorks: [
      "The calculator runs a two-proportion z-test: it pools both variants' rates to estimate shared variance, computes how many standard errors separate the two conversion rates, and converts that z-score into a p-value.",
      "The p-value is the probability of seeing a gap this large if the two variants were actually identical. Below 5% (at 95% confidence), random chance is an unlikely explanation — most teams call the test there.",
      "Relative lift puts the gap in business terms. A significant 1% lift can be worth running; a big but non-significant lift is still a coin flip.",
    ],
    example:
      "A: 340 of 10,000 (3.4%). B: 402 of 10,000 (4.02%). That is an 18.2% relative lift with a z-score near 2.32 and p ≈ 0.02 — significant at 95%, so variant B ships. At 99% confidence it would still pass, comfortably above the threshold.",
    faqs: [
      {
        q: "Can I stop the test early when it looks significant?",
        a: "Be careful: repeatedly checking and stopping on significance inflates false positives. Set the sample size and duration in advance, or use sequential testing methods.",
      },
      {
        q: "Why is my test underpowered?",
        a: "Small absolute rates need big samples to detect modest lifts. If neither variant reached hundreds of conversions, the honest answer is 'keep collecting', not 'call it a tie'.",
      },
      {
        q: "Does significance mean business importance?",
        a: "No — it means the difference is probably real, not random. Multiply the lift by traffic and margin to check the win is worth the change's cost.",
      },
      {
        q: "What confidence level should I use?",
        a: "95% is the default in growth teams. Use 90% for low-risk iteration speed and 99% when a bad call is expensive.",
      },
    ],
    component: ABTestSignificanceCalculator,
  },
  {
    slug: "ltv-calculator",
    name: "Customer Lifetime Value Calculator",
    domain: "marketing",
    category: "Customers",
    tagline: "What a customer is worth over their whole life — and the 3:1 health check.",
    description:
      "Project lifetime value from order value, frequency, margin and churn, then benchmark it against your CAC.",
    tags: ["ltv", "clv", "lifetime value", "churn", "retention"],
    popular: true,
    howItWorks: [
      "Lifetime value = average order value × purchases per year × gross margin × expected lifespan in years, where lifespan is 1 ÷ annual churn. Margin keeps it in profit terms, not revenue terms.",
      "Churn dominates the equation: halving churn doubles lifespan, which doubles LTV at every other number unchanged. Retention work is the highest-leverage growth project most businesses ignore.",
      "The LTV:CAC ratio is the health check: roughly 3:1 means each customer returns triple their acquisition cost. Below 1.5:1 the model is upside down; far above 5:1 often means you are under-investing in growth.",
    ],
    example:
      "$85 average order × 6 purchases a year × 65% margin = $331.50 of annual profit. With 15% churn, customers stay about 6.7 years, giving an LTV near $2,210. Against a $95 CAC that is 23:1 — either a great business or an under-funded acquisition budget.",
    faqs: [
      {
        q: "Revenue LTV or profit LTV?",
        a: "Profit LTV — that is why margin is an input. A revenue LTV of $1,000 at a 30% margin is really $300, and CAC must be judged against the $300.",
      },
      {
        q: "My churn is lumpy. Which number do I use?",
        a: "Use annual churn measured over a stable period. If customers leave in waves (seasonal contracts), measure cohorts rather than a single month.",
      },
      {
        q: "What if customers stay for decades?",
        a: "Cap the horizon at something defensible — many analysts model 3–5 years regardless, because discounting, competition and behaviour change make decade-long assumptions fragile.",
      },
    ],
    component: LTVCalculator,
  },

  /* -------------------------- ADVERTISING -------------------------- */
  {
    slug: "cpc-calculator",
    name: "CPC Calculator",
    domain: "advertising",
    category: "Media Buying",
    tagline: "Cost per click from any campaign — or the clicks any budget should buy.",
    description:
      "Calculate CPC from spend and clicks, or plan expected clicks from a budget at a target CPC.",
    tags: ["cpc", "cost per click", "ppc", "google ads"],
    howItWorks: [
      "CPC is total spend divided by clicks. It is the price of traffic itself — every other metric (CPA, ROAS) is built on top of it.",
      "The planning tab runs it forward: budget ÷ target CPC = expected clicks, so you can sanity-check platform forecasts before committing spend.",
      "Platform blends hide structure: one auction at $0.40 and another at $8.00 average to $4.20. If CPCs feel high, the cause is usually competition or relevance, not the bid alone.",
    ],
    example:
      "$2,400 of spend buying 860 clicks is a $2.79 CPC — $36 of clicks per $100. Plan the same budget at a $2.50 target and the forecast is 960 clicks; the gap between forecast and reality is your relevance score made visible.",
    faqs: [
      {
        q: "What is a good CPC?",
        a: "Whatever leaves margin after conversion. A $10 CPC is cheap for a $10,000 product and ruinous for a $15 one — judge CPC against conversion value, never in isolation.",
      },
      {
        q: "Why did my CPC rise?",
        a: "Usually more competition on your auctions, falling quality scores, or creative fatigue lowering CTR (which raises effective CPC almost everywhere).",
      },
      {
        q: "CPC or CPM bidding?",
        a: "CPC when you pay for engagement intent; CPM when reach is the goal or the platform's click prediction is strong. Test both where the platform allows.",
      },
    ],
    component: CPCCalculator,
  },
  {
    slug: "cpm-calculator",
    name: "CPM Calculator",
    domain: "advertising",
    category: "Media Buying",
    tagline: "Cost per thousand impressions — and the reach your budget should deliver.",
    description:
      "Calculate CPM from spend and impressions, or forecast total impressions from a budget at a target CPM.",
    tags: ["cpm", "impressions", "reach", "brand awareness"],
    howItWorks: [
      "CPM is spend divided by impressions × 1,000 — the standard unit for buying attention rather than actions.",
      "The planning tab converts a budget and target CPM into expected impressions, which is how awareness campaigns should be scoped before launch.",
      "CPM is the top of every funnel: CPC = CPM ÷ (CTR × 1,000) × 1,000... in plain terms, your effective CPC is set by CPM and CTR together. Rising CPMs with flat CTRs is the classic creative-fatigue signature.",
    ],
    example:
      "$5,000 delivering 1.25M impressions is a $4.00 CPM — cheap for social, mid-range for display. The same budget at a $6 target buys about 833,000 impressions; anything materially below that forecast signals auction competition is higher than planned.",
    faqs: [
      {
        q: "What is a typical CPM?",
        a: "Social feeds commonly trade $5–$15; display $2–$10; premium video $20+. Season and audience specificity move it more than platform choice.",
      },
      {
        q: "Is a low CPM always good?",
        a: "Only if the impressions are relevant. Cheap, untargeted impressions produce the worst kind of metric: high reach, zero response.",
      },
      {
        q: "How does CPM relate to CPC?",
        a: "They are two views of the same spend: CPC ≈ CPM ÷ (CTR × 1,000). Halve your CTR at the same CPM and your effective CPC doubles.",
      },
    ],
    component: CPMCalculator,
  },
  {
    slug: "ctr-calculator",
    name: "CTR Calculator",
    domain: "advertising",
    category: "Media Buying",
    tagline: "Click-through rate with honest channel benchmarks for context.",
    description:
      "Calculate CTR from impressions and clicks, or forecast expected clicks from impressions at a target CTR.",
    tags: ["ctr", "click through rate", "creative", "benchmark"],
    howItWorks: [
      "CTR is clicks ÷ impressions. It measures how well your creative and audience match — the purest early signal of ad quality, untouched by pricing or landing pages.",
      "The planning tab forecasts clicks from impressions at a target CTR, useful for briefing creative teams with concrete numbers instead of adjectives.",
      "Benchmarks vary wildly by intent: search ads commonly run 3–6% because the click is the point, while display and feeds run 0.5–1.5% because the audience is busy living. Compare within channel, never across.",
    ],
    example:
      "3,900 clicks from 120,000 impressions is a 3.25% CTR — strong for mixed placements, where the display layer usually drags blended rates toward 1–2%. At the same impressions, a 2% target CTR forecasts 2,400 clicks; the 1,500-click gap is the creative's contribution to the business.",
    faqs: [
      {
        q: "What is a good CTR?",
        a: "Within channel: search often 3–6%, display 0.5–1.5%, social feeds 0.5–2%. Your account history is the only benchmark that fully accounts for your audience and offer.",
      },
      {
        q: "Is a high CTR always good?",
        a: "Not always — curiosity-bait headlines can inflate CTR while attracting clicks that never convert. Watch CTR and CVR together.",
      },
      {
        q: "How do I raise CTR without clickbait?",
        a: "Tighter audience-message match: speak to one segment per ad, lead with the specific benefit, and match the landing page promise exactly.",
      },
    ],
    component: CTRCalculator,
  },
  {
    slug: "roas-calculator",
    name: "ROAS Calculator",
    domain: "advertising",
    category: "Media Buying",
    tagline: "Return on ad spend with the break-even line drawn where it belongs.",
    description:
      "Calculate ROAS, profit after spend and your break-even ROAS from gross margin — the number every buyer should memorize.",
    tags: ["roas", "return on ad spend", "break-even", "ppc", "ecommerce"],
    popular: true,
    howItWorks: [
      "ROAS is revenue ÷ ad spend — the headline efficiency of a campaign. But it is only meaningful next to your break-even ROAS: 1 ÷ gross margin.",
      "At a 55% margin, break-even is 1.82x: below that ROAS, every sale loses money however good the dashboard looks. Above it, the profit-after-spend figure shows what the campaign actually banked.",
      "The target tab answers the scaling question: revenue needed to hit a target ROAS at current spend, and how much spend headroom remains before efficiency slips.",
    ],
    example:
      "$45,000 of revenue on $9,000 of spend is a 5.0x ROAS. At a 55% margin, break-even sits at 1.82x, so the campaign is 3.18x above the line and banked about $15,750 of gross profit. To hit a 6x target at the same spend, revenue must reach $54,000.",
    faqs: [
      {
        q: "What is a good ROAS?",
        a: "Whatever clears your margin with room to grow. Margin decides it: at 20% margin you need 5x to break even; at 60% margin, 1.67x. There is no universal 'good'.",
      },
      {
        q: "Should ROAS use revenue or profit?",
        a: "Platform ROAS is revenue-based because that is what ad platforms can see. Decisions should use the profit view — which is why the break-even line exists.",
      },
      {
        q: "How do I scale spend without killing ROAS?",
        a: "Step budgets up in increments and watch the margin-adjusted profit, not the ROAS percentage. Rising CPAs are fine while profit per dollar stays positive.",
      },
      {
        q: "Is ROAS the same as ROI?",
        a: "No. ROAS compares revenue to spend; ROI compares profit to spend after margin. A 4x ROAS at a 20% margin is an ROI of −20% — the difference that separates buyers from optimizers.",
      },
    ],
    component: ROASCalculator,
  },
  {
    slug: "ad-budget-calculator",
    name: "Ad Budget Calculator",
    domain: "advertising",
    category: "Planning & Forecasting",
    tagline: "What a budget buys in clicks, orders and revenue — before you spend it.",
    description:
      "Forecast results from a budget through CPC, conversion rate and order value, or work backwards from a revenue goal to the budget it requires.",
    tags: ["ad budget", "forecast", "ppc", "media planning", "cpa"],
    howItWorks: [
      "Every dollar of spend flows through a short chain: budget ÷ CPC = clicks, clicks × conversion rate = orders, orders × average order value = revenue.",
      "The forecast tab runs that chain forward on a budget; the goal tab runs it backwards — a revenue target ÷ the return each dollar produces = the budget required.",
      "The return per dollar (your projected ROAS) is the single number to interrogate: it is set entirely by CPC, CVR and AOV, so improving any one of the three lifts the whole plan.",
    ],
    example:
      "A $10,000 budget at a $2.00 CPC buys 5,000 clicks; at a 2.5% conversion rate that is 125 orders with an $80 CPA, and $120 order value turns it into $15,000 of revenue — a 1.5x return per dollar. To hit a $45,000 goal on the same funnel, the budget must rise to $30,000.",
    faqs: [
      {
        q: "What numbers should I plug in?",
        a: "Recent, channel-specific ones: CPC from the last 30 days of the account, CVR from the actual landing page analytics, AOV from the last 90 days of orders. Media-kit averages flatter every input.",
      },
      {
        q: "Does the budget include creative and agency fees?",
        a: "No — this models working spend only. Layer management fees and production costs on top before you commit, since they come out of the same P&L line.",
      },
      {
        q: "What ROAS should I demand from a forecast?",
        a: "Whatever clears your break-even ROAS (1 ÷ gross margin) with headroom. At a 50% margin that means 2x minimum; anything below the line loses money at any budget size.",
      },
    ],
    component: AdBudgetCalculator,
  },
  {
    slug: "impression-estimator",
    name: "Impression Estimator",
    domain: "advertising",
    category: "Reach & Awareness",
    tagline: "The impressions and unique reach a budget actually delivers at your CPM.",
    description:
      "Turn a budget and CPM into impressions, then split them into unique reach at your target frequency — or price the budget a reach goal requires.",
    tags: ["impressions", "reach", "frequency", "cpm", "awareness"],
    howItWorks: [
      "Impressions are the raw buy: budget ÷ CPM × 1,000. Reach is what matters for awareness, and it is impressions divided by frequency — how many times each person sees the ad.",
      "The estimator runs both directions: from budget to reach at a frequency, or from a reach goal back to the budget it costs at the going CPM.",
      "Cost per person reached is the quiet KPI of awareness buys — it moves with frequency faster than with anything else, because frequency multiplies impressions per unique person.",
    ],
    example:
      "$6,000 at a $7.50 CPM buys 800,000 impressions. At a 2.4x frequency that is roughly 333,000 unique people at $0.018 per person. The same reach at a 3.6x frequency would need 1.2M impressions — half again the budget for the same people, three more views each.",
    faqs: [
      {
        q: "What frequency should I plan for?",
        a: "Two to four views per person is the usual band for awareness. Below two, the message rarely registers; far above four, you are paying to fatigue the same people.",
      },
      {
        q: "Why is my actual reach lower than estimated?",
        a: "Frequency is rarely even: some people see the ad ten times while others see it once. Platforms report average frequency, so real unique reach usually lands below the clean estimate.",
      },
      {
        q: "Does this work for video views?",
        a: "Yes — impressions map to video impressions (not completed views). If the goal is completed views, add an estimated completion rate on top.",
      },
    ],
    component: ImpressionEstimator,
  },
  {
    slug: "reach-frequency-calculator",
    name: "Reach & Frequency Calculator",
    domain: "advertising",
    category: "Reach & Awareness",
    tagline: "Coverage, GRPs and the reach-frequency trade-off on any audience.",
    description:
      "Convert impressions and average frequency into unique reach, audience coverage and GRPs — and see how the split changes at different frequencies.",
    tags: ["reach", "frequency", "grp", "coverage", "awareness"],
    howItWorks: [
      "Reach × frequency = impressions is the identity behind every media plan: 1,000,000 impressions can be 1,000,000 people once, or 500,000 people twice, or 250,000 people four times.",
      "Coverage is reach as a share of the addressable audience; GRPs multiply coverage by frequency, which is why 50% at 1.5x and 25% at 3x both price at 75 GRPs but reach very different campaigns.",
      "The comparison table re-runs reach at several frequencies, showing exactly what each frequency decision costs in people reached.",
    ],
    example:
      "1.5M impressions at a 1.5x frequency on a 2M audience reach 1,000,000 people — 50% coverage, 75 GRPs. Push frequency to 3x and coverage halves to 25%: the same budget now talks to fewer people, more often, which is a retargeting shape rather than a launch shape.",
    faqs: [
      {
        q: "What are GRPs and do I need them?",
        a: "Gross rating points are coverage × frequency — the traditional currency of media buying. You only need them when comparing plans or briefing agencies used to trading in GRPs.",
      },
      {
        q: "Is high frequency bad?",
        a: "Past roughly 3–4 exposures per week, extra views mostly add cost and fatigue. Frequency ceilings and rotation exist precisely to cap this.",
      },
      {
        q: "What audience size should I enter?",
        a: "The addressable audience the platform can actually deliver to — your targeting definition, not the platform's total user count.",
      },
    ],
    component: ReachFrequencyCalculator,
  },
  {
    slug: "media-planning-calculator",
    name: "Media Planning Calculator",
    domain: "advertising",
    category: "Planning & Forecasting",
    tagline: "Split a budget across channels and see the blended plan in one table.",
    description:
      "Allocate a budget across search, social and display with per-channel CPM and CTR assumptions, then read the blended CPM, CTR and effective CPC.",
    tags: ["media plan", "budget split", "blended cpm", "channel mix", "planning"],
    howItWorks: [
      "Each channel's share of the budget buys impressions at its own CPM, and those impressions produce clicks at the channel's own CTR — the same math that governs each buy in the platform.",
      "The blended view is what management actually approves: one CPM, one CTR, one effective CPC across the whole plan, weighted by where the money went.",
      "Per-channel effective CPC is the sanity check: CPM ÷ (CTR × 10) should land near the CPCs you see in-platform, or the plan's assumptions need correcting before it ships.",
    ],
    example:
      "A $20,000 plan split 50/30/20 across search, social and display delivers about 1.78M impressions and 18,300 clicks. Search's $90 CPM looks expensive until its 4.5% CTR lands clicks at $2.00; display's $4 CPM is cheap until its 0.6% CTR makes every click nearly as dear. Blended: an $11.25 CPM, a 1.03% CTR and a $1.09 effective CPC.",
    faqs: [
      {
        q: "Why is search's CPM so high?",
        a: "Search sells intent, and its click rates run 3–6% — so the same click costs a much higher CPM. Judge search on CPC and conversion, never on CPM.",
      },
      {
        q: "How should I split the budget?",
        a: "Start from the role each channel plays — capture demand, create demand, cheap frequency — then move share toward whichever marginal dollar produces the most profitable next click.",
      },
      {
        q: "Can I add more channels?",
        a: "The three rows cover the standard split, but the math is per-channel: run the tool again for video, podcast or OOH lines and add the totals into the plan.",
      },
    ],
    component: MediaPlanningCalculator,
  },

  /* ---------------------------- BUSINESS --------------------------- */
  {
    slug: "profit-margin-calculator",
    name: "Profit Margin Calculator",
    domain: "business",
    category: "Pricing & Margins",
    tagline: "Margin, markup and where every $100 of revenue actually goes.",
    description:
      "Enter revenue and cost of goods to get gross profit, gross margin and the markup on cost — with a visual split of where each sales dollar goes.",
    tags: ["profit margin", "gross margin", "markup", "pricing", "unit economics"],
    popular: true,
    howItWorks: [
      "Gross margin is profit ÷ revenue: what share of every sales dollar survives after the direct cost of the product or service. It is the number lenders, investors and pricing decisions all start from.",
      "Markup is the same profit described against cost instead of price — a 40% margin is a 66.7% markup. The two get swapped constantly, and the error quietly misprices products.",
      "The cost bar shows the split of every $100 of revenue between cost and profit, so the margin stops being an abstraction and becomes a picture.",
    ],
    example:
      "$45,000 of revenue against $27,000 of COGS leaves $18,000 of gross profit — a 40% margin and a 66.7% markup. Every $100 of sales keeps $40; at a 55% margin the same $100 would keep $55, which is why two-point margin moves are worth real arguments.",
    faqs: [
      {
        q: "Gross, operating or net margin?",
        a: "This is gross margin: revenue minus direct costs. Operating margin subtracts overheads too, net margin subtracts everything including tax. Compare each against its own kind.",
      },
      {
        q: "What is a good gross margin?",
        a: "Varies by model: product businesses commonly run 25–50%, services 50–70%, software 70%+. Direction matters more than the absolute: margin should be stable or rising.",
      },
      {
        q: "Which should I quote — margin or markup?",
        a: "Margin, internally. It is the version that connects to the P&L, and pricing targets set in markup routinely produce thinner margins than intended.",
      },
      {
        q: "My margin is high but cash is tight. Why?",
        a: "Margin is profitability per sale, not cash flow. Slow receivables, inventory and loan payments can starve a high-margin business — check the cash cycle next.",
      },
    ],
    component: ProfitMarginCalculator,
  },
  {
    slug: "markup-calculator",
    name: "Markup Calculator",
    domain: "business",
    category: "Pricing & Margins",
    tagline: "Price from markup — and the margin it quietly becomes.",
    description:
      "Convert unit cost and markup into a selling price with profit per unit, or read the markup behind any existing price and its true margin.",
    tags: ["markup", "selling price", "margin", "pricing", "retail"],
    howItWorks: [
      "Price from markup is cost × (1 + markup): a $60 cost at a 75% markup prices at $105, adding $45 of profit per unit.",
      "The reverse tab reads an existing price backwards: profit over cost gives the markup, and profit over price gives the margin it actually delivers.",
      "Every markup has a margin twin — 75% on cost is 42.9% of price — and the calculator always shows both, because quoting one while meaning the other is the most common pricing mistake in retail.",
    ],
    example:
      "A $60 unit at a 75% markup prices at $105 with $45 profit. Expressed as margin that is 42.9% — so if the target was 'a 75% margin', the price must be $240, not $105. Same cost, very different business.",
    faqs: [
      {
        q: "What markup should a product carry?",
        a: "Enough to cover overheads and profit after the direct cost — commonly 50–100% in retail, more where service or exclusivity is part of the product. Work backwards from the margin the business needs.",
      },
      {
        q: "Is keystone pricing (2x cost) enough?",
        a: "A 100% markup is a 50% margin, which is healthy for many goods — but thin once discounts, shrinkage and returns enter. Price for the margin after your real selling pattern, not the sticker one.",
      },
      {
        q: "Can I use this for services?",
        a: "Yes, with 'cost' as the direct delivery cost (contractor time, software, materials). Overhead recovery belongs in the markup, not the cost line.",
      },
    ],
    component: MarkupCalculator,
  },
  {
    slug: "break-even-calculator",
    name: "Break-even Calculator",
    domain: "business",
    category: "Unit Economics",
    tagline: "The exact unit count where the business stops losing money.",
    description:
      "From fixed costs, price and variable cost, get your break-even units and revenue — plus the margin of safety on current sales.",
    tags: ["break-even", "fixed costs", "contribution margin", "safety margin", "unit economics"],
    popular: true,
    howItWorks: [
      "Each unit sold contributes price minus variable cost — the contribution margin. Fixed costs ÷ contribution per unit is the break-even point: the units that must sell before the business earns anything.",
      "Break-even revenue multiplies those units by price, which is the monthly sales figure to clear before profit begins.",
      "Margin of safety compares current sales to the break-even point: how far volume can fall before losses start. It turns the break-even math from a curiosity into a risk measure.",
    ],
    example:
      "$12,000 of fixed costs, a $45 price and $27 variable cost give $18 of contribution per unit — 667 units or $30,000 of revenue to break even. Selling 800 units leaves a 16.7% safety margin: one slow month from losses, and a warning to fix margins before scaling spend.",
    faqs: [
      {
        q: "What counts as a fixed cost?",
        a: "Costs that do not move with each unit: rent, salaries, software, insurance. Payments that scale with volume (materials, shipping, transaction fees) are variable.",
      },
      {
        q: "Semi-variable costs — where do they go?",
        a: "Split them: the base that exists at zero volume is fixed, the per-unit part joins variable cost. A phone plan with a per-minute rate is the classic case.",
      },
      {
        q: "Can I break even per product line?",
        a: "Yes — run the tool per line with that line's price, variable cost and its share of fixed costs. Blended break-evens hide which product carries the rent.",
      },
      {
        q: "How do I lower my break-even point?",
        a: "Three levers: cut fixed costs, raise price, cut variable cost. Raising price works fastest because it improves contribution on every unit at once.",
      },
    ],
    component: BreakEvenCalculator,
  },
  {
    slug: "pricing-calculator",
    name: "Pricing Calculator",
    domain: "business",
    category: "Pricing & Margins",
    tagline: "The price your margin needs — and the margin the market gives.",
    description:
      "Price from a target margin with a full margin ladder, or check what margin any market price actually delivers against your cost.",
    tags: ["pricing", "target margin", "price ladder", "competitor pricing", "unit economics"],
    howItWorks: [
      "Pricing for a margin divides cost by (1 − margin): a $60 cost at a 55% margin needs $133.33, because profit must be 55% of the final price, not of the cost.",
      "The margin ladder shows prices at 40%, 50% and 60% targets, so pricing conversations happen over a range rather than a single fragile number.",
      "The market tab inverts the question: given the price the market already pays, what margin survives? That gap between required and achieved margin is the real pricing decision.",
    ],
    example:
      "A $60 cost at a 55% target prices at $133.33 — a 122% markup, which is why '55% margin' and '55% markup' produce wildly different prices. If the market pays $110 for the same unit, the margin is only 45.5%, and either cost must fall $10 or positioning must justify the higher price.",
    faqs: [
      {
        q: "Cost-plus or value-based pricing?",
        a: "Cost-plus sets the floor — the minimum viable price. Value-based sets the ceiling — what the outcome is worth. Healthy prices sit between, and this calculator maps the floor precisely.",
      },
      {
        q: "Does this include payment fees and returns?",
        a: "Only if you add them to unit cost. For most goods, adding the average per-order fee and expected return rate to cost gives a truer floor price.",
      },
      {
        q: "What margin should I target?",
        a: "Backwards from overheads and profit goal ÷ expected volume. The target margin is whatever makes the whole P&L work at realistic sales — not a number borrowed from an industry table.",
      },
    ],
    component: PricingCalculator,
  },
  {
    slug: "discount-calculator",
    name: "Discount Calculator",
    domain: "business",
    category: "Promotions & Sales",
    tagline: "The real cost of a discount: margin lost and volume needed to replace it.",
    description:
      "Apply a discount to see the final price and savings — then the margin damage and how much extra volume the promotion must produce to break even.",
    tags: ["discount", "sale price", "promotion", "margin impact", "pricing"],
    howItWorks: [
      "The headline math is simple: list price × (1 − discount) = final price, and the difference is what the customer saves.",
      "The business math is not: margin falls faster than price, because the discount comes straight out of profit. A 20% discount on a 44% margin item leaves 30% — a third of the margin gone.",
      "Volume needed compares profit per unit before and after: selling at the discounted price must produce 1.8x the units to earn the same total profit. That multiplier is the real test of every promotion.",
    ],
    example:
      "$249 at 20% off sells for $199.20 — $49.80 off for the customer. With a $140 cost, margin falls from 43.8% to 29.7%, and profit per unit drops from $109 to $59.20. The promotion now needs 1.84x the volume just to match the profit of selling undiscounted.",
    faqs: [
      {
        q: "When is a discount worth it?",
        a: "When it buys something: cleared inventory, new-customer acquisition, or volume the business can actually monetize. A discount with no strategic job is a margin donation.",
      },
      {
        q: "Is 20% off twice as costly as 10% off?",
        a: "Worse. Discounts compound against margin: the second 10% comes entirely out of the thinner remaining margin. Stacked discounts deserve this math every time.",
      },
      {
        q: "How do I protect margin while discounting?",
        a: "Conditions: bundles, minimum baskets, limited windows, member-only pricing. Each constraint limits the discount's cost while keeping the psychological pull.",
      },
    ],
    component: DiscountCalculator,
  },
  {
    slug: "commission-calculator",
    name: "Sales Commission Calculator",
    domain: "business",
    category: "Promotions & Sales",
    tagline: "Commission, total pay and the effective rate the plan really costs.",
    description:
      "Calculate commission on sales as a straight percentage or base-plus-commission, with an earnings ladder and the plan's true effective rate.",
    tags: ["commission", "sales compensation", "ote", "payroll", "incentives"],
    howItWorks: [
      "Straight commission multiplies revenue by the rate; base-plus adds salary on top, which is the standard OTE structure for most sales teams.",
      "Effective rate — total pay ÷ revenue — is what the plan actually costs as a share of sales. Base salaries quietly push it above the headline commission percentage.",
      "The earnings ladder shows pay at three revenue levels, which is exactly the table reps and managers argue quotas over — now computed instead of guessed.",
    ],
    example:
      "$85,000 of monthly sales at a 6% rate earns $5,100 in commission; on a $2,800 base the rep takes home $7,900 — an effective 9.3% of revenue, not 6%. Sales needed for a $10,000 month: $120,000. That gap between headline and effective rate is where comp plans are really designed.",
    faqs: [
      {
        q: "Commission on revenue or on margin?",
        a: "Revenue plans are simpler and standard; margin plans protect profitability on discounting-heavy sales. Whichever you choose, the calculator works — enter margin dollars as revenue for margin plans.",
      },
      {
        q: "How is OTE set?",
        a: "OTE = base + commission at 100% of quota. If the numbers here don't sum to the advertised OTE at quota, the plan or the job ad is miscalibrated.",
      },
      {
        q: "Should tiers accelerate payout?",
        a: "Commonly yes — higher rates above quota keep top performers selling. Model a tier by running this tool at each rate band and blending the result at expected volume.",
      },
    ],
    component: SalesCommissionCalculator,
  },
  {
    slug: "shipping-cost-calculator",
    name: "Shipping Cost Calculator",
    domain: "business",
    category: "Shipping & Fulfilment",
    tagline: "What the parcel really costs — including the dimensional weight trap.",
    description:
      "Estimate domestic shipping costs by weight, box size, destination zone and service level — and catch dim-weight pricing before it catches you.",
    tags: ["shipping", "fulfilment", "dim weight", "logistics", "ecommerce"],
    howItWorks: [
      "Carriers bill the greater of actual weight and dimensional weight (L × W × H ÷ 139 for inches and pounds). A big light box is charged as if it were heavy, because it eats trailer space.",
      "Each destination zone has a base rate plus a per-pound rate. Zones follow distance bands: a Zone 2 parcel across town costs a fraction of the same box crossing the country at Zone 8.",
      "The service multiplier then scales freight: ground is the baseline, two-day express runs roughly 1.75×, and overnight about 3×. Packaging and handling are added last so they never hide inside the freight line.",
    ],
    example:
      "A 4 lb parcel in a 14×10×6 box at Zone 4 has a dim weight of 6.0 lb, so it bills at 6 lb: $15.00 freight on ground, $26.25 express, $46.50 overnight. With $1.50 packaging, ground all-in is $16.50 — and the box, not the product, is deciding the price.",
    faqs: [
      {
        q: "Why does my light parcel cost more than a heavy one?",
        a: "Dimensional weight. Carriers charge for space as much as mass — L×W×H ÷ 139 sets the minimum billable weight. Downsize the box and the price usually drops a zone or a tier.",
      },
      {
        q: "How do I find my zone?",
        a: "Zones are distance bands from your warehouse: Zone 2 is up to ~150 miles, Zone 8 the farthest. Your carrier's zone chart maps destination ZIPs — most e-commerce orders to the coasts land in Zones 5–8.",
      },
      {
        q: "Are these exact carrier rates?",
        a: "No — these are planning estimates from typical published base and per-pound rates. Carrier surcharges (fuel, residential, peak season) stack on top; get the live rate sheet before quoting customers.",
      },
      {
        q: "Should I offer free shipping?",
        a: "Run the numbers: free shipping is a price cut, and this tool tells you the size of it. Many stores fold a flat $6–$9 shipping estimate into product prices instead.",
      },
    ],
    component: ShippingCostCalculator,
  },
  {
    slug: "invoice-generator",
    name: "Invoice Generator",
    domain: "business",
    category: "Billing",
    tagline: "A clean, branded invoice with tax, due dates and one-click PDF.",
    description:
      "Build a professional invoice with line items, tax and payment terms, then print it, save it as PDF or download the HTML — free, no account.",
    tags: ["invoice", "billing", "freelancer", "payments", "accounting"],
    popular: true,
    howItWorks: [
      "Each line item multiplies quantity by rate, and the subtotal is the sum of those amounts. Tax applies to the subtotal in one step — no compounding surprises.",
      "The due date is the issue date plus your payment terms (Net 14 by default). The whole invoice recalculates live as you edit any field.",
      "Print opens your browser's print dialog with a clean, standalone layout — choose 'Save as PDF' as the destination. The HTML download gives you a self-contained file you can email or archive.",
    ],
    example:
      "The sample invoice: $1,800 design, 6 × $180 copywriting, 2 × $240 analytics = $3,360 subtotal, plus 8.5% tax ($285.60) = $3,645.60 due. Issued today, it is due in 14 days — Net 14, the standard freelance term.",
    faqs: [
      {
        q: "Is this a legal invoice for tax purposes?",
        a: "It contains everything an invoice needs: parties, date, itemisation, tax and total. Requirements vary by country (VAT numbers, sequential numbering) — add those details in the fields and notes if yours require them.",
      },
      {
        q: "How do I save it as a PDF?",
        a: "Click 'Print / save as PDF' and pick 'Save as PDF' in the print dialog. That produces a clean one-page document without tool UI around it.",
      },
      {
        q: "What payment terms should I use?",
        a: "Net 14 is the freelancer default; Net 30 for corporate clients. Shorter terms get paid sooner — Net 7 is increasingly common for small projects.",
      },
      {
        q: "Does my data get uploaded anywhere?",
        a: "No. Everything is generated in your browser and never leaves the page — safe for client details.",
      },
    ],
    component: InvoiceGenerator,
  },
  /* ------------------------------ SEO ------------------------------ */
  {
    slug: "meta-title-generator",
    name: "Meta Title Generator",
    domain: "seo",
    category: "On-Page SEO",
    tagline: "Six keyword-first titles, sized to Google's 60-character budget.",
    description:
      "Generate proven meta title patterns from your keyword and brand, with live character counts so every option fits the SERP.",
    tags: ["meta title", "title tag", "serp", "headline", "on-page seo"],
    howItWorks: [
      "Six title patterns run against your keyword and brand: guide, brand-append, how-to, year-stamped, explainer and listicle — the formats that consistently earn clicks across search studies.",
      "Each option is measured against Google's ~60-character display budget. Titles that run long get cut on mobile first, where the practical limit is closer to 45 characters.",
      "Front-loading the keyword matters most: the closer a word sits to the start of the title, the more weight users and crawlers give it when scanning results.",
    ],
    example:
      "Keyword “Email marketing” with brand “Brightlist” produces “Email marketing: The Complete Guide for 2026” (43 chars — green), “Email marketing — Brightlist” (28 — short but clean) and a listicle at 47 chars. Two of six over-run 60 characters, which is normal: pick the best-fitting three and A/B them.",
    faqs: [
      {
        q: "What is the ideal meta title length?",
        a: "30–60 characters. Under 30 wastes SERP real estate; over 60 gets truncated with an ellipsis. Measure in characters — pixel width varies by letter, so thin letters buy you a little extra room.",
      },
      {
        q: "Should I include my brand name?",
        a: "Yes, if it fits: brand names build recognition and can lift click-through on repeated searches. Put it at the end after a pipe or dash so the keyword stays in front.",
      },
      {
        q: "Does Google rewrite my titles?",
        a: "Often — studies put rewrites around 60% of results, usually when titles are stuffed, too long, or mismatched to the query. A clean, keyword-first title under 60 characters is your best defence against rewrites.",
      },
      {
        q: "Can I use the same pattern for every page?",
        a: "Use the patterns, vary the structure. If every page is “X: The Complete Guide”, your site looks templated to users scanning results — rotate formats across your calendar.",
      },
    ],
    component: MetaTitleGenerator,
  },
  {
    slug: "meta-description-generator",
    name: "Meta Description Generator",
    domain: "seo",
    category: "On-Page SEO",
    tagline: "Benefit-led descriptions that fit 155 characters and earn the click.",
    description:
      "Write meta descriptions from a keyword, benefit and call to action — four variants with live length checks against Google's display limit.",
    tags: ["meta description", "serp", "ctr", "on-page seo", "snippet"],
    howItWorks: [
      "Four description formulas combine your keyword, one benefit and one call to action — the three elements that decide whether a searcher clicks your result or the one below it.",
      "Length is measured against the ~155–160 character desktop display window. The pill turns amber below 120 (wasted space) and red above 160 (guaranteed truncation).",
      "Descriptions do not affect ranking directly — they affect click-through rate, which compounds: more clicks on the same position tells Google searchers prefer your result.",
    ],
    example:
      "For “project management” + “ship projects 2 weeks faster”: the direct variant lands at 141 characters — inside budget with room for Google's bolded query terms. The longest variant runs 168 and will lose its final phrase on desktop.",
    faqs: [
      {
        q: "How long should a meta description be?",
        a: "Aim for 120–158 characters. Google truncates around 155–160 on desktop and less on mobile, and short descriptions waste the selling space you are given.",
      },
      {
        q: "Do keywords in the description help ranking?",
        a: "Not directly — but Google bolds words matching the query, and bolded terms catch eyes. Include the keyword naturally for the bold, not for the algorithm.",
      },
      {
        q: "What if I leave the description empty?",
        a: "Google writes one for you from page text — usually the first suitable sentence, which rarely sells the click. A hand-written description is one of the highest-leverage 10 minutes in on-page SEO.",
      },
      {
        q: "Should every page have a unique description?",
        a: "Yes. Duplicate descriptions tell Google your pages compete with each other, and users notice the copy-paste. Unique, specific descriptions are worth their weight in CTR.",
      },
    ],
    component: MetaDescriptionGenerator,
  },
  {
    slug: "serp-snippet-preview",
    name: "SERP Snippet Preview",
    domain: "seo",
    category: "On-Page SEO",
    tagline: "See your result exactly as Google will render it — before you ship.",
    description:
      "Preview your title, URL breadcrumb and description as a real Google result, with pixel-width truncation warnings for the title tag.",
    tags: ["serp", "preview", "snippet", "title tag", "meta description"],
    popular: true,
    howItWorks: [
      "The preview mimics Google's desktop result card: favicon initial, site name, breadcrumb URL, 19px blue title and grey description — the elements a searcher actually scans.",
      "Title truncation is estimated in pixels, not characters, the way Google measures: roughly 580px of rendering space. The model budgets ~8.6px per character and cuts with an ellipsis when you run over.",
      "The breadcrumb reconstructs from your URL path: /advertising/roas-calculator renders as “Advertising › Roas Calculator”, matching how Google often displays sectioned URLs.",
    ],
    example:
      "Paste “ROAS Calculator — Measure Every Ad Dollar | ToolDeck” (52 chars, ~447px) and it renders in full. Add one more clause and the pixel estimate crosses 580px — the preview shows the ellipsis before Google does.",
    faqs: [
      {
        q: "Why measure the title in pixels instead of characters?",
        a: "Google allocates rendering width, not a character count. “W” and “M” eat roughly twice the width of an “i”, so 60 wide characters can truncate while 65 narrow ones fit. Pixel estimation is the honest test.",
      },
      {
        q: "Does the preview show mobile too?",
        a: "The card mirrors desktop proportions; mobile is tighter (roughly 45–50 characters of title). If your title fits desktop at ~55 chars, treat mobile as likely truncated and front-load the essential words.",
      },
      {
        q: "Will Google display my breadcrumb like this?",
        a: "Usually, when the URL has a clear structure and the site publishes BreadcrumbList schema. Flat URLs without a path render the bare domain instead.",
      },
      {
        q: "What makes searchers click one result over another?",
        a: "Promise + proof: the title sets the promise, the description gives one concrete benefit, and the URL confirms relevance. All three are editable in this preview.",
      },
    ],
    component: SerpSnippetPreview,
  },
  {
    slug: "keyword-density-checker",
    name: "Keyword Density Checker",
    domain: "seo",
    category: "Content Analysis",
    tagline: "Spot over-optimisation before Google does — unigrams to trigrams.",
    description:
      "Analyse any text for keyword frequency and density across one-, two- and three-word phrases, with stop-word filtering.",
    tags: ["keyword density", "seo content", "optimisation", "text analysis"],
    howItWorks: [
      "The text is tokenised to words and counted as single words, bigrams (two-word phrases) and trigrams (three-word phrases). Density is each phrase's count over the number of phrases of that length.",
      "Stop-word filtering excludes any phrase containing the, and, of and friends — those dominate raw counts and hide the phrases that matter. Toggle it off to see raw frequency.",
      "The verdict thresholds follow common practice: 1–2% for your top phrase is natural writing, 2–3% is worth diversifying, and above ~3% starts to look like keyword stuffing to search quality systems.",
    ],
    example:
      "The 57-word sample repeats “email marketing” four times — 8.7% of bigrams, deep in the red zone. Two mentions become “segmented email campaigns” and “each send” and the piece reads naturally again without losing relevance.",
    faqs: [
      {
        q: "What keyword density should I aim for?",
        a: "There is no official target — but 1–2% for the top phrase is where natural writing lands. Worry less about hitting a number and more about not repeating one phrase mechanically.",
      },
      {
        q: "Is keyword density still an SEO ranking factor?",
        a: "Not as a target — but stuffing is a negative signal, so the ceiling matters more than the floor. Cover the topic's vocabulary instead and density takes care of itself.",
      },
      {
        q: "Why filter stop words?",
        a: "Without filtering, “of the” and “in the” top almost every English text's bigram list. Filtering surfaces the two- and three-word phrases users actually search for.",
      },
      {
        q: "How long should the analysed text be?",
        a: "Analyse the full page — a section is too small for percentages to mean anything. Below ~150 words, treat every density figure as noise.",
      },
    ],
    component: KeywordDensityChecker,
  },
  {
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    domain: "seo",
    category: "Technical SEO",
    tagline: "Block the right bots, expose the right pages, ship the file.",
    description:
      "Generate a valid robots.txt from a crawl policy, disallowed paths, crawl-delay and sitemap reference — ready to upload.",
    tags: ["robots.txt", "crawl", "technical seo", "search console", "crawler"],
    howItWorks: [
      "A robots.txt is a list of user-agent groups: each bot reads the first group that matches its name (or the * wildcard) and follows the Disallow/Allow rules inside it.",
      "Three presets cover the common cases: standard (block private areas like /admin/ and checkout), allow-all (the public default) and block-all (staging, where you want nothing indexed).",
      "The Sitemap line at the bottom is technically outside the standard but supported by every major engine — it tells crawlers where the full URL inventory lives. Crawl-delay is respected by Bing and most minor bots; Google ignores it (use Search Console settings instead).",
    ],
    example:
      "The standard preset with four disallowed paths and a sitemap URL produces a 8-line file: block /admin/, /cart, /checkout and /thank-you for all bots, then declare the sitemap. Upload it to https://yoursite.com/robots.txt — the root, or it does nothing.",
    faqs: [
      {
        q: "Does Disallow keep a page out of Google?",
        a: "No — it stops crawling, not indexing. A disallowed page can still appear in results (without a snippet) if other pages link to it. To truly exclude a page, use a noindex meta tag and let it be crawled.",
      },
      {
        q: "Where exactly does robots.txt go?",
        a: "At the domain root: https://yoursite.com/robots.txt. Subdomains need their own file, and the filename is case-sensitive on most servers.",
      },
      {
        q: "Should I block GPTBot and AI crawlers?",
        a: "A policy decision, not an SEO one. Blocking keeps your content out of AI training datasets; allowing it can widen distribution. Many sites allow with attribution expectations — there is no universal answer.",
      },
      {
        q: "How do I test my robots.txt?",
        a: "Search Console's robots.txt report shows the live file and flags syntax errors. After any change, request a re-fetch — a broken robots.txt can hide your whole site for weeks.",
      },
    ],
    component: RobotsTxtGenerator,
  },
  {
    slug: "xml-sitemap-generator",
    name: "XML Sitemap Generator",
    domain: "seo",
    category: "Technical SEO",
    tagline: "Paste URLs, get a valid sitemap.xml Google will accept first try.",
    description:
      "Turn a list of URLs into a standards-compliant XML sitemap with lastmod dates, changefreq and priority — download or copy instantly.",
    tags: ["sitemap", "xml sitemap", "technical seo", "search console", "indexing"],
    howItWorks: [
      "Each URL becomes a <url> entry wrapped in the sitemaps.org 0.9 namespace — the schema Google, Bing and every major engine reads. Invalid lines (missing http/https) are skipped and counted so you can fix them.",
      "lastmod is stamped with today's date — the field search engines actually use, because it tells them when to re-check the page. changefreq and priority are declared but treated as weak hints.",
      "The result is saved as sitemap.xml and submitted in Search Console. Submission starts discovery; internal links remain what actually distributes crawl priority.",
    ],
    example:
      "Four URLs — home, /pricing, /blog/email-marketing-guide and /tools/roas-calculator — produce a 28-line sitemap with weekly changefreq and 0.8 priority. The counter reports “4 URLs included, 0 skipped”, ready for Search Console.",
    faqs: [
      {
        q: "How many URLs fit in one sitemap?",
        a: "50,000 URLs or 50MB uncompressed — far beyond most sites. Past that, split into multiple sitemaps and list them in a sitemap index file.",
      },
      {
        q: "Do I still need a sitemap if my site is small?",
        a: "It costs nothing and speeds up discovery of new pages, especially for sites without strong internal linking. Search Console also reports indexing status per submitted URL — free diagnostics.",
      },
      {
        q: "What is the difference between lastmod and changefreq?",
        a: "lastmod is a fact (when the page genuinely changed); changefreq and priority are suggestions engines largely ignore. Keep lastmod honest — fake dates erode trust in the whole file.",
      },
      {
        q: "Should pages with noindex be in the sitemap?",
        a: "No — a sitemap is a recommendation of index-worthy URLs. Submitting noindex pages sends contradictory signals and wastes crawl budget.",
      },
    ],
    component: XmlSitemapGenerator,
  },
  {
    slug: "url-slug-generator",
    name: "URL Slug Generator",
    domain: "seo",
    category: "Technical SEO",
    tagline: "Clean, keyword-dense slugs from any batch of titles.",
    description:
      "Convert titles into lowercase, hyphenated URL slugs — with accent stripping, stop-word removal and whole-word length limits. Batch-friendly.",
    tags: ["url", "slug", "permalinks", "technical seo", "content"],
    howItWorks: [
      "Each line is normalised: accents stripped (café → cafe), punctuation removed, everything lowercased, then whitespace and dashes collapsed into your chosen separator.",
      "Optional stop-word removal drops the, of, in and friends — leaving shorter, more keyword-dense slugs. It is optional because very short slugs can lose meaning (“the-cost-of-x” → “cost-x”).",
      "Length trimming cuts on a word boundary, never mid-word: a 60-character cap trims “ultimate-buyers-guide-for” at the last whole separator, preserving readable words.",
    ],
    example:
      "“Café Racer: The Ultimate Buyer's Guide” becomes cafe-racer-the-ultimate-buyers-guide (36 chars). With stop words removed it tightens to cafe-racer-ultimate-buyers-guide — same meaning, cleaner URL, still unambiguous.",
    faqs: [
      {
        q: "Hyphens or underscores in URLs?",
        a: "Hyphens — Google treats them as word separators; underscores historically join words. tooldeck-example vs tooldeck_example: only one parses as two words.",
      },
      {
        q: "How long should a slug be?",
        a: "3–5 meaningful words. Users read slugs in results and paste them as links; short keyword-dense slugs survive both. Everything after ~60 characters is ignored by most engines.",
      },
      {
        q: "Can I change a slug after publishing?",
        a: "Yes, but always add a 301 redirect from the old URL. Changing a slug without a redirect throws away the page's accumulated link equity and history.",
      },
      {
        q: "Should slugs include dates or categories?",
        a: "Prefer not. Dates expire (“2026 tips” reads stale in 2027) and category prefixes break when you re-organise. Keep the slug about the content itself.",
      },
    ],
    component: UrlSlugGenerator,
  },
  {
    slug: "schema-markup-generator",
    name: "Schema Markup Generator",
    domain: "seo",
    category: "Technical SEO",
    tagline: "Rich-result-ready JSON-LD for articles, products, FAQs and local.",
    description:
      "Generate valid JSON-LD structured data for Article, Product, FAQ and LocalBusiness pages — paste it in and qualify for rich results.",
    tags: ["schema", "structured data", "json-ld", "rich results", "technical seo"],
    popular: true,
    howItWorks: [
      "JSON-LD is Google's preferred structured-data format: a <script type=\"application/ld+json\"> block describing the page in schema.org vocabulary, separate from the visible HTML.",
      "Each type maps your inputs to the required and recommended properties — Article needs headline, author and dates; Product needs name and an Offer; FAQPage needs question/answer pairs.",
      "The output is a copy-paste snippet for the page's <head> or <body>. Validate it in Google's Rich Results Test — eligibility for stars, FAQ dropdowns and price badges is checked there.",
    ],
    example:
      "The FAQ preset with two question pairs yields a FAQPage block with mainEntity array — the exact structure that wins expandable FAQ results. The Article preset headlines “Email Marketing: The Complete Guide” with author and today's date pre-filled.",
    faqs: [
      {
        q: "Which schema types actually produce rich results?",
        a: "The reliable set: Article, Product (with reviews), FAQPage, HowTo, LocalBusiness, Organization, BreadcrumbList and Event. Google's gallery in Search Central documents each one's eligibility rules.",
      },
      {
        q: "Where do I paste the JSON-LD?",
        a: "Inside the <head> or top of <body> of the specific page. One script block per type; a page can carry several (an article that is also an FAQ gets both).",
      },
      {
        q: "Does schema markup improve rankings?",
        a: "Not directly — it improves how the result looks, which lifts click-through. Rich results occupy more screen space and answer pre-click questions, and that CTR gain compounds like any other.",
      },
      {
        q: "Can I mark up content that isn't visible on the page?",
        a: "No. Structured data must describe content that exists on the page. Hidden FAQ markups trigger manual actions — the FAQ content must be visible to users.",
      },
    ],
    component: SchemaMarkupGenerator,
  },
  /* ---------------------------- CONTENT ---------------------------- */
  {
    slug: "diff-checker",
    name: "Visual Diff Checker",
    domain: "content",
    category: "Text Utilities",
    tagline: "Compare two texts or code snippets side-by-side and highlight additions, deletions, and deltas.",
    description:
      "Instant text diffing with word and character delta tracking, whitespace trimming, and one-click unified output export.",
    tags: ["diff", "compare", "text comparison", "revisions", "changelog", "content"],
    popular: true,
    howItWorks: [
      "Computes line-by-line differences using the Longest Common Subsequence (LCS) algorithm entirely in your browser.",
      "Additions are highlighted in soft green (+), deletions in soft coral (-), and unchanged text remains neutral.",
      "Optional toggles allow you to ignore whitespace variations and case sensitivity for cleaner comparisons.",
    ],
    example:
      "Paste two draft blog posts or contract paragraphs to immediately spot which clauses were edited, added, or deleted without reading line by line.",
    faqs: [
      {
        q: "Is my text uploaded or stored on any server?",
        a: "No. The diff computation runs 100% on your device using client-side JavaScript. Your text never leaves your browser.",
      },
      {
        q: "Can I compare code snippets and JSON?",
        a: "Yes — the monospace diff viewer preserves indentation and shows exact code line deltas.",
      },
    ],
    component: DiffChecker,
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    domain: "content",
    category: "Writing Metrics",
    tagline: "Words, characters, sentences and reading time — counted as you type.",
    description:
      "Live word, character, sentence and paragraph counts with reading time and your most-used words — the writer's dashboard.",
    tags: ["word count", "character count", "reading time", "writing", "text analysis"],
    popular: true,
    howItWorks: [
      "Words are counted by whitespace splitting after trimming; characters are counted raw and again without spaces, because both numbers matter — essays ask for one, meta tags ask for the other.",
      "Sentences split on ., ! and ? boundaries; paragraphs on blank lines. Average words per sentence falls out of the two: above ~25 and readers start to drown.",
      "Reading time uses 225 words per minute, the commonly measured adult average for screen reading, rounded up to the minute.",
    ],
    example:
      "Paste a 1,200-word draft and see 6,842 characters (5,498 without spaces), 61 sentences (19 words each — healthy), 9 paragraphs and a 6-minute read. “actually” topping the most-used list is your cue to cut it.",
    faqs: [
      {
        q: "What counts as a word?",
        a: "Anything separated by whitespace — “state-of-the-art” is one word, numbers count. That matches what word processors and submission forms do.",
      },
      {
        q: "How long should a blog post be?",
        a: "Long enough to cover the promise of the title — typically 1,000–2,500 words for guides. Depth beats length: a tight 800 words outperforms a padded 2,000 every time.",
      },
      {
        q: "Why does reading time matter?",
        a: "Readers commit when they know the cost. A “6 min read” label sets expectations and measurably improves completion rates versus no label.",
      },
      {
        q: "What's a healthy average sentence length?",
        a: "15–20 words. Above 25, comprehension drops sharply — split long sentences and your writing instantly feels clearer.",
      },
    ],
    component: WordCounter,
  },
  {
    slug: "character-counter",
    name: "Character Counter",
    domain: "content",
    category: "Writing Metrics",
    tagline: "Your text against every platform limit that matters.",
    description:
      "Count characters live against X, Instagram, LinkedIn, SMS and SEO limits — with fill bars that turn red the moment you over-run.",
    tags: ["character count", "social media", "twitter", "limits", "writing"],
    howItWorks: [
      "Every keystroke recounts the text and updates seven platform bars: X (280), meta title (60), meta description (160), SMS (160), Instagram caption (2,200), LinkedIn post (3,000) and YouTube title (100).",
      "Bars fill proportionally and change colour as they approach the limit — green under 90%, amber near it, red over. The over-count shows exactly how many characters to cut.",
      "Counts are raw characters, matching how every platform measures (X's 280, SMS's 160). Emoji can cost more than one character on some legacy systems, but all modern platforms count code points.",
    ],
    example:
      "A 262-character post fills the X bar at 94% — green, one edit of headroom. The same text is 85 characters over YouTube's 100-title limit: cut the clause after the colon and both bars go green.",
    faqs: [
      {
        q: "Why 280 for X / Twitter?",
        a: "X doubled the classic 140 limit in 2017. Long posts are allowed via subscriptions now, but 280 remains what standard posts measure against.",
      },
      {
        q: "Does the meta description limit belong here?",
        a: "Yes — meta descriptions are just text with a display budget of ~160 characters. Writing them inside this counter kills the truncation problem at the source.",
      },
      {
        q: "Do emoji and links count?",
        a: "Emoji count as one or two characters depending on the platform; X counts all URLs as 23 characters regardless of length. Paste your real text and the raw count is close enough to draft against.",
      },
      {
        q: "What about LinkedIn's limit?",
        a: "3,000 characters for a standard post — but the feed truncates around 210 characters with a 'see more' fold. Put the hook in the first two lines regardless of the total.",
      },
    ],
    component: CharacterCounter,
  },
  {
    slug: "reading-time-calculator",
    name: "Reading Time Calculator",
    domain: "content",
    category: "Writing Metrics",
    tagline: "How long your text takes to read — at four realistic speeds.",
    description:
      "Calculate reading time from pasted text or a word count, across slow, average, fast and read-aloud speeds.",
    tags: ["reading time", "words per minute", "content length", "blogging"],
    howItWorks: [
      "Words are counted from your pasted text (or read from the live count) and divided by your chosen speed: 150 wpm for careful reading, 225 for the measured adult average, 300 for skimmers, 160 for read-aloud pacing.",
      "Results show in minutes and seconds, so a 1,400-word post at 225 wpm reads “6 min 13 sec” — the honest number behind a “6 min read” label.",
      "Read-aloud timing (160 wpm) doubles as a script tool: it estimates podcast or video duration from a written script before you record.",
    ],
    example:
      "A 1,400-word draft: 6 min 13 sec for the average reader, 9 min 20 sec for a slow one, 4 min 40 sec for a skimmer — and 8 min 45 sec read aloud, which is exactly the podcast segment it would produce.",
    faqs: [
      {
        q: "What's the average reading speed?",
        a: "Adults read non-fiction on screens at roughly 200–250 wpm; 225 is the working average. Skilled readers exceed 300, careful readers of dense material drop to 150.",
      },
      {
        q: "What's the ideal blog post reading time?",
        a: "Studies of engagement converge on 5–7 minutes for full reads. Past that, consider structuring with subheads so skimmers can navigate.",
      },
      {
        q: "Should I display reading time on articles?",
        a: "Yes — it sets expectations and improves completion. Publish the rounded-up figure; “7 min read” that takes 5:40 feels like a gift, the reverse feels like a cheat.",
      },
      {
        q: "Does reading speed differ by language?",
        a: "Modestly — English and Romance languages cluster near 200–250 wpm; Chinese and Japanese measure in characters per minute instead. For translation work, time the target-language text directly.",
      },
    ],
    component: ReadingTimeCalculator,
  },
  {
    slug: "text-case-converter",
    name: "Text Case Converter",
    domain: "content",
    category: "Text Utilities",
    tagline: "UPPER, Title, camel, snake, kebab — all eight, one paste.",
    description:
      "Convert any text into eight naming and writing conventions at once, each ready to copy — from headlines to variable names.",
    tags: ["case converter", "uppercase", "camelcase", "snake case", "developer"],
    howItWorks: [
      "Eight conventions are computed in parallel from one input: UPPERCASE, lowercase, Title Case (with minor words kept lowercase), Sentence case, camelCase, PascalCase, snake_case and kebab-case.",
      "The code formats split on spaces, hyphens and underscores — so “user_account-name” correctly becomes userAccountName, not user_accountName with a stuck underscore.",
      "Title Case follows headline convention: articles and short prepositions (a, the, of, in…) stay lowercase unless they open the line.",
    ],
    example:
      "“the quick brown fox jumps over the lazy dog” becomes “The Quick Brown Fox Jumps Over the Lazy Dog” in Title Case, theQuickBrownFox… in camelCase and the-quick-brown-fox… in kebab-case — three targets, one paste.",
    faqs: [
      {
        q: "Which case for URLs?",
        a: "lowercase kebab-case. URLs are case-sensitive after the domain; lowercase hyphenated slugs are the safest, most readable convention.",
      },
      {
        q: "camelCase or PascalCase for code?",
        a: "camelCase for variables and functions, PascalCase for classes, components and types in most style guides. snake_case dominates Python and database columns.",
      },
      {
        q: "When is Title Case wrong?",
        a: "Sentence case is the modern default for UI copy, emails and body text — Title Case stays for headlines, book titles and formal documents.",
      },
      {
        q: "Does it handle accented characters?",
        a: "Yes — accents pass through unchanged (Éclair → ÉCLAIR in upper). For URL-safe slugs, use the URL Slug Generator, which strips accents first.",
      },
    ],
    component: TextCaseConverter,
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    domain: "content",
    category: "Text Utilities",
    tagline: "Placeholder text by paragraph, sentence or word — instantly.",
    description:
      "Generate lorem ipsum placeholder text in exactly the amount you need for mockups, CMS testing and design reviews.",
    tags: ["lorem ipsum", "placeholder text", "dummy text", "design"],
    howItWorks: [
      "Text is generated from the classical lorem corpus — the scrambled Cicera passage typesetters have used since the 1500s — with realistic sentence lengths of 8–18 words.",
      "Choose your unit: paragraphs (3–5 sentences each), sentences or raw words. The classic “Lorem ipsum dolor sit amet…” opening is optional so regenerated blocks vary.",
      "Everything is produced locally with each Regenerate click — no two batches are identical, which keeps placeholders from looking like one repeated block in a design.",
    ],
    example:
      "Three paragraphs is the design-review standard: roughly 120 words, filling a card or article layout honestly — long enough to test wrapping, short enough not to hide layout bugs under scroll.",
    faqs: [
      {
        q: "Why lorem ipsum instead of real text?",
        a: "Neutral placeholder keeps reviews on the design: readable English invites line-editing, lorem invites layout critique. It also reveals letter distribution more honestly than 'abc' filler.",
      },
      {
        q: "Is lorem ipsum real Latin?",
        a: "It is scrambled fragments of Cicero's “De Finibus Bonorum et Malorum” (45 BC) — recognisably Latin roots, deliberately meaningless since a typesetter jumbled it in the 1500s.",
      },
      {
        q: "How much should I generate?",
        a: "Match the real content: 3 paragraphs for cards, 6–10 for article pages, exact word counts when the copy is contracted. The unit selector handles all three.",
      },
      {
        q: "Can I regenerate to get different text?",
        a: "Yes — Regenerate reshuffles from the corpus instantly. Distinct batches per slot keep a wireframe from looking copy-pasted.",
      },
    ],
    component: LoremIpsumGenerator,
  },
  {
    slug: "headline-analyser",
    name: "Headline Analyser",
    domain: "content",
    category: "Ideation",
    tagline: "Score any headline against the six checks strong titles pass.",
    description:
      "Rate your headline on length, structure, numbers, power words and emotional triggers — with specific fixes, not just a score.",
    tags: ["headline", "title analyser", "copywriting", "ctr", "blogging"],
    howItWorks: [
      "Six evidence-backed checks run on every headline: 40–70 character length, 6–12 words, a number, a power word (proven, free, complete…), an emotional trigger, and no ALL-CAPS shouting.",
      "Each passed check earns an equal sixth of the score, so the number is a diagnosis, not a mystery: the flagged items are exactly the fixes.",
      "The thresholds come from headline studies that keep finding the same patterns — list posts with numbers, specific promise plus emotion, inside Google's pixel budget.",
    ],
    example:
      "“10 Proven Ways to Double Your Email Open Rates” scores 100: 47 characters, 9 words, a number, “proven” and the emotional “double”. Drop “10” and it loses 17 points — the cheapest fix in copywriting is the one you can see.",
    faqs: [
      {
        q: "What makes a headline score well?",
        a: "Specificity plus stakes: a number or concrete promise, one power word, one emotional word, in 6–12 words. “10 Proven Ways to Double X” is the archetype for a reason.",
      },
      {
        q: "Is a higher score always better?",
        a: "No — the score flags missed opportunities, it doesn't rank creativity. A 70-score headline that perfectly fits its audience beats a formula-perfect 100 aimed at no one.",
      },
      {
        q: "Why does length matter so much?",
        a: "Google truncates around 60 characters, social cards around 70, and readers scan. 40–70 characters is the band where the full promise survives everywhere it is displayed.",
      },
      {
        q: "Should I A/B test headlines?",
        a: "Yes — analyser output is the shortlist, the audience decides. Test the two highest-scoring variants against each other in email subject lines or paid social where feedback is fast.",
      },
    ],
    component: HeadlineAnalyser,
  },
  /* ---------------------------- DESIGN ----------------------------- */
  {
    slug: "contrast-checker",
    name: "WCAG Contrast Checker",
    domain: "design",
    category: "Accessibility & Colors",
    tagline: "Test foreground and background color combinations against WCAG 2.2 AA and AAA standards.",
    description:
      "Verify color contrast ratios for normal text, large text, and UI components in real time with live preview.",
    tags: ["contrast", "wcag", "accessibility", "a11y", "color", "design tokens"],
    popular: true,
    howItWorks: [
      "The tool calculates the relative luminance of both colors using the WCAG 2.2 sRGB formula and determines the contrast ratio from 1:1 up to 21:1.",
      "WCAG 2.2 AA requires a minimum ratio of 4.5:1 for normal text and 3:1 for large text (18pt or 14pt bold).",
      "WCAG 2.2 AAA sets the higher bar at 7:1 for normal text and 4.5:1 for large text. UI icons and buttons require 3:1.",
    ],
    example:
      "A deep green ink (#1f4a3f) on warm cream (#fff6e0) yields a 9.18:1 contrast ratio — passing both WCAG AA and AAA with top marks for effortless readability.",
    faqs: [
      {
        q: "What is the difference between WCAG AA and AAA?",
        a: "AA is the legal and industry standard for public websites. AAA is the highest accessible tier, recommended for essential government, healthcare, or high-readability text.",
      },
      {
        q: "Does button or icon contrast matter?",
        a: "Yes — WCAG 2.1+ requires graphical objects and UI components (like active borders and icons) to achieve at least 3.0:1 contrast against adjacent colors.",
      },
      {
        q: "Can I swap the foreground and background?",
        a: "Yes — mathematically the contrast ratio between two colors is identical whether one is text or background.",
      },
    ],
    component: ContrastChecker,
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    domain: "design",
    category: "Image Tools",
    tagline: "Smaller images, same look — compressed entirely in your browser.",
    description:
      "Shrink JPEG and PNG files with quality control, optional WebP output and downscaling — files never leave your device.",
    tags: ["image compression", "webp", "page speed", "optimisation", "images"],
    howItWorks: [
      "The image is redrawn onto a canvas and re-encoded at your chosen quality (10–100). Quality 70 is the sweet spot where saving is large and loss invisible.",
      "Optional downscaling caps the width — most web images never render wider than 1,920px, so a 4,000px photo can shed 75% of its pixels before compression even starts.",
      "Output can be JPEG (universal) or WebP (typically 25–35% smaller at equal quality). The before/after sizes and savings percentage update live; download when the balance looks right.",
    ],
    example:
      "A 3.2MB phone photo at quality 70 with a 1,920px cap compresses to roughly 380KB — an 88% saving. Switching the same image to WebP usually lands near 260KB, the difference between a 1.2s and a 0.6s page load.",
    faqs: [
      {
        q: "What quality setting should I use?",
        a: "70 for photos is nearly invisible; 50 still looks good on mobile. Logos and screenshots with text prefer 85+ — flat colours band earlier than photos.",
      },
      {
        q: "JPEG or WebP?",
        a: "WebP wherever the browsers you support allow it — it is smaller at every quality level. Keep JPEG as the universal fallback.",
      },
      {
        q: "Are my images uploaded to a server?",
        a: "No — compression runs entirely in your browser via canvas. Nothing is transmitted, which makes it safe for unreleased product shots.",
      },
      {
        q: "Why did compression make my PNG bigger?",
        a: "PNG re-encoding through canvas loses its optimisation headroom. For flat graphics, compress the PNG to WebP instead, or use the original if it is already optimised.",
      },
    ],
    component: ImageCompressor,
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    domain: "design",
    category: "Image Tools",
    tagline: "Exact pixel dimensions with the aspect ratio locked on.",
    description:
      "Resize images to precise width and height with high-quality resampling, ratio locking and one-click presets for common web sizes.",
    tags: ["image resize", "dimensions", "scale", "images", "web"],
    howItWorks: [
      "The source is resampled onto a canvas at your target size using high-quality smoothing — downscaling averages real pixels rather than discarding rows, which is what makes it look clean.",
      "Ratio lock derives height from width (or the reverse) from the original's aspect ratio, so a 3:2 photo stays 3:2. Unlock to force exact dimensions — useful for thumbnails that must fit a frame.",
      "Presets (1,920 / 1,200 / 800 / 400px wide) cover the common web targets: hero, article, card and thumb. Output is PNG for lossless results.",
    ],
    example:
      "A 4,032×3,024 phone photo resized to 1,200px wide becomes 1,200×900 — 11% of the original pixels, ready for an article header. The 800px preset makes the card version at 800×600 from the same source in one click.",
    faqs: [
      {
        q: "Why does downscaling look better than upscaling?",
        a: "Downscaling has real information to average; upscaling must invent pixels, which softens edges. Scale down freely, avoid scaling up more than ~110%.",
      },
      {
        q: "What sizes does the web actually need?",
        a: "1,920px for heroes, 1,200 for article images, 800 for cards, 400 for thumbnails — then let srcset serve the right one. Uploading originals straight from the camera is the #1 page-speed leak.",
      },
      {
        q: "Should I resize before compressing?",
        a: "Yes — shrinking dimensions first means fewer pixels for the compressor to encode, and the two savings multiply. This tool pairs with the Image Compressor for exactly that pipeline.",
      },
      {
        q: "Does resizing strip EXIF data?",
        a: "Yes — canvas re-encoding drops EXIF including GPS coordinates. That is usually a feature: no location data leaks in published images.",
      },
    ],
    component: ImageResizer,
  },
  {
    slug: "image-cropper",
    name: "Image Cropper",
    domain: "design",
    category: "Image Tools",
    tagline: "Frame the shot — numeric crop with a live selection overlay.",
    description:
      "Crop images to an exact region with X/Y/width/height controls, a darkened overlay preview and clamping so you can't overshoot.",
    tags: ["image crop", "crop tool", "images", "design", "photos"],
    howItWorks: [
      "The crop region is defined by four numbers: X and Y (the top-left corner inside the image) and width and height. The overlay draws the selection over the darkened rest of the image.",
      "Every value clamps to the image bounds — X + width can never exceed the natural width — so blind numeric edits can't produce an invalid crop.",
      "Output renders the selected region at its native resolution to PNG. Cropping never resamples: a 400×300 crop of a 4,000px photo is a true 400×300.",
    ],
    example:
      "A 4,032×3,024 photo cropped at X 1,200, Y 500, 1,600×1,600 keeps the subject centre-square for an Instagram post or avatar — the overlay shows the frame before you commit, and 'Kept' reports 21% of the original.",
    faqs: [
      {
        q: "Why numeric crop instead of dragging?",
        a: "Numbers are exact and repeatable: the same X/Y/W/H reproduces the crop across a whole batch, and keyboard-only users get the same power. The overlay keeps it visual.",
      },
      {
        q: "What aspect ratios do social platforms want?",
        a: "1:1 for feed posts, 4:5 for portrait feed, 16:9 for YouTube thumbnails, 9:16 for stories. Set the crop size to those ratios and the export fits without letterboxing.",
      },
      {
        q: "Does cropping lose quality?",
        a: "No — the kept region is copied at native resolution, not resampled. Crop, then resize down if you need smaller: that order preserves maximum detail.",
      },
      {
        q: "Can I crop a precise face or product shot?",
        a: "Zoom the numbers: nudge X and Y by 10–20px steps while watching the overlay. The clamp guarantee means you can push values to the edges without errors.",
      },
    ],
    component: ImageCropper,
  },
  {
    slug: "colour-palette-generator",
    name: "Colour Palette Generator",
    domain: "design",
    category: "Colour",
    tagline: "Four harmony systems from one base colour — click to copy.",
    description:
      "Build complementary, analogous, triadic and monochromatic palettes from any hex colour, with hover-to-copy swatches.",
    tags: ["colour palette", "color scheme", "hex", "hsl", "design system"],
    howItWorks: [
      "Your hex is converted to HSL, where hue is the colour wheel position. Harmony maths lives in hue: complementary adds 180°, analogous ±30°, triadic ±120°.",
      "The monochromatic row keeps hue and saturation fixed and steps lightness −28% to +28% — five shades of one colour, the safest palette system for UI work.",
      "Click any swatch to copy its hex. Hovering reveals the code so you can grab exactly the shade you pointed at.",
    ],
    example:
      "Base #308F68 (the site's green) yields the complementary #8F3057 for CTAs, analogous #308F39/#30868F for calm variety, a triadic trio #68308F/#8F6830 for illustrations, and a five-step monochrome ramp ready for text/background states.",
    faqs: [
      {
        q: "Which harmony should a website start from?",
        a: "Monochromatic for the system (backgrounds, text, borders) plus one complementary accent for actions. It is nearly impossible to get wrong and reads as intentional.",
      },
      {
        q: "What is the 60-30-10 rule?",
        a: "60% dominant neutral, 30% secondary colour, 10% accent. Map the monochrome ramp to the 60/30 and spend the 10% on the complementary — instant hierarchy.",
      },
      {
        q: "Why work in HSL instead of RGB?",
        a: "HSL separates hue from lightness, which is how designers think: “same blue, darker”. RGB maths makes consistent shades almost accidental.",
      },
      {
        q: "How do I check accessibility on a palette?",
        a: "Contrast is about lightness more than hue — pair the lightness steps (L 20% text on L 95% background) and verify with a contrast checker; the HEX↔RGB tool shows relative luminance.",
      },
    ],
    component: ColourPaletteGenerator,
  },
  {
    slug: "hex-to-rgb-converter",
    name: "HEX to RGB Converter",
    domain: "design",
    category: "Colour",
    tagline: "HEX, RGB and HSL in one place — plus the contrast verdict.",
    description:
      "Convert colours between HEX, RGB and HSL with a live swatch, relative luminance and a recommendation for text that sits on top.",
    tags: ["hex to rgb", "color converter", "hsl", "css", "design"],
    howItWorks: [
      "HEX is parsed to red/green/blue bytes (0–255) — #1f4a3f is R 31, G 74, B 63. RGB can be edited directly and the hex updates in sync, so both directions work.",
      "HSL is derived and shown alongside because it is the space where design changes are easy: keep the hue, nudge lightness, get a consistent shade.",
      "Relative luminance (0.299R + 0.587G + 0.114B, weighted for human perception) decides the verdict: above ~0.6 needs dark text, below needs white — the WCAG starting point.",
    ],
    example:
      "#1f4a3f reads RGB(31, 74, 63), HSL(165°, 41%, 21%) with luminance 0.235 — far below 0.6, so white text on top is the correct pairing. The swatch demonstrates it live in the corner.",
    faqs: [
      {
        q: "What's the difference between HEX and RGB?",
        a: "None in colour — HEX is RGB written as hex bytes (#RRGGBB). CSS accepts both; HEX is shorter, RGB supports the alpha() function form.",
      },
      {
        q: "Why do designers prefer HSL?",
        a: "Because its channels match design intent: hue is the colour family, saturation the intensity, lightness the shade. “Darker version of the brand green” is one HSL nudge, not three RGB guesses.",
      },
      {
        q: "How is the text-on-colour recommendation calculated?",
        a: "Relative luminance with perceptual weights (green counts most, blue least), the same weighting WCAG contrast ratios build on. Above 0.6, dark text wins; below, white.",
      },
      {
        q: "Can I convert 3-digit hex like #FFF?",
        a: "This tool takes 6-digit hex — expand shorthand first (#FFF → #FFFFFF). The colour picker always produces the full form.",
      },
    ],
    component: HexRgbConverter,
  },
  {
    slug: "aspect-ratio-calculator",
    name: "Aspect Ratio Calculator",
    domain: "design",
    category: "Layout",
    tagline: "Simplify any ratio and scale dimensions without distorting.",
    description:
      "Reduce any width and height to its simplest ratio, identify the nearest standard format, and scale to a new width proportionally.",
    tags: ["aspect ratio", "dimensions", "16:9", "resize", "video"],
    howItWorks: [
      "The ratio simplifies by dividing both dimensions by their greatest common divisor: 1920×1080 reduces to 16:9 exactly as fractions do on paper.",
      "The nearest-standard check compares your decimal ratio against 1:1, 4:3, 3:2, 16:9, 21:9 and 9:16 — so you immediately know whether a client's “16:9 image” actually is one.",
      "The new-width calculator multiplies by the decimal ratio: 1,280px wide at 1.778 gives 720px tall — no rounding drift, because the ratio is carried, not the numbers.",
    ],
    example:
      "A 1,920×1,080 screenshot simplifies to 16:9 (0.1% off from 1.778). Enter a new width of 1,280 and the height lands at 720 — the classic 720p frame, resized without a single distorted pixel.",
    faqs: [
      {
        q: "How is aspect ratio calculated?",
        a: "Width ÷ height, then simplify both by their GCD. 1,920×1,080 ÷ 120 gives 16:9. The decimal (1.778) is what the new-width calculator uses under the hood.",
      },
      {
        q: "Why does CSS aspect-ratio matter?",
        a: "aspect-ratio: 16 / 9 reserves the correct height before an image or video loads — eliminating layout shift, which is a Core Web Vitals metric.",
      },
      {
        q: "Which ratio for which platform?",
        a: "16:9 video and heroes, 4:5 or 1:1 Instagram feed, 9:16 stories and reels, 3:2 classic photography, 21:9 cinematic. The nearest-standard check tells you where you already are.",
      },
      {
        q: "My ratio is 1,879:1,062 — why so odd?",
        a: "Odd dimensions are usually crops or exports at non-standard sizes. Simplify to see how far from 16:9 you've drifted — 0.1% is invisible, 5% reads as wrong immediately.",
      },
    ],
    component: AspectRatioCalculator,
  },
  /* ----------------------------- DATA ------------------------------ */
  {
    slug: "percentage-change-calculator",
    name: "Percentage Change Calculator",
    domain: "data",
    category: "Quick Stats",
    tagline: "From 12,500 to 18,400 is +47.2% — with the reverse check done for you.",
    description:
      "Calculate percentage increase or decrease between two values, with the absolute difference, multiplier and the reverse-change check.",
    tags: ["percentage change", "percent increase", "growth rate", "analytics"],
    howItWorks: [
      "Change is (new − old) ÷ |old| × 100 — the absolute value in the base matters, because percentages relative to a negative base flip meaning.",
      "The multiplier view (new ÷ old) shows the same fact as 1.472×, which is the form budgets and forecasts actually use.",
      "The reverse check computes what percentage drop from the new value returns to the old one — usually a smaller number than the increase, and the source of endless reporting errors.",
    ],
    example:
      "12,500 → 18,400 is +47.2% (1.472×). But falling back from 18,400 to 12,500 is only −32.1%: gains and losses measure against different bases. Report both directions and no one can misquote you.",
    faqs: [
      {
        q: "Why is a +25% gain undone by a −20% loss?",
        a: "Because the bases differ. +25% on 100 gives 125; −20% of 125 is 100 again. Percentage moves are not symmetrical — the reverse check in this tool shows the exact pair.",
      },
      {
        q: "What does percentage change of 100% mean?",
        a: "The value doubled. A 100% increase doubles; a 100% decrease reaches zero. Beyond 100% increase is ordinary — beyond 100% decrease is impossible.",
      },
      {
        q: "How do I annualise a percentage change?",
        a: "Use the multiplier, not the percentage: (1 + change)^(12/months) − 1. A 4% monthly gain compounds to about 60% a year, not 48%.",
      },
      {
        q: "Can the base be zero?",
        a: "No — percentage change from zero is undefined (division by zero). Report the absolute difference instead.",
      },
    ],
    component: PercentageChangeCalculator,
  },
  {
    slug: "data-format-converter",
    name: "Data Format Converter",
    domain: "data",
    category: "Format Conversion",
    tagline: "JSON, CSV, TSV and NDJSON — paste any, convert to any.",
    description:
      "Auto-detect JSON, CSV or TSV input and convert between delimited formats, JSON arrays and NDJSON — with quoting handled correctly.",
    tags: ["csv", "json", "tsv", "ndjson", "data conversion"],
    howItWorks: [
      "Input format is sniffed automatically: leading { or [ means JSON, otherwise the delimiter that appears most in the first line (comma, semicolon, tab, pipe) wins.",
      "Conversion normalises everything through an internal row model — each format becomes records, records become any output format. Nested objects survive as JSON strings inside cells so nothing is silently dropped.",
      "Output quoting follows RFC-4180: cells containing the delimiter, quotes or line breaks get wrapped in quotes with inner quotes doubled — the detail that breaks naive converters in Excel.",
    ],
    example:
      "A two-campaign JSON array converts to CSV with campaign,spend,revenue columns and two data rows; flipped the other way, a 200-row spreadsheet export becomes an NDJSON stream ready for an API import.",
    faqs: [
      {
        q: "What is NDJSON and why use it?",
        a: "One JSON object per line — the streaming format for logs and bulk API imports. Unlike a JSON array, each line parses independently, so a bad row doesn't kill the whole file.",
      },
      {
        q: "Why does my file open wrong in Excel?",
        a: "Locale. European Excel expects semicolons because commas are decimal separators. Convert to the semicolon variant here and it opens correctly.",
      },
      {
        q: "What happens to nested objects in CSV?",
        a: "They serialise as JSON text inside their cell — lossless but not spreadsheet-friendly. Flatten the data before converting if you need plain columns.",
      },
      {
        q: "Is my data uploaded anywhere?",
        a: "No — parsing and conversion run entirely in your browser. Safe for customer exports and internal data.",
      },
    ],
    component: DataFormatConverter,
  },
  {
    slug: "csv-viewer",
    name: "CSV Viewer",
    domain: "data",
    category: "Format Conversion",
    tagline: "Instant, clean table view of any CSV — no spreadsheet needed.",
    description:
      "Paste CSV data and inspect it as a scrollable table with auto-detected delimiters, row/column counts and per-column type hints.",
    tags: ["csv", "viewer", "table", "data inspection", "spreadsheet"],
    howItWorks: [
      "The parser handles quoted cells with embedded commas and escaped quotes properly — the RFC-4180 cases that break naive string.split(',').",
      "Delimiter auto-detect scores the first line: whichever of comma, semicolon, tab or pipe appears most often wins. Override it from the dropdown when a file mixes both.",
      "Each column is sampled for numeric content — 80%+ numeric values flags it as a number column, which then right-aligns, giving an instant sense of the data's shape.",
    ],
    example:
      "The four-row sample (date, channel, spend, orders) renders as a sticky-header table with two numeric columns highlighted. 1400 in spend is obviously currency; with 200 rows pasted, the same table scrolls at full speed.",
    faqs: [
      {
        q: "How large a CSV can this handle?",
        a: "Comfortably tens of thousands of rows — the table caps display (default 50, up to 500) while the stats count everything. For millions of rows, use a real data tool; for inspection, this is faster than opening Excel.",
      },
      {
        q: "Why does my file show one wide column?",
        a: "Wrong delimiter — likely semicolons or tabs auto-detected against an unusual first line. Set the delimiter manually from the dropdown.",
      },
      {
        q: "Does it show hidden characters or encoding issues?",
        a: "Yes, visibly: stray quotes and mojibake (Ã©-style sequences) appear in the cells, which is exactly what you want when diagnosing a broken export.",
      },
      {
        q: "Is my data sent anywhere?",
        a: "No — parsing is 100% local in your browser. Paste customer data freely.",
      },
    ],
    component: CsvViewer,
  },
  {
    slug: "json-to-csv-converter",
    name: "JSON to CSV Converter",
    domain: "data",
    category: "Format Conversion",
    tagline: "API responses into spreadsheets — columns built from your keys.",
    description:
      "Convert a JSON array into a clean CSV with automatic headers, correct quoting and Excel-friendly delimiter options — download ready.",
    tags: ["json to csv", "convert", "spreadsheet", "export", "api"],
    howItWorks: [
      "The first array element's keys become the header row; every object contributes its values in that order. Keys that appear in later objects are unioned in so no field is dropped.",
      "Nested values (objects, arrays) are serialised to JSON text inside their cell — lossless, and clearly marked so you can flatten deliberately rather than discover it in Excel.",
      "Delimiter choice matters for Excel: comma for most locales, semicolon for European ones where comma is the decimal separator, tab for pasting into tools that expect TSV.",
    ],
    example:
      "Three product objects (product, units, revenue) become a 4-line CSV — header plus 3 rows — with 42-unit desks at $2,814. Download it, open in Excel, and the pivot is one click away.",
    faqs: [
      {
        q: "What if my objects have different keys?",
        a: "The header is the union of all keys; objects missing a key get an empty cell. Nothing is silently discarded.",
      },
      {
        q: "Why does my number look like text in Excel?",
        a: "Usually locale decimals or leading zeros. Keep numbers plain (no currency symbols), use the semicolon delimiter in EU locales, and Excel will parse them as numbers.",
      },
      {
        q: "Can it handle deeply nested JSON?",
        a: "One level of structure works best. Deeply nested API responses should be flattened first (or accept JSON-strings in cells) — this tool never loses the data either way.",
      },
      {
        q: "Is there a row limit?",
        a: "No hard limit — the browser handles tens of thousands of rows locally. Very large exports may take a couple of seconds to encode.",
      },
    ],
    component: JsonToCsvConverter,
  },
  {
    slug: "average-calculator",
    name: "Average Calculator",
    domain: "data",
    category: "Quick Stats",
    tagline: "Mean, median, mode and range from any list of numbers.",
    description:
      "Paste numbers in any format and get mean, median, mode, range, sum and a symmetry verdict that tells you when the average is lying.",
    tags: ["average", "mean", "median", "mode", "statistics"],
    howItWorks: [
      "Numbers split on spaces, commas and new lines, so pasted spreadsheets, lists and prose tables all work. Non-numeric fragments are ignored rather than erroring.",
      "Mean is the sum over count; median is the middle of the sorted list (averaging the two middles for even counts); mode is the most frequent value, shown only when it actually repeats.",
      "The verdict compares mean and median: when they diverge beyond 20%, outliers are dragging the mean, and the median is the honest 'typical value' to report.",
    ],
    example:
      "Ten scores (82, 91, 78… 90) average 86.6 with median 86 — nearly identical, so the average is trustworthy. Add one 400 and the mean jumps to 122 while the median stays 86: the verdict turns amber and says why.",
    faqs: [
      {
        q: "When should I use median instead of mean?",
        a: "Whenever the data is skewed — incomes, house prices, response times, page loads. One billionaire in the room makes the mean useless; the median barely notices.",
      },
      {
        q: "What if no number repeats — is there a mode?",
        a: "Then there is no mode, and the tool says so. A mode that exists only by coincidence (two values tied once) is noise, not a statistic.",
      },
      {
        q: "Why does my average disagree with Excel's?",
        a: "Check what got excluded: text fragments are ignored here. If Excel included them as zero, its mean is the wrong one.",
      },
      {
        q: "How many decimal places should I report?",
        a: "One more than your data's precision. Scores in whole numbers → one decimal for the mean. Precision beyond the data's is noise dressed as rigour.",
      },
    ],
    component: AverageCalculator,
  },
  {
    slug: "standard-deviation-calculator",
    name: "Standard Deviation Calculator",
    domain: "data",
    category: "Quick Stats",
    tagline: "Spread that means something — sample or population, with context.",
    description:
      "Compute standard deviation and variance for sample or population data, plus the coefficient of variation that says whether the spread actually matters.",
    tags: ["standard deviation", "variance", "statistics", "data analysis"],
    howItWorks: [
      "Standard deviation is the square root of the average squared distance from the mean. Sample data divides by n−1 (Bessel's correction — an unbiased estimate); population data divides by n.",
      "Variance is shown alongside in squared units — correct for formulas, useless for intuition, which is why the headline number is the square root.",
      "The coefficient of variation (SD ÷ mean × 100) makes spread comparable across scales: 5 minutes of spread on a 10-minute task is a crisis; on a 3-hour task it is nothing.",
    ],
    example:
      "Eight delivery times (12.8, 13.1 … 13.2 min) give mean 12.96 and sample SD 0.27 min — a CV of 2.1%, tight enough to promise a 13-minute window. The verdict confirms: roughly two-thirds of deliveries land within ±0.27 min.",
    faqs: [
      {
        q: "Sample or population — which do I pick?",
        a: "Almost always sample. You rarely have every observation that could exist; n−1 corrects for what your subset underestimates. Population only when you truly have all of them.",
      },
      {
        q: "What is a 'good' standard deviation?",
        a: "Depends entirely on the mean — hence the coefficient of variation. Under ~10% of the mean is tight; above ~30% the average alone is misleading.",
      },
      {
        q: "Why n−1 for samples?",
        a: "A sample's spread is computed from the same points that estimated its mean, which biases variance low. Dividing by n−1 corrects that bias — it is Bessel's correction.",
      },
      {
        q: "What does '68% within one SD' mean?",
        a: "For roughly normal data, about two-thirds of values fall within ±1 SD of the mean, ~95% within ±2. It turns one number into a picture of the distribution.",
      },
    ],
    component: StandardDeviationCalculator,
  },
  /* -------------------------- DEVELOPER ---------------------------- */
  {
    slug: "password-generator",
    name: "Password & Secret Generator",
    domain: "developer",
    category: "Security & Crypto",
    tagline: "Generate cryptographically secure passwords and secrets with real-time Shannon entropy metrics.",
    description:
      "Generate high-entropy passwords with custom length, character sets, ambiguous character filters, and batch options.",
    tags: ["password", "secret", "crypto", "generator", "security", "token"],
    popular: true,
    howItWorks: [
      "Uses the browser's native Web Cryptography API (window.crypto.getRandomValues) for cryptographically strong pseudo-random numbers.",
      "Calculates Shannon entropy in bits (Length × log2(Pool Size)), rating passwords from Weak up to Cryptographic Grade (90+ bits).",
      "Offers instant batch generation so you can pick from multiple high-security candidates in one click.",
    ],
    example:
      "A 24-character password generated across uppercase, lowercase, numbers, and symbols delivers ~157 bits of entropy — effectively immune to modern brute-force attacks.",
    faqs: [
      {
        q: "Is Math.random() used?",
        a: "No. Math.random() is predictable and unsuitable for security. This tool strictly uses the hardware-seeded WebCrypto API.",
      },
      {
        q: "What are ambiguous characters?",
        a: "Characters that look similar in certain fonts (like 0, O, o, 1, l, I). Excluding them prevents transcription mistakes.",
      },
    ],
    component: PasswordGenerator,
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    domain: "developer",
    category: "Format & Validation",
    tagline: "Validate, beautify and minify JSON with precise error messages.",
    description:
      "Paste JSON to validate it instantly, beautify at 2 or 4 spaces, or minify for production — with exact parse errors when it's broken.",
    tags: ["json", "formatter", "validator", "beautify", "minify", "developer"],
    popular: true,
    howItWorks: [
      "Validation runs the browser's native JSON.parse — the same parser your code will use — so a green badge here means valid everywhere. Errors quote position and cause.",
      "Beautify re-serialises at your chosen indent (2 or 4 spaces) with keys preserved in insertion order, so reading order survives formatting.",
      "Minify strips all insignificant whitespace into one compact line — the form you ship in configs, responses and storage. The char counts show exactly what compression bought.",
    ],
    example:
      "A one-line config with 214 characters beautifies to 11 readable lines at 2 spaces (389 chars) and stays 214 minified. The key count (7) confirms nothing was lost in either direction.",
    faqs: [
      {
        q: "What are the most common JSON errors?",
        a: "Trailing commas, single instead of double quotes, unquoted keys, and comments — all legal in JavaScript, all invalid in JSON. The error message names the position.",
      },
      {
        q: "Does formatting change my data?",
        a: "No — whitespace is not data. Parse → re-serialise round-trips every key and value exactly; only the layout changes.",
      },
      {
        q: "2 or 4 spaces?",
        a: "Either — consistency within the team matters more than the choice. 2 spaces is the dominant convention in web tooling; 4 persists in Python-adjacent codebases.",
      },
      {
        q: "Is my data uploaded?",
        a: "No — parsing happens in your browser. Safe for API responses with tokens: paste, inspect, and nothing leaves the page.",
      },
    ],
    component: JsonFormatter,
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    domain: "developer",
    category: "Format & Validation",
    tagline: "Test patterns against live text with matches and groups listed.",
    description:
      "Build and debug regular expressions with instant highlighting, a match/group breakdown, flag toggles and safe presets for common patterns.",
    tags: ["regex", "regular expression", "pattern", "developer", "testing"],
    howItWorks: [
      "Your pattern compiles with the selected flags (g, i, m, s, u) and executes against the test string, listing every match with its index and capture groups.",
      "The test string renders with matches highlighted — the fastest way to see greedy vs lazy behaviour and accidental over-matching.",
      "A 500-match guard and 10k-character cap keep catastrophic backtracking from freezing the page; presets for email, URL, ISO dates and hex colours give safe starting points.",
    ],
    example:
      "The email preset [\\w.+-]+@[\\w-]+\\.[\\w.]{2,} with flags g finds all three addresses in the sample sentence, each listed with its position — and 'ana@brightlist.io' highlights the moment you paste your own text.",
    faqs: [
      {
        q: "Why is my match too greedy?",
        a: "Quantifiers grab as much as possible. <.+> swallows a whole tag pair; <.+?> stops at the first >. The highlight shows exactly where each match ends.",
      },
      {
        q: "What do the flags mean?",
        a: "g (all matches, not just the first), i (case-insensitive), m (^/$ match line boundaries), s (dot matches newlines), u (unicode). Toggle them and watch the match count change.",
      },
      {
        q: "How do I match an email exactly?",
        a: "Perfectly is impossible with regex — RFC 5322 is a full page. The preset covers practical addresses; validate truly critical input with a confirmation email instead.",
      },
      {
        q: "Why use named groups?",
        a: "(?<year>\\d{4}) reads as itself in code; \\1 doesn't. The tester shows numbered groups — in production, name them and the consuming code becomes self-documenting.",
      },
    ],
    component: RegexTester,
  },

  /* --------------------------- DEVELOPER (cont.) --------------------------- */
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder & Decoder",
    domain: "developer",
    category: "Encoders & Generators",
    tagline: "Encode and decode Base64 safely — UTF-8 correct, URL-safe optional.",
    description:
      "Convert text to Base64 and back with proper UTF-8 handling, a standard or URL-safe alphabet, and automatic padding repair on decode.",
    tags: ["base64", "encoding", "developer", "converter", "token"],
    popular: true,
    howItWorks: [
      "Encoding converts your text to UTF-8 bytes, then re-expresses every 3 bytes as 4 Base64 characters — the ~33% size growth shown in the stats is that fixed ratio, not removable overhead.",
      "The URL-safe alphabet swaps + and / for - and _ and drops the padding, which is what tokens and path segments need to survive routing, cookies and query strings.",
      "Decoding reverses the process after repairing common quirks first: whitespace stripped, URL-safe characters mapped back, missing padding rebuilt — then the bytes decode as UTF-8 text.",
    ],
    example:
      "The preloaded 31-character greeting encodes to 48 Base64 characters (SGVsbG8sIFRvb2xEZWNr…) — about 55% growth because of the accents. Switch the mode to Decode and the same string round-trips back to the original text, accents intact.",
    faqs: [
      {
        q: "Is Base64 encryption?",
        a: "No — it is a reversible encoding with no key. Anyone can decode it; use it for transport, not secrecy. Encrypt first, then Base64-encode the ciphertext if it must travel as text.",
      },
      {
        q: "Why does Base64 make things bigger?",
        a: "Three bytes become four characters, so output is about 4/3 of the input plus padding. On binary payloads like images that is exactly the data-URL cost.",
      },
      {
        q: "Standard or URL-safe?",
        a: "Standard wherever the Base64 stays inside JSON or files. URL-safe for JWTs, path segments and query values, where + and / collide with URL syntax.",
      },
      {
        q: "Why does my text decode as garbage?",
        a: "Usually because one side encoded a different character set (UTF-16 or Latin-1 bytes) — not a Base64 failure. Re-encode from the original source in UTF-8 and the round trip is clean.",
      },
    ],
    component: Base64EncoderDecoder,
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder & Decoder",
    domain: "developer",
    category: "Encoders & Generators",
    tagline: "Percent-encode parameters or whole URLs — and decode them back.",
    description:
      "Encode query values, path segments or complete URLs with the right scope, and decode percent-encoding with clear errors on malformed input.",
    tags: ["url", "uri", "encoding", "percent-encoding", "developer"],
    howItWorks: [
      "The Component scope escapes everything that could be mistaken for URL structure — :/?#[]@!&'()*+,;= all become %XX — which is what each query value or path segment needs.",
      "The Full URL scope keeps structural characters (: / ? & =) so a complete URL stays navigable, escaping only the content inside it, like spaces and non-ASCII text.",
      "Decoding runs decodeURIComponent inside a try/catch: a stray % that isn't part of a valid pair is reported as an error instead of crashing your app with a URIError.",
    ],
    example:
      "The preloaded search URL encodes at Component scope to https%3A%2F%2Ftooldeck.example%2Fsearch%3Fq%3Dunit%20converter%26lang%3Den (56 → 73 characters), while Full URL scope keeps the path readable and escapes just the space: q=unit%20converter.",
    faqs: [
      {
        q: "%20 or + for spaces?",
        a: "In percent-encoding, %20. The + convention only exists in application/x-www-form-urlencoded — HTML form submissions and some legacy APIs. decodeURIComponent keeps + literal, and so does this tool.",
      },
      {
        q: "When do I use which scope?",
        a: "Every value you interpolate into a URL: Component. The URL itself: Full URL. Encoding an already-complete URL with the Component scope is the classic double-encoding bug.",
      },
      {
        q: "Why is my decoded text garbage?",
        a: "Someone encoded bytes in another charset, often Latin-1. If you control the source, re-encode as UTF-8; if not, the bytes need manual recovery — no decoder can guess the charset for you.",
      },
      {
        q: "Is encoding a security measure?",
        a: "No. It preserves data integrity in transit, and encoding before concatenation prevents parameter smuggling — but it is not encryption and does not sanitize content.",
      },
    ],
    component: UrlEncoderDecoder,
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    domain: "developer",
    category: "Encoders & Generators",
    tagline: "Generate RFC 4122 v4 UUIDs in bulk, with formatting options.",
    description:
      "Create cryptographically random version-4 UUIDs one at a time or in batches of fifty, with uppercase and hyphen-free output for strict schemas.",
    tags: ["uuid", "guid", "developer", "generator", "random"],
    howItWorks: [
      "Each UUID comes from crypto.getRandomValues: 16 bytes of CSPRNG output with six bits overwritten to mark version 4 and the RFC variant — leaving 122 genuinely random bits.",
      "Batches render instantly in your browser; nothing is logged or stored. Every UUID is independently random, so a batch is exactly as safe as generating them one by one.",
      "The formatting options are lossless: uppercase changes case only, and removing hyphens still leaves the 32 hex digits that databases with CHAR(32) columns expect.",
    ],
    example:
      "The default batch of five renders like 3f9c2a4e-8b7d-4c2a-9e1f-6d4b8a2c5e7f — the third group always starts with 4 (the version) and the fourth with 8, 9, a or b (the variant). Generate a fresh batch any time; copy one row or all of them.",
    faqs: [
      {
        q: "Can two UUIDs collide?",
        a: "In theory yes, in practice no: 122 random bits means you would need to generate about 2.7 quintillion UUIDs for a 1-in-a-billion chance of one collision. Storage fills up first.",
      },
      {
        q: "UUID v4 or v7?",
        a: "v4 for pure randomness in IDs and tokens, anywhere unpredictability matters. v7 embeds a timestamp and sorts naturally in database indexes — useful, but its IDs are predictable by design.",
      },
      {
        q: "Are these cryptographically secure?",
        a: "Yes — crypto.getRandomValues is the browser's CSPRNG. That makes v4 UUIDs suitable for session identifiers, though they carry no identity data and still need expiry and rotation around them.",
      },
      {
        q: "Is a GUID the same thing?",
        a: "Microsoft's name for the same 128-bit format. The terms are interchangeable; UUID is the RFC 4122 standard spelling.",
      },
    ],
    component: UuidGenerator,
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    domain: "developer",
    category: "Encoders & Generators",
    tagline: "SHA-256, SHA-384, SHA-512 and SHA-1 digests, computed locally.",
    description:
      "Hash any text with the Web Crypto API and get hex and Base64 digests instantly — the input never leaves your browser.",
    tags: ["hash", "sha-256", "checksum", "developer", "security"],
    howItWorks: [
      "The Web Crypto API digests your UTF-8 bytes with the chosen algorithm, locally: a genuine one-way function anyone can verify, but nobody can reverse to recover the input.",
      "Flipping a single bit of the input changes roughly half the output bits — the avalanche effect that makes hashes reliable fingerprints for files and payloads.",
      "Output appears in both hex (the form most tools and databases expect) and Base64 (the compact form HTTP headers prefer), so you can cross-check any reference implementation.",
    ],
    example:
      "The preloaded input abc hashes with SHA-256 to ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad — the canonical test vector from the NIST specification. Change one character and every hex digit changes.",
    faqs: [
      {
        q: "Can a hash be reversed?",
        a: "The hash itself cannot — but short or predictable inputs fall to brute force. That is why raw SHA-256 is wrong for passwords: use a slow, salted KDF like Argon2 or bcrypt instead.",
      },
      {
        q: "Is SHA-1 still usable?",
        a: "Only for non-adversarial checksums. Practical collision attacks have existed since 2017 (SHAttered), so anything security-sensitive must use SHA-256 or newer.",
      },
      {
        q: "Which algorithm should I pick?",
        a: "SHA-256 is the default that satisfies almost everything. SHA-512 costs about the same on 64-bit machines and suits longer digests; SHA-384 is a truncated SHA-512.",
      },
      {
        q: "Why does my hash differ from the server's?",
        a: "Nine times out of ten it is the bytes, not the algorithm: a trailing newline, CRLF instead of LF, or UTF-8 versus UTF-16 encoding of text that looks identical on screen.",
      },
    ],
    component: HashGenerator,
  },

  /* -------------------------- PRODUCTIVITY -------------------------- */
  {
    slug: "pomodoro-timer",
    name: "Pomodoro Timer",
    domain: "productivity",
    category: "Time & Focus",
    tagline: "A 25/5 focus timer that counts your pomodoros as you bank them.",
    description:
      "Run the classic Pomodoro cycle with adjustable focus and break lengths, automatic round switching, and a running count of today's completed blocks.",
    tags: ["pomodoro", "focus", "timer", "productivity", "deep work"],
    popular: true,
    howItWorks: [
      "Set focus and break lengths (25 and 5 minutes in the classic cycle) and press start. The countdown runs locally — closing or refreshing the page resets it, so treat a started block as a commitment.",
      "When a block ends, the timer rolls straight into the next phase automatically: focus into break, break back into focus. Each completed focus block adds one pomodoro to the session counter.",
      "The progress bar shows where you are inside the current block, and the focus-time figure accumulates completed pomodoros × your focus length — your deep-work bank for the day.",
    ],
    example:
      "Start with the defaults: 25:00 of focus, an automatic 5-minute break, focus again. Four rounds later the counter reads 4 pomodoros and 100 focus minutes — the canonical deep-work block. Skip jumps phases when a meeting interrupts.",
    faqs: [
      {
        q: "Why 25 minutes?",
        a: "It is short enough that starting feels easy and long enough to finish something real — Cirillo's original interval. 50/10 or 90/20 suit slower-burn work; adjust the two fields and the cycle adapts.",
      },
      {
        q: "Should breaks be screen-free?",
        a: "Ideally yes: stand up, water, window. A break spent scrolling leaves you more tired than when you started, and the next block begins already compromised.",
      },
      {
        q: "What about interruptions?",
        a: "Note the intruder, park it, return. If something genuinely cannot wait, skip to the break and start a fresh block after — a ruined pomodoro does not count, and that is the method working.",
      },
      {
        q: "Where is the sound when time is up?",
        a: "There is none — the timer flips phases and the progress bar restarts. Keep it visible in a pinned tab and glance over; no notification permissions required.",
      },
    ],
    component: PomodoroTimer,
  },
  {
    slug: "meeting-cost-calculator",
    name: "Meeting Cost Calculator",
    domain: "productivity",
    category: "Planning & Cost",
    tagline: "What a recurring meeting really costs — per session and per year.",
    description:
      "Multiply attendees, blended hourly rate and duration into a per-meeting figure, project it annually by frequency, and see what a 45-minute version would save.",
    tags: ["meeting", "cost", "productivity", "management", "money"],
    howItWorks: [
      "Cost per meeting = attendees × blended hourly rate × duration. The blended rate is the loaded cost of an average attendee — salary plus ~30% overhead, divided by ~1,800 working hours a year.",
      "The annual projection multiplies by frequency: weekly meetings run 48 weeks a year (people take leave), fortnightly 24, monthly 12. One-off meetings cost once.",
      "The 45-minute variant shows the annual saving if the same meeting shed everything after 45 minutes — usually the least decision-dense part of any long meeting.",
    ],
    example:
      "Six people at a $75 blended rate in a weekly 90-minute stand-up: $675 per session, $2,700 a month, $32,400 a year — a mid-level salary for one status meeting. Compressing it to 45 minutes would save $16,200 of that every year.",
    faqs: [
      {
        q: "What is a blended rate?",
        a: "The average loaded hourly cost across attendees. Finance teams might average $60; executives $200+. Divide annual salary by 1,800 and add ~30% overhead — the calculator takes the final number.",
      },
      {
        q: "Doesn't this demonize meetings?",
        a: "It prices them. A decision meeting that kills a month of misdirected work is the cheapest $675 you will spend; a weekly status update that could be a document is the reverse.",
      },
      {
        q: "Why 48 weeks for weekly meetings?",
        a: "Four working weeks of leave plus holidays on average. If your team's calendar differs, the frequency field is editable — the projection follows it.",
      },
      {
        q: "Should I include prep time?",
        a: "If prep is real — reading a pre-read, building slides — add it to the duration. A 30-minute meeting with 20 minutes of prep each costs as much as a 50-minute one.",
      },
    ],
    component: MeetingCostCalculator,
  },
  {
    slug: "working-days-calculator",
    name: "Working Days Calculator",
    domain: "productivity",
    category: "Planning & Cost",
    tagline: "Count real working days between two dates — weekends and holidays out.",
    description:
      "Enter a date range to get calendar days, weekend days and working days, plus total working hours at 8 hours a day.",
    tags: ["working days", "business days", "dates", "planning", "productivity"],
    howItWorks: [
      "The range walks day by day, counting Mondays through Fridays and setting aside Saturdays and Sundays — the Mon–Fri convention most contracts and SLAs use.",
      "Public holidays are subtracted as a count: enter how many weekday holidays fall inside the range, because a holiday that lands on a Saturday costs nobody a working day.",
      "Working hours apply an 8-hour day and working weeks divide by 5 — handy when translating a deadline into person-weeks of capacity.",
    ],
    example:
      "January 2026 spans 31 calendar days containing 9 weekend days — 22 working days, or 21 once one weekday public holiday is excluded. At 8 hours a day that is 168 working hours, or 4.2 person-weeks of capacity in the month.",
    faqs: [
      {
        q: "Which holidays do I count?",
        a: "Only ones landing on a weekday inside your range. Christmas on a Saturday costs nobody a working day; the following Friday off does — count that one.",
      },
      {
        q: "Does the range include both endpoints?",
        a: "Yes — start and end day both count if they fall on weekdays. Monday to Friday of the same week is 5 working days.",
      },
      {
        q: "Can I count 6-hour days?",
        a: "Count days here, then scale: 22 working days × 6 hours = 132 hours. The 8-hour figure is a default, not a rule.",
      },
      {
        q: "Why not just divide calendar days by 7?",
        a: "Because a 30-day range starting mid-week is 22 working days, not 21.4. The day-by-day walk handles every starting weekday correctly.",
      },
    ],
    component: WorkingDaysCalculator,
  },
  {
    slug: "project-cost-calculator",
    name: "Project Cost Calculator",
    domain: "productivity",
    category: "Planning & Cost",
    tagline: "Turn estimated hours into a defensible project price.",
    description:
      "Combine labour hours, a blended rate and fixed costs, add contingency, and see the weekly burn rate plus the quote a target margin implies.",
    tags: ["project", "cost", "budget", "quote", "productivity"],
    howItWorks: [
      "Labour = estimated hours × blended rate across all roles. Fixed costs — software, contractors, hardware — ride on top, and contingency applies to the sum, because overruns burn fixed costs too.",
      "Burn per week divides total cost by planned duration: your weekly cash commitment, useful for spotting a 12-week project that quietly costs more per week than it bills.",
      "The suggested quote divides cost by (1 − margin): a 30% margin means 30% of the final price is profit — which is a 43% markup on cost, and the two numbers get confused constantly.",
    ],
    example:
      "320 hours at $95 is $30,400 of labour; add $4,500 fixed and 15% contingency ($5,235) for a $40,135 total. That burns $3,345 a week across 12 weeks, and the 30% margin quote prices the job at $57,336 — $17,201 of profit.",
    faqs: [
      {
        q: "How much contingency?",
        a: "15–25% for scoped work with known unknowns; 40%+ for first-of-its-kind builds. Under 10% is wishful thinking — overruns on new scopes cluster at 20–40%.",
      },
      {
        q: "Margin or markup?",
        a: "Margin is profit ÷ price; markup is profit ÷ cost. A 30% margin equals a 43% markup. Quote from margin — what you keep — then sanity-check the markup the client is being asked to wear.",
      },
      {
        q: "Should fixed costs carry contingency?",
        a: "Yes — quotes overrun on licenses and third-party fees as often as on hours, so this tool applies contingency to the labour-plus-fixed total.",
      },
      {
        q: "What if my hours are wrong?",
        a: "They will be — that is what contingency absorbs. Track actuals weekly against the burn figure and re-baseline the moment variance passes 10%.",
      },
    ],
    component: ProjectCostCalculator,
  },
  {
    slug: "deadline-calculator",
    name: "Deadline Calculator",
    domain: "productivity",
    category: "Time & Focus",
    tagline: "Add working days, weeks or months to a kickoff date.",
    description:
      "Project a deadline from a start date by working days (weekends skipped), calendar days, weeks or months — with the span and landing weekday shown.",
    tags: ["deadline", "dates", "planning", "working days", "productivity"],
    howItWorks: [
      "Working-day mode advances Monday through Friday only, so 15 working days from a Monday lands on the Monday three weeks later — and the start day itself is never counted.",
      "Calendar-day, week and month modes include weekends. Months clamp to the end of shorter months: January 31 plus one month is February 28, not a date that does not exist.",
      "The result panel shows the deadline's weekday (nobody wants a Friday-4pm delivery), the calendar span, and how many of those days were working days.",
    ],
    example:
      "Kick off Monday, November 2 2026 with 15 working days and the deadline lands on Monday, November 23 — a 21-calendar-day span containing exactly 15 working days. Switch to calendar days and 15 lands earlier, on Tuesday, November 17.",
    faqs: [
      {
        q: "Does the start day count?",
        a: "No. Day one is the first day after kickoff. If the kickoff day itself is a full working day, count from one day earlier.",
      },
      {
        q: "Are holidays skipped in working days?",
        a: "Not here — this tool skips weekends only. Count the holidays inside your window and pad the deadline, or use the working days calculator to see the gap first.",
      },
      {
        q: "Why does the weekday matter?",
        a: "Deliveries land on someone's desk. A Thursday deadline leaves Friday for feedback; a Friday deadline means feedback arrives Monday — five days lost on a two-week project.",
      },
      {
        q: "How are months of different length handled?",
        a: "By clamping to the last real day: Jan 31 + 1 month = Feb 28. That matches how contracts are usually written, even when some date libraries round the other way.",
      },
    ],
    component: DeadlineCalculator,
  },
  {
    slug: "time-zone-converter",
    name: "Time Zone Converter",
    domain: "productivity",
    category: "Global Work",
    tagline: "One time in one zone, translated to twelve cities at once.",
    description:
      "Convert a date and time from any of 12 zones to all of them simultaneously, with UTC offsets, abbreviations and day-shift markers for cross-date calls.",
    tags: ["time zone", "utc", "scheduling", "meeting", "productivity"],
    howItWorks: [
      "Enter a wall-clock time in the source zone; the browser's time-zone database resolves the exact instant, then formats it back in every other zone with correct DST handling for that specific date.",
      "Offsets and abbreviations (EST vs EDT, GMT vs BST) come from the same database, so the table is accurate for the date you picked — not an average offset.",
      "Day-shift markers flag zones where the converted time lands on a different calendar day than the source — the detail that ruins '9am for everyone' meeting proposals.",
    ],
    example:
      "14:30 UTC on January 15 2026 is 09:30 in New York (EST, UTC−5), 14:30 in London (GMT), 15:30 in Lagos (WAT), 22:30 in Shanghai and 01:30 in Sydney — marked +1 day, because Sydney has already crossed midnight.",
    faqs: [
      {
        q: "Does this handle daylight saving?",
        a: "Yes — the conversion resolves the exact instant for the date you picked, then applies each zone's rules for that date. January and July will genuinely differ where DST applies.",
      },
      {
        q: "Which zones are covered?",
        a: "Twelve spanning the working world: UTC plus Los Angeles, Denver, New York, São Paulo, London, Berlin, Lagos, Dubai, Shanghai, Tokyo and Sydney.",
      },
      {
        q: "Why does Sydney show a different day?",
        a: "Sydney is UTC+10/11, ahead of Europe. An afternoon UTC meeting happens after midnight there — the +1 day marker is exactly the signal not to schedule it.",
      },
      {
        q: "What about half-hour offsets?",
        a: "Zones like India (UTC+5:30) round-trip through the same database. The offset column shows the true offset, minutes included.",
      },
    ],
    component: TimeZoneConverter,
  },

  /* --------------------------- EDUCATION ---------------------------- */
  {
    slug: "gpa-calculator",
    name: "GPA Calculator",
    domain: "education",
    category: "Grades & GPA",
    tagline: "Your GPA on the 4.0 scale, course by course, as you go.",
    description:
      "Enter letter grades and credit values per course to compute your grade point average, quality points and letter band on the standard 4.0 scale.",
    tags: ["gpa", "grades", "student", "university", "education"],
    howItWorks: [
      "Each letter grade maps to grade points on the 4.0 scale — A and A+ earn 4.0, A− earns 3.7, stepping down to F at 0 — the scale most institutions publish.",
      "Quality points = grade points × credits, summed across courses, then divided by total credits. A 4-credit B+ moves your GPA more than a 2-credit A− precisely because credits weight it.",
      "Rows with zero or blank credits are ignored, so you can park next semester's courses at the bottom of the list without disturbing the calculation.",
    ],
    example:
      "Five courses — A (3cr), B+ (4cr), B (3cr), A− (2cr), C+ (3cr) — earn 48.5 quality points across 15 credits: a 3.23 GPA. The B+ in the 4-credit course is doing most of the damage; retakes say target the heavy, low courses first.",
    faqs: [
      {
        q: "Is A+ worth 4.0 or 4.3?",
        a: "Here 4.0, the most common convention. Some schools award 4.3 for A+ or run a different A− policy — always check your institution's published scale.",
      },
      {
        q: "What about pass/fail courses?",
        a: "Leave them out: they carry credits but no grade points, and counting them at zero would drag your average unfairly. Zero-credit rows are ignored here for the same reason.",
      },
      {
        q: "Weighted high-school GPA?",
        a: "This is the unweighted 4.0 scale. If your school adds a full point for AP or IB courses, convert those letters mentally — or keep comparing students on the unweighted scale.",
      },
      {
        q: "What grade do I need to raise my GPA?",
        a: "Add a hypothetical row: your expected grade in the next course at its credit weight, then watch the average move. It is the fastest what-if you can run.",
      },
    ],
    component: GpaCalculator,
  },
  {
    slug: "grade-calculator",
    name: "Grade Calculator",
    domain: "education",
    category: "Grades & GPA",
    tagline: "What score on the final gets the grade you want?",
    description:
      "Enter your grade so far, the weight of completed work and your target — see the exact final-exam score needed, plus a ladder of common targets.",
    tags: ["grade", "final exam", "student", "education", "planning"],
    popular: true,
    howItWorks: [
      "Your course grade is a weighted blend: current grade × completed weight + final exam score × final weight. The calculator solves that equation for the final.",
      "Weights must total 100% — if coursework so far counts for 60%, the final is the remaining 40%. The hint shows the remainder as you type.",
      "The target ladder shows what 90, 85, 80 and 70% course grades would each demand, so you can pick an achievable target instead of discovering the math at exam time.",
    ],
    example:
      "Sitting at 82% with 60% of the grade done and chasing 85%: you need 89.5% on the final, which counts for the remaining 40%. Even a perfect final caps the course at 89.2% — so 85% is tight, and an A is out of reach.",
    faqs: [
      {
        q: "What if the needed score is over 100?",
        a: "The target is mathematically gone — the ceiling stat shows your best possible course grade. Redirect that energy to the next course, where the points are still alive.",
      },
      {
        q: "What if it's negative?",
        a: "You have already secured the target: even a zero on the final keeps you above it. The final is upside now, not pressure.",
      },
      {
        q: "Do I include dropped lowest scores?",
        a: "If your syllabus drops the lowest quiz before computing the average, yes — enter the post-drop average and the post-drop weight. The math only works on consistent inputs.",
      },
      {
        q: "What about extra credit?",
        a: "Fold it into the current grade or the final's weight, whichever way your syllabus grants it. Most courses cap at 100%, and so does this calculation.",
      },
    ],
    component: GradeCalculator,
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    domain: "education",
    category: "Math Basics",
    tagline: "Three percentage questions, answered instantly.",
    description:
      "Compute X% of Y, what percent X is of Y, or the percentage change between two numbers — with the inverse changes most people get wrong.",
    tags: ["percentage", "math", "calculator", "discount", "education"],
    popular: true,
    howItWorks: [
      "X% of Y multiplies: percent × value ÷ 100 — the discount and tax calculation. The extras show the value after increasing or decreasing Y by X% in one step.",
      "'X is what % of Y' divides: part ÷ whole × 100 — market share, attendance, budget used. The fraction form is shown too, because it is often what you actually need.",
      "Percentage change divides the difference by the original: (new − old) ÷ |old|. The undo figure shows the reverse change — and reveals why +25% is undone by −20%, not −25%.",
    ],
    example:
      "15% of $240 is $36 — a coupon on a $240 order. The same numbers backwards: $36 is 15% of $240. And a price moving $80 → $100 is +25%; undoing it needs −20%, because the second percentage divides by the new, larger base.",
    faqs: [
      {
        q: "Why isn't −25% the undo of +25%?",
        a: "Percentages divide by their own base. +25% on 80 gives 100; taking 25% off 100 gives 75, not 80. The exact undo is 1 ÷ 1.25 − 1 = −20%.",
      },
      {
        q: "Percentage points vs percent?",
        a: "A rate moving from 4% to 5% is +1 percentage point but +25% in relative terms. Financial press usually means points; the change mode here gives relative change.",
      },
      {
        q: "How do I add 15% tax?",
        a: "Multiply by 1.15 — the 'increased by' extra does it directly. And +15% then −15% does not cancel: it lands 2.25% below where you started.",
      },
      {
        q: "Percentage change from zero?",
        a: "Undefined — division by zero. Any change from zero is 'all of it'; use the absolute difference and say so.",
      },
    ],
    component: PercentageCalculator,
  },
  {
    slug: "citation-formatter",
    name: "Citation Formatter",
    domain: "education",
    category: "Research & Citations",
    tagline: "APA 7 and MLA 9 citations from the fields you already have.",
    description:
      "Format journal articles, books and websites into APA 7 or MLA 9 citations with matching in-text forms — authors parsed from any reasonable input.",
    tags: ["citation", "apa", "mla", "research", "student"],
    howItWorks: [
      "Authors parse one per line in either order — 'Ada Lovelace' or 'Lovelace, Ada'. APA renders initials ('Lovelace, A.'), MLA keeps full names, and three or more authors collapse to et al. in MLA.",
      "Source type drives the template: journals carry volume, issue and pages; books carry the publisher; websites carry URL and, for MLA, an access date — each with its own punctuation skeleton.",
      "The in-text form is generated to match: APA parenthesizes author and year ('(Lovelace & Turing, 2025)'), MLA cites with page numbers ('(Lovelace and Turing 44)').",
    ],
    example:
      "Two authors on a journal article in APA 7: 'Lovelace, A., & Turing, A. M. (2025). Designing the analytical engine. The Babbage Review, 12(3), 44–61.' — cited in-text as (Lovelace & Turing, 2025). Switch to MLA 9 and the same fields produce the full-name, quoted-title version.",
    faqs: [
      {
        q: "Which style do I need?",
        a: "APA dominates the social sciences and education; MLA the humanities. Course syllabi usually name one — ask if unclear, because mixing styles in one bibliography is the most-corrected formatting error.",
      },
      {
        q: "Where are the italics?",
        a: "Plain text cannot mark them: in APA italicise the journal or book title; in MLA italicise the container. Apply italics when you paste into your document.",
      },
      {
        q: "How do I handle 21+ authors?",
        a: "APA 7 lists the first 19, an ellipsis, then the final author; MLA uses et al. after the first. For the papers you actually cite, list what you have and the formatter keeps up.",
      },
      {
        q: "Is the access date required?",
        a: "MLA wants access dates for undated web sources; APA dropped the practice. That is why the field only appears for MLA websites.",
      },
    ],
    component: CitationFormatter,
  },

  /* ---------------------------- EVERYDAY ---------------------------- */
  {
    slug: "age-calculator",
    name: "Age Calculator",
    domain: "everyday",
    category: "Dates & Ages",
    tagline: "Exact age in years, months and days — plus the next birthday.",
    description:
      "Compute age against today or any date, with totals in months, weeks and days, the weekday you were born and a countdown to the next birthday.",
    tags: ["age", "birthday", "dates", "everyday", "calculator"],
    popular: true,
    howItWorks: [
      "Age is calendar arithmetic, not decimal division: from June 15 1995 to October 31 2026 is 31 years, 4 months, 16 days — months borrow from years and days borrow from the previous month's length.",
      "Totals flatten the same span into months, weeks and days — 11,461 days in the worked example — the figure insurance forms and 'days on earth' posts actually want.",
      "The next birthday walks forward to your birth month and day, rolls February 29 to March 1 in common years, and counts the days away from your as-of date.",
    ],
    example:
      "Born June 15 1995, as of October 31 2026: 31 years, 4 months, 16 days — 11,461 days in total, born on a Thursday. The next birthday lands June 15 2027, 227 days out.",
    faqs: [
      {
        q: "Why does the as-of date matter?",
        a: "It is the whole point for legal ages: age at December 31, age at the policy date, age on the first day of school. Enter the date and the breakdown updates instantly.",
      },
      {
        q: "How does a Feb 29 birthday count?",
        a: "The calculator rolls it to March 1 in non-leap years, matching most jurisdictions' convention. In leap years, February 29 itself is the day.",
      },
      {
        q: "Isn't years × 365.25 close enough?",
        a: "For rough age, yes — but it drifts from the calendar by days and misses month boundaries entirely. Forms asking for age want calendar age, and this gives exactly that.",
      },
      {
        q: "Can I check someone else's age?",
        a: "Any birth date works — relatives, historical figures ('how old was Ada Lovelace in 1843?'), fictional characters. The math is identical.",
      },
    ],
    component: AgeCalculator,
  },
  {
    slug: "date-calculator",
    name: "Date Calculator",
    domain: "everyday",
    category: "Dates & Ages",
    tagline: "Add or subtract days, weeks, months or years from any date.",
    description:
      "Walk a date forward or backward by calendar units, with the landing weekday, total span and month-end clamping handled honestly.",
    tags: ["date", "calendar", "everyday", "planning", "calculator"],
    howItWorks: [
      "Days and weeks walk the calendar directly; months and years move the month while keeping the day of month wherever the target month allows.",
      "Month-end clamping keeps results real: January 31 plus one month is February 28, and the tool flags the clamp so the moved day is never a surprise.",
      "The span readout converts the jump into total days and weeks, with weekend days in the span counted — useful when a 'two month' lease is really 61 days.",
    ],
    example:
      "November 2 2026 plus 30 days lands on Wednesday, December 2 — 30 calendar days later, 10 of them weekend days. The same jump by months (one month) also lands December 2; from January 31 it would clamp to February 28.",
    faqs: [
      {
        q: "Why did my month-end move?",
        a: "Because February has no 31st. Clamping to the last real day is the standard legal convention, and the verdict flags it whenever it happens.",
      },
      {
        q: "Do results include weekends?",
        a: "Yes — this is calendar arithmetic. For deadlines that skip weekends, the deadline calculator in Productivity does the working-day math.",
      },
      {
        q: "Subtracting across a year boundary?",
        a: "Works as expected: November 2 minus 120 days crosses back into July. The weekday readout verifies the landing date.",
      },
      {
        q: "What is the furthest I can go?",
        a: "100,000 days — about 274 years. Enough for lease terms, anniversaries and most historical curiosity; beyond that it becomes archaeology, not planning.",
      },
    ],
    component: DateCalculator,
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    domain: "everyday",
    category: "Conversions",
    tagline: "Length, weight, volume and data — one value, every unit at once.",
    description:
      "Convert between metric and US units across four families, seeing your value expressed in every unit simultaneously instead of one guess at a time.",
    tags: ["unit converter", "measurement", "metric", "everyday", "conversion"],
    popular: true,
    howItWorks: [
      "Every unit is defined against a base — meters, kilograms, liters, bytes — by an exact factor: 1 inch is 0.0254 m by international agreement, not an approximation.",
      "The value converts to the base once, then fans out to every unit in the family; the row for your input unit reads back your value as a built-in checksum.",
      "Data storage shows both decimal (KB = 1000 B, what drive makers quote) and binary (KiB = 1024 B, what operating systems report) — the reason a '1 TB' drive shows about 909 TiB.",
    ],
    example:
      "1 meter fans out to 3.28084 feet, 1.09361 yards, 0.000621371 miles and 1,000 millimeters at once — no swapping the from-unit and re-converting. Switch to Data storage and 1 GB reads 0.931323 GiB.",
    faqs: [
      {
        q: "US or imperial units?",
        a: "US customary — the pints, gallons and fluid ounces actually used in the United States. True imperial pints (568 ml) differ; UK readers should double-check volume conversions.",
      },
      {
        q: "Why does 1 GB ≠ 1 GiB?",
        a: "Gigabyte is decimal (10⁹ bytes — storage marketing); gibibyte is binary (2³⁰ — memory and OS accounting). Neither is wrong; they answer different questions, and both are shown.",
      },
      {
        q: "How exact are the factors?",
        a: "Exact by definition: 1 inch = 25.4 mm and 1 pound = 0.45359237 kg are internationally fixed. Display rounds to 7 significant digits; the math underneath does not.",
      },
      {
        q: "Can I convert flour to cups?",
        a: "Cups-to-grams needs ingredient density — flour is not water. Convert volumes here; for baking weights use a recipe-specific chart.",
      },
    ],
    component: UnitConverter,
  },
  {
    slug: "temperature-converter",
    name: "Temperature Converter",
    domain: "everyday",
    category: "Conversions",
    tagline: "Celsius, Fahrenheit and Kelvin — all three, every time.",
    description:
      "Convert between Celsius, Fahrenheit and Kelvin with the formula shown, plus a reference table from absolute zero to boiling water.",
    tags: ["temperature", "celsius", "fahrenheit", "kelvin", "everyday"],
    howItWorks: [
      "The input converts to Celsius first — the bridge scale — then fans out: °F = °C × 9/5 + 32 and K = °C + 273.15, both exact definitions.",
      "The formula line shows the one being applied, so the conversion is auditable rather than a black box, and the reference table anchors all three scales physically.",
      "The verdict checks physical plausibility: below −273.15 °C is below absolute zero and impossible — which catches the classic sign error in Kelvin conversions.",
    ],
    example:
      "100 °C converts to 212 °F and 373.15 K — water boiling at sea level. Run the same input from Fahrenheit mode and 212 °F returns 100 °C and 373.15 K. Body temperature reads 37 °C, 98.6 °F, 310.15 K wherever you start.",
    faqs: [
      {
        q: "Why do two non-metric scales exist?",
        a: "History: Fahrenheit anchors human weather (0 cold, 100 hot); Celsius anchors water (0 freeze, 100 boil). Kelvin is Celsius shifted to start at absolute zero — same degree size.",
      },
      {
        q: "Why can't Kelvin be negative?",
        a: "It measures from absolute zero, where molecular motion stops. A negative Kelvin reading is a conversion error — the verdict flags it.",
      },
      {
        q: "Is −40 the same in both?",
        a: "Yes — the single crossover point, because −40 × 9/5 + 32 = −40. A favourite sanity check: enter −40 and both scales should agree.",
      },
      {
        q: "Oven temperatures?",
        a: "Convert as usual: 180 °C ≈ 356 °F, the 'moderate' oven. Recipes round to 350 °F because ovens are imprecise — the exact 356 never mattered.",
      },
    ],
    component: TemperatureConverter,
  },

  /* ---------------------------- ADDITIONAL DEVELOPER ---------------------------- */
  {
    slug: "jwt-decoder",
    name: "JWT Inspector & Decoder",
    domain: "developer",
    category: "Security & Tokens",
    tagline: "Decode, inspect claims, and check expiration on JSON Web Tokens locally.",
    description: "Paste any JWT to parse headers, payload claims, and signature status. Computes expiration deltas completely client-side with zero network calls.",
    tags: ["jwt", "tokens", "auth", "security", "base64", "developer"],
    howItWorks: [
      "The token is split by periods into header, payload, and signature components.",
      "Base64URL decoding reconstructs the JSON objects without exposing sensitive claims to a backend.",
      "Timestamp claims (exp, iat, nbf) are evaluated against client time to provide instant validity and expiration countdowns."
    ],
    example: "Paste an authentication bearer token to confirm claims like user ID, roles, issuer, and whether the expiration timestamp has lapsed.",
    faqs: [
      { q: "Is it safe to paste private JWTs?", a: "Yes. All decoding occurs 100% inside your browser using client-side Web APIs." },
      { q: "Does this tool verify cryptographic signatures?", a: "It validates token structure and decodes payloads; cryptographic signature verification requires knowledge of your private secret or public key." }
    ],
    component: JwtDecoder,
  },
  {
    slug: "cron-builder",
    name: "Cron Expression Builder & Explainer",
    domain: "developer",
    category: "Automation & Scheduling",
    tagline: "Build 5-field cron schedules and translate them into human-readable English.",
    description: "Visual cron builder for background tasks, serverless functions, and cron jobs. Generates the next 5 execution timestamps in real time.",
    tags: ["cron", "schedule", "automation", "developer", "backend"],
    howItWorks: [
      "Inputs for minute, hour, day of month, month, and day of week generate standardized cron expressions.",
      "A parsing engine translates wildcard, step, and range syntax into plain English.",
      "A local lookahead simulator projects future execution times based on the active pattern."
    ],
    example: "Configure '0 9 * * 1-5' to schedule a job every weekday morning at 9:00 AM.",
    faqs: [
      { q: "Which cron format is supported?", a: "Standard POSIX 5-field cron syntax (Minute, Hour, Day of Month, Month, Day of Week)." }
    ],
    component: CronBuilder,
  },
  {
    slug: "curl-to-code",
    name: "cURL to Code Converter",
    domain: "developer",
    category: "HTTP & APIs",
    tagline: "Turn cURL terminal commands into Fetch, Axios, Python, and Go requests.",
    description: "Converts curl CLI commands with headers, cookies, HTTP verbs, and request bodies into production-ready API code snippets.",
    tags: ["curl", "fetch", "axios", "python", "go", "api", "developer"],
    howItWorks: [
      "Tokenizes command line arguments (-X, -H, -d, --data-raw) into structured HTTP request models.",
      "Formats idiomatic syntax for JavaScript fetch, Node.js axios, Python requests, and Go net/http.",
      "Properly escapes JSON payloads and headers for clean copy-pasting."
    ],
    example: "Paste a curl command from your browser DevTools Network tab to instantly generate Python requests code.",
    faqs: [
      { q: "Can I convert POST requests with JSON payloads?", a: "Yes, both single-line and multiline raw JSON payloads are parsed and formatted." }
    ],
    component: CurlToCode,
  },
  {
    slug: "timestamp-converter",
    name: "Unix Timestamp & Epoch Converter",
    domain: "developer",
    category: "Time & Dates",
    tagline: "Convert epoch timestamps in seconds and milliseconds to human-readable dates.",
    description: "Real-time Unix epoch converter with live ticker. Translates between timestamps, ISO 8601 strings, UTC, and local browser time.",
    tags: ["timestamp", "epoch", "time", "date", "developer", "unix"],
    howItWorks: [
      "Detects seconds (10-digit) vs milliseconds (13-digit) automatically.",
      "Converts to ISO 8601, UTC, and formatted local time.",
      "Provides two-way conversion from a date-time picker back into integer epoch seconds and milliseconds."
    ],
    example: "Enter 1730380000 to see the exact UTC and local date, or pick a date to get the epoch integer for database queries.",
    faqs: [
      { q: "What is Unix epoch time?", a: "The number of seconds that have elapsed since January 1, 1970 00:00:00 UTC." }
    ],
    component: TimestampConverter,
  },

  /* ---------------------------- ADDITIONAL DESIGN ---------------------------- */
  {
    slug: "box-shadow-generator",
    name: "CSS Box Shadow Generator",
    domain: "design",
    category: "CSS & Styling",
    tagline: "Craft smooth, multi-layer elevation shadows with CSS and Tailwind code.",
    description: "Design multi-layer elevation shadows with blur, spread, color, opacity, and inset toggles. Live interactive canvas with light and dark mode testing.",
    tags: ["css", "shadow", "box-shadow", "elevation", "tailwind", "design"],
    howItWorks: [
      "Allows layering multiple shadows for realistic light falloff and elevation.",
      "Computes standard CSS box-shadow declarations and arbitrary Tailwind classes.",
      "Renders live on light cream, pure white, and deep dark backgrounds."
    ],
    example: "Stack a crisp 1px ambient border with a soft 12px blur shadow for modern UI card depth.",
    faqs: [
      { q: "Why use multi-layer shadows?", a: "Real physical lighting has both sharp contact shadows and diffuse ambient shadows; stacking 2 or more layers looks far more natural than 1 harsh shadow." }
    ],
    component: BoxShadowGenerator,
  },
  {
    slug: "svg-to-css",
    name: "SVG to CSS Data URI Generator",
    domain: "design",
    category: "Vectors & Assets",
    tagline: "Convert raw SVG vectors into background-image CSS and Base64 data URIs.",
    description: "Optimizes SVG markup, strips redundant XML metadata, and encodes characters into clean CSS background-image url() declarations.",
    tags: ["svg", "css", "data-uri", "base64", "vector", "design"],
    howItWorks: [
      "Strips comments, newlines, and excess whitespace from vector markup.",
      "URL-encodes specific characters (#, %, <, >) to ensure cross-browser CSS validity without bloat.",
      "Generates both lightweight URL-encoded CSS and Base64 strings."
    ],
    example: "Paste an icon SVG to get an inline background-image rule ready for CSS stylesheets.",
    faqs: [
      { q: "Why URL-encode instead of Base64?", a: "URL-encoded SVGs are roughly 20-30% smaller than Base64 and compress better over gzip." }
    ],
    component: SvgToCss,
  },
  {
    slug: "clamp-calculator",
    name: "Fluid Typography & Clamp Calculator",
    domain: "design",
    category: "Responsive Typography",
    tagline: "Generate modern CSS clamp() formulas for smooth fluid typography and spacing.",
    description: "Calculate linear interpolation formulas that scale typography smoothly between mobile and desktop viewports without media queries.",
    tags: ["clamp", "typography", "fluid", "responsive", "css", "tailwind", "design"],
    howItWorks: [
      "Takes min/max screen sizes and min/max font sizes in pixels.",
      "Solves the linear equation slope and y-intercept in rem and vw units.",
      "Outputs production-ready clamp(min, preferred, max) rules."
    ],
    example: "Scale headlines from 24px at 375px mobile to 48px at 1440px desktop seamlessly.",
    faqs: [
      { q: "What is CSS clamp?", a: "clamp(min, val, max) constrains an element between minimum and maximum bounds using a responsive preferred value." }
    ],
    component: ClampCalculator,
  },
  {
    slug: "favicon-generator",
    name: "Favicon & App Icon Generator",
    domain: "design",
    category: "Brand Assets",
    tagline: "Generate multi-size favicons and preview them in browser tab mockups.",
    description: "Design monogram favicons or upload logos to generate 16x16, 32x32, 180x180, and 192x192 icons with HTML meta tags.",
    tags: ["favicon", "app-icon", "pwa", "meta-tags", "design", "branding"],
    howItWorks: [
      "Renders custom monograms or uploaded images onto HTML5 Canvas elements.",
      "Simulates real browser tab display to verify legibility at small dimensions.",
      "Exports downloadable PNG assets and HTML link tags."
    ],
    example: "Type 'UT' to generate a matching cream-on-forest favicon set and export PNG files.",
    faqs: [
      { q: "What sizes are required for websites?", a: "At minimum: 16x16 and 32x32 for desktop browsers, and 180x180 for iOS home screens." }
    ],
    component: FaviconGenerator,
  },

  /* ---------------------------- ADDITIONAL FINANCE ---------------------------- */
  {
    slug: "freelance-rate-calculator",
    name: "Freelance Billable Rate Calculator",
    domain: "finance",
    category: "Pricing & Invoicing",
    tagline: "Calculate your required hourly and daily billing rates to hit your take-home goals.",
    description: "Factor in unpaid vacation, non-billable administrative time, business overhead, and taxes to establish a sustainable freelancing rate.",
    tags: ["freelance", "hourly-rate", "day-rate", "pricing", "finance", "consulting"],
    howItWorks: [
      "Calculates gross revenue needed to achieve net income after taxes and overhead.",
      "Deducts non-working weeks and applies billable time ratios to determine real productive hours.",
      "Divides gross target revenue by billable capacity to yield minimum hourly and daily rates."
    ],
    example: "Targeting $90,000 take-home with $12,000 expenses and 60% billable ratio requires ~$85/hour.",
    faqs: [
      { q: "What is a realistic billable ratio?", a: "Most solo freelancers spend 50-70% of their working hours on billable client work; the rest is sales, invoicing, and admin." }
    ],
    component: FreelanceRateCalculator,
  },
  {
    slug: "mrr-churn-calculator",
    name: "SaaS MRR & Churn Model",
    domain: "finance",
    category: "SaaS & Subscriptions",
    tagline: "Model monthly recurring revenue, net retention, and customer churn dynamics.",
    description: "Track beginning MRR, new logos, expansion, contraction, and cancellations to measure Net Revenue Retention (NRR) and SaaS Quick Ratio.",
    tags: ["mrr", "arr", "churn", "saas", "retention", "nrr", "finance"],
    howItWorks: [
      "Aggregates positive inflows (New MRR, Expansion) against negative outflows (Contraction, Churn).",
      "Calculates Gross Churn %, Net Churn %, and Net Revenue Retention (NRR).",
      "Evaluates growth sustainability using the SaaS Quick Ratio (healthy above 4.0x)."
    ],
    example: "A business with $50k MRR adding $9k new/expansion and losing $2.3k churn maintains 103.4% NRR.",
    faqs: [
      { q: "What is Net Revenue Retention (NRR)?", a: "The percentage of recurring revenue retained from existing customers over a period, including upgrades and downgrades." }
    ],
    component: MrrChurnCalculator,
  },
  {
    slug: "cash-runway-calculator",
    name: "Cash Runway & Burn Calculator",
    domain: "finance",
    category: "Cash Flow & Planning",
    tagline: "Calculate startup runway months and project your zero-cash depletion date.",
    description: "Model cash balance against gross burn, revenue inflows, and projected growth rates to anticipate when fundraising or profitability is required.",
    tags: ["runway", "burn-rate", "cash-flow", "startup", "finance", "fundraising"],
    howItWorks: [
      "Calculates net monthly burn as gross operating expenses minus collected revenue.",
      "Simulates dynamic growth rates for both revenue and expenses over a multi-year horizon.",
      "Identifies the exact month and year when cash reserves hit zero."
    ],
    example: "A business with $250k cash burning $20k net/month has 12.5 months of baseline runway.",
    faqs: [
      { q: "When should a startup begin fundraising?", a: "Standard practice is to begin fundraising when 6 to 9 months of runway remain." }
    ],
    component: CashRunwayCalculator,
  },
  {
    slug: "depreciation-calculator",
    name: "Asset Depreciation Calculator",
    domain: "finance",
    category: "Accounting & Tax",
    tagline: "Calculate annual asset write-offs and generate full depreciation schedules.",
    description: "Calculate straight-line and accelerated declining balance depreciation schedules for business equipment, vehicles, and software.",
    tags: ["depreciation", "accounting", "assets", "tax", "finance", "write-off"],
    howItWorks: [
      "Computes the depreciable base as initial cost minus salvage value.",
      "Generates year-by-year beginning book value, depreciation expense, and accumulated write-offs.",
      "Enforces salvage floors so book value never drops below estimated scrap value."
    ],
    example: "A $25,000 asset with $2,500 salvage over 5 years depreciates at $4,500/year under straight-line.",
    faqs: [
      { q: "What is straight-line depreciation?", a: "Spreading the depreciable cost of an asset equally across each year of its useful life." }
    ],
    component: DepreciationCalculator,
  },

  /* ---------------------------- ADDITIONAL MARKETING & ADS ---------------------------- */
  {
    slug: "utm-builder",
    name: "Campaign UTM Link Builder",
    domain: "marketing",
    category: "Tracking & Attribution",
    tagline: "Build standardized campaign tracking URLs with one-click channel presets.",
    description: "Generate clean, validated Google Analytics and Meta campaign tracking links with utm_source, medium, campaign, term, and content.",
    tags: ["utm", "tracking", "campaigns", "analytics", "marketing", "links"],
    howItWorks: [
      "Takes base destination URL and appends URL-encoded UTM query parameters.",
      "Includes presets for Google Ads, Facebook/Meta, Email Newsletters, and LinkedIn.",
      "Validates URL syntax and parameter consistency."
    ],
    example: "Add 'utm_source=newsletter&utm_medium=email&utm_campaign=q4_launch' to track email subscriber conversions.",
    faqs: [
      { q: "Why are UTM parameters necessary?", a: "They tell analytics platforms (like GA4) exactly which ad, email, or post drove a visitor." }
    ],
    component: UtmBuilder,
  },
  {
    slug: "ctor-calculator",
    name: "Email Click-to-Open Rate (CTOR) Calculator",
    domain: "marketing",
    category: "Email Marketing",
    tagline: "Measure email content quality and click-through performance among openers.",
    description: "Calculate Click-to-Open Rate (CTOR), Open Rate, and CTR to diagnose whether email copy or subject lines need optimization.",
    tags: ["email", "ctor", "ctr", "newsletter", "marketing", "conversion"],
    howItWorks: [
      "Calculates CTOR as unique clicks divided by unique opens.",
      "Separates subject line performance (open rate) from body copy and CTA effectiveness (CTOR).",
      "Benchmarks your rate against industry standards (15-20% is healthy)."
    ],
    example: "2,800 opens with 420 clicks yields a 15.0% CTOR, indicating healthy copy resonance.",
    faqs: [
      { q: "How does CTOR differ from CTR?", a: "CTR measures clicks over all delivered emails; CTOR measures clicks only among subscribers who actually opened the email." }
    ],
    component: CtorCalculator,
  },
  {
    slug: "viral-coefficient-calculator",
    name: "Viral Coefficient & K-Factor Calculator",
    domain: "marketing",
    category: "Growth & Referrals",
    tagline: "Calculate your referral K-factor and project multi-cycle viral customer growth.",
    description: "Model customer invitation rates, referral conversion, and viral loop cycle times to determine if your product has exponential viral growth.",
    tags: ["viral", "k-factor", "referrals", "growth", "marketing", "loop"],
    howItWorks: [
      "Computes the viral coefficient K as invites sent per user multiplied by conversion rate.",
      "Identifies exponential viral growth when K > 1.0.",
      "Calculates organic customer multipliers for sub-viral acquisition."
    ],
    example: "4 invites per user at 20% conversion gives K = 0.80, expanding initial user cohorts by 5.0x.",
    faqs: [
      { q: "What is a good viral coefficient?", a: "K > 1.0 creates exponential self-sustaining growth; K between 0.4 and 0.8 significantly amplifies paid ad spend." }
    ],
    component: ViralCoefficientCalculator,
  },
  {
    slug: "target-cpa-calculator",
    name: "Break-Even CPA Target Calculator",
    domain: "advertising",
    category: "Bidding & Economics",
    tagline: "Find the maximum allowable Cost Per Acquisition for media buying campaigns.",
    description: "Work backward from product retail price, COGS, and desired margins to set break-even and target CPA bidding ceilings.",
    tags: ["cpa", "roas", "bidding", "advertising", "media-buying", "ppc"],
    howItWorks: [
      "Deducts COGS, payment fees, and fulfillment from cart value to find gross profit before ad spend.",
      "Calculates break-even CPA where profit is zero.",
      "Deducts target profit margin to establish target CPA and target ROAS goals."
    ],
    example: "On a $120 product with $50 total costs and 25% target profit, target CPA is $40 (3.0x ROAS).",
    faqs: [
      { q: "What happens if actual CPA exceeds break-even CPA?", a: "Your business loses money on every customer order before accounting for repeat purchases." }
    ],
    component: TargetCpaCalculator,
  },
  {
    slug: "video-completion-calculator",
    name: "Video Completion Rate & CPCV Calculator",
    domain: "advertising",
    category: "Video Advertising",
    tagline: "Calculate video completion rates and cost per completed view across quartiles.",
    description: "Analyze video ad performance across 25%, 50%, 75%, and 100% completion quartiles for YouTube, TikTok, and Meta Reels.",
    tags: ["video", "vcr", "cpcv", "youtube", "tiktok", "advertising"],
    howItWorks: [
      "Calculates Video Completion Rate (VCR) as 100% completions divided by video starts.",
      "Computes Cost Per Completed View (CPCV) from campaign ad spend.",
      "Renders audience retention drop-offs across quartiles."
    ],
    example: "$2,500 spend delivering 50k starts and 12k full completions yields 24% VCR at $0.21 CPCV.",
    faqs: [
      { q: "What is a strong Video Completion Rate?", a: "For 15-30 second skippable video ads, 20% to 30% completion is generally considered strong." }
    ],
    component: VideoCompletionCalculator,
  },
  {
    slug: "ad-fatigue-estimator",
    name: "Ad Fatigue & Frequency Estimator",
    domain: "advertising",
    category: "Audience Optimization",
    tagline: "Estimate audience saturation and determine when ad creative fatigue sets in.",
    description: "Model impressions against target audience size and repeat view ratios to calculate average frequency and creative refresh cycles.",
    tags: ["frequency", "ad-fatigue", "saturation", "reach", "advertising"],
    howItWorks: [
      "Estimates unique reach based on impressions and retargeting algorithm concentration.",
      "Calculates average impressions seen per unique user.",
      "Flags fatigue risks and recommends days between creative asset rotations."
    ],
    example: "A 250k audience receiving 20k impressions/day reaches moderate fatigue around day 14.",
    faqs: [
      { q: "What causes ad fatigue?", a: "When audience members see the exact same creative too many times, click-through rates decline and CPA rises." }
    ],
    component: AdFatigueEstimator,
  },

  /* ---------------------------- ADDITIONAL BUSINESS ---------------------------- */
  {
    slug: "unit-economics-calculator",
    name: "Unit Economics & Contribution Margin Model",
    domain: "business",
    category: "Operations & Profit",
    tagline: "Model per-order revenue, COGS, shipping, payment fees, and net contribution.",
    description: "Calculate first-order contribution margin (CM1 before ads, CM2 after CAC) to verify unit business viability.",
    tags: ["unit-economics", "contribution-margin", "cogs", "business", "ecommerce"],
    howItWorks: [
      "Deducts COGS, inbound packaging, outbound shipping, gateway fees, and returns from order value.",
      "Computes Contribution Margin 1 (Gross unit profit before marketing).",
      "Subtracts Customer Acquisition Cost (CAC) to reveal true first-order profitability."
    ],
    example: "An $85 order with $36 operational costs and $22 CAC generates $27 net profit (31.8% margin).",
    faqs: [
      { q: "What is Contribution Margin 1 vs 2?", a: "CM1 reflects gross profit after all variable physical costs; CM2 deducts marketing acquisition spend." }
    ],
    component: UnitEconomicsCalculator,
  },
  {
    slug: "inventory-turnover-calculator",
    name: "Inventory Turnover & Days to Sell Calculator",
    domain: "business",
    category: "Inventory & Supply Chain",
    tagline: "Measure inventory turnover ratio and average days required to sell stock.",
    description: "Calculate inventory velocity, Days Sales of Inventory (DSI), and annual carrying costs from COGS and inventory valuations.",
    tags: ["inventory", "turnover", "dsi", "supply-chain", "business", "operations"],
    howItWorks: [
      "Calculates average inventory from starting and ending period values.",
      "Divides annual COGS by average inventory to determine annual turns.",
      "Divides 365 days by turnover ratio to calculate average holding days."
    ],
    example: "$360,000 COGS with $60,000 average inventory turns 6.0x per year (61 days to sell).",
    faqs: [
      { q: "Why is high inventory turnover beneficial?", a: "Higher turnover frees up working capital, reduces warehouse holding costs, and minimizes dead stock risks." }
    ],
    component: InventoryTurnoverCalculator,
  },
  {
    slug: "nps-calculator",
    name: "Net Promoter Score (NPS) Calculator",
    domain: "business",
    category: "Customer Experience",
    tagline: "Calculate customer Net Promoter Score and loyalty distribution from survey data.",
    description: "Tally Promoters (9-10), Passives (7-8), and Detractors (0-6) to calculate your Net Promoter Score with breakdown visualizer.",
    tags: ["nps", "satisfaction", "customers", "loyalty", "business", "cx"],
    howItWorks: [
      "Groups 0-10 survey scores into Promoters, Passives, and Detractors.",
      "Subtracts the Detractor percentage from the Promoter percentage to find NPS (-100 to +100).",
      "Displays percentage composition and customer sentiment health."
    ],
    example: "140 promoters, 70 passives, and 30 detractors across 240 responses yields an NPS of +46.",
    faqs: [
      { q: "What is considered a good NPS score?", a: "Any score above 0 is positive; above +50 is excellent, and above +70 is world-class customer loyalty." }
    ],
    component: NpsCalculator,
  },

  /* ---------------------------- ADDITIONAL SEO & CONTENT ---------------------------- */
  {
    slug: "social-share-preview",
    name: "Open Graph & Social Share Preview",
    domain: "seo",
    category: "Social Meta Tags",
    tagline: "Preview how your URLs will look when shared on X/Twitter, LinkedIn, and Facebook.",
    description: "Simulate social media link cards and generate verified og:title, og:description, and twitter:card meta tags.",
    tags: ["open-graph", "social-preview", "twitter-cards", "meta-tags", "seo"],
    howItWorks: [
      "Accepts meta title, description, destination URL, and 1200x630 image links.",
      "Renders live responsive card mockups for Twitter, LinkedIn, and Facebook.",
      "Generates production-ready HTML head tags with copy button."
    ],
    example: "Verify title truncation and image cropping before publishing a new blog post.",
    faqs: [
      { q: "What is the recommended Open Graph image size?", a: "1200 × 630 pixels (1.91:1 aspect ratio) displays crisply across all major platforms." }
    ],
    component: SocialSharePreview,
  },
  {
    slug: "hreflang-generator",
    name: "Hreflang & Canonical Tag Generator",
    domain: "seo",
    category: "International SEO",
    tagline: "Generate multi-language and regional hreflang link tags for international sites.",
    description: "Configure language and country combinations (e.g. en-US, en-GB, es-ES) with fallback x-default tags to prevent duplicate content penalties.",
    tags: ["hreflang", "international-seo", "canonical", "seo", "localization"],
    howItWorks: [
      "Validates ISO 639-1 language codes and ISO 3166-1 country codes.",
      "Creates reciprocal alternate link elements for search engines.",
      "Includes required x-default fallback for unmatched visitor languages."
    ],
    example: "Set up localized English and Spanish regional versions for global corporate websites.",
    faqs: [
      { q: "What does x-default do in hreflang?", a: "It tells search engines which page to serve when no specific language matches the user's browser settings." }
    ],
    component: HreflangGenerator,
  },
  {
    slug: "redirect-generator",
    name: "301 Redirect Rule Generator",
    domain: "seo",
    category: "Site Migrations",
    tagline: "Convert old and new URL pairs into Nginx, Apache, and Cloudflare redirect rules.",
    description: "Generate clean 301 permanent and 302 temporary redirect rules for web servers and Jamstack host platforms.",
    tags: ["redirects", "301", "nginx", "htaccess", "seo", "cloudflare"],
    howItWorks: [
      "Parses space- or tab-separated old-to-new URL pairs.",
      "Formats syntax for Nginx rewrite, Apache RedirectMatch, Cloudflare _redirects, or Next.js config.",
      "Supports 301 permanent and 302 temporary HTTP status codes."
    ],
    example: "Migrate 20 blog URLs into Nginx rewrite rules with one click.",
    faqs: [
      { q: "When should I use a 301 vs 302 redirect?", a: "Use 301 for permanent page moves to transfer SEO link equity; use 302 only for temporary maintenance." }
    ],
    component: RedirectGenerator,
  },
  {
    slug: "readability-analyzer",
    name: "Readability & Grade Level Analyzer",
    domain: "content",
    category: "Audience & Tone",
    tagline: "Analyze text readability with Flesch Reading Ease and Flesch-Kincaid Grade scores.",
    description: "Evaluate sentence length, syllable density, and complex words to score copy readability and optimize for clarity.",
    tags: ["readability", "flesch", "grade-level", "writing", "content", "copywriting"],
    howItWorks: [
      "Calculates words, sentences, and syllable distribution algorithmically.",
      "Computes Flesch Reading Ease (0-100) and Flesch-Kincaid Grade Level.",
      "Provides actionable copywriting guidance to simplify dense phrasing."
    ],
    example: "Analyze blog draft copy to ensure it scores between 60-70 for standard consumer readability.",
    faqs: [
      { q: "What is an ideal Flesch Reading Ease score for web copy?", a: "Between 60 and 70 (readable by an 8th-grade student) ensures maximum engagement." }
    ],
    component: ReadabilityAnalyzer,
  },
  {
    slug: "markdown-converter",
    name: "Markdown & HTML Converter",
    domain: "content",
    category: "Formatting & Markup",
    tagline: "Convert Markdown to clean HTML and HTML back to Markdown bi-directionally.",
    description: "Dual-pane converter for headings, bold, italic, code blocks, blockquotes, and lists with live rendered output.",
    tags: ["markdown", "html", "converter", "formatting", "content", "developer"],
    howItWorks: [
      "Parses markdown syntax into clean semantic HTML5 markup.",
      "Converts HTML tags back into lightweight Markdown formatting.",
      "Renders client-side without external dependencies or server trips."
    ],
    example: "Convert documentation drafted in Markdown into HTML for CMS posting.",
    faqs: [
      { q: "Are custom HTML tags stripped when converting to Markdown?", a: "Standard structural tags (h1-h6, p, ul, ol, a, strong, em) are converted; unsupported styling tags are cleanly preserved or ignored." }
    ],
    component: MarkdownConverter,
  },
  {
    slug: "filename-sanitizer",
    name: "File & Slug Name Sanitizer",
    domain: "content",
    category: "Assets & File Systems",
    tagline: "Sanitize titles and messy strings into clean kebab-case, snake_case, and file paths.",
    description: "Strips illegal characters, normalizes accents and diacritics, and formats strings for web URLs and cross-platform file systems.",
    tags: ["filename", "slug", "kebab-case", "snake-case", "sanitizer", "content"],
    howItWorks: [
      "Normalizes Unicode diacritics into ASCII equivalents (e.g. café -> cafe).",
      "Strips illegal OS filesystem characters while preserving valid file extensions.",
      "Generates kebab-case, snake_case, camelCase, and PascalCase simultaneously."
    ],
    example: "Turn 'Q4 Report (v2) — Notes!.pdf' into clean 'q4-report-v2-notes.pdf'.",
    faqs: [
      { q: "Why sanitize filenames?", a: "Unsanitized spaces, symbols, and accents cause broken links and transfer errors across different servers and cloud buckets." }
    ],
    component: FilenameSanitizer,
  },

  /* ---------------------------- ADDITIONAL DATA & PRODUCTIVITY ---------------------------- */
  {
    slug: "sample-size-calculator",
    name: "Statistical Sample Size Calculator",
    domain: "data",
    category: "Statistics & Sampling",
    tagline: "Calculate the required survey or experiment sample size for statistical significance.",
    description: "Compute required sample counts for surveys, A/B tests, and market research based on confidence level, margin of error, and population.",
    tags: ["sample-size", "statistics", "surveys", "confidence", "data", "research"],
    howItWorks: [
      "Applies Cochran's sample size formula for infinite and finite populations.",
      "Supports 90%, 95%, and 99% statistical confidence levels.",
      "Generates trade-off comparisons across alternative margins of error (1% to 10%)."
    ],
    example: "For a 100,000 population with 95% confidence and ±5% margin of error, 383 responses are required.",
    faqs: [
      { q: "Why is 50% used as the default expected proportion?", a: "A 50% proportion assumes maximum variance, ensuring your calculated sample size is large enough for any outcome." }
    ],
    component: SampleSizeCalculator,
  },
  {
    slug: "correlation-calculator",
    name: "Correlation & Linear Regression Calculator",
    domain: "data",
    category: "Statistics & Modeling",
    tagline: "Calculate Pearson correlation r, R², and linear regression slope (y = mx + b).",
    description: "Analyze paired numerical data series to determine statistical relationship strength and best-fit linear forecasting equations.",
    tags: ["correlation", "regression", "statistics", "pearson", "data", "analytics"],
    howItWorks: [
      "Calculates sample means, variances, and covariance across paired numerical arrays.",
      "Derives Pearson's correlation coefficient r and coefficient of determination R².",
      "Solves ordinary least squares slope m and intercept b for linear prediction."
    ],
    example: "Input paired ad spend and revenue points to quantify how strongly marketing investment drives return.",
    faqs: [
      { q: "What does an r value near 1.0 mean?", a: "r close to +1.0 indicates strong positive correlation: as X increases, Y increases proportionally." }
    ],
    component: CorrelationCalculator,
  },
  {
    slug: "data-deduplicator",
    name: "Data & Text Deduplicator",
    domain: "data",
    category: "Data Wrangling",
    tagline: "Remove duplicate lines and clean up lists, emails, and CSV rows in seconds.",
    description: "Fast in-browser deduplication for customer emails, URLs, keywords, and data exports with case sensitivity and whitespace controls.",
    tags: ["deduplication", "cleaner", "csv", "lists", "data", "wrangling"],
    howItWorks: [
      "Splits input by newlines and evaluates line uniqueness using Set hashing.",
      "Supports trimming whitespace and case-insensitive matching.",
      "Exports clean unique entries and provides duplicate counts."
    ],
    example: "Paste an export of 1,000 newsletter signups to instantly eliminate duplicate emails.",
    faqs: [
      { q: "Is my data uploaded to a server?", a: "No. All list processing and deduplication happens completely inside your browser memory." }
    ],
    component: DataDeduplicator,
  },
  {
    slug: "sprint-capacity-planner",
    name: "Sprint Capacity & Velocity Planner",
    domain: "productivity",
    category: "Agile & Projects",
    tagline: "Calculate engineering sprint capacity and recommended story point commitments.",
    description: "Account for team headcount, working days, planned PTO, agile ceremony overhead, and focus factors to prevent sprint over-commitment.",
    tags: ["scrum", "sprint", "capacity", "agile", "velocity", "productivity"],
    howItWorks: [
      "Calculates gross team hours from sprint days and headcount minus PTO holidays.",
      "Deducts meeting overhead (standups, refinement, retros) and applies a focus factor.",
      "Translates net productive hours into recommended story point commitment targets."
    ],
    example: "A 5-engineer team in a 2-week sprint with 2 PTO days and 20% ceremonies has capacity for ~40 story points.",
    faqs: [
      { q: "Why apply an 85% commitment buffer?", a: "A 15% buffer absorbs unexpected bugs and review delays, preventing task spillover into future sprints." }
    ],
    component: SprintCapacityPlanner,
  },
  {
    slug: "timesheet-calculator",
    name: "Weekly Timesheet & Pay Calculator",
    domain: "productivity",
    category: "Time & Billing",
    tagline: "Log daily clock-in and clock-out hours to calculate gross earnings and overtime.",
    description: "Weekly hours and wages calculator for employees and contractors. Calculates net work time deducting unpaid breaks with overtime multipliers.",
    tags: ["timesheet", "hours", "overtime", "wages", "payroll", "productivity"],
    howItWorks: [
      "Calculates daily duration between clock-in and clock-out minus lunch breaks.",
      "Sums total weekly hours and separates regular time from overtime beyond 40 hours.",
      "Calculates gross earnings at standard and 1.5x overtime rates."
    ],
    example: "Log a standard 40-hour work week plus 2 hours overtime at $45/hr to compute gross earnings.",
    faqs: [
      { q: "How is unpaid lunch break deducted?", a: "Break minutes are automatically subtracted from the total elapsed duration of each work day." }
    ],
    component: TimesheetCalculator,
  },
  {
    slug: "priority-matrix",
    name: "Eisenhower Priority Matrix",
    domain: "productivity",
    category: "Task Management",
    tagline: "Organize tasks by urgency and importance with an interactive 4-quadrant board.",
    description: "Prioritize daily goals into Do First, Schedule, Delegate, and Eliminate. Export your daily checklist as Markdown.",
    tags: ["eisenhower", "priority", "productivity", "tasks", "time-management"],
    howItWorks: [
      "Classifies tasks across two dimensions: Urgency and Importance.",
      "Provides rapid quadrant reassignment and completion tracking.",
      "Exports formatted Markdown checklists for task management apps."
    ],
    example: "Move high-impact strategic projects to Q2 (Schedule) to protect focus time before urgent firefighting strikes.",
    faqs: [
      { q: "What belongs in Quadrant 2?", a: "Tasks that are highly important for long-term goals but have no immediate deadline, like planning, learning, and system architecture." }
    ],
    component: PriorityMatrix,
  },

  /* ---------------------------- ADDITIONAL EDUCATION & EVERYDAY ---------------------------- */
  {
    slug: "final-exam-calculator",
    name: "Final Exam Grade Calculator",
    domain: "education",
    category: "Grades & GPA",
    tagline: "Find out what score you need on your final exam to secure your target course grade.",
    description: "Calculate the exact percentage needed on your final exam based on current syllabus standing and final exam weighting.",
    tags: ["grades", "final-exam", "gpa", "college", "school", "education"],
    howItWorks: [
      "Evaluates current course standing and remaining syllabus weighting.",
      "Solves for the required exam percentage to achieve target letter grades.",
      "Provides status indicators for achievable goals and extra credit requirements."
    ],
    example: "With an 84% course average and a 30% final exam, you need 94.0% to achieve an A (90%).",
    faqs: [
      { q: "What if the required score is above 100%?", a: "That indicates your target letter grade is mathematically out of reach unless extra credit is awarded." }
    ],
    component: FinalExamCalculator,
  },
  {
    slug: "sig-fig-calculator",
    name: "Significant Figures Calculator",
    domain: "education",
    category: "Math & Science",
    tagline: "Count significant figures and format numbers into scientific and rounded notation.",
    description: "Analyze significant digits, trailing zeros, and round values to specified precision according to standard scientific rounding rules.",
    tags: ["sig-fig", "precision", "scientific-notation", "chemistry", "physics", "education"],
    howItWorks: [
      "Identifies significant non-zero digits and decimal trailing zeros.",
      "Formats values into standard scientific exponential notation (mantissa x 10^exp).",
      "Rounds numbers to specified significant figure precision."
    ],
    example: "0.004520 has 4 significant figures and formats to 4.520 x 10^-3.",
    faqs: [
      { q: "Are trailing zeros significant?", a: "Yes, if a decimal point is explicitly present (e.g. 50.0 has 3 sig figs, while 50 typically has 1)." }
    ],
    component: SigFigCalculator,
  },
  {
    slug: "tip-splitter",
    name: "Tip & Bill Splitter",
    domain: "everyday",
    category: "Money & Dining",
    tagline: "Calculate gratuity and split restaurant checks evenly with whole-dollar rounding.",
    description: "Calculate tip amounts (15%, 18%, 20%, 25%, or custom), split bills evenly among groups, and round totals to clean figures.",
    tags: ["tip", "bill-splitter", "restaurant", "dining", "everyday", "money"],
    howItWorks: [
      "Calculates tip percentage and adds to base bill amount.",
      "Optionally rounds total up to the nearest whole dollar.",
      "Divides bill and tip evenly across any number of dining guests."
    ],
    example: "An $86.50 bill with 18% tip split among 3 people comes out to $34.02 each.",
    faqs: [
      { q: "Does the per-person amount include tip?", a: "Yes, both total per person and tip portion per person are calculated and displayed." }
    ],
    component: TipSplitter,
  },
  {
    slug: "fuel-cost-calculator",
    name: "Trip Fuel & Mileage Calculator",
    domain: "everyday",
    category: "Travel & Auto",
    tagline: "Estimate road trip fuel costs and split gas expenses per passenger.",
    description: "Calculate fuel needed and total gas expenses for road trips using US (MPG / Gallons) or Metric (L/100km / Liters) units.",
    tags: ["fuel", "gas", "mileage", "trip", "road-trip", "travel", "everyday"],
    howItWorks: [
      "Calculates total fuel consumption from distance and vehicle efficiency.",
      "Multiplies fuel needed by local price per gallon or liter.",
      "Calculates cost per mile/km and splits total gas expense across passengers."
    ],
    example: "A 320-mile trip at 28 MPG and $3.65/gal costs $41.71 total ($20.86 per person for two).",
    faqs: [
      { q: "Can this calculate round trips?", a: "Yes, toggling Round-Trip automatically doubles the distance and expense calculations." }
    ],
    component: FuelCostCalculator,
  },
  {
    slug: "countdown-timer",
    name: "Milestone Countdown & Ticker",
    domain: "everyday",
    category: "Events & Time",
    tagline: "Track days, hours, and minutes remaining until your milestone events.",
    description: "Real-time client-side countdown timer for product launches, deadlines, holidays, and milestones with live second ticks.",
    tags: ["countdown", "timer", "event", "milestone", "days-until", "everyday"],
    howItWorks: [
      "Calculates millisecond difference between target date-time and client clock.",
      "Breaks delta into days, hours, minutes, and seconds.",
      "Automatically transitions from countdown to elapsed timer once the event passes."
    ],
    example: "Set a countdown for your upcoming product launch or quarterly deadline.",
    faqs: [
      { q: "Does the countdown work across time zones?", a: "Yes, dates are interpreted in your local browser timezone or UTC depending on input format." }
    ],
    component: CountdownTimer,
  },
];
