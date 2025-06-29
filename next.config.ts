import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ecom1.s3-hcm-r2.s3cloud.vn",
        pathname: "/images/**", // Tùy chọn: giữ nguyên nếu bạn muốn giới hạn đường dẫn
      },
      {
        protocol: "https",
        hostname: "qr.sepay.vn",
        pathname: "/img/**", // Tùy chọn: bạn có thể giới hạn đường dẫn nếu cần
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/img/**", // Tùy chọn: bạn có thể giới hạn đường dẫn nếu cần
      },
    ],
  },
};

export default nextConfig;
