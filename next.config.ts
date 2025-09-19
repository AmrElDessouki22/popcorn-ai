import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
  },

  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'react-native-sqlite-storage': 'commonjs react-native-sqlite-storage',
        '@sap/hana-client': 'commonjs @sap/hana-client',
        'mysql': 'commonjs mysql',
        'mysql2': 'commonjs mysql2',
        'pg': 'commonjs pg',
        'pg-native': 'commonjs pg-native',
        'sqlite3': 'commonjs sqlite3',
        'better-sqlite3': 'commonjs better-sqlite3',
        'ioredis': 'commonjs ioredis',
        'redis': 'commonjs redis',
        'mongodb': 'commonjs mongodb',
        // Remove typeorm from externals to ensure entity metadata is bundled
        // 'typeorm': 'commonjs typeorm',
      });
      
      // Disable minification for server-side builds to preserve class names
      if (config.optimization) {
        config.optimization.minimize = false;
      }
    }
    return config;
  },
};

export default nextConfig;
