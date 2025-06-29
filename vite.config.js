import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'https://valid-platypus-tender.ngrok-free.app',
        changeOrigin: true,
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
          // During development, let shortcodes pass through to proxy
          if (req.url && req.url.match(/^\/[a-zA-Z0-9]+$/)) {
            return next()
          }
          
          // For other routes, serve index.html (SPA behavior)
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
