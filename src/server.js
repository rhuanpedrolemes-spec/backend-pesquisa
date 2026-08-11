require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado ao MongoDB.");

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (erro) {
    console.error("Falha ao conectar ao MongoDB:", erro);
    process.exit(1);
  }
}

start();
