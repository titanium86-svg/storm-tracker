"use client";

import dynamic from "next/dynamic";
import type { NHCStorm } from "@/lib/nhc";
import StormStats from "@/components/storm/StormStats";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const StormDetailMap = dynamic(() => import("./StormDetailMap"), { ssr: false });

type Props = { storm: NHCStorm };

export default function StormDetailClient({ storm }: Props) {
  return (
    <main
      className="flex-1 flex"
      style={{ height: "calc(100vh - 56px)" }}
    >
      {/* Map — 60% */}
      <div className="flex-1 relative">
        <StormDetailMap storm={storm} />
      </div>

      {/* Stats panel — 40% */}
      <div
        className="w-96 shrink-0 flex flex-col overflow-y-auto"
        style={{
          backgroundColor: "var(--ink-800)",
          borderLeft: "1px solid var(--ink-600)",
        }}
      >
        <div className="p-6 space-y-6">
          <Link
            href="/live"
            className="inline-flex items-center gap-1 text-xs transition-colors"
            style={{ color: "var(--smoke)", fontFamily: "var(--font-body)" }}
          >
            <ArrowLeft size={12} />
            All storms
          </Link>
          <StormStats storm={storm} />
        </div>
      </div>
    </main>
  );
}
