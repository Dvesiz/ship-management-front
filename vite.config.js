import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
  // 关键：必须添加 plugins 配置
  plugins: [vue()],
  // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

  server: {
    host: true, 
    allowedHosts: [
      '5ac6df1d.r7.cpolar.top',
      'dhy721.dpdns.org', // <-- 你的 cpolar 公网域名
      'localhost',
      '127.0.0.1'
    ],
    proxy: {

      '/api': {
        target: 'http://localhost:8080', // 你的后端地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 去掉 /api
      }
    }
  }
})