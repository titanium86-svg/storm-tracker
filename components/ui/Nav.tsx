"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/live", label: "Live", aria: "Live storm tracking" },
  { href: "/library", label: "Library", aria: "Storm research library" },
  { href: "/about", label: "About", aria: "About Storm Tracker" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ backgroundColor: "var(--ink-800)", borderColor: "var(--ink-600)" }}
    >
      <nav
        className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="text-sm font-semibold tracking-wider uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
          style={{ fontFamily: "var(--font-body)", color: "var(--cream)" }}
          aria-label="Storm Tracker home"
        >
          Storm Tracker
        </Link>
        <ul className="flex items-center gap-6" role="list">
          {links.map(({ href, label, aria }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-label={aria}
                  aria-current={active ? "page" : undefined}
                  className="text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded px-1"
                  style={{ fontFamily: "var(--font-body)", color: active ? "var(--amber-glow)" : "var(--smoke)" }}
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
