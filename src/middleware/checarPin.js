function checarPin(req, res, next) {
  const pinRecebido = req.header("x-admin-pin");

  if (!pinRecebido || pinRecebido !== process.env.ADMIN_PIN) {
    return res.status(401).json({ erro: "PIN inválido ou ausente." });
  }

  next();
}

module.exports = checarPin;
