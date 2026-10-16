const express = require("express");
const Resposta = require("../models/Resposta");

const router = express.Router();

// GET /api/barbearia — pública. Total de avaliações e média das estrelas da barbearia.
// `media` é a média aritmética com os valores originais; o arredondamento é só de exibição.
router.get("/", async (req, res) => {
  try {
    const [estatisticas] = await Resposta.aggregate([
      { $match: { notaBarbearia: { $gte: 1, $lte: 5 } } },
      {
        $group: {
          _id: null,
          totalAvaliacoes: { $sum: 1 },
          media: { $avg: "$notaBarbearia" },
        },
      },
    ]);

    res.json({
      totalAvaliacoes: estatisticas?.totalAvaliacoes ?? 0,
      media: estatisticas?.media ?? null,
    });
  } catch (erro) {
    console.error("Erro ao calcular avaliação da barbearia:", erro);
    res.status(500).json({ erro: "Erro interno ao calcular a avaliação da barbearia." });
  }
});

module.exports = router;
