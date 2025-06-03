import { z } from "zod";

export const upsertPatientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phoneNumber: z.string().min(1, "Telefone é obrigatório"),
  sex: z.enum(["male", "female"]),
});

export type UpsertPatientSchema = z.infer<typeof upsertPatientSchema>;
