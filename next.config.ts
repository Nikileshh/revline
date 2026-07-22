import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Next 16 blocks upstream images that resolve to private IPs. Local ISPs
    // that use NAT64 (64:ff9b::/96) trip this even for legit public hosts,
    // so we relax it in dev only — production DNS resolves to public IPs.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
