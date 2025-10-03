import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Increase timeout for API routes
  serverRuntimeConfig: {
    apiTimeout: 120000, // 2 minutes
  },
};

export default nextConfig;
