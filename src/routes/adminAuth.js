const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

// POST /api/admin/login — autentica o administrador e retorna um JWT
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const usernameValido = username === process.env.ADMIN_USERNAME;
    const senhaValida =
      usernameValido && password
        ? await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH)
        : false;

    if (!usernameValido || !senhaValida) {
      return res.status(401).json({ erro: "Usuário ou senha inválidos." });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (erro) {
    console.error("Erro ao autenticar administrador:", erro);
    res.status(500).json({ erro: "Erro interno ao autenticar." });
  }
});

module.exports = router;
