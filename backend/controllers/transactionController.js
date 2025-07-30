const Transaction = require("../models/transation");

exports.listar = (req, res) => {
  const userId = req.session.userId;

  try {
    const rows = Transaction.getTransactionsByUser(userId);
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar transações:", err);
    res.status(500).json({ erro: "Erro ao buscar transações" });
  }
};

exports.criar = (req, res) => {
  const userId = req.session.userId;
  const { tipo, valor, categoria, descricao, data } = req.body;

  // Validação: valor deve ser positivo
  if (Number(valor) <= 0) {
    return res
      .status(400)
      .json({ erro: "O valor deve ser um número maior que zero." });
  }

  try {
    const id = Transaction.createTransaction(
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

exports.atualizar = (req, res) => {
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
    const result = Transaction.upDateTransation(
      userId,
      tipo,
      valor,
      categoria,
      descricao,
      data,
      id
    );
    res.status(200).json({ changes: result.changes });
  } catch (err) {
    console.error("Erro ao atualizar transação:", err);
    res.status(500).json({ erro: "Erro ao atualizar transação" });
  }
};

exports.deletar = (req, res) => {
  const id = req.params.id;
  const userId = req.session.userId;

  try {
    const result = Transaction.deleteTransation(id, userId);

    if (result.changes === 0) {
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

const db = require("../db");

exports.baixarLancamentos = (req, res) => {
  const userId = req.session.userId;

  try {
    const rows = Transaction.getTransactionsByUser(userId);
    // Ordenar por data (decrescente)
    const ordenado = rows.sort((a, b) => new Date(b.data) - new Date(a.data));

    let csv = "ID; Data; Tipo; Categoria; Descrição;Valor\n";
    rows.forEach((row) => {
      csv += `${row.id};${row.data};"${row.tipo}";"${row.categoria}";"${row.descricao}";${row.valor}\n`;
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
    //res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar transações:", err);
    res.status(500).json({ erro: "Erro ao buscar transações" });
  }
};
