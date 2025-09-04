/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@ordo/ui"],
  experimental: {
    optimizePackageImports: ["@ordo/ui"],
  },

  // Vercel deployment configuration
  output: "standalone",
  compress: true,

  // Ensure routes manifest is always generated
  generateBuildId: async () => {
    return process.env.VERCEL_GIT_COMMIT_SHA || "build-" + Date.now();
  },

  // Route configuration
  trailingSlash: false,
  skipTrailingSlashRedirect: false,

  // Ensure proper static optimization
  swcMinify: true,

  // Image optimization for Vercel
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Webpack configuration for monorepo
  webpack: (config, { isServer }) => {
    // Handle workspace packages properly
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ["**/node_modules", "**/.next", "**/apps/!(marketing)/**"],
    };

    return config;
  },

  // Ensure proper module resolution in monorepo
  modularizeImports: {
    "@ordo/ui": {
      transform: "@ordo/ui/{{member}}",
    },
  },
};

export default nextConfig;
