import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { site } from "@/lib/data";
import { ContentProvider } from "@/lib/content";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ChatDock from "@/components/ChatDock";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.summary,
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.summary,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cls = `${sans.variable} ${display.variable} ${mono.variable}`;
  return (
    <html lang="en" className={cls}>
      <body className="grain font-sans antialiased">
        <ContentProvider>
          <Cursor />
          <Nav />
          {children}
          <Footer />
          <ChatDock />
        </ContentProvider>
      </body>
    </html>
  );
}
