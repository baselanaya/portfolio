import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import CommandPaletteProvider from "@/components/command-palette-provider";
import dynamic from "next/dynamic";
import MouseSpotlight from "@/components/mouse-spotlight";

// Easter egg, below the fold by definition — keep it out of the critical bundle
const HiddenTerminal = dynamic(() => import("@/components/hidden-terminal"));
import Analytics from "@/components/analytics";
import StickyCta from "@/components/sticky-cta";
import { personJsonLd, websiteJsonLd } from "@/lib/seo";
import "../styles/globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://baselanaya.com"),
  title: {
    default: "Basel Anaya — AI Engineer",
    template: "%s — Basel Anaya",
  },
  description:
    "Building infrastructure for the age of autonomous AI. Founder of Maximlabs.",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "Basel Anaya — AI Engineer",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={[
        bricolage.variable,
        instrument.variable,
        GeistMono.variable,
      ].join(" ")}
    >
      {/* pb-14 reserves space for the fixed mobile bottom nav; overflow-x-hidden prevents horizontal scroll from ghost digits */}
      <body className="flex flex-col min-h-screen pb-14 md:pb-0 overflow-x-hidden">
        {/* iOS-26-style liquid glass: SVG displacement used by .glass via
            backdrop-filter (progressively enhanced, see globals.css) */}
        <svg aria-hidden="true" style={{ position: "absolute", width: 0, height: 0 }}>
          <filter id="liquid-glass" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="7" result="warp" />
            <feGaussianBlur in="warp" stdDeviation="6" result="warpsmooth" />
            <feDisplacementMap in="SourceGraphic" in2="warpsmooth" scale="16" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        {/* Engineering-paper background: fine grid fading out below the fold,
            plus a cursor spotlight and film grain (body::before). */}
        <div className="page-grid" aria-hidden="true" />
        <MouseSpotlight />
        <Nav />
        <CommandPaletteProvider />
        <HiddenTerminal />
        <div className="flex flex-col flex-1">{children}</div>
        <Footer />
        <StickyCta />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
