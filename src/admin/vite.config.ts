import { defineConfig } from "vite"

export default defineConfig({
  server: {
    port: 9000,
    strictPort: false,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 9000,
      clientPort: 9000
    }
  }
})
