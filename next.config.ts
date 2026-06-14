import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Presenter token rides in the URL query string (?present=<token>).
        // Suppress the Referer header so the token can't leak to third parties
        // via outbound image/link requests rendered inside slides.
        source: "/p/:path*",
        headers: [{ key: "Referrer-Policy", value: "no-referrer" }],
      },
    ];
  },
};

export default nextConfig;
