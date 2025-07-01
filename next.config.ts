import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  eslint: {
    // Disable ESLint during builds since we use Biome
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
