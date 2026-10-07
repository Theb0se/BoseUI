/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
