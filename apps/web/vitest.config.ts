import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/lib/**', 'src/app/api/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@loverecap/validation': path.resolve(__dirname, '../../packages/validation/src/index.ts'),
      '@loverecap/utils': path.resolve(__dirname, '../../packages/utils/src/index.ts'),
    },
  },
})
