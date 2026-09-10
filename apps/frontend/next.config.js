/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@royalstream/ui', '@royalstream/stellar-sdk', '@royalstream/types'],
};

module.exports = nextConfig;
