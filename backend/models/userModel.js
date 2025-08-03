const db = require("../db");

exports.createUser = async (nome, email, senha) => {
  const result = await db.query(
    `INSERT INTO users (nome, email, senha) VALUES ($1, $2, $3) RETURNING id`,
    [nome, email, senha]
  );
  return { id: result.rows[0].id };
};

exports.findUserByEmail = async (email) => {
  const result = await db.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  return result.rows[0] || null;
};

exports.getUserById = async (id) => {
  const result = await db.query(
    `SELECT id, nome, email FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

exports.getUserWithSenha = async (id) => {
  const result = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result.rows[0] || null;
};

exports.updateUser = async (id, campos) => {
  const updates = [];
  const valores = [];
  let index = 1;

  for (const chave in campos) {
    updates.push(`${chave} = $${index}`);
    valores.push(campos[chave]);
    index++;
  }

  valores.push(id); // último valor para o WHERE

  const sql = `UPDATE users SET ${updates.join(
    ", "
  )} WHERE id = $${index} RETURNING *`;
  const result = await db.query(sql, valores);
  return result.rows[0] || null;
};
