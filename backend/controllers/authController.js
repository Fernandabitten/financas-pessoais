const bcrypt = require("bcrypt");
const User = require("../models/userModel");

exports.register = (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const usuarioExistente = User.findUserByEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ erro: "Email já cadastrado." });
    }

    const hash = bcrypt.hashSync(senha, 10);
    const { id: userId } = User.createUser(nome, email, hash);
    req.session.userId = userId;

    res.status(201).json({ id: userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao registrar usuário" });
  }
};

exports.login = (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = User.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const senhaValida = bcrypt.compareSync(senha, user.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    req.session.userId = user.id;
    res.json({ mensagem: "Login realizado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao fazer login" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ mensagem: "Logout realizado" });
  });
};

exports.getUser = (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ erro: "Não autenticado" });

  try {
    const user = User.getUserById(userId);
    if (!user) return res.status(404).json({ erro: "Usuário não encontrado" });

    res.json(user); // { id, nome, email }
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao obter dados do usuário" });
  }
};

exports.atualizarPerfil = (req, res) => {
  const userId = req.session.userId;
  const { nome, senhaAtual, novaSenha } = req.body;

  if (!userId) return res.status(401).json({ erro: "Não autenticado" });
  if (!senhaAtual)
    return res.status(400).json({ erro: "Senha atual é obrigatória" });

  try {
    const user = User.getUserWithSenha(userId);
    if (!user) return res.status(404).json({ erro: "Usuário não encontrado" });

    const senhaValida = bcrypt.compareSync(senhaAtual, user.senha);
    if (!senhaValida)
      return res.status(403).json({ erro: "Senha atual incorreta" });

    const atualizacoes = {};

    if (nome?.trim()) atualizacoes.nome = nome.trim();
    if (novaSenha?.trim()) atualizacoes.senha = bcrypt.hashSync(novaSenha, 10);

    if (Object.keys(atualizacoes).length === 0) {
      return res.status(400).json({ erro: "Nenhuma alteração enviada" });
    }

    User.updateUser(userId, atualizacoes);
    res.json({ mensagem: "Perfil atualizado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar perfil" });
  }
};
