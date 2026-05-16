import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/ui/Nav";

export const metadata: Metadata = {
  title: "Storm Tracker — Tropical Cyclone Research",
  description:
    "Research-grade live tracking and historical archive of tropical cyclones worldwide.",
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
        <Nav />
        {children}
      </body>
    </html>
  );
}
