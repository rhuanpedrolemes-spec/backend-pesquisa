const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  const authHeader = req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ erro: "Token ausente." });
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (erro) {
    return res.status(401).json({ erro: "Token inválido ou expirado." });
  }
}

module.exports = verificarToken;
