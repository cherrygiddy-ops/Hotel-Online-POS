import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    proxy: {
      // Forward API requests to backend
       "/auth": {
        target: "http://178.62.225.206:3001", // proxy auth endpoints too
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, "/auth"),
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
