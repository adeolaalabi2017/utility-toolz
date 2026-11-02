import type { Metadata, Viewport } from "next";
import { Geist, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SearchProvider } from "@/components/site/search-dialog";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { PwaRegister } from "@/components/site/pwa-register";
import { CurrencyProvider } from "@/components/site/currency";
import { DOMAINS, TOOLS } from "@/lib/registry";

const TOOL_COUNT = TOOLS.length;
const DOMAIN_COUNT = DOMAINS.length;

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://utilitytoolz.com";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1f4a3f" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1520" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Utility Toolz",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon-192.png",
  },
  title: {
    default: "Utility Toolz — Professional tools, organized by domain",
    template: "%s | Utility Toolz",
  },
  description:
    `Free professional calculators and utilities for finance, marketing, business, developers and students. ${TOOL_COUNT} tools across ${DOMAIN_COUNT} domains.`,
  keywords: [
    "calculators",
    "marketing tools",
    "finance tools",
    "ROAS calculator",
    "loan calculator",
    "SEO tools",
    "json formatter",
    "word counter",
    "invoice generator",
    "pomodoro timer",
    "gpa calculator",
    "unit converter",
    "contrast checker",
    "diff checker",
    "password generator",
    "professional tools",
  ],
  authors: [{ name: "Utility Toolz" }],
  openGraph: {
    title: "Utility Toolz — Professional tools, organized by domain",
    description:
      `Every tool your work needs — organized by professional domain, not buried in a random list. ${TOOL_COUNT} tools across finance, marketing, advertising, business, SEO, content, design, data, development, productivity, education and everyday utilities.`,
    siteName: "Utility Toolz",
    type: "website",
    url: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground font-sans">
        <ThemeProvider>
          <CurrencyProvider>
            <SearchProvider>
              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-lark"
              >
                Skip to content
              </a>
              <div className="flex min-h-screen flex-col bg-background text-foreground">
                <Header />
                <main id="main" tabIndex={-1} className="flex-1 overflow-x-hidden w-full max-w-full focus:outline-none">
                  {children}
                </main>
                <Footer />
              </div>
            </SearchProvider>
          </CurrencyProvider>
          <Toaster />
          <PwaRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
