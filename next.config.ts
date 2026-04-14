import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90, 100],
  },
  // Turbopack (default in Next.js 16): stub out Node-only packages from browser bundles
  turbopack: {
    resolveAlias: {
      // Prevent browser bundles from pulling in the Node.js ONNX runtime
      // @huggingface/transformers will use onnxruntime-web instead
      "onnxruntime-node": { browser: "./src/lib/empty-module.ts" },
      sharp: { browser: "./src/lib/empty-module.ts" },
    },
  },
};

export default nextConfig;
