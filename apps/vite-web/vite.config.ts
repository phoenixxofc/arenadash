import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@arena-dash/engine': '/app/packages/engine/src/index.ts'
    }
  },
  server: {
    watch: {
      usePolling: true
    }
  },
  optimizeDeps: {
    exclude: ['@arena-dash/engine']
  }
})
