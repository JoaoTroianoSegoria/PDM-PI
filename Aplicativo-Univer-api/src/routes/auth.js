import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { loginSchema } from "../schemas/authSchema.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "univer-secret";
const router = Router();

function buildUserPayload(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    registration: user.registration,
    studentId: user.studentId,
  };
}

router.post("/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { registration: data.registration },
    });

    if (!user) {
      return res.status(401).json({ error: "Matrícula ou CPF inválidos" });
    }

    const cpfMatches = await bcrypt.compare(data.cpf, user.cpfHash);
    if (!cpfMatches) {
      return res.status(401).json({ error: "Matrícula ou CPF inválidos" });
    }

    const userPayload = buildUserPayload(user);
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      token,
      user: userPayload,
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/me", authMiddleware, (req, res) => {
  return res.json({ user: req.user });
});

export default router;
