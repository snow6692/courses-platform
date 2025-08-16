import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // ppr: "incremental",
    viewTransition: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "courses.fly.storage.tigris.dev",
      },
    ],
  },
};

export default nextConfig;
