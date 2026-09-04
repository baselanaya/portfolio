import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Google Analytics — set NEXT_PUBLIC_GA_ID (e.g. G-XXXXXXXXXX) to enable
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

// Google Analytics domains, only when a measurement ID is configured
const gaCsp = GA_ID
  ? [
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://*.google-analytics.com",
    ]
  : [];

// Production-only: dev needs HMR websockets and eval, which a strict CSP blocks.
const csp = [
  "default-src 'self'",
  // 'unsafe-inline': Next.js hydration/bootstrap inline scripts and style attributes.
  `script-src 'self' 'unsafe-inline' ${gaCsp[0] ?? ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  // github-contributions-api: heatmap · googletagmanager: GA4 (when enabled)
  `connect-src 'self' https://github-contributions-api.jogruber.de ${gaCsp.filter((d) => !d.includes("tagmanager")).join(" ")}`,
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90, 100],
  },
  // never ship source maps to the browser in production
  productionBrowserSourceMaps: false,
  async redirects() {
    return [
      {
        source: "/projects",
        destination: "/work",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: isDev
          ? securityHeaders
          : [
              ...securityHeaders,
              { key: "Content-Security-Policy", value: csp },
            ],
      },
    ];
  },
};

export default nextConfig;
