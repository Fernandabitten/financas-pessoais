const db = require("../db"); // agora é o `better-sqlite3` configurado

exports.getTransactionsByUser = (userId) => {
  const stmt = db.prepare("SELECT * FROM transactions WHERE user_id = ?");
  return stmt.all(userId);
};

exports.createTransaction = (
  userId,
  tipo,
  valor,
  categoria,
  descricao,
  data
) => {
  const stmt = db.prepare(`
    INSERT INTO transactions (user_id, tipo, valor, categoria, descricao, data)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(userId, tipo, valor, categoria, descricao, data);
  return info.lastInsertRowid;
};

exports.upDateTransation = (
  userId,
  tipo,
  valor,
  categoria,
  descricao,
  data,
  id
) => {
  const stmt = db.prepare(`
    UPDATE transactions
    SET tipo = ?, valor = ?, categoria = ?, descricao = ?, data = ?
    WHERE id = ? AND user_id = ?
  `);
  return stmt.run(tipo, valor, categoria, descricao, data, id, userId);
};

exports.deleteTransation = (id, userId) => {
  const stmt = db.prepare(
    "DELETE FROM transactions WHERE id = ? AND user_id = ?"
  );
  return stmt.run(id, userId);
};
