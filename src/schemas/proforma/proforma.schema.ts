import { z } from "zod";

export const ProformaDetailSchema = z.object({
  productId: z.number().min(1, "Debe seleccionar un producto"),
  quantity: z.number().min(0.01, "La cantidad debe ser mayor a 0"),
});

export const ProformaSchema = z.object({
  clientId: z.number().min(1, "Debe seleccionar un cliente"),
  storeId: z.number().min(1, "El código de almacén es requerido"),
  details: z.array(ProformaDetailSchema).min(1, "Debe agregar al menos un producto"),
});

export type ProformaInput = z.infer<typeof ProformaSchema>;
export type ProformaDetailInput = z.infer<typeof ProformaDetailSchema>;
