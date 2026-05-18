import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // wagmi's connector barrel (`wagmi/connectors`) eagerly references
    // optional wallet SDKs — Porto and Tempo — that this template does not
    // install. We only use the `injected` and `metaMask` connectors, so
    // stub the unused ones out to keep the webpack build happy.
    config.resolve.alias = {
      ...config.resolve.alias,
      "porto/internal": false,
      accounts: false,
    };
    return config;
  },
};

export default nextConfig;
