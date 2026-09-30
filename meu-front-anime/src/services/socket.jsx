import { io } from 'socket.io-client';

// ✅ Se estiver no computador (DEV), conecta DIRETO na porta 3000 sem passar pelo proxy do Vite!
// Se estiver em produção (Render), usa a URL salva na variável.
const API_URL = import.meta.env.DEV 
  ? "http://localhost:3000" 
  : (import.meta.env.VITE_API_URL || "");

export const socket = io(API_URL, {
  transports: ['websocket'],
  autoConnect: false, // Mantém false para o App.jsx controlar
});

// Logs básicos para você ver no navegador (F12)
socket.on('connect', () => {
  console.log('✅ [Socket] CONECTADO DIRETO NO BACKEND! ID:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('❌ [Socket] Erro ao conectar direto:', error.message);
});
