/** @type {import('next').NextConfig}
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig */

/** @type {import('next').NextConfig} - ANIGUO */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
}


module.exports = nextConfig




