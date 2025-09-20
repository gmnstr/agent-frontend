import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/polyfills/nodeFilter.ts', './vitest.setup.ts'],
    css: true,
    globalSetup: './vitest.global-setup.ts',
  },
})
