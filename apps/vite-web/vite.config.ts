import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@arena-dash/engine': path.resolve(__dirname, '../../packages/engine/src/index.ts')
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
