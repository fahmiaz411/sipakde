/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    return config;
  },
};

export default nextConfig;
