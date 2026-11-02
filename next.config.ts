import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // The early /exams pages were replaced by the exam picker in /app.
  async redirects() {
    return [
      { source: "/exams", destination: "/app", permanent: true },
      { source: "/exams/:slug", destination: "/app", permanent: true },
    ];
  },
};

export default nextConfig;
