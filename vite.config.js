import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { builtinModules } from 'module'

export default defineConfig({
  plugins: [react()],
  base: './',
  optimizeDeps: {
    exclude: ['electron']
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['electron']
    }
  },
  server: {
    port: 5173,
  },
})