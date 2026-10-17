const express = require("express");
const Resposta = require("../models/Resposta");
const verificarToken = require("../middleware/verificarToken");

const router = express.Router();

// Leitura (lista e resumo) é pública a pedido do dono: o painel abre sem senha.
// Excluir continua exigindo o token do administrador.

// GET /api/respostas — pública, lista todas as respostas (mais recentes primeiro)
router.get("/", async (req, res) => {
  try {
    const respostas = await Resposta.find()
      .sort({ criadoEm: -1 })
      .populate("barbeiro", "nome slug");
    res.json(respostas);
  } catch (erro) {
    console.error("Erro ao listar respostas:", erro);
    res.status(500).json({ erro: "Erro interno ao listar as respostas." });
  }
});

// GET /api/respostas/resumo — pública, retorna total e médias
router.get("/resumo", async (req, res) => {
  try {
    const [resumo] = await Resposta.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          mediaNotaAtendimento: { $avg: "$notaAtendimento" },
          mediaNotaBarbeiro: { $avg: "$notaBarbeiro" },
          mediaNotaBarbearia: { $avg: "$notaBarbearia" },
          mediaSatisfacaoGeral: { $avg: "$satisfacaoGeral" },
        },
      },
    ]);

    res.json({
      total: resumo?.total || 0,
      mediaNotaAtendimento: resumo?.mediaNotaAtendimento ?? null,
      mediaNotaBarbeiro: resumo?.mediaNotaBarbeiro ?? null,
      mediaNotaBarbearia: resumo?.mediaNotaBarbearia ?? null,
      mediaSatisfacaoGeral: resumo?.mediaSatisfacaoGeral ?? null,
    });
  } catch (erro) {
    console.error("Erro ao gerar resumo:", erro);
    res.status(500).json({ erro: "Erro interno ao gerar o resumo." });
  }
});

// DELETE /api/respostas — protegida, apaga TODAS as respostas (zera médias e ranking)
router.delete("/", verificarToken, async (req, res) => {
  try {
    const { deletedCount } = await Resposta.deleteMany({});
    res.json({ apagadas: deletedCount });
  } catch (erro) {
    console.error("Erro ao zerar respostas:", erro);
    res.status(500).json({ erro: "Erro interno ao zerar as respostas." });
  }
});

// DELETE /api/respostas/:id — protegida, exclui uma resposta
router.delete("/:id", verificarToken, async (req, res) => {
  try {
    const resposta = await Resposta.findByIdAndDelete(req.params.id);

    if (!resposta) {
      return res.status(404).json({ erro: "Resposta não encontrada." });
    }

    res.status(204).send();
  } catch (erro) {
    if (erro.name === "CastError") {
      return res.status(400).json({ erro: "Id inválido." });
    }
    console.error("Erro ao excluir resposta:", erro);
    res.status(500).json({ erro: "Erro interno ao excluir a resposta." });
  }
});

module.exports = router;
