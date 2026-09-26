import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css'
const animesIniciais = [
  {
    mal_id: 21,
    nome_do_titulo: "One Piece",
    capa: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
    embed_url: "https://www.youtube-nocookie.com/embed/S8_YwFLCh4U",
  },
  {
    mal_id: 1535,
    nome_do_titulo: "Death Note",
    capa: "https://cdn.myanimelist.net/images/anime/9/9453.jpg",
    embed_url: "https://www.youtube-nocookie.com/embed/gvxNaSIB_WI"
  },
  {
    mal_id: 269,
    nome_do_titulo: "Bleach",
    capa: "https://cdn.myanimelist.net/images/anime/3/40451.jpg",
    embed_url: "https://www.youtube-nocookie.com/embed/GrletSTtDCk"
  },
  {
    mal_id: 9253,
    nome_do_titulo: "Steins;Gate",
    capa: "https://cdn.myanimelist.net/images/anime/1935/127974.jpg",
    embed_url: "https://www.youtube-nocookie.com/embed/uMYhjVwp0Fk"
  },
  {
    mal_id: 23273,
    nome_do_titulo: "Shigatsu wa Kimi no Uso (Your Lie in April)",
    capa: "https://cdn.myanimelist.net/images/anime/3/67177.jpg",
    embed_url: "https://www.youtube-nocookie.com/embed/aMJpI_fEsA4"
  },
  {
    mal_id: 38000,
    nome_do_titulo: "Demon Slayer (Kimetsu no Yaiba)",
    capa: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
    embed_url: "https://www.youtube-nocookie.com/embed/s2BNK1uy42g",
  },
  {
    mal_id: 40748,
    nome_do_titulo: "Jujutsu Kaisen",
    capa: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
    embed_url: "https://www.youtube-nocookie.com/embed/ynr6gnyu9NE",
  },
  // Copie estes itens e adicione junto aos outros dentro do seu array animesIniciais:
  {
    mal_id: 11061,
    nome_do_titulo: "Hunter x Hunter (2011)",
    capa: "https://cdn.myanimelist.net/images/anime/1337/99013.jpg",
    embed_url: "https://www.youtube-nocookie.com/embed/d6kBeWjRIc8"
  },
  {
    mal_id: 31964,
    nome_do_titulo: "My Hero Academia (Boku no Hero)",
    capa: "https://cdn.myanimelist.net/images/anime/10/78745.jpg",
    embed_url: "https://www.youtube-nocookie.com/embed/D5fYOnwYkj4"
  },
  {
    mal_id: 16498,
    nome_do_titulo: "Attack on Titan (Shingeki no Kyojin)",
    capa: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
    embed_url: "https://www.youtube-nocookie.com/embed/CID-sYQNCew"
  },

  {
    mal_id: 50265,
    nome_do_titulo: "Spy x Family",
    capa: "https://cdn.myanimelist.net/images/anime/1441/122795.jpg",
    embed_url: "https://www.youtube-nocookie.com/embed/ofXigq9aIpo"
  },
  {
    mal_id: 5114,
    nome_do_titulo: "Fullmetal Alchemist: Brotherhood",
    capa: "https://cdn.myanimelist.net/images/anime/1208/94745.jpg",
    embed_url: "https://www.youtube-nocookie.com/embed/BOm_PAI1w_o"
  },
  {
    mal_id: 30276,
    nome_do_titulo: "One Punch Man",
    capa: "https://cdn.myanimelist.net/images/anime/12/76049.jpg",
    embed_url: "https://www.youtube-nocookie.com/embed/exC1mffF5uU"
  },
  {
    mal_id: 20,
    nome_do_titulo: "Naruto",
    capa: "https://cdn.myanimelist.net/images/anime/13/17405.jpg",
    embed_url: "https://www.youtube-nocookie.com/embed/2uVIsZgK5wM"
  },
  {
    mal_id: 34798,
    nome_do_titulo: "Yuru Camp",
    capa: "https://cdn.myanimelist.net/images/anime/4/89877.jpg",
    embed_url: "https://www.youtube-nocookie.com/embed/X3Jw1Q0K8cE"
  },
  {
    mal_id: 34914,
    nome_do_titulo: "Made in Abyss",
    capa: "https://cdn.myanimelist.net/images/anime/6/86733.jpg",
    embed_url: "https://www.youtube-nocookie.com/embed/M2e9w3QJZ9M"
  },
{
  mal_id: 28851,
  nome_do_titulo: "Koe no Katachi",
  capa: "https://cdn.myanimelist.net/images/anime/1122/96435.jpg",
  embed_url: "https://www.youtube-nocookie.com/embed/nfK6UgLra7g"
},
{
  mal_id: 23273,
  nome_do_titulo: "Shigatsu wa Kimi no Uso",
  capa: "https://cdn.myanimelist.net/images/anime/3/67177.jpg",
  embed_url: "https://www.youtube-nocookie.com/embed/3b3i8c1bK1I"
},
{
  mal_id: 15039,
  nome_do_titulo: "Ano Hi Mita Hana no Namae wo Bokutachi wa Mada Shiranai.",
  capa: "https://cdn.myanimelist.net/images/anime/5/79697.jpg",
  embed_url: "https://www.youtube-nocookie.com/embed/4HHI9dT4QYw"
},
{
  mal_id: 32281,
  nome_do_titulo: "Kimi no Na wa.",
  capa: "https://cdn.myanimelist.net/images/anime/5/87048.jpg",
  embed_url: "https://www.youtube-nocookie.com/embed/3KR8_igDs1Y"
},
{
  mal_id: 37450,
  nome_do_titulo: "Seishun Buta Yarou wa Yumemiru Shoujo no Yume wo Minai",
  capa: "https://cdn.myanimelist.net/images/anime/1613/102179.jpg",
  embed_url: "https://www.youtube-nocookie.com/embed/2tYj7Q9JZ7I"
},
{
  mal_id: 199,
  nome_do_titulo: "Sen to Chihiro no Kamikakushi",
  capa: "https://cdn.myanimelist.net/images/anime/6/79597.jpg",
  embed_url: "https://www.youtube-nocookie.com/embed/ByXuk9QqQkk"
},
{
  mal_id: 2167,
  nome_do_titulo: "Clannad",
  capa: "https://cdn.myanimelist.net/images/anime/1804/95033.jpg",
  embed_url: "https://www.youtube-nocookie.com/embed/9ZQfVhbdxFw"
},
{
  mal_id: 6746,
  nome_do_titulo: "Durarara!!",
  capa: "https://cdn.myanimelist.net/images/anime/10/71772.jpg",
  embed_url: "https://www.youtube-nocookie.com/embed/v8e2f8j0FfA"
},
{
  mal_id: 31043,
  nome_do_titulo: "Boku dake ga Inai Machi",
  capa: "https://cdn.myanimelist.net/images/anime/10/77957.jpg",
  embed_url: "https://www.youtube-nocookie.com/embed/DwmxEAWjTQQ"
},
];

export default function App() {
  const [socket, setSocket] = useState(null);
  const [nomeUsuario, setNomeUsuario] = useState('Usuário');
  const [historicoChat, setHistoricoChat] = useState([]);
  const [mensagemChat, setMensagemChat] = useState('');
  const [animeIdNoPlayer, setAnimeIdNoPlayer] = useState(null);
  const [perguntaIA, setPerguntaIA] = useState('');
  const [recomendacoes, setRecomendacoes] = useState([]);
  const [iaCarregando, setIaCarregando] = useState(false);
  const [iaAberta, setIaAberta] = useState(false);
  const [chatAberto, setChatAberto] = useState(false);

  const fimDoChatRef = useRef(null);

  // Inicialização e gerenciamento do Socket.io
  useEffect(() => {
    const urlChat = import.meta.env.VITE_CHAT_URL || 'http://localhost:3000';

    const novoSocket = io(urlChat, {
      transports: ['websocket'],
      autoConnect: true
    });

    setSocket(novoSocket);

    novoSocket.on('connect', () => {
      novoSocket.emit('welcome', { name: nomeUsuario });
    });

    novoSocket.on('chat:sendmessage', (data) => {
      setHistoricoChat((prev) => [...prev, data]);
    });

    return () => {
      novoSocket.off('connect');
      novoSocket.off('chat:sendmessage');
      novoSocket.close();
    };
  }, []);

  const lidarMudancaNomeLocal = (novoNome) => {
    setNomeUsuario(novoNome);
  };

  const salvarNomeNoServidor = () => {
    if (socket && nomeUsuario.trim()) {
      socket.emit('welcome', { name: nomeUsuario });
    }
  };

  useEffect(() => {
    fimDoChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [historicoChat]);

  // Controle de trailer corrigido para lidar com caminhos do Jikan v4
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
        console.warn("Não foi possível carregar o trailer: mal_id não fornecido.");
        setAnimeIdNoPlayer("https://www.youtube.com/embed/");
        return;
      }

      const response = await fetch(`https://api.jikan.moe/v4/anime/${mal_id}`);

      if (!response.ok) {
        throw new Error(`Erro na API do Jikan: ${response.status}`);
      }

      const json = await response.json();
      const youtubeId = json.data?.trailer?.youtube_id;

      if (youtubeId) {
        setAnimeIdNoPlayer(`https://www.youtube.com/embed/${youtubeId}`);
      } else {
        setAnimeIdNoPlayer("https://www.youtube.com/embed/");
        alert("Trailer oficial não encontrado. Reproduzindo player padrão.");
      }
    } catch (error) {
      console.error("Erro ao buscar o trailer no Jikan:", error);
      setAnimeIdNoPlayer("https://www.youtube.com/embed/");
    }
  };

  // 2. Busca IA Otimizada: processa as recomendações em fila com delay controlado para garantir todas as imagens
  const lidarBuscaIA = async (e) => {
    e.preventDefault();
    if (!perguntaIA.trim()) return;

    setIaCarregando(true);
    setRecomendacoes([]);
    setAnimeIdNoPlayer(null);

    try {
      const response = await fetch('http://localhost:3000/pergunta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pergunta: perguntaIA }),
      });
      const dados = await response.json();

      const recomendacoesDaIA = dados.recomendacoes || [];
      const listaComImagensSeguras = [];

      // Loop for...of sequencial substituindo o Promise.all para respeitar a API do Jikan
      for (const anime of recomendacoesDaIA) {
        try {
          if (!anime.mal_id) {
            listaComImagensSeguras.push(anime);
            continue;
          }

          // Pequeno delay de 350ms entre cada item recomendado pela IA para evitar o Erro 429
          await new Promise(resolve => setTimeout(resolve, 350));

          const resJikan = await fetch(`https://api.jikan.moe/v4/anime/${anime.mal_id}`);
          if (!resJikan.ok) throw new Error();

          const jsonJikan = await resJikan.json();

          listaComImagensSeguras.push({
            ...anime,
            nome_do_titulo: anime.nome_do_titulo || jsonJikan.data?.title,
            capa: jsonJikan.data?.images?.jpg?.large_image_url || jsonJikan.data?.images?.jpg?.image_url,
            embed_url: jsonJikan.data?.trailer?.embed_url || ""
          });
        } catch (errAnimes) {
          console.error(`Erro ao buscar dados do Jikan para o anime ID ${anime.mal_id}:`, errAnimes);

          listaComImagensSeguras.push({
            ...anime,
            capa: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&q=80"
          });
        }
      }

      setRecomendacoes(listaComImagensSeguras);
    } catch (err) {
      console.error('Erro ao falar com o Gemini:', err);
    } finally {
      setIaCarregando(false);
    }
  };

  const lidarEnviarChat = (e) => {
    if (e) e.preventDefault();
    if (!mensagemChat.trim() || !socket) return;

    socket.emit('chat:message', {
      name: nomeUsuario,
      message: mensagemChat,
      animeSharing: null
    });

    setMensagemChat('');
  };

  const compartilharAnimeNoChat = (mal_id, titulo, embed_url) => {
    if (!socket) return;

    socket.emit('chat:message', {
      name: nomeUsuario,
      message: `Recomendo o anime: ${titulo}!`,
      animeSharing: {
        mal_id: mal_id,
        titulo: titulo,
        embed_url: embed_url
      }
    });

    setIaAberta(false);
    setChatAberto(true);
  };

  return (
    <div className="site-container">
      <div className="conteudo-site">
        <h1>Bem-vindo à Minha Plataforma de Cine-Anime🎬</h1>
        <p>Navegue pelo catálogo. Se precisar de uma indicação inteligente ou quiser interagir na sala global, use os botões flutuantes no canto inferior ID do player.</p>
        <p>Daniel-20px</p>

        <div className="perfil-info">
          <label>Seu apelido no chat: </label>
          <input
            type="text"
            value={nomeUsuario}
            onChange={(e) => lidarMudancaNomeLocal(e.target.value)}
            onBlur={salvarNomeNoServidor}
            onKeyDown={(e) => e.key === 'Enter' && salvarNomeNoServidor()}
            placeholder="Digite seu apelido..."
          />
        </div>

        {animeIdNoPlayer && (
          <div className="container-player-principal">
            <div className="player-header">
              <h3>Reproduzindo Trailer do Anime</h3>
              <button onClick={() => setAnimeIdNoPlayer(null)} className="btn-fechar-video">
                Fechar Player ✕
              </button>
            </div>
            <div className="video-wrapper">
              <iframe
                src={animeIdNoPlayer}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        <h2 className="titulo-secao">🔥 Assista Agora</h2>
        <div className="grid-animes-catalogo">
          {animesIniciais.map((anime) => (
            <div key={anime.mal_id} className="card-anime-home">
              <div style={{ position: 'relative', width: '100%', height: '180px', background: '#151525', overflow: 'hidden' }}>
                <img
                  src={anime.capa}
                  alt={anime.nome_do_titulo}
                  referrerPolicy="no-referrer"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />

                <div className="overlay-play" onClick={() => assistirTrailerDinamico(anime)}>
                  <span className="icone-play">▶</span>
                </div>
              </div>

              <div className="info-anime">
                <h3>{anime.nome_do_titulo}</h3>
                <div className="botoes-card-home">
                  {/* Chame a função dinâmica aqui também para carregar o player com o trailer real! 🚀 */}
                  <button onClick={() => assistirTrailerDinamico(anime)} className="btn-assistir-home">
                    Assistir
                  </button>
                  <button onClick={() => compartilharAnimeNoChat(anime.mal_id, anime.nome_do_titulo, anime.embed_url)} className="btn-compartilhar-home">
                    💬
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
      {/* JANELA DA IA */}
      {iaAberta && (
        <div className="janela-flutuante janela-ia">
          <div className="janela-header">
            <h3>🤖 Recomendador IA Gemini</h3>
            <button onClick={() => setIaAberta(false)} className="btn-fechar">✕</button>
          </div>

          <div className="janela-conteudo">
            <form onSubmit={lidarBuscaIA} className="form-busca-ia">
              <input
                type="text"
                value={perguntaIA}
                onChange={(e) => setPerguntaIA(e.target.value)}
                placeholder="Ex: Quero um anime de ação com muita luta..."
                disabled={iaCarregando}
              />
              <button type="submit" disabled={iaCarregando}>
                {iaCarregando ? 'Pensando...' : 'Pedir indicação'}
              </button>
            </form>

            <div className="lista-recomendacoes-ia">
              {iaCarregando && <p className="status-ia">Buscando as melhores opções no catálogo...</p>}

              {recomendacoes.map((rec) => (
                <div key={rec.mal_id} className="card-recomendacao-ia">
                  <h4>{rec.nome_do_titulo}</h4>
                  <p>{rec.justificativa_curta}</p>
                  <div className="acoes-recomendacao">
                    <button onClick={() => setAnimeIdNoPlayer(rec.embed_url)} className="btn-assistir-home">
                      Assistir
                    </button>
                    <button onClick={() => compartilharAnimeNoChat(rec.mal_id, rec.nome_do_titulo, rec.embed_url)} className="btn-compartilhar-home">
                      💬 Compartilhar
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* JANELA DO CHAT */}
      {chatAberto && (
        <div className="janela-flutuante janela-chat">
          <div className="janela-header">
            <h3>💬 Sala Global de Chat</h3>
            <button onClick={() => setChatAberto(false)} className="btn-fechar">✕</button>
          </div>

          <div className="janela-conteudo">
            <div className="historico-mensagens-chat">
              {historicoChat.map((chat, index) => (
                <div key={index} className={`mensagem-item ${chat.name === nomeUsuario ? 'minha-mensagem' : ''}`}>
                  <span className="usuario-nome"><strong>{chat.name}:</strong></span>
                  <p className="usuario-texto">{chat.message}</p>

                  {/*a mensagem incluir um card de anime compartilhado */}
                  {chat.animeSharing && (
                    <div className="card-compartilhado-no-chat">
                      <h5>🎬 {chat.animeSharing.titulo}</h5>
                      <button onClick={() => setAnimeIdNoPlayer(chat.animeSharing.embed_url)} className="btn-player-chat">
                        Abrir Player
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <div ref={fimDoChatRef} />
            </div>

            <form onSubmit={lidarEnviarChat} className="form-enviar-chat">
              <input
                type="text"
                value={mensagemChat}
                onChange={(e) => setMensagemChat(e.target.value)}
                placeholder="Digite sua mensagem aqui..."
              />
              <button type="submit">Enviar</button>
            </form>
          </div>
        </div>
      )}

      {/* BOTÕES FLUTUANTES DE ACESSO */}
      <div className="botoes-flutuantes-fixos">
        <button onClick={() => { setIaAberta(!iaAberta); setChatAberto(false); }} className={`btn-flutuante btn-call-ia ${iaAberta ? 'ativo' : ''}`}>
          🤖 IA
        </button>
        <button onClick={() => { setChatAberto(!chatAberto); setIaAberta(false); }} className={`btn-flutuante btn-call-chat ${chatAberto ? 'ativo' : ''}`}>
          💬 Chat
        </button>
      </div>

    </div>
  );
}

