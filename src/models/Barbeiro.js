const mongoose = require("mongoose");

const barbeiroSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
});

module.exports = mongoose.model("Barbeiro", barbeiroSchema);
