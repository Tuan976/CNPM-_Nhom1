import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Lắng nghe trên mọi interface mạng
    port: 5173,
    strictPort: true, // Ép chạy đúng cổng 5173, không tự nhảy cổng khác
    allowedHosts: [
      'a298-112-197-52-33.ngrok-free.app',
      'all',
      '.ngrok-free.app',
      '.ngrok.io'
    ]
  }
})
