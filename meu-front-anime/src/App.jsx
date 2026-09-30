import { useState, useEffect, useRef } from 'react';
import { animesIniciais } from './services/catalog';
// Seus serviços externos 
import { buscarTrailerJikan, buscarRecomendacoesIA } from './services/animeApi'; 
// Seus componentes isolados 
import PlayerTrailer from './components/PlayerTrailer';
import CardAnime from './components/CardAnime';
import JanelaIA from './components/JanelaIA';
import JanelaChat from './components/JanelaChat';
import { socket } from './services/socket';



import './App.css';




export default function App() {
 // 📦 Seus states (useState) declarados aqui antes das funções:
  const [nomeUsuario, setNomeUsuario] = useState('Visitante');
  const [animeIdNoPlayer, setAnimeIdNoPlayer] = useState(null);
  
  const [iaAberta, setIaAberta] = useState(false);
  const [perguntaIA, setPerguntaIA] = useState('');
  const [iaCarregando, setIaCarregando] = useState(false);
  const [recomendacoes, setRecomendacoes] = useState([]);

  const [chatAberto, setChatAberto] = useState(false);
  const [mensagemChat, setMensagemChat] = useState('');
  const [historicoChat, setHistoricoChat] = useState([]); // 👈 Seu estado real é este!
  

  const fimDoChatRef = useRef(null);

useEffect(() => {
  // 🔌 Força a conexão manual assim que o componente entra na tela
  console.log("🔌 Solicitando conexão com o servidor Socket.io...");
  socket.connect();

  // 🎧 Escuta as mensagens do servidor e joga no seu estado real (historicoChat)
  socket.on('chat:sendmessage', (novaMensagem) => {
    console.log("📩 Nova mensagem recebida do servidor:", novaMensagem);
    setHistoricoChat((historicoAtual) => [...historicoAtual, novaMensagem]);
  });

  // Desliga tudo quando você atualizar a página ou fechar o app
  return () => {
    console.log("❌ Desconectando e limpando ouvintes antigos...");
    socket.off('chat:sendmessage');
    socket.disconnect(); 
  };
}, []); 

  // 📜 Rola a tela automaticamente para o fim do chat quando chegar mensagem nova
  useEffect(() => {
    if (fimDoChatRef.current) {
      fimDoChatRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [historicoChat]); // 💡 Monitora o histórico real do chat

  // 🛠️ Funções auxiliares locais do chat 
  const lidarMudancaNomeLocal = (novoNome) => {
    setNomeUsuario(novoNome);
  };

  // 1. Avisa o servidor quando o usuário define ou altera o nome
  const salvarNomeNoServidor = () => {
    if (!nomeUsuario.trim()) return;
    console.log("Nome salvo no servidor:", nomeUsuario);
    
    // 🚀 Dispara o evento 'welcome' que o seu backend espera receber
    socket.emit('welcome', { name: nomeUsuario });
  };

  // 2. Compartilha um anime estruturado no chat
  const compartilharAnimeNoChat = (anime) => {
    if (!nomeUsuario.trim()) return alert("Defina um apelido primeiro!");

    // 🚀 Dispara o evento correto com a estrutura que o backend repassa
    socket.emit('chat:message', {
      name: nomeUsuario,
      message: `Olhem esse anime: *${anime.title || anime}*! 🎬`,
      animeSharing: anime
    });
  };

  // 3. Envia mensagem de texto normal do chat
  const lidarEnviarChat = (e) => {
    e.preventDefault();
    if (!mensagemChat.trim()) return;
    if (!nomeUsuario.trim()) return alert("Defina um apelido primeiro!");

    console.log("Enviando mensagem:", mensagemChat);

    // 🚀 Dispara o evento 'chat:message' esperado pelo backend
    socket.emit('chat:message', {
      name: nomeUsuario,
      message: mensagemChat,
      animeSharing: null
    });

    // ✅ Limpa o input de texto do chat após enviar
    setMensagemChat(''); 
  };

  // Abre o trailer usando o embed existente ou buscando-o na Jikan.
  const assistirTrailerDinamico = async (animeOuId) => {
    const ehObjeto = typeof animeOuId === 'object' && animeOuId !== null;
    const mal_id = ehObjeto ? animeOuId.mal_id : animeOuId;
    const embedUrlExistente = ehObjeto ? animeOuId.embed_url : null;

    if (embedUrlExistente && embedUrlExistente.includes('/embed/') && embedUrlExistente !== "https://youtube.com") {
      setAnimeIdNoPlayer(embedUrlExistente);
      return;
    }

    try {
      if (!mal_id) {
        setAnimeIdNoPlayer("https://www.youtube.com/embed/");
        return;
      }

      // 🔥 Chama o serviço isolado
      const youtubeId = await buscarTrailerJikan(mal_id);

      if (youtubeId) {
        setAnimeIdNoPlayer(`https://www.youtube.com/embed/${youtubeId}`);
      } else {
        setAnimeIdNoPlayer("https://www.youtube.com/embed/");
        alert("Trailer oficial não encontrado. Reproduzindo player padrão.");
      }
    } catch (error) {
      console.error("Erro ao buscar o trailer:", error);
      setAnimeIdNoPlayer("https://www.youtube.com/embed/");
    }
  };

  // Envia a pergunta para o backend e recebe as recomendações da IA.
  const lidarBuscaIA = async (e) => {
    e.preventDefault();
    if (!perguntaIA.trim()) return;

    setIaCarregando(true);
    setRecomendacoes([]);
    setAnimeIdNoPlayer(null);

    try {
      // 🔥 Chama o serviço inteligente que isolamos
      const resultadoFinal = await buscarRecomendacoesIA(perguntaIA);
      setRecomendacoes(resultadoFinal);
    } catch (err) {
      console.error('Erro ao falar com o Gemini:', err);
    } finally {
      setIaCarregando(false);
    }
  };

  return (
    <div className="site-container">
      <div className="conteudo-site">
        <h1>Bem-vindo à Minha Plataforma de Cine-Anime🎬</h1>
        <p>Navegue pelo catálogo. Se precisar de uma indicação inteligente ou quiser interagir na sala global, use os botões flutuantes no canto inferior ID do player.</p>
        <p>Daniel-20px</p>

        <div className="perfil-info">
          <label>Seu apelido aqui: </label>
          <input
            type="text"
            value={nomeUsuario}
            onChange={(e) => lidarMudancaNomeLocal(e.target.value)}
            onBlur={salvarNomeNoServidor}
            onKeyDown={(e) => e.key === 'Enter' && salvarNomeNoServidor()}
            placeholder="Digite seu apelido..."
          />
        </div>

        {/* 🎬 PLAYER ISOLADO */}
        <PlayerTrailer 
          urlVideo={animeIdNoPlayer} 
          onFechar={() => setAnimeIdNoPlayer(null)} 
        />

        <h2 className="titulo-secao">🔥 Assista Agora</h2>

        {/* 🎴 GRID DE CARDS UTILIZANDO O COMPONENTE SEPARADO */}
        <div className="grid-animes-catalogo">
          {animesIniciais.map((anime) => (
            <CardAnime 
              key={anime.mal_id}
              anime={anime}
              onAssistir={assistirTrailerDinamico}
              onCompartilhar={compartilharAnimeNoChat}
            />
          ))}
        </div>

        {/* 🤖 JANELA DA IA ISOLADA */}
        <JanelaIA 
          iaAberta={iaAberta}
          onFechar={() => setIaAberta(false)}
          onBuscarIA={lidarBuscaIA}
          perguntaIA={perguntaIA}
          setPerguntaIA={setPerguntaIA}
          iaCarregando={iaCarregando}
          recomendacoes={recomendacoes}
          onAssistir={setAnimeIdNoPlayer}
          onCompartilhar={compartilharAnimeNoChat}
        />

        {/* 💬 JANELA DO CHAT ISOLADA */}
        <JanelaChat 
          chatAberto={chatAberto}
          onFechar={() => setChatAberto(false)}
          historicoChat={historicoChat}
          nomeUsuario={nomeUsuario}
          onAssistir={setAnimeIdNoPlayer}
          fimDoChatRef={fimDoChatRef}
          onEnviarChat={lidarEnviarChat}
          mensagemChat={mensagemChat}
          setMensagemChat={setMensagemChat}
        />

        {/* 🚀 BOTÕES FLUTUANTES CONTROLANDO AS JANELAS */}
        <div className="botoes-flutuantes-fixos">
          <button 
            onClick={() => { setIaAberta(!iaAberta); setChatAberto(false); }} 
            className={`btn-flutuante btn-call-ia ${iaAberta ? 'ativo' : ''}`}
          >
            🤖 IA
          </button>

          <button 
            onClick={() => { setChatAberto(!chatAberto); setIaAberta(false); }} 
            className={`btn-flutuante btn-call-chat ${chatAberto ? 'ativo' : ''}`}
          >
            💬 Chat
          </button>
        </div>

      </div> 
    </div> 
  );
}
