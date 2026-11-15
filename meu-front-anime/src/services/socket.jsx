import { io } from 'socket.io-client';

const API_URL = import.meta.env.DEV 
  ? "http://localhost:3000" 
  : (import.meta.env.VITE_API_URL || "");

export const socket = io(API_URL, {
  transports: ['websocket'],
  autoConnect: false, 
});


socket.on('connect', () => {
  console.log('✅ [Socket] CONECTADO DIRETO NO BACKEND! ID:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('❌ [Socket] Erro ao conectar direto:', error.message);
});