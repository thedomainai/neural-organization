import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NODE_ENV === "development" ? "" : "/neural-organization",
  images: {
    unoptimized: true,
  },
  // Optimize package imports for Framer Motion and Radix UI
  experimental: {
    optimizePackageImports: ["@radix-ui/react-dialog", "@radix-ui/react-tooltip", "@radix-ui/react-tabs"],
  },
};

export default withBundleAnalyzer(nextConfig);
