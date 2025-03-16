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
  // This is what helps with client-side only pages
  experimental: {
    disableOptimizedLoading: true
  },
  
  // Add a special export condition for your statistics page
  exportPathMap: async function() {
    return {
      '/': { page: '/' },
      '/sign-in': { page: '/sign-in' },
      '/sign-up': { page: '/sign-up' },
      '/dashboard': { page: '/dashboard' },
      '/transactions': { page: '/transactions' },
      // Leave out statistics to prevent static build errors
    };
  }
};

export default nextConfig;
