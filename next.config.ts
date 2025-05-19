import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['randomuser.me', 'html.tailus.io'],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allows production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // !! WARN !!
    // Disabling ESLint during production builds to allow successful completion
    // !! WARN !!
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
