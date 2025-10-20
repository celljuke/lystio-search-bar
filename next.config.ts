import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "cdn.lystio.at" },
      { hostname: "cdn.lystio.co" },
    ],
  },
};

export default nextConfig;
