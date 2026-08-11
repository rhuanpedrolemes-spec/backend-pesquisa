const express = require("express");
const cors = require("cors");

const respostasRouter = require("./routes/respostas");
const adminRouter = require("./routes/admin");

const app = express();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", servico: "tradicao-do-boleiro-api" });
});

app.use("/api/respostas", respostasRouter);
app.use("/api/respostas", adminRouter);

module.exports = app;
