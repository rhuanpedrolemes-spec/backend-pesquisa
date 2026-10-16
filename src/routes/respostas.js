const express = require("express");
const mongoose = require("mongoose");
const Resposta = require("../models/Resposta");
const Barbeiro = require("../models/Barbeiro");

const router = express.Router();

// Janela em que a mesma pessoa avaliando o mesmo barbeiro conta como envio duplicado.
const JANELA_DUPLICADO_MS = 10 * 60 * 1000;

// POST /api/respostas — pública, registra a resposta de um cliente
router.post("/", async (req, res) => {
  try {
    const {
      clienteNome,
      clienteWhatsapp,
      barbeiro,
      notaBarbeiro,
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

    if (!mongoose.isValidObjectId(barbeiro) || !(await Barbeiro.exists({ _id: barbeiro }))) {
      return res.status(400).json({ erro: "Barbeiro inválido." });
    }

    const clienteWhatsappNormalizado = String(clienteWhatsapp ?? "").replace(/\D/g, "");

    if (clienteWhatsappNormalizado) {
      const duplicada = await Resposta.exists({
        barbeiro,
        clienteWhatsappNormalizado,
        criadoEm: { $gte: new Date(Date.now() - JANELA_DUPLICADO_MS) },
      });
      if (duplicada) {
        return res.status(409).json({ erro: "Avaliação duplicada." });
      }
    }

    const resposta = await Resposta.create({
      clienteNome,
      clienteWhatsapp,
      clienteWhatsappNormalizado,
      barbeiro,
      notaBarbeiro,
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
