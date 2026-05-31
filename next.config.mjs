/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: "export",
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Debug-Deploy',
            value: 'true',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/ranking2/:path*',
        destination: '/ranking2/:path*',
      },
      {
        source: '/infotable/:path*',
        destination: '/infotable/:path*',
      },
    ];
  },
};

export default nextConfig;
