import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    // Diagram sources linked from posts: show them in the browser instead of downloading.
    return [{ source: "/blog/:slug/:file.bux", headers: [{ key: "Content-Type", value: "text/plain; charset=utf-8" }] }];
  },
};

export default nextConfig;
