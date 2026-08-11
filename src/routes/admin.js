const express = require("express");
const Resposta = require("../models/Resposta");
const checarPin = require("../middleware/checarPin");

const router = express.Router();

router.use(checarPin);

// GET /api/respostas — protegida, lista todas as respostas (mais recentes primeiro)
router.get("/", async (req, res) => {
  try {
    const respostas = await Resposta.find().sort({ criadoEm: -1 });
    res.json(respostas);
  } catch (erro) {
    console.error("Erro ao listar respostas:", erro);
    res.status(500).json({ erro: "Erro interno ao listar as respostas." });
  }
});

// GET /api/respostas/resumo — protegida, retorna total e médias
router.get("/resumo", async (req, res) => {
  try {
    const [resumo] = await Resposta.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          mediaNotaAtendimento: { $avg: "$notaAtendimento" },
          mediaSatisfacaoGeral: { $avg: "$satisfacaoGeral" },
        },
      },
    ]);

    res.json({
      total: resumo?.total || 0,
      mediaNotaAtendimento: resumo?.mediaNotaAtendimento ?? null,
      mediaSatisfacaoGeral: resumo?.mediaSatisfacaoGeral ?? null,
    });
  } catch (erro) {
    console.error("Erro ao gerar resumo:", erro);
    res.status(500).json({ erro: "Erro interno ao gerar o resumo." });
  }
});

module.exports = router;
