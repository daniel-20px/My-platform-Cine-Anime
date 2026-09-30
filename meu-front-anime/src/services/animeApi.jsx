// src/services/animeApi.js
const API_URL = import.meta.env.VITE_API_URL || window.location.origin;

// 🍿 Busca o trailer de um anime específico no Jikan API
export const buscarTrailerJikan = async (mal_id) => {
  const response = await fetch(`https://api.jikan.moe/v4/anime/${mal_id}`);
  if (!response.ok) throw new Error(`Erro Jikan: ${response.status}`);
  const json = await response.json();
  return json.data?.trailer?.youtube_id || null;
};

// 🧠 Envia a pergunta para a IA e monta a lista de recomendações com dados do Jikan
export const buscarRecomendacoesIA = async (perguntaIA) => {
  const response = await fetch(`${API_URL}/pergunta`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pergunta: perguntaIA }),
  });
  
  const dados = await response.json();
  const recomendacoesDaIA = dados.recomendacoes || [];
  const listaComImagensSeguras = [];

  for (const anime of recomendacoesDaIA) {
    try {
      if (!anime.mal_id) {
        listaComImagensSeguras.push(anime);
        continue;
      }

      // Evita o limite de taxa (rate limit) da API pública do Jikan
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
  return listaComImagensSeguras;
};
