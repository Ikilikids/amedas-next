/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  // マルチインスタンスでのキャッシュ整合性を保つためのビルドID固定
  generateBuildId: async () => {
    return process.env.GIT_COMMIT_SHA || "amedas-next-build";
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
