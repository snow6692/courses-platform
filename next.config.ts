import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
