import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import CommandPaletteProvider from "@/components/command-palette-provider";
import HiddenTerminal from "@/components/hidden-terminal";
import MouseSpotlight from "@/components/mouse-spotlight";
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
  title: "Basel Anaya — AI Engineer",
  description:
    "Building infrastructure for the age of autonomous AI. Founder of Maximlabs.",
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
        {/* Engineering-paper background: fine grid fading out below the fold,
            plus a cursor spotlight and film grain (body::before). */}
        <div className="page-grid" aria-hidden="true" />
        <MouseSpotlight />
        <Nav />
        <CommandPaletteProvider />
        <HiddenTerminal />
        <div className="flex flex-col flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
