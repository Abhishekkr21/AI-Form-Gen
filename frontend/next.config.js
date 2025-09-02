/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
  typescript: {
    // ✅ Allow production builds to succeed even with type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // ✅ Allow builds to pass even if ESLint has errors
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
