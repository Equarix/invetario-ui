import z from "zod";

export const UnitSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
});

export type OmitUnitSchemaType = z.infer<typeof UnitSchema>;

export const updateUnitSchema = UnitSchema.extend({
  status: z.boolean().optional(),
});

export type UpdateUnitInput = z.infer<typeof updateUnitSchema>;
