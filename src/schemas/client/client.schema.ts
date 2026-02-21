import z from "zod";

export enum ClientType {
  NATURAL = 0,
  COMPANY = 1,
}

export const ClientSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.email("El correo electrónico no es válido").optional(),
  phone: z.string().min(1, "El teléfono es requerido"),
  typeDocument: z.string().min(1, "El tipo de documento es requerido"),
  documentNumber: z.string().min(1, "El número de documento es requerido"),
  clientType: z.nativeEnum(ClientType).default(ClientType.NATURAL),
});

export type ClientInput = z.infer<typeof ClientSchema>;

export const updateClientSchema = ClientSchema.extend({
  status: z.boolean().optional(),
});

export type UpdateClientInput = z.infer<typeof updateClientSchema>;
