import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,  // This allows Vite to try another port if 5173 is taken
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})