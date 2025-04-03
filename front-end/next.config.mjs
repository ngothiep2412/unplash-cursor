/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  // Allow dev origins for local development
  experimental: {
    allowedDevOrigins: ['192.168.1.11', 'localhost'],
  },
};

export default nextConfig; 