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
  },
  
  // Skip generating problematic pages
  experimental: {
    disableOptimizedLoading: true
  },
  
  // This is critical - control which pages get generated statically
  generateStaticParams: async () => {
    // Only generate static content for public pages
    return [
      { path: ['/'] },
      { path: ['/sign-in'] },
      { path: ['/sign-up'] }
    ];
  },
  
  // Set up redirects to handle protected pages
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/sign-in?redirect=/dashboard',
        permanent: false,
      },
      {
        source: '/transactions',
        destination: '/sign-in?redirect=/transactions',
        permanent: false,
      },
      {
        source: '/statistics',
        destination: '/sign-in?redirect=/statistics',
        permanent: false,
      }
    ];
  }
};

export default nextConfig;
