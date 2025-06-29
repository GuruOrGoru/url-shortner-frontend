import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true, // Opens browser automatically
    proxy: {
      '/api': {
        target: 'https://valid-platypus-tender.ngrok-free.app',
        changeOrigin: true,
      },
      // Proxy shortcode GET requests to backend directly
      // No rewrite, proxy path as-is
      // We'll use a custom bypass function below
      '/': {
        target: 'https://valid-platypus-tender.ngrok-free.app',
        changeOrigin: true,
        bypass: (req) => {
          // If the request matches shortcode pattern, proxy it (return null means proxy)
          if (req.url && req.url.match(/^\/[a-zA-Z0-9]+$/)) {
            return null
          }
          // Don't proxy API requests or static assets (skip proxy)
          if (
            req.url.startsWith('/api') ||
            req.url.includes('.') ||
            req.url === '/' ||
            req.url.startsWith('/some-static-path')
          ) {
            return req.url // skip proxy for these
          }
          return req.url // fallback: serve normally (no proxy)
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  plugins: [
    {
      name: 'spa-fallback',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // For shortcode routes, just pass through (let proxy handle it)
          if (req.url && req.url.match(/^\/[a-zA-Z0-9]+$/)) {
            return next()
          }

          // For SPA routes, rewrite to index.html if no file extension, not /, not /api
          if (
            req.url &&
            !req.url.includes('.') &&
            req.url !== '/' &&
            !req.url.startsWith('/api')
          ) {
            req.url = '/'
          }
          next()
        })
      }
    }
  ]
})
