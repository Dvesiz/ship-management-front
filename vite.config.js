import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 你的后端地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 去掉 /api
      }
    }
  }
})
