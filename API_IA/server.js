import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import perguntaRefletion from './controllers/motivation.controller.js';


dotenv.config();

const app = express();

// Configura o CORS para aceitar
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL 
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  methods: ['GET', 'POST'],
};

app.use(cors(corsOptions));

// Limita o tamanho do JSON recebido 
app.use(express.json({ limit: '10kb' }));

// Protege a rota da IA contra abuso
const iaLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { error: 'Muitas perguntas seguidas. Tente novamente em alguns minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cria o servidor HTTP 
const server = http.createServer(app);

// Configura o Socket.IO
const io = new Server(server, {
  cors: corsOptions,
  transports: ['websocket', 'polling'],
  pingInterval: 2000,
  pingTimeout: 2000,
});

// Define a rota responsável pelas perguntas da IA c
app.post('/pergunta', iaLimiter, perguntaRefletion);

// Guarda temporariamente os usuários conectados.
let users = [];

// Executado quando um novo cliente se conecta.
io.on('connection', (socket) => {
  users.push(socket.id);
  console.log(`Usuários conectados: ${users.length}`);


  socket.on('welcome', (msg) => {
    if (!msg || typeof msg.name !== 'string') return;
    const safeName = msg.name.trim().slice(0, 30) || 'Anônimo';

    io.emit('chat:sendmessage', {
      name: 'Sistema 🤖',
      message: `${safeName} entrou no chat!`,
      senderId: 'sistema',
      animeSharing: null
    });
  });

  // Envia as mensagens para todos os usuários
  socket.on('chat:message', (msg) => {
    if (!msg || typeof msg.message !== 'string') return;
    
    const safeMessage = msg.message.trim().slice(0, 500);
    if (!safeMessage && !msg.animeSharing) return;

    const safeName = typeof msg.name === 'string' 
      ? msg.name.trim().slice(0, 30) 
      : 'Anônimo';

    io.emit('chat:sendmessage', {
      name: safeName,
      message: safeMessage,
      senderId: socket.id,
      animeSharing: msg.animeSharing || null
    });
  });

  // Remove o usuário 
  socket.on('disconnect', () => {
    users = users.filter(userID => userID !== socket.id);
    console.log(`Usuário desconectado. Restam: ${users.length}`);
  });
});

// Disponibiliza os arquivos compilados 
app.use(express.static(path.resolve(__dirname, 'dist')));


app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

// Define a porta usada pelo servidor
const PORT = process.env.PORT || 3000;

// Inicia o servidor.
server.listen(PORT, () => {
  console.log(`🚀 Servidor unificado ativo na porta ${PORT}`);
});
