import type { NextConfig } from "next";
import nextra from "nextra";

const withNextra = nextra({
  defaultShowCopyCode: true
  // ... Add Nextra-specific options here
})

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    resolveAlias: {
      'next-mdx-import-source-file': './mdx-components.ts'
    }
  }
};

export default withNextra(nextConfig);
