import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import laravel from "laravel-vite-plugin"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  server: {
    host: "127.0.0.1",
    port: 5173,
    cors: true,
  },
  plugins: [
    laravel({
      input: ["resources/css/app.css", "resources/js/app.tsx"],
      refresh: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./resources/js", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes("node_modules")) return
          if (id.includes("node_modules/react-router") || id.includes("node_modules/@remix-run/")) return "vendor-router"
          if (id.includes("node_modules/@tanstack/")) return "vendor-query"
          if (
            id.includes("node_modules/react-dom/")
            || id.includes("node_modules/react/")
            || id.includes("node_modules/scheduler/")
          ) return "vendor-react"
        },
      },
    },
  },
})
