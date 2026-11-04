import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // "./" makes the built site work on GitHub Pages no matter what your repo is called
  base: "./",
  build: {
    // The globe engine + map + 12,870 picks are big; split them so browsers can cache each part
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          globe: ["globe.gl"],
          react: ["react", "react-dom"],
          data: ["./src/data/guide.json", "./src/data/world.json"]
        }
      }
    }
  }
});