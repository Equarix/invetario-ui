import z from "zod";

export enum PayCondition {
  Contado = 0,
  Credito30 = 1,
  Credito60 = 2,
  Credito90 = 3,
}

export const ProviderSchema = z.object({
  code: z.string().min(1, "El código es requerido"),
  email: z.email("El correo electrónico no es válido").optional(),
  phone: z.string().min(1, "El teléfono es requerido"),
  address: z.string().optional(),
  typeMoney: z.string().min(1, "El tipo de moneda es requerido"),
  publicName: z.string().min(1, "El nombre público es requerido"),
  companyName: z.string().min(1, "El nombre de la compañía es requerido"),
  mainContact: z
    .string()
    .min(1, "El nombre del contacto principal es requerido"),
  contactPhone: z.string().min(1, "El teléfono del contacto es requerido"),
  typeDocument: z.string().min(1, "El tipo de documento es requerido"),
  documentNumber: z.string().min(1, "El número de documento es requerido"),
  daysDelivery: z.number().min(1, "Los días de entrega son requeridos"),
  payCondition: z.nativeEnum(PayCondition, {
    error: "La condición de pago es requerida",
  }),
});

export const updateProviderSchema = ProviderSchema.extend({
  status: z.boolean().optional(),
});

export type ProviderInput = z.infer<typeof ProviderSchema>;
