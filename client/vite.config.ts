import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {resolve} from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@typings': resolve(__dirname, 'src/types'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@contexts': resolve(__dirname, 'src/contexts'),
      '@shared': resolve(__dirname, '../shared/'),      
    },
  },
})
