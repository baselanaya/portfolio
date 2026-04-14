import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import {
  GeistPixelSquare,
  GeistPixelGrid,
  GeistPixelLine,
} from "geist/font/pixel";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import AsciiBackground from "@/components/ascii-background";
import CommandPaletteProvider from "@/components/command-palette-provider";
import HiddenTerminal from "@/components/hidden-terminal";
import AskBasel from "@/components/ask-basel";
import MiniGame from "@/components/mini-game";
import "../styles/globals.css";

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
        GeistSans.variable,
        GeistMono.variable,
        GeistPixelSquare.variable,
        GeistPixelGrid.variable,
        GeistPixelLine.variable,
      ].join(" ")}
    >
      {/* pb-14 reserves space for the fixed mobile bottom nav; overflow-x-hidden prevents horizontal scroll from ghost digits */}
      <body className="flex flex-col min-h-screen pb-14 md:pb-0 overflow-x-hidden">
        <AsciiBackground />
        <Nav />
        <CommandPaletteProvider />
        <HiddenTerminal />
        <MiniGame />
        <AskBasel />
        <div className="flex flex-col flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
