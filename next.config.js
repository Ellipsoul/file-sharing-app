/** @type {import('next').NextConfig} */
// Make the about page the default landing page
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/about",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
