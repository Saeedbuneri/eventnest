/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
  // Required for Vercel deployment — server components can call their own API routes
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  // Silence noisy build warnings from mongoose
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'mongoose'];
    }
    return config;
  },
};

export default nextConfig;
