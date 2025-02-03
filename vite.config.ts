import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { dirname, resolve } from "node:path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/*": path.resolve(__dirname, "../../*"),
    },
  },
  server: {
    fs: {
      cachedChecks: false,
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
      },
    },
  },
});
