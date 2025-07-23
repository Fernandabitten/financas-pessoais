const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const iaServiceController = require("../controllers/iaServiceController");

router.use(authMiddleware);
router.post("/recomendacoes", iaServiceController.getRecomendacao);
router.post("/resumo-ia", iaServiceController.getResumo);

module.exports = router;
