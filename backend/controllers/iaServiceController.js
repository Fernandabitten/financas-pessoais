const iaService = require("../services/iaService");

exports.getRecomendacao = (req, res) => {
  const { transacoes, ano, mes } = req.body;

  if (!transacoes || !ano) {
    return res.status(400).json({ error: "Dados insuficientes para análise." });
  }

  const recomendacao = iaService.analisarTransacoes(transacoes, ano, mes);
  res.json({ recomendacao });
};

exports.getResumo = async (req, res) => {
  try {
    const dados = req.body;
    const resumo = await iaService.gerarResumoFinanceiro(dados); // Aguardando a Promise
    return res.json({ resumo });
  } catch (error) {
    console.error("Erro ao gerar resumo:", error);
    res.status(500).json({ error: "Erro ao gerar resumo" });
  }
};
