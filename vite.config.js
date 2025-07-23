import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@shadcn/ui": path.resolve(
        fileURLToPath(new URL(".", import.meta.url)),
        "node_modules/@shadcn/ui/dist"
      ),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  build: {
    sourcemap: true, // Generate sourcemaps for better error reporting
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore "use client" directive warnings
        if (
          warning.message.includes(
            'Module level directives cause errors when bundled, "use client"'
          )
        ) {
          return;
        }
        // Ignore sourcemap warnings for problematic files
        if (
          warning.message.includes("Can't resolve original location of error")
        ) {
          return;
        }
        warn(warning);
      },
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: [
            "framer-motion",
            "@radix-ui/react-label",
            "@radix-ui/react-dialog",
          ],
        },
      },
    },
  },
  // Enable compression and caching
  server: {
    headers: {
      "Cache-Control": "public, max-age=31536000",
    },
  },
});
