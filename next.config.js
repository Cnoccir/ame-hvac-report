/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ame-techassist-bucket.s3.amazonaws.com", "ame-techassist-bucket.s3.us-east-1.amazonaws.com"]
  }
}

module.exports = nextConfig
