import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    proxy: {
      // Forward all API requests to backend
      "/api": {
        target: "http://localhost:8080", // backend running locally in dev
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // strip /api before forwarding
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
