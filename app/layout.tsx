import type { Metadata } from "next";
import { Bodoni_Moda, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { site } from "@/lib/data";
import { ContentProvider } from "@/lib/content";
import Masthead from "@/components/Masthead";
import Opening from "@/components/Opening";
import Colophon from "@/components/Colophon";
import ChatDock from "@/components/ChatDock";
import "./globals.css";

// Bodoni Moda is a true Didone — the same lineage as the Computer Modern his
// LaTeX resume is set in. Plex carries the engineering register underneath it.
const display = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600"],
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

// metadataBase makes the generated opengraph-image URL absolute, which every
// scraper (LinkedIn, WhatsApp, X) requires.
const url = "https://know-about-adarsh.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: `${site.name} — ${site.role}`,
  description: site.summary,
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.summary,
    type: "website",
    url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.summary,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cls = `${display.variable} ${sans.variable} ${mono.variable}`;
  return (
    <html lang="en" className={cls}>
      <body className="gridpaper bg-ground font-sans text-[17px] text-bone antialiased">
        <ContentProvider>
          <Opening />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-bone focus:px-4 focus:py-2 focus:text-ground"
          >
            Skip to content
          </a>
          <Masthead />
          {children}
          <Colophon />
          <ChatDock />
        </ContentProvider>
      </body>
    </html>
  );
}
