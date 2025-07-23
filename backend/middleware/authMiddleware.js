function authMiddleware(req, res, next) {
  try {
    if (!req.session?.userId) {
      return res
        .status(401)
        .json({ error: "Acesso não autorizado. Faça login para continuar." });
    }

    // Usuário autenticado
    next();
  } catch (err) {
    console.error("Erro no middleware de autenticação:", err);

    return res.status(500).json({
      error: "Erro interno no servidor durante a verificação de autenticação.",
    });
  }
}

module.exports = authMiddleware;
