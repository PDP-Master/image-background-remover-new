import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodyParser: false,
    },
  },
};

export default nextConfig;
