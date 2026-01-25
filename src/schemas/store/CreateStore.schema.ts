import z from "zod";

export const CreateStoreSchema = z.object({
  code: z.string().min(1, "El código es obligatorio"),
  name: z.string().min(1, "El nombre es obligatorio"),
  phone: z.string().min(1, "El teléfono es obligatorio"),
  address: z.string().min(1, "La dirección es obligatoria"),
  observations: z.string().optional(),
  maxCapacity: z
    .number({
      error: "La capacidad máxima es obligatoria",
    })
    .min(1, "La capacidad máxima es obligatoria"),
  userId: z.number({
    error: "El encargado es obligatorio",
  }),
});

export type CreateStoreInput = z.infer<typeof CreateStoreSchema>;
