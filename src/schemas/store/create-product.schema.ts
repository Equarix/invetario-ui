import z from "zod";

export const CreateProductSchema = z.object({
  productId: z.number(),
  actualStock: z.number().min(0, "El stock actual no puede ser negativo"),
  minStock: z.number().min(0, "El stock mínimo no puede ser negativo"),
  maxStock: z.number().min(0, "El stock máximo no puede ser negativo"),
  avgCost: z.number().min(0, "El precio promedio no puede ser negativo"),
  lastCost: z.number().min(0, "El último costo no puede ser negativo"),
});

export const UpdateProductSchema = CreateProductSchema.extend({
  status: z.boolean(),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
