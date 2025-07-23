const db = require("../db");

exports.createUser = (nome, email, senha) => {
  const stmt = db.prepare(
    `INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)`
  );
  const result = stmt.run(nome, email, senha);
  return { id: result.lastInsertRowid };
};

exports.findUserByEmail = (email) => {
  const stmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
  return stmt.get(email);
};

exports.getUserById = (id) => {
  const stmt = db.prepare(`SELECT id, nome, email FROM users WHERE id = ?`);
  return stmt.get(id);
};

exports.getUserWithSenha = (id) => {
  const stmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
  return stmt.get(id);
};

exports.updateUser = (id, campos) => {
  const updates = [];
  const valores = [];

  for (const chave in campos) {
    updates.push(`${chave} = ?`);
    valores.push(campos[chave]);
  }

  const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
  valores.push(id);

  const stmt = db.prepare(sql);
  return stmt.run(...valores);
};
