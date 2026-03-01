/** @type {import('next').NextConfig} */
const nextConfig = {
  // comment me to test build locally
  output: "standalone",
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
};

module.exports = nextConfig;
