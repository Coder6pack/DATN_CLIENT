import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ecom1.s3-hcm-r2.s3cloud.vn",
        pathname: "/images/**", // Tùy chọn: giới hạn đường dẫn nếu cần
      },
    ],
  },
};

export default nextConfig;
