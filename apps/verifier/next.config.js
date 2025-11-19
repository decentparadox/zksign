/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@zksign/ui", "@zksign/zk-circuits", "@zksign/contracts", "@zksign/orbitdb"],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig;

