/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  onDemandEntries: {
    maxInactiveAge: 1000 * 60 * 60,
    pagesBufferLength: 100,
  },
  async redirects() {
    return [
      {
        source: "/component",
        destination: "/components",
        permanent: false,
      },
      {
        source: "/component/:slug",
        destination: "/components/:slug",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

