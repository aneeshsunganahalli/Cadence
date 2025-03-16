/** @type {import('next').NextConfig} */
const nextConfig = {
  // Change output mode to export static files
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  skipTrailingSlashRedirect: true,
  experimental: {
    // Disable generating route manifests altogether
    disableOptimizedLoading: true
  }
};

module.exports = nextConfig;
