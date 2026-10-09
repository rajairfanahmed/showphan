import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-7951652fb9484b909e8f3989e79f7111.r2.dev",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/health",
        destination: "/api/health",
      },
      {
        source: "/ready",
        destination: "/api/ready",
      },
    ];
  },
};

export default nextConfig;
