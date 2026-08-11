const express = require("express");
const cors = require("cors");

const respostasRouter = require("./routes/respostas");
const adminRouter = require("./routes/admin");
const adminAuthRouter = require("./routes/adminAuth");

const app = express();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", servico: "tradicao-do-boleiro-api" });
});

app.use("/api/respostas", respostasRouter);
app.use("/api/respostas", adminRouter);
app.use("/api/admin", adminAuthRouter);

module.exports = app;
