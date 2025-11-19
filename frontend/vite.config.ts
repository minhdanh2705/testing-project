// Tên file: frontend/vite.config.ts
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Cho phép dùng describe, test, expect ở mọi nơi
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts', // File cài đặt chung cho các test
  },
})