import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    legacy()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8100,
    proxy: {
      '/usuarios': 'http://localhost:3000',
      '/reservas': 'http://localhost:3000',
      '/motos': 'http://localhost:3000',
      '/parqueaderos': 'http://localhost:3000',
    }
  }
} )
