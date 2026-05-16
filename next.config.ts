import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow Wikipedia, NASA, NOAA image domains
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "earthobservatory.nasa.gov" },
      { protocol: "https", hostname: "www.nhc.noaa.gov" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  // Compress responses
  compress: true,
  // Power by header off
  poweredByHeader: false,
};

export default nextConfig;
