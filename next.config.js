/** @type {import('next').NextConfig} */
const nextConfig = {
  // npm run build will create server.js thanks to:
  output: "standalone",
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
};

module.exports = nextConfig;
