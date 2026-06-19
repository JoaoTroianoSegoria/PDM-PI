import "dotenv/config";
import cors from "cors";
import express from "express";
import academicRouter from "./routes/academic.js";
import authRouter from "./routes/auth.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ ok: true, name: "aplicativo-univer-api" });
});

app.use("/auth", authRouter);
app.use("/academic", authMiddleware, academicRouter);

app.use(errorHandler);

const port = process.env.PORT ?? 3001;

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
