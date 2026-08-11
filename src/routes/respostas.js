const express = require("express");
const Resposta = require("../models/Resposta");

const router = express.Router();

// POST /api/respostas — pública, registra a resposta de um cliente
router.post("/", async (req, res) => {
  try {
    const {
      notaAtendimento,
      assinante,
      satisfacaoAssinatura,
      satisfacaoGeral,
      comentario,
      frequenciaCorte,
      objecao,
      interessePlano,
      indicacaoNome,
      indicacaoWhatsapp,
    } = req.body;

    const resposta = await Resposta.create({
      notaAtendimento,
      assinante,
      satisfacaoAssinatura,
      satisfacaoGeral,
      comentario,
      frequenciaCorte,
      objecao,
      interessePlano,
      indicacaoNome,
      indicacaoWhatsapp,
    });

    res.status(201).json(resposta);
  } catch (erro) {
    if (erro.name === "ValidationError") {
      return res.status(400).json({ erro: erro.message });
    }
    console.error("Erro ao salvar resposta:", erro);
    res.status(500).json({ erro: "Erro interno ao salvar a resposta." });
  }
});

module.exports = router;
