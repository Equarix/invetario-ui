import z from "zod";

export enum OrderEntrySchemaType {
  FACTURA = 0,
  BOLETA = 1,
}

export const OrderEntryDetailsSchema = z.object({
  productId: z.number({
    error: "El producto es requerido",
  }),
  quantity: z.number({
    error: "La cantidad es requerida",
  }),
  unitPrice: z.number({
    error: "El precio unitario es requerido",
  }),
});

export const OrderEntrySchema = z.object({
  providerId: z.number({
    error: "El proveedor es requerido",
  }),
  storeId: z.number({
    error: "La tienda es requerida",
  }),
  entryDate: z
    .date({
      error: "La fecha de entrada es requerida",
    })
    .default(new Date()),
  entryOrderType: z.nativeEnum(OrderEntrySchemaType, {
    error: "El tipo de orden de entrada es requerido",
  }),
  typeMoney: z.string({
    error: "El tipo de moneda es requerido",
  }),
  payCondition: z.number({
    error: "La condición de pago es requerida",
  }),
  tax: z.number({
    error: "El impuesto es requerido",
  }),
  entryOrderDetails: z.array(OrderEntryDetailsSchema).min(1),
  observations: z.string().optional(),
});

export type OrderEntryType = z.infer<typeof OrderEntrySchema>;
