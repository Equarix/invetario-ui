import z from "zod";

export const ClientSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.email("El correo electrónico no es válido").optional(),
  phone: z.string().min(1, "El teléfono es requerido"),
  typeDocument: z.string().min(1, "El tipo de documento es requerido"),
  documentNumber: z.string().min(1, "El número de documento es requerido"),
});
