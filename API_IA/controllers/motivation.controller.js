import { obterRecomendacaoFinal } from '../services/gemini.services.js';

// Processa a pergunta do usuário e retorna recomendações da IA.
const perguntaRefletion = async (req, res) => {

  try {

    // Obtém a pergunta enviada pelo cliente.
    const { pergunta } = req.body;

    // Valida se a pergunta foi preenchida.
    if (!pergunta || !pergunta.trim()) {

      return res.status(400).json({

        error: "A pergunta não pode estar vazia.",

        recomendacoes: []

      });

    }

    // Registra a pergunta recebida no servidor.
    console.log(
      `[Controller] Recebida pergunta do usuário: "${pergunta}"`
    );

    // Solicita as recomendações ao serviço da IA.
    const dadosIA = await obterRecomendacaoFinal(pergunta);

    // Mostra a resposta recebida do Gemini.
    console.log(
      "[Controller] Dados retornados pelo Gemini:",
      JSON.stringify(dadosIA, null, 2)
    );

    // Retorna as recomendações quando o formato é válido.
    if (dadosIA && Array.isArray(dadosIA.recomendacoes)) {

      return res.json({

        recomendacoes: dadosIA.recomendacoes

      });

    }

    // Retorna uma lista vazia como fallback.
    return res.json({

      recomendacoes: []

    });

  } catch (error) {

    // Registra o erro ocorrido durante o processamento.
    console.error(
      "[Controller] Erro crítico no fluxo de recomendação:",
      error
    );

    // Envia uma resposta genérica de erro ao cliente.
    return res.status(500).json({

      error: "Erro interno no servidor ao processar a IA.",

      recomendacoes: []

    });

  }

};

export default perguntaRefletion;