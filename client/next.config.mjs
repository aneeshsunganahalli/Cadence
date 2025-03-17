/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  skipTrailingSlashRedirect: true,
  // Remove exportPathMap and just use experimental config
  experimental: {
    disableOptimizedLoading: true
  }
};

export default nextConfig;
