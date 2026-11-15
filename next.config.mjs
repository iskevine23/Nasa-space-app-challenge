/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  experimental: { serverActions: { allowedOrigins: ["*"] } },
  eslint: { ignoreDuringBuilds: true },
};
export default nextConfig;
