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
  // Proxy Auth-Requests zu Django Backend
  proxy: {
    '/auth': {
      target: 'http://apiproject:8000',  // Container-to-Container communication
      changeOrigin: true,
      secure: false
    },
    // Proxy API-Requests zu Django Backend  
    '/api': {
      target: 'http://apiproject:8000',
      changeOrigin: true,
      secure: false
    }
  }
 },
});