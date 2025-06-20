import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: ["sharp"],
    },
  },
  optimizeDeps: {
    exclude: ["sharp"],
  },
  define: {
    // Ensure sharp is treated as external
    "process.env.SHARP_IGNORE_GLOBAL_LIBVIPS": "1",
  },
  ssr: {
    noExternal: [],
  },
});
