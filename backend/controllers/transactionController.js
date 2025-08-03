const Transaction = require("../models/transation");

exports.listar = async (req, res) => {
  const userId = req.session.userId;

  try {
    const rows = await Transaction.getTransactionsByUser(userId);
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar transações:", err);
    res.status(500).json({ erro: "Erro ao buscar transações" });
  }
};

exports.criar = async (req, res) => {
  const userId = req.session.userId;
  const { tipo, valor, categoria, descricao, data } = req.body;

  // Validação: valor deve ser positivo
  if (Number(valor) <= 0) {
    return res
      .status(400)
      .json({ erro: "O valor deve ser um número maior que zero." });
  }

  try {
    const id = await Transaction.createTransaction(
      userId,
      tipo,
      valor,
      categoria,
      descricao,
      data
    );
    res.status(201).json({ id });
  } catch (err) {
    console.error("Erro ao inserir transação:", err);
    res.status(500).json({ erro: "Erro ao inserir transação" });
  }
};

exports.atualizar = async (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;
  const { tipo, valor, categoria, descricao, data } = req.body;

  // Validação: valor deve ser positivo
  if (Number(valor) <= 0) {
    return res
      .status(400)
      .json({ erro: "O valor deve ser um número maior que zero." });
  }

  try {
    const result = await Transaction.upDateTransation(
      userId,
      tipo,
      valor,
      categoria,
      descricao,
      data,
      id
    );

    if (!result) {
      return res
        .status(404)
        .json({ erro: "Transação não encontrada ou não pertence ao usuário" });
    }

    res.status(200).json({ mensagem: "Transação atualizada com sucesso" });
  } catch (err) {
    console.error("Erro ao atualizar transação:", err);
    res.status(500).json({ erro: "Erro ao atualizar transação" });
  }
};

exports.deletar = async (req, res) => {
  const id = req.params.id;
  const userId = req.session.userId;

  try {
    const result = await Transaction.deleteTransation(id, userId);

    if (!result) {
      return res.status(404).json({
        erro: "Transação não encontrada ou não pertence ao usuário",
      });
    }

    res.status(204).end(); // sucesso sem conteúdo
  } catch (err) {
    console.error("Erro ao excluir transação:", err);
    res.status(500).json({ erro: "Erro ao excluir transação" });
  }
};

exports.baixarLancamentos = async (req, res) => {
  const userId = req.session.userId;

  try {
    const rows = await Transaction.getTransactionsByUser(userId);
    // Ordenar por data (decrescente)
    const ordenado = rows.sort((a, b) => new Date(b.data) - new Date(a.data));

    let csv = "ID; Data; Tipo; Categoria; Descrição; Valor\n";
    ordenado.forEach((row) => {
      csv += `${row.id};${row.data};"${row.tipo}";"${row.categoria}";"${
        row.descricao || ""
      }";${row.valor}\n`;
    });

    // Adiciona BOM (Byte Order Mark) para UTF-8
    const BOM = "\uFEFF";
    const csvComBOM = BOM + csv;

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=lancamentos.csv"
    );
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.send(csvComBOM);
  } catch (err) {
    console.error("Erro ao buscar transações:", err);
    res.status(500).json({ erro: "Erro ao buscar transações" });
  }
};
