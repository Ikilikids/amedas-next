/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
};

export default nextConfig;
