/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@ordo/ui"],
  experimental: {
    optimizePackageImports: ["@ordo/ui"],
  },
  // Ensure proper build artifacts generation
  generateBuildId: async () => {
    return "build-" + Date.now();
  },
  // Optimize for deployment
  output: "standalone",
  compress: true,
  // Ensure routes manifest is generated
  trailingSlash: false,
  skipTrailingSlashRedirect: false,
};

export default nextConfig;
