import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      perf_hooks: false,
    };
    return config;
  },
  experimental: {
    // ppr: "incremental",
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "courses.fly.storage.tigris.dev",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
