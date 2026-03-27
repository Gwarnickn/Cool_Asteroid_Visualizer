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
  build:{
    outDir: 'dist'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})