/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: "export", // 静的エクスポート
  trailingSlash: true, // URL末尾にスラッシュ付与（任意）
};

export default nextConfig;
