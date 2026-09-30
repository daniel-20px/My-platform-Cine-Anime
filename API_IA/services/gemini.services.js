import { GoogleGenAI } from "@google/genai";

import dotenv from 'dotenv';

// Carrega as variáveis do arquivo .env.
dotenv.config();

// Cria a conexão com o Gemini usando a chave da API.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Relaciona os gêneros aos IDs usados pela Jikan.
const GENEROS_MAP = {
  "acao": 1, "aventura": 2, "comedia": 4, "drama": 8,
  "fantasia": 10, "horror": 14, "terror": 14, "romance": 22,
  "scifi": 24, "ficcao": 24, "suspense": 41
};

// Busca animes na Jikan com base na pergunta.
async function buscarNoJikan(perguntaDoUsuario) {

  try {

    // Remove acentos para facilitar a identificação dos gêneros.
    const textoLimpo = perguntaDoUsuario.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    let generoId = null;

    const params = new URLSearchParams();

    params.append('limit', '15');

    // Procura um gênero mencionado na pergunta.
    for (const [key, value] of Object.entries(GENEROS_MAP)) {

      if (textoLimpo.includes(key)) {

        generoId = value;

        break;

      }

    }

    // Filtra pelo gênero encontrado.
    if (generoId) {

      params.append('genres', generoId);

      params.append('order_by', 'score');

      params.append('sort', 'desc');

    } else {

      params.append('q', perguntaDoUsuario);

    }

    const urlFinal = `https://api.jikan.moe/v4/anime?${params.toString()}`;

    const response = await fetch(urlFinal, {

      headers: {

        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',

        'Accept': 'application/json'

      }

    });

    // Usa o catálogo local se a Jikan retornar erro.
    if (!response.ok) {

      console.warn(`A API do Jikan retornou status ${response.status}. Usando catálogo local.`);

      return obterCatalogoLocalFallback();

    }

    // Confirma se a resposta é JSON.
    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {

      console.warn("Jikan não retornou um JSON válido. Ativando catálogo local.");

      return obterCatalogoLocalFallback();

    }

    const json = await response.json();

    // Verifica se existem resultados.
    if (!json.data || json.data.length === 0) {

      console.warn("Nenhum resultado encontrado no Jikan. Ativando catálogo local.");

      return obterCatalogoLocalFallback();

    }

    return formatarLista(json.data);

  } catch (error) {

    // Usa o catálogo local quando a comunicação falha.
    console.error("Erro geral na comunicação com o Jikan. Usando catálogo local:", error.message);

    return obterCatalogoLocalFallback();

  }

}

// Fornece animes locais quando a Jikan não responde.
function obterCatalogoLocalFallback() {

  return [

    {

      mal_id: 21,

      title: "One Piece",

      genres: ["Ação", "Aventura"],

      score: 8.7,

      synopsis: "A jornada de Luffy para se tornar o Rei dos Piratas.",

      youtube_id: "S8_YwFLCh4U",

      embed_url: "https://youtube.com"

    },

    {

      mal_id: 5114,

      title: "Fullmetal Alchemist: Brotherhood",

      genres: ["Ação", "Drama"],

      score: 9.1,

      synopsis: "Dois irmãos procuram a Pedra Filosofal para restaurar seus corpos.",

      youtube_id: "Bw7Ou4_0Ofs",

      embed_url: "https://youtube.com"

    },

    {

      mal_id: 31964,

      title: "Boku no Hero Academia",

      genres: ["Ação"],

      score: 7.9,

      synopsis: "Um garoto sem poderes entra para a maior escola de heróis.",

      youtube_id: "D5fYOnwYtj4",

      embed_url: "https://youtube.com"

    },

    {

      mal_id: 42249,

      title: "Kaguya-sama: Love is War",

      genres: ["Comédia", "Romance"],

      score: 8.7,

      synopsis: "Dois gerais estudantis criam estratégias para fazer o outro se confessar.",

      youtube_id: "v9Z5b-w8jUo",

      embed_url: "https://youtube.com"

    },

    {

      mal_id: 1535,

      title: "Death Note",

      genres: ["Suspense", "Sobrenatural"],

      score: 8.6,

      synopsis: "Um estudante encontra um caderno que pode tirar vidas escrevendo nomes.",

      youtube_id: "NlJZ-Y6At-c",

      embed_url: "https://youtube.com"

    },

    {

      mal_id: 9253,

      title: "Steins;Gate",

      genres: ["Ficção Científica", "Suspense"],

      score: 9.1,

      synopsis: "Cientistas inventam um método de enviar mensagens de texto para o passado.",

      youtube_id: "27OZcIqT9v8",

      embed_url: "https://youtube.com"

    }

  ];

}

// Converte os dados da Jikan para o formato usado pelo app.
function formatarLista(listaAnimes) {

  if (!listaAnimes) return [];

  return listaAnimes.map(anime => {

    const ytId = anime.trailer?.youtube_id || null;

    return {

      mal_id: anime.mal_id,

      title: anime.title,

      // Seleciona a melhor imagem disponível.
      capa: anime.images?.jpg?.large_image_url

        || anime.images?.jpg?.image_url

        || null,

      genres: anime.genres

        ? anime.genres.map(g => g.name)

        : [],

      score: anime.score || "Sem nota",

      // Limita o tamanho da sinopse.
      synopsis: anime.synopsis

        ? anime.synopsis.slice(0, 120) + "..."

        : "Sem sinopse disponível.",
              embed_url: ytId
        ? `https://www.youtube.com/embed/${ytId}`
        : null

    };

  });

}

// Gera recomendações usando Jikan e Gemini.
export const obterRecomendacaoFinal = async (perguntaDoUsuario) => {

  try {

    const catalogoFiltrado = await buscarNoJikan(perguntaDoUsuario);

    if (catalogoFiltrado.length === 0) {

      return { recomendacoes: [] };

    }

    // Monta o contexto enviado ao Gemini.
    const inputComContexto = `

    Pedido do Usuário: "${perguntaDoUsuario}"

    Lista Filtrada de Animes Reais do Catálogo:

    ${JSON.stringify(catalogoFiltrado, null, 2)}

    `;

    let response;

    let tentativas = 0;

    const maxTentativas = 3;

    // Tenta novamente em caso de erro temporário.
    while (tentativas < maxTentativas) {

      try {

        response = await ai.models.generateContent({

          model: 'gemini-3.6-flash',

          contents: inputComContexto,

          config: {

            systemInstruction: `Você é o recomendador inteligente do nosso app de streaming. Escolha de 1 a 3 opções perfeitas contidas estritamente na lista fornecida. Você deve obrigatoriamente preencher os campos estruturados em português conforme o esquema estrutural definido.`,

            temperature: 0.3, // Reduz variações nas respostas.

            responseMimeType: "application/json",

            // Define o formato obrigatório da resposta.
            responseSchema: {

              type: "OBJECT",

              properties: {

                recomendacoes: {

                  type: "ARRAY",

                  items: {

                    type: "OBJECT",

                    properties: {

                      nome_do_titulo: { type: "STRING", description: "O nome do anime conforme fornecido no catálogo" },

                      mal_id: { type: "INTEGER", description: "O ID mal_id do anime" },

                      // Mantém a capa original do catálogo.
                      capa: { type: "STRING", description: "O link da capa/imagem completo copiado EXATAMENTE IGUAL ao fornecido na lista do catálogo." },

                      justificativa_curta: { type: "STRING", description: "Breve explicação em português de por que esse anime foi selecionado" },

                      embed_url: { type: "STRING", description: "O link embed_url completo do trailer copiado EXATAMENTE IGUAL ao fornecido na lista do catálogo." }

                    },

                    // Define os campos obrigatórios.
                    required: ["nome_do_titulo", "mal_id", "capa", "justificativa_curta", "embed_url"]

                  }

                }

              },

              required: ["recomendacoes"]

            }

          }

        });

        break; // Encerra as tentativas após o sucesso.

      } catch (apiError) {

        tentativas++;

        const erroMensagem = apiError.message || "";

        // Aguarda antes de tentar novamente em erros 503.
        if ((erroMensagem.includes("503") || erroMensagem.includes("UNAVAILABLE")) && tentativas < maxTentativas) {

          console.warn(`[Gemini] Servidor instável (503). Tentativa ${tentativas} de ${maxTentativas}... Aguardando reenvio.`);

          await new Promise(resolve => setTimeout(resolve, 1500));

        } else {

          throw apiError; // Encerra em erros que não permitem nova tentativa.

        }

      }

    }

    let textoResposta = "";

    // Obtém o texto em diferentes formatos possíveis.
    if (response && response.text) {

      textoResposta = response.text;

    } else if (response && response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts && response.candidates[0].content.parts[0]) {

      textoResposta = response.candidates[0].content.parts[0].text;

    }

    // Interrompe se a resposta estiver vazia.
    if (!textoResposta) {

      console.error("O Gemini respondeu, mas a estrutura de dados veio vazia.");

      return { recomendacoes: [] };

    }

    // Remove formatação Markdown antes do parsing.
    let textoLimpo = textoResposta.trim();

    if (textoLimpo.startsWith("```")) {

      textoLimpo = textoLimpo.replace(/^```json\s*/i, "").replace(/```$/, "").trim();

    }

    // Converte a resposta para objeto JavaScript.
    const respostaIA = JSON.parse(textoLimpo);

    // Garante trailers válidos nas recomendações.
    if (respostaIA && Array.isArray(respostaIA.recomendacoes)) {

      respostaIA.recomendacoes = respostaIA.recomendacoes.map(rec => {

        const animesLocais = obterCatalogoLocalFallback();

        // Localiza o anime pelo MAL ID.
        const animeCorrespondente = catalogoFiltrado.find(a => Number(a.mal_id) === Number(rec.mal_id)) ||

          animesLocais.find(a => Number(a.mal_id) === Number(rec.mal_id));

        if (animeCorrespondente) {

          // Usa o embed já disponível no catálogo.
          if (animeCorrespondente.embed_url && animeCorrespondente.embed_url.length > 30) {

            return { ...rec, embed_url: animeCorrespondente.embed_url };

          }

          // Monta o embed usando o ID do YouTube.
          if (animeCorrespondente.youtube_id) {

            return { ...rec, embed_url: `https://youtube.com/embed/${animeCorrespondente.youtube_id}` };

          }

        }

        // Define um link padrão caso não exista trailer.
        return { ...rec, embed_url: "https://youtube.com" };

      });

    }

    return respostaIA;

  } catch (error) {

    // Usa recomendações alternativas quando o fluxo principal falha.
    console.error("[Serviço] Erro no fluxo de recomendação do Gemini:", error.message);

    // Normaliza a pergunta para o sistema de fallback.
    const termoBusca = perguntaDoUsuario ? perguntaDoUsuario.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

    // Fallback para pedidos relacionados a romance.
    if (

      termoBusca.includes("romance") ||

      termoBusca.includes("roance") ||

      termoBusca.includes("romanc") ||

      termoBusca.includes("amor") ||

      termoBusca.includes("namoro")

    ) {

      return {

          recomendacoes: [

      {
        mal_id: 41380,
        nome_do_titulo: "Horimiya (Fallback Romance)",
        justificativa_curta: "A IA encontrou uma instabilidade, esse romance apaixonante e super leve para assistir agora!",
        embed_url: "https://www.youtube.com"
      },

      {
        mal_id: 4224,
        nome_do_titulo: "Toradora! (Fallback Romance)",
        justificativa_curta: "Uma comédia romântica clássica perfeita para acompanhar enquanto normalizamos o sinal.",
        embed_url: "https://www.youtube.com"
      }

    ]

  };

}

// Fallback para pedidos de ficção científica.
if (termoBusca.includes("scifi") || termoBusca.includes("ficcao") || termoBusca.includes("cientifica") || termoBusca.includes("tempo") || termoBusca.includes("robo")) {

  return {

    recomendacoes: [

      {
        mal_id: 9253,
        nome_do_titulo: "Steins;Gate (Fallback Sci-Fi)",
        justificativa_curta: "A IA encontrou uma instabilidade temporária, mas que tal essa obra-prima sobre viagem no tempo e ficção científica?",
        embed_url: "https://www.youtube.com"
      },

      {
        mal_id: 13601,
        nome_do_titulo: "Psycho-Pass (Fallback Sci-Fi)",
        justificativa_curta: "Uma excelente indicação de ficção científica cyberpunk e distópica para assistir agora mesmo.",
        embed_url: "https://www.youtube.com"
      }

    ]

  };

}

// Fallback para pedidos de comédia.
if (termoBusca.includes("comedia") || termoBusca.includes("engracado") || termoBusca.includes("rir") || termoBusca.includes("humor")) {

  return {

    recomendacoes: [

      {
        mal_id: 30276,
        nome_do_titulo: "One Punch Man (Fallback Comédia)",
        justificativa_curta: "O sistema oscilou, mas divirta-se com a comédia hilária do herói mais forte do mundo!",
        embed_url: "https://www.youtube.com"
      },

      {
        mal_id: 50265,
        nome_do_titulo: "Spy x Family (Fallback Comédia)",
        justificativa_curta: "Uma comédia familiar cheia de carisma recomendada pelo nosso modo de segurança temporário.",
        embed_url: "https://www.youtube.com"
      }

    ]

  };

}

// Usa recomendações gerais quando nenhum gênero é identificado.
return {

  recomendacoes: [

    {
      mal_id: 20,
      nome_do_titulo: "Naruto (Fallback Ação/Geral)",
      justificativa_curta: "Tivemos um problema de conexão com o catálogo principal, mas recomendamos esse clássico absoluto repleto de combates ninjas incríveis e superação.",
      embed_url: "https://www.youtube.com"
    },

    {
      mal_id: 31964,
      nome_do_titulo: "Boku no Hero Academia (Fallback Ação/Geral)",
      justificativa_curta: "Nosso sistema está operando em modo de segurança. Que tal curtir muita ação com super-heróis em lutas eletrizantes?",
      embed_url: "https://www.youtube.com"
    }

  ]

};

  }

};