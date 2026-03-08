import z from "zod";

export const UserSchema = z.object({
  email: z.email({ error: "Correo electrónico inválido" }),
  password: z
    .string()
    .min(6, { error: "La contraseña debe tener al menos 6 caracteres" }),
  firstName: z
    .string()
    .min(2, { error: "El nombre debe tener al menos 2 caracteres" }),
  lastName: z
    .string()
    .min(2, { error: "El apellido debe tener al menos 2 caracteres" }),

  role: z.enum(["0", "1", "2", "3"], {
    error:
      "Rol inválido. Debe ser uno de los siguientes: 0 (Admin), 1 (Vendedor), 2 (Almacenero), 3 (Cliente)",
  }),
});

export type UserSchemaType = z.infer<typeof UserSchema>;
