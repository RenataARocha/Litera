import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    domains: [
      'm.media-amazon.com',
      'upload.wikimedia.org',
      'encrypted-tbn1.gstatic.com'
    ],
  },

};

export default nextConfig;
