const mongoose = require("mongoose");

const respostaSchema = new mongoose.Schema(
  {
    clienteNome: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    clienteWhatsapp: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    clienteWhatsappNormalizado: {
      type: String,
      index: true,
    },
    barbeiro: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Barbeiro",
      required: true,
      index: true,
    },
    notaBarbeiro: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: "notaBarbeiro deve ser um número inteiro de 1 a 5.",
      },
    },
    // Legado: nota 1-10 das respostas antigas (antes das estrelas por barbeiro).
    notaAtendimento: {
      type: Number,
      min: 1,
      max: 10,
    },
    // Campos abaixo: legado do questionário antigo. Não são mais perguntados nem
    // obrigatórios; seguem no schema só para exibir as respostas antigas no painel.
    assinante: {
      type: Boolean,
    },
    satisfacaoAssinatura: {
      type: Number,
      min: 1,
      max: 10,
    },
    satisfacaoGeral: {
      type: Number,
      min: 1,
      max: 10,
    },
    comentario: {
      type: String,
      trim: true,
    },
    frequenciaCorte: {
      type: String,
      enum: ["1 vez", "2 vezes", "3 vezes", "4 vezes ou mais"],
    },
    objecao: {
      type: String,
      enum: [
        "Sairia muito caro",
        "Não tenho tempo",
        "Não vejo motivo de cortar mais vezes",
      ],
    },
    interessePlano: {
      type: String,
      enum: ["Sim", "Não"],
    },
    indicacaoNome: {
      type: String,
      trim: true,
    },
    indicacaoWhatsapp: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: "criadoEm", updatedAt: false },
  }
);

module.exports = mongoose.model("Resposta", respostaSchema);
