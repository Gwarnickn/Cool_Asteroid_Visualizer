import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import svgrPlugin from 'vite-plugin-svgr';
//import { analyzer } from 'vite-bundle-analyzer'

export default defineConfig({
  plugins: [
    react(),
    svgrPlugin(),
    //analyzer(),
  ],
  server: {
    proxy: {
      '/api/sbdb': {
        target: 'https://ssd-api.jpl.nasa.gov/sbdb.api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/sbdb/, '')
      }
    }
  },
  build:{
    outDir: 'dist'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})