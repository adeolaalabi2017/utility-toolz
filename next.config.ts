import type { NextConfig } from "next";
import path from "path";

const isDev = process.env.NODE_ENV !== "production";

// Pages are statically prerendered, so Next's inline bootstrap scripts, the
// theme script and the JSON-LD blocks can't carry a per-request nonce; that is
// why script-src keeps 'unsafe-inline'. img-src allows https: because the
// social share preview loads whatever image URL the visitor types in.
// When AdSense goes live its domains need adding to script-src, img-src,
// connect-src and frame-src.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' blob: data:${isDev ? " ws:" : ""}`,
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  turbopack: {
    root: path.resolve(__dirname),
  },
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  async redirects() {
    // These tools lived under Education before the Math domain existed.
    return ["percentage-calculator", "fraction-calculator", "sig-fig-calculator"].map((slug) => ({
      source: `/education/${slug}`,
      destination: `/math/${slug}`,
      permanent: true,
    }));
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // The service worker must never be served stale, or fixes to it can't ship.
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: "no-cache" }],
      },
    ];
  },
};

export default nextConfig;
