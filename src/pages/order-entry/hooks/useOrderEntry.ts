import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  Product,
  ResponseProvider,
  ResponseStore,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import {
  OrderEntrySchemaType,
  type OrderEntryType,
} from "@/schemas/order-entry/orderEntry.schema";
import { PayCondition } from "@/schemas/provider/provider.schema";
import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

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
      value: OrderEntrySchemaType.FACTURA,
    },
    {
      label: "Boleta",
      value: OrderEntrySchemaType.BOLETA,
    },
  ];

  const payCondition = [
    { label: "Contado", value: PayCondition.Contado },
    { label: "Crédito 30", value: PayCondition.Credito30 },
    { label: "Crédito 60", value: PayCondition.Credito60 },
    { label: "Crédito 90", value: PayCondition.Credito90 },
  ];

  const {
    mutate: getProducts,
    isPending: isLoadingProducts,
    data: resProducts,
  } = useMutation({
    mutationFn: async (storeId: number) => {
      const res = await instance.get(`/product/store-available/${storeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data as ApiResponse<Product[]>;
    },
  });
  const navigate = useNavigate();
  const { mutate, isPending: isLoadingOrderEntry } = useMutation({
    mutationFn: async (data: OrderEntryType) => {
      const res = await instance.post("/entryorder", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Ocurrió un error al crear la orden de entrada",
        color: "danger",
      });
    },
    onSuccess: () => {
      addToast({
        title: "Éxito",
        description: "Orden de entrada creada correctamente",
        color: "success",
      });
      navigate("/orden-entrada");
    },
  });

  const isLoading =
    isLoadingProviders || isLoadingStores || isLoadingOrderEntry;
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
    products: {
      data: resProducts?.data || [],
      isLoading: isLoadingProducts,
      getProducts,
    },
    isLoading,
    mutate,
  };
}
