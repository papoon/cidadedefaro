// Configuração separada do vite.config.js para não carregar os plugins de build (EJS, static copy).
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.js'],
    restoreMocks: true
  }
})
