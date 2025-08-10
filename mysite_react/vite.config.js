import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
 base: "/",
 plugins: [react()],
 preview: {
  port: 8080,
  strictPort: true,
 },
 server: {
  port: 8080,
  strictPort: true,
  host: true,
  origin: "http://localhost:8080",
          // Proxy nur API-Requests zu Django Backend (HTML-Templates entfernt)
        proxy: {
          '/api': {
            target: 'http://apiproject:8000',  // Container-to-Container communication
            changeOrigin: true,
            secure: false
          }
        }
 },
});