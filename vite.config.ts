import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Neural-Pro-Plus/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@headlessui/react', 'framer-motion'],
          'editor-vendor': ['react-quill'],
          'audio-vendor': ['wavesurfer.js']
        }
      }
    }
  },
  server: {
    port: 5173,
    strictPort: false,
    open: true,
    host: true
  },
  preview: {
    port: 5173,
    strictPort: false,
    open: true
  }
}) 