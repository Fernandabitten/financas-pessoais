const db = require("../db");

exports.getTransactionsByUser = async (userId) => {
  const result = await db.query(
    "SELECT * FROM transactions WHERE user_id = $1",
    [userId]
  );
  return result.rows;
};

exports.createTransaction = async (
  userId,
  tipo,
  valor,
  categoria,
  descricao,
  data
) => {
  const result = await db.query(
    `
    INSERT INTO transactions (user_id, tipo, valor, categoria, descricao, data)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
    `,
    [userId, tipo, valor, categoria, descricao, data]
  );
  return result.rows[0].id;
};

exports.upDateTransation = async (
  userId,
  tipo,
  valor,
  categoria,
  descricao,
  data,
  id
) => {
  const result = await db.query(
    `
    UPDATE transactions
    SET tipo = $1, valor = $2, categoria = $3, descricao = $4, data = $5
    WHERE id = $6 AND user_id = $7
    RETURNING *
    `,
    [tipo, valor, categoria, descricao, data, id, userId]
  );
  return result.rows[0] || null;
};

exports.deleteTransation = async (id, userId) => {
  const result = await db.query(
    "DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *",
    [id, userId]
  );
  return result.rows[0] || null;
};
