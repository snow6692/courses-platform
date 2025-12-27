import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      perf_hooks: false,
    };
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "spider-pl.b-cdn.net",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
