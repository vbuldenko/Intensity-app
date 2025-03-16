import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url"; // Import this to work with import.meta.url

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Adjust this alias based on your project structure
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        additionalData: `
          @use "@/styles/abstracts/variables.scss" as *;
          @use "@/styles/abstracts/mixins.scss" as *;
          @use "@/styles/abstracts/functions.scss" as *;
        `,
      },
    },
  },
});
