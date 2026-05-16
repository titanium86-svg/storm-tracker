"use client";

import dynamic from "next/dynamic";

const StormMap = dynamic(() => import("./StormMap"), { ssr: false });

export default function StormMapLoader() {
  return <StormMap />;
}
