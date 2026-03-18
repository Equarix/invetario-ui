import z from "zod";

export const ReportProductSchema = z.object({
  storeId: z.number(),
  productId: z.number(),
  quantity: z.number().min(1, "La cantidad debe ser al menos 1"),
});

export type ReportProductInput = z.infer<typeof ReportProductSchema>;
