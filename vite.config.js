import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    modules: {
      // [name] - имя файла (например, Accordion)
      // [local] - твой класс (например, wrapper)
      // [hash] - короткий хеш, чтобы стили не конфликтовали
      generateScopedName: '[name]_[local]__[hash:base64:5]',
    },
  },
  // ------------------------
})
