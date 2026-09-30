import React from 'react';

export default function PlayerTrailer({ urlVideo, onFechar }) {
  // Se não houver vídeo selecionado, não renderiza nada
  if (!urlVideo) return null;

  return (
    <div className="container-player-principal">
      <div className="player-header">
        <h3>Reproduzindo Trailer do Anime</h3>
        <button onClick={onFechar} className="btn-fechar-video">
          Fechar Player ✕
        </button>
      </div>

      <div className="video-wrapper">
        <iframe
          src={urlVideo}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
