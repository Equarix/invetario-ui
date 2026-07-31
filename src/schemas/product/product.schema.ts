import z from "zod";

export const ProductPriceSchema = z.object({
  price: z.number(),
  status: z.boolean(),
});

export const ProductSchema = z.object({
  codeInternal: z.string().min(1).max(50),
  code: z.string().min(1).max(50),
  name: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.number(),
  unitId: z.number(),
  priceBuy: z.number().nonnegative(),
  priceSell: z.number().nonnegative(),
  minStock: z.number().nonnegative(),
  imageId: z.number(),
  productPrices: z.array(ProductPriceSchema).optional(),
});

export const UpdateProductSchema = ProductSchema.extend({
  status: z.boolean(),
});

export type ProductInput = z.infer<typeof ProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;

