const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const transactionController = require("../controllers/transactionController");

// Aplica autenticação a todas as rotas abaixo
router.use(authMiddleware);

router.get("/transactions", transactionController.listar);
router.post("/transactions", transactionController.criar);
router.put("/transactions/:id", transactionController.atualizar);
router.delete("/transactions/:id", transactionController.deletar);
router.get("/baixar", transactionController.baixarLancamentos);

module.exports = router;
