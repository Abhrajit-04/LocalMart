import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
        protocol: "https",
        port: "",
        pathname: "/**",
      },
      {
        hostname: "plus.unsplash.com",
      },
      {
        hostname: "res.cloudinary.com",
      }
    ],
  }
};

export default nextConfig;
