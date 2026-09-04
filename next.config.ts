import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Production-only: dev needs HMR websockets and eval, which a strict CSP blocks.
const csp = [
  "default-src 'self'",
  // 'unsafe-inline': Next.js hydration/bootstrap inline scripts and style attributes.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  // github-contributions-api: heatmap
  "connect-src 'self' https://github-contributions-api.jogruber.de",
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
