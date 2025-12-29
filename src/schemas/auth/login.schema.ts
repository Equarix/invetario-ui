import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Correo electrónico inválido"),
  password: z.string().min(3, "La contraseña debe tener al menos 6 caracteres"),
});

export type AuthSchemaType = z.infer<typeof loginSchema>;
