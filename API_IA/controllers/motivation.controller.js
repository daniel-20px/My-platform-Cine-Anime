import { obterRecomendacaoFinal } from '../services/gemini.services.js';

const perguntaRefletion = async (req, res) => {
  try {
    const { pergunta } = req.body;

    if (!pergunta || !pergunta.trim()) {
      return res.status(400).json({
        error: "A pergunta não pode estar vazia.",
        recomendacoes: []
      });
    }

    console.log(
      `[Controller] Recebida pergunta do usuário: "${pergunta}"`
    );

    const dadosIA = await obterRecomendacaoFinal(pergunta);

    console.log(
      "[Controller] Dados retornados pelo Gemini:",
      JSON.stringify(dadosIA, null, 2)
    );

    if (dadosIA && Array.isArray(dadosIA.recomendacoes)) {
      return res.json({
        recomendacoes: dadosIA.recomendacoes
      });
    }

    return res.json({
      recomendacoes: []
    });

  } catch (error) {
    console.error(
      "[Controller] Erro crítico no fluxo de recomendação:",
      error
    );

    return res.status(500).json({
      error: "Erro interno no servidor ao processar a IA.",
      recomendacoes: []
    });
  }
};

export default perguntaRefletion;