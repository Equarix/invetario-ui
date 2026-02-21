import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  ResponseProvider,
  ResponseStore,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { OrderEntrySchema } from "@/schemas/order-entry/orderEntry.schema";
import { PayCondition } from "@/schemas/provider/provider.schema";
import { useQuery } from "@tanstack/react-query";

export function useOrderEntry() {
  const { token } = useAuth();

  const { data: resProviders, isLoading: isLoadingProviders } = useQuery<
    ApiResponse<ResponseProvider[]>
  >({
    queryKey: ["providers"],
    queryFn: async () => {
      const res = await instance.get("/provider", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const { data: resStores, isLoading: isLoadingStores } = useQuery<
    ApiResponse<ResponseStore[]>
  >({
    queryKey: ["stores"],
    queryFn: async () => {
      const res = await instance.get("/store", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const entriesTypes = [
    {
      label: "Factura",
      value: OrderEntrySchema.FACTURA,
    },
    {
      label: "Boleta",
      value: OrderEntrySchema.BOLETA,
    },
  ];

  const payCondition = [
    { label: "Contado", value: PayCondition.Contado },
    { label: "Crédito 30", value: PayCondition.Credito30 },
    { label: "Crédito 60", value: PayCondition.Credito60 },
    { label: "Crédito 90", value: PayCondition.Credito90 },
  ];

  return {
    provider: {
      data: resProviders?.data || [],
      isLoading: isLoadingProviders,
    },
    stores: {
      data: resStores?.data || [],
      isLoading: isLoadingStores,
    },
    entriesTypes,
    payCondition,
  };
}
