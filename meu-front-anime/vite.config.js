import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './', // 🚀 ADICIONE ESTA LINHA: Garante que os arquivos sejam achados na nuvem
  build: {
    outDir: path.resolve(__dirname, '../API_IA/dist'),
    emptyOutDir: true,
  }
})
