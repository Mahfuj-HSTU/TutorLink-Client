import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow fetching images from any HTTPS origin (covers tutor profile images)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
