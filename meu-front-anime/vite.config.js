import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    // Faz o Vite salvar o site pronto direto dentro da pasta da API
    outDir: path.resolve(__dirname, '../API_IA/dist'),
    emptyOutDir: true, // Limpa a pasta antes de gerar o novo build
  }
})
