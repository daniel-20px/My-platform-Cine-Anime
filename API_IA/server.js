import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import perguntaRefletion from './controllers/motivation.controller.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
   credentials: true,
}));

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servidor HTTP
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
     credentials: true,
  },
  transports: ['websocket']
});

// Rota da API
app.post('/pergunta', perguntaRefletion);

// Usuários conectados
let users = [];

io.on('connection', (socket) => {
  users.push(socket.id);

  console.log(`Usuários conectados: ${users.length}`);

  socket.on('welcome', (msg) => {
    io.emit('chat:sendmessage', {
      name: 'Sistema 🤖',
      message: `${msg.name} entrou no chat!`,
      senderId: 'sistema',
      animeSharing: null
    });
  });

  socket.on('chat:message', (msg) => {
    io.emit('chat:sendmessage', {
      name: msg.name,
      message: msg.message,
      senderId: socket.id,
      animeSharing: msg.animeSharing || null
    });
  });

  socket.on('disconnect', () => {
    users = users.filter(
      userID => userID !== socket.id
    );

    console.log(
      `Usuário desconectado. Restam: ${users.length}`
    );
  });
});

// Servir React
app.use(
  express.static(path.join(__dirname, 'dist'))
);

// Fallback do React EXPRESS 5 🚀
app.get('/*splat', (req, res) => {
  res.sendFile(
    path.join(__dirname, 'dist', 'index.html')
  );
});


// Porta
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(
    `🚀 Servidor unificado ativo na porta ${PORT}`
  );
});