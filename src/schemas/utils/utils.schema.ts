import z from "zod";

export const ModalStoreSchema = z.object({
  storeId: z
    .number({
      error: "Debe seleccionar una tienda",
    })
    .min(0, "Debe seleccionar una tienda"),
  boxId: z
    .number({
      error: "Debe seleccionar una caja",
    })
    .min(0, "Debe seleccionar una caja"),
});

export type ModalStoreSchemaType = z.infer<typeof ModalStoreSchema>;
