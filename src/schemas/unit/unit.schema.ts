import z from "zod";

export const UnitSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
});

export type UnitSchemaType = z.infer<typeof UnitSchema>;
