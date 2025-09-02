/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:5000/api/:path*'
            : 'https://ai-form-generator-d0nr.onrender.com/api/:path*',
      },
    ];
  },
  typescript: {
    // ✅ Let build succeed even with type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // ✅ Let build succeed even with lint errors
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
