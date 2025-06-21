import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true, // Opens browser automatically
    // Proxy API calls to your Go backend
    proxy: {
      '/api': {
        target: 'http://localhost:8414',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
