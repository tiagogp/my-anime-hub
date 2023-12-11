/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["www.animesonline.in"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.animesonline.in",
      },
    ],
  },
}

export default nextConfig
