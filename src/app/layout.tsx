import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SearchProvider } from "@/components/site/search-dialog";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { PwaRegister } from "@/components/site/pwa-register";

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
    "A domain-first platform of professional calculators and utilities for marketers, accountants, business owners, media buyers, developers, designers, project managers and students. 119 free tools live across 12 domains.",
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
      "Every tool your work needs — organized by professional domain, not buried in a random list. 119 tools across finance, marketing, advertising, business, SEO, content, design, data, development, productivity, education and everyday utilities.",
    siteName: "Utility Toolz",
    type: "website",
    url: siteUrl,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground font-sans">
        <ThemeProvider>
          <SearchProvider>
            <div className="flex min-h-screen flex-col bg-background text-foreground">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </SearchProvider>
          <Toaster />
          <PwaRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
