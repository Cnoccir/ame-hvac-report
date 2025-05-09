/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ame-techassist-bucket.s3.amazonaws.com", "ame-techassist-bucket.s3.us-east-1.amazonaws.com"],
    unoptimized: true
  },
  // Add support for importing SVG files
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });
    return config;
  }
}

module.exports = nextConfig
