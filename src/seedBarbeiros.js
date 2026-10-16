const Barbeiro = require("./models/Barbeiro");

// A foto de cada barbeiro vive no frontend: /barbeiros/<slug>.jpg
const BARBEIROS = [
  { nome: "Carlos Bueno", slug: "carlos-bueno" },
  { nome: "Diogo Ferreira", slug: "diogo-ferreira" },
  { nome: "Julio Ornelles", slug: "julio-ornelles" },
  { nome: "Victor Ferreira", slug: "victor-ferreira" },
  { nome: "Fagner Lima", slug: "fagner-lima" },
];

// Idempotente: cria os que faltam e nunca remove nem altera avaliações existentes.
async function seedBarbeiros() {
  await Barbeiro.bulkWrite(
    BARBEIROS.map((b) => ({
      updateOne: {
        filter: { slug: b.slug },
        update: { $setOnInsert: b },
        upsert: true,
      },
    }))
  );
}

module.exports = seedBarbeiros;
