import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    viewTransition: false,
  },
  devIndicators: false,
  productionBrowserSourceMaps: false,  
};

export default nextConfig;
