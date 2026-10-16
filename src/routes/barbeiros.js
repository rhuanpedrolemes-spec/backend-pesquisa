const express = require("express");
const Barbeiro = require("../models/Barbeiro");
const Resposta = require("../models/Resposta");

const router = express.Router();

// GET /api/barbeiros — pública. Lista os barbeiros já ordenados pelo ranking:
// 1) mais avaliações, 2) maior média (desempate), 3) nome (ordem estável).
// `media` é a média aritmética com os valores originais; o arredondamento é só de exibição.
router.get("/", async (req, res) => {
  try {
    const [barbeiros, estatisticas] = await Promise.all([
      Barbeiro.find().lean(),
      Resposta.aggregate([
        { $match: { barbeiro: { $ne: null }, notaBarbeiro: { $gte: 1, $lte: 5 } } },
        {
          $group: {
            _id: "$barbeiro",
            totalAvaliacoes: { $sum: 1 },
            somaNotas: { $sum: "$notaBarbeiro" },
          },
        },
      ]),
    ]);

    const porBarbeiro = new Map(estatisticas.map((e) => [String(e._id), e]));

    const ranking = barbeiros
      .map((b) => {
        const e = porBarbeiro.get(String(b._id));
        const totalAvaliacoes = e?.totalAvaliacoes ?? 0;
        return {
          _id: b._id,
          nome: b.nome,
          slug: b.slug,
          totalAvaliacoes,
          media: totalAvaliacoes > 0 ? e.somaNotas / totalAvaliacoes : null,
        };
      })
      .sort(
        (a, b) =>
          b.totalAvaliacoes - a.totalAvaliacoes ||
          (b.media ?? 0) - (a.media ?? 0) ||
          a.nome.localeCompare(b.nome, "pt-BR")
      );

    res.json(ranking);
  } catch (erro) {
    console.error("Erro ao listar barbeiros:", erro);
    res.status(500).json({ erro: "Erro interno ao listar os barbeiros." });
  }
});

module.exports = router;
