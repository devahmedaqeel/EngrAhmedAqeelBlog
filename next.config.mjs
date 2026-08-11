
const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: "",
  },
  // Compress responses
  compress: true,
  // Power page transitions and reduce layout shifts
  reactStrictMode: false,
  // Speed up builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Rewrites for dynamic RSS and JSON feeds
  async rewrites() {
    return [
      { source: "/rss.xml", destination: "/api/rss" },
      { source: "/feed.xml", destination: "/api/rss" },
      { source: "/feed.json", destination: "/api/feed" },
    ];
  },
  // HTTP headers for caching static assets
  async headers() {
    return [
      {
        source: "/images/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
