const bcrypt = require("bcrypt");

const senha = process.argv[2];

if (!senha) {
  console.error("Uso: node scripts/gerar-hash-senha.js <senha>");
  process.exit(1);
}

bcrypt.hash(senha, 10).then((hash) => {
  console.log(hash);
});
