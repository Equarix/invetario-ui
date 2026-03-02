import z from "zod";

export const ModalStoreSchema = z.object({
  storeId: z
    .number({
      error: "Debe seleccionar una tienda",
    })
    .min(0, "Debe seleccionar una tienda"),
});

export type ModalStoreSchemaType = z.infer<typeof ModalStoreSchema>;
