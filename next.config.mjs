/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["192.168.11.*", "localhost", "127.0.0.1"],
  output: "standalone",
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  // 再デプロイ時に古いブラウザキャッシュと新ビルドの不整合（404 ChunkLoadError）を防ぐためビルドIDを生成
  generateBuildId: async () => {
    return process.env.GIT_COMMIT_SHA || `build-${Date.now()}`;
  },
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  turbopack: {
    resolveAlias: {
      fs: { browser: "./src/utils/empty.ts" },
      path: { browser: "./src/utils/empty.ts" },
    },
  },

  experimental: {
    // サーバーレス環境でのメモリリーク防止とディスクキャッシュ活用
    isrFlushToDisk: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Debug-Deploy",
            value: "true",
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
