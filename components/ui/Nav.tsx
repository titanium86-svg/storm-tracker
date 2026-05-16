"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/live", label: "Live" },
  { href: "/library", label: "Library" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "var(--ink-800)",
        borderColor: "var(--ink-600)",
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold tracking-wider uppercase"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--cream)",
          }}
        >
          Storm Tracker
        </Link>
        <ul className="flex items-center gap-6">
          {links.map(({ href, label }) => {
            const active = pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm transition-colors"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: active ? "var(--amber-glow)" : "var(--smoke)",
                  }}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
