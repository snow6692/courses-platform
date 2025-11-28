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
