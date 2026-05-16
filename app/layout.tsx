import type { Metadata } from "next";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://storm-tracker-one.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Storm Tracker — Tropical Cyclone Research",
    template: "%s — Storm Tracker",
  },
  description:
    "Research-grade live tracking and historical archive of tropical cyclones worldwide. Explore active storms, 5-day forecast cones, and 50 famous storms from 1996–2026.",
  keywords: ["hurricane", "typhoon", "cyclone", "tropical storm", "NHC", "weather", "storm tracker"],
  authors: [{ name: "Storm Tracker" }],
  openGraph: {
    type: "website",
    siteName: "Storm Tracker",
    title: "Storm Tracker — Tropical Cyclone Research",
    description: "Live storm tracking + research archive for tropical cyclones worldwide.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Storm Tracker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Storm Tracker",
    description: "Live storm tracking + research archive for tropical cyclones worldwide.",
    images: ["/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        className="min-h-full flex flex-col"
        style={{ backgroundColor: "var(--ink-900)", color: "var(--bone)" }}
      >
        {/* Skip to main content for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded focus:text-sm"
          style={{ backgroundColor: "var(--amber-glow)", color: "var(--ink-900)", fontFamily: "var(--font-body)" }}
        >
          Skip to content
        </a>
        <Nav />
        <div id="main-content">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
