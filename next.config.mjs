/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Expose Netlify's platform-provided URL (process.env.URL) to client bundles
    NEXT_PUBLIC_NETLIFY_URL: process.env.URL || process.env.DEPLOY_PRIME_URL || '',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/journal/:slug',
        destination: '/article/:slug',
        permanent: true,
      },
      {
        source: '/journal',
        destination: '/articles',
        permanent: true,
      },
      {
        source: '/article',
        destination: '/articles',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
