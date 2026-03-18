import z from "zod";

export const PayMethodSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  turned: z.boolean().default(false),
});

export const UpdatePayMethodSchema = PayMethodSchema.extend({
  paymethodId: z.number(),
  status: z.boolean(),
});

export type PayMethodInput = z.infer<typeof PayMethodSchema>;
export type UpdatePayMethodInput = z.infer<typeof UpdatePayMethodSchema>;
