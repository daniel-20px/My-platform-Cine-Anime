import React from 'react';
export default function JanelaIA({ 
  iaAberta, 
  onFechar, 
  onBuscarIA, 
  perguntaIA, 
  setPerguntaIA, 
  iaCarregando, 
  recomendacoes, 
  onAssistir, 
  onCompartilhar 
}) {
  if (!iaAberta) return null;

  return (
    <div className="janela-flutuante janela-ia">
      <div className="janela-header">
        <h3>🤖 Recomendador IA Gemini</h3>
        <button onClick={onFechar} className="btn-fechar">✕</button>
      </div>

      <div className="janela-conteudo">
        <form onSubmit={onBuscarIA} className="form-busca-ia">
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
                <button onClick={() => onAssistir(rec.embed_url)} className="btn-assistir-home">
                  Assistir
                </button>
                <button 
                  onClick={() => onCompartilhar(rec.mal_id, rec.nome_do_titulo, rec.embed_url)} 
                  className="btn-compartilhar-home"
                >
                  💬 Compartilhar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
