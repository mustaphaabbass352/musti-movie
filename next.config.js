/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/musti-movie',
  assetPrefix: '/musti-movie',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
