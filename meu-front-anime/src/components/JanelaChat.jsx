import React from 'react';


export default function JanelaChat({
  chatAberto,
  onFechar,
  historicoChat,
  nomeUsuario,
  onAssistir,
  fimDoChatRef,
  onEnviarChat,
  mensagemChat,
  setMensagemChat
}) {
  if (!chatAberto) return null;

  return (
    <div className="janela-flutuante janela-chat">
      <div className="janela-header">
        <h3>💬 Sala Global de Chat</h3>
        <button onClick={onFechar} className="btn-fechar">✕</button>
      </div>

      <div className="janela-conteudo">
        <div className="historico-mensagens-chat">
          {historicoChat.map((chat, index) => (
            <div key={index} className={`mensagem-item ${chat.name === nomeUsuario ? 'minha-mensagem' : ''}`}>
              <span className="usuario-nome"><strong>{chat.name}:</strong></span>
              <p className="usuario-texto">{chat.message}</p>

              {chat.animeSharing && (
                <div className="card-compartilhado-no-chat">
                  <h5>🎬 {chat.animeSharing.titulo}</h5>
                  <button onClick={() => onAssistir(chat.animeSharing.embed_url)} className="btn-player-chat">
                    Abrir Player
                  </button>
                </div>
              )}
            </div>
          ))}
          <div ref={fimDoChatRef} />
        </div>

        <form onSubmit={onEnviarChat} className="form-enviar-chat">
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
  );
}
