import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import perguntaRefletion from './controllers/motivation.controller.js';

// Carrega as variáveis do arquivo .env.
dotenv.config();

const app = express();

// Aceita o localhost em desenvolvimento e qualquer origem em produção (Render)
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({
  origin: (origin, callback) => {
    // Se não houver origem ou se estiver na lista de permitidos ou em produção
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'production') {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
}));

// Permite receber dados em formato JSON.
app.use(express.json());

// Converte o caminho do módulo para um caminho de arquivo.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Cria o servidor HTTP usado pelo Express
const server = http.createServer(app);

// No seu server.js, ajuste a criação do io:
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'production') {
        callback(null, true);
      } else {
        callback(new Error('Não permitido pelo CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  //ADICIONE ESSAS DUAS LINHAS AQUI EMBAIXO:
  pingInterval: 2000, 
  pingTimeout: 2000,  
});

// Define a rota responsável pelas perguntas da IA.
app.post('/pergunta', perguntaRefletion);

// Guarda temporariamente os usuários conectados.
let users = [];

// Executado quando um novo cliente se conecta.
io.on('connection', (socket) => {
  users.push(socket.id);
  console.log(`Usuários conectados: ${users.length}`);

  // Avisa no chat quando um usuário entra.
  socket.on('welcome', (msg) => {
    io.emit('chat:sendmessage', {
      name: 'Sistema 🤖',
      message: `${msg.name} entrou no chat!`,
      senderId: 'sistema',
      animeSharing: null
    });
  });

  // Envia as mensagens para todos os usuários.
  socket.on('chat:message', (msg) => {
    io.emit('chat:sendmessage', {
      name: msg.name,
      message: msg.message,
      senderId: socket.id,
      animeSharing: msg.animeSharing || null
    });
  });

  // Remove o usuário quando ele se desconecta.
  socket.on('disconnect', () => {
    users = users.filter(userID => userID !== socket.id);
    console.log(`Usuário desconectado. Restam: ${users.length}`);
  });
});

// Disponibiliza os arquivos compilados do React.
app.use(express.static(path.resolve(__dirname, 'dist')));

//  FORMATO COMPATÍVEL COM EXPRESS 5: Entrega o React sem crashar
app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

// Define a porta usada pelo servidor.
const PORT = process.env.PORT || 3000;

// Inicia o servidor.
server.listen(PORT, () => {
  console.log(`🚀 Servidor unificado ativo na porta ${PORT}`);
});