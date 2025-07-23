const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Rotas de autenticação e perfil
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authController.getUser);
router.put("/update-profile", authController.atualizarPerfil);

module.exports = router;
