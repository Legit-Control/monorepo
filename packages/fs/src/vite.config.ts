import { defineConfig } from "vite";
import commonjs from "vite-plugin-commonjs";

export default defineConfig({
  optimizeDeps: {
    include: ["isomorphic-git", "path-browserify"],
  },

  // Optional: use esbuild to force convert CJS -> ESM
  // Not always needed, but may help in some environments
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },

  // Optional: if using `vite-node` or SSR, add this too:
  ssr: {
    noExternal: ["isomorphic-git"],
  },
});
