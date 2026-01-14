import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,
    host: true, // 监听 0.0.0.0
    // 显式允许本地 + 自定义域名
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      // IPv6 localhost
      '::1',
      'd1amond.cn',
      'www.d1amond.cn'
      // 可继续添加其他子域名，如 'app.d1amond.cn'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  }
})