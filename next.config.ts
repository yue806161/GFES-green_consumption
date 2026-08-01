import type { NextConfig } from "next";

const isCloudflarePagesBuild =
  process.env.CLOUDFLARE_PAGES_BUILD === "1";

const nextConfig: NextConfig = {
  ...(isCloudflarePagesBuild
    ? {
        output: "export" as const,
        typescript: { ignoreBuildErrors: true },
      }
    : {}),
};

export default nextConfig;
