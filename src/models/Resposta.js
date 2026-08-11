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
    notaAtendimento: {
      type: Number,
      min: 1,
      max: 10,
    },
    assinante: {
      type: Boolean,
      required: true,
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
