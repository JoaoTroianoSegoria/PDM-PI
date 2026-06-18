import { z } from "zod";

export const loginSchema = z.object({
  registration: z
    .string()
    .regex(/^\d{10}$/, "A matrícula deve ter exatamente 10 números"),
  cpf: z.string().regex(/^\d{11}$/, "O CPF deve ter exatamente 11 números"),
});
